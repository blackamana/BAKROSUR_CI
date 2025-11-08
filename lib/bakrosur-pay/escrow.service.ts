/**
 * Service Escrow/Séquestre - BakroSur Pay
 */

import { supabase } from '@/lib/supabase';

export interface EscrowAccount {
  id: string;
  property_id: string;
  seller_id: string;
  buyer_id: string;
  notary_id?: string;
  total_amount: number;
  deposit_amount: number;
  remaining_amount: number;
  escrow_fee: number;
  notary_fee: number;
  status: EscrowStatus;
  release_conditions: {
    documents_verified: boolean;
    notary_approval: boolean;
    buyer_confirmation: boolean;
    cooling_period_end: string | null;
  };
  deposit_deadline?: string;
  full_payment_deadline?: string;
  cooling_period_days: number;
  created_at: string;
  updated_at: string;
}

export type EscrowStatus = 
  | 'PENDING'
  | 'DEPOSIT_PAID'
  | 'DOCUMENTS_REVIEW'
  | 'APPROVED'
  | 'FULL_PAYMENT'
  | 'RELEASED'
  | 'CANCELLED'
  | 'DISPUTED';

export class EscrowService {
  /**
   * Créer un compte escrow pour une transaction
   */
  async createEscrow(data: {
    propertyId: string;
    sellerId: string;
    buyerId: string;
    totalAmount: number;
    depositAmount?: number;
    notaryId?: string;
  }): Promise<EscrowAccount> {
    const { data: escrow, error } = await supabase
      .from('escrow_accounts')
      .insert({
        property_id: data.propertyId,
        seller_id: data.sellerId,
        buyer_id: data.buyerId,
        notary_id: data.notaryId,
        total_amount: data.totalAmount,
        deposit_amount: data.depositAmount,
        deposit_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
        full_payment_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
      })
      .select()
      .single();

    if (error) throw error;

    // Créer une notification pour le vendeur
    await this.createNotification(data.sellerId, {
      type: 'ESCROW_CREATED',
      title: '🔒 Compte séquestre créé',
      body: `Un acheteur a initié une transaction sécurisée de ${this.formatAmount(data.totalAmount)} FCFA`,
      data: { escrow_id: escrow.id, property_id: data.propertyId },
    });

    // Créer une notification pour l'acheteur
    await this.createNotification(data.buyerId, {
      type: 'ESCROW_CREATED',
      title: '✅ Transaction sécurisée initiée',
      body: `Votre compte séquestre a été créé. Payez l'acompte avant le ${new Date(escrow.deposit_deadline!).toLocaleDateString('fr-FR')}`,
      data: { escrow_id: escrow.id, property_id: data.propertyId },
    });

    return escrow;
  }

  /**
   * Récupérer un compte escrow
   */
  async getEscrow(escrowId: string): Promise<EscrowAccount | null> {
    const { data, error } = await supabase
      .from('escrow_accounts')
      .select(`
        *,
        property:properties(id, title, city_name, price),
        seller:users!seller_id(id, name, email, phone),
        buyer:users!buyer_id(id, name, email, phone),
        notary:notaries(id, office_name, phone)
      `)
      .eq('id', escrowId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Récupérer tous les escrows d'un utilisateur
   */
  async getUserEscrows(userId: string): Promise<EscrowAccount[]> {
    const { data, error } = await supabase
      .from('escrow_accounts')
      .select(`
        *,
        property:properties(id, title, city_name, price, images),
        seller:users!seller_id(id, name, avatar),
        buyer:users!buyer_id(id, name, avatar)
      `)
      .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Mettre à jour le statut d'un escrow
   */
  async updateEscrowStatus(
    escrowId: string,
    status: EscrowStatus,
    conditions?: Partial<EscrowAccount['release_conditions']>
  ): Promise<void> {
    const updates: any = { status, updated_at: new Date().toISOString() };

    if (conditions) {
      const { data: current } = await supabase
        .from('escrow_accounts')
        .select('release_conditions')
        .eq('id', escrowId)
        .single();

      updates.release_conditions = {
        ...current?.release_conditions,
        ...conditions,
      };
    }

    const { error } = await supabase
      .from('escrow_accounts')
      .update(updates)
      .eq('id', escrowId);

    if (error) throw error;
  }

  /**
   * Libérer les fonds au vendeur
   */
  async releaseFunds(escrowId: string): Promise<void> {
    // Vérifier les conditions
    const escrow = await this.getEscrow(escrowId);
    if (!escrow) throw new Error('Escrow introuvable');

    const conditions = escrow.release_conditions;
    const canRelease =
      conditions.documents_verified &&
      conditions.notary_approval &&
      conditions.buyer_confirmation &&
      escrow.status === 'FULL_PAYMENT';

    if (!canRelease) {
      throw new Error('Conditions de libération non remplies');
    }

    // Libérer les fonds
    await this.updateEscrowStatus(escrowId, 'RELEASED');

    // Créer transaction de libération
    await supabase.from('payment_transactions').insert({
      escrow_account_id: escrowId,
      user_id: escrow.seller_id,
      transaction_type: 'RELEASE',
      amount: escrow.total_amount - escrow.escrow_fee,
      status: 'COMPLETED',
      description: 'Libération des fonds au vendeur',
      completed_at: new Date().toISOString(),
    });

    // Notifier le vendeur
    await this.createNotification(escrow.seller_id, {
      type: 'ESCROW_RELEASED',
      title: '💰 Fonds libérés',
      body: `${this.formatAmount(escrow.total_amount - escrow.escrow_fee)} FCFA ont été transférés sur votre compte`,
      data: { escrow_id: escrowId },
    });
  }

  /**
   * Annuler un escrow
   */
  async cancelEscrow(escrowId: string, reason: string): Promise<void> {
    const escrow = await this.getEscrow(escrowId);
    if (!escrow) throw new Error('Escrow introuvable');

    await supabase
      .from('escrow_accounts')
      .update({
        status: 'CANCELLED',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
      })
      .eq('id', escrowId);

    // Si acompte déjà payé, créer transaction de remboursement
    if (escrow.status !== 'PENDING') {
      await supabase.from('payment_transactions').insert({
        escrow_account_id: escrowId,
        user_id: escrow.buyer_id,
        transaction_type: 'REFUND',
        amount: escrow.deposit_amount,
        status: 'COMPLETED',
        description: `Remboursement suite à annulation: ${reason}`,
        completed_at: new Date().toISOString(),
      });
    }

    // Notifier les parties
    await this.createNotification(escrow.buyer_id, {
      type: 'ESCROW_CREATED',
      title: '❌ Transaction annulée',
      body: reason,
      data: { escrow_id: escrowId },
    });

    await this.createNotification(escrow.seller_id, {
      type: 'ESCROW_CREATED',
      title: '❌ Transaction annulée',
      body: reason,
      data: { escrow_id: escrowId },
    });
  }

  /**
   * Vérifier si l'utilisateur peut libérer les fonds
   */
  async canReleaseFunds(escrowId: string, userId: string): Promise<boolean> {
    const escrow = await this.getEscrow(escrowId);
    if (!escrow) return false;

    // Seul le notaire ou l'admin peut libérer
    return (
      escrow.notary_id === userId &&
      escrow.status === 'FULL_PAYMENT' &&
      escrow.release_conditions.documents_verified &&
      escrow.release_conditions.notary_approval
    );
  }

  /**
   * Créer une notification
   */
  private async createNotification(
    userId: string,
    notification: {
      type: string;
      title: string;
      body: string;
      data?: any;
    }
  ): Promise<void> {
    await supabase.from('notifications').insert({
      user_id: userId,
      notification_type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
    });
  }

  /**
   * Formater un montant en FCFA
   */
  private formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

// Export singleton
export const escrowService = new EscrowService();