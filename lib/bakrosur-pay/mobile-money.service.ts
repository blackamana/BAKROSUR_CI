/**
 * Service Mobile Money - Intégration Orange, MTN, Moov, Wave
 */

import { supabase } from '@/lib/supabase';

export type MobileMoneyProvider = 
  | 'ORANGE_MONEY' 
  | 'MTN_MONEY' 
  | 'MOOV_MONEY' 
  | 'WAVE';

export interface PaymentRequest {
  escrowId: string;
  amount: number;
  phoneNumber: string;
  provider: MobileMoneyProvider;
  description?: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  providerReference?: string;
  message: string;
}

export class MobileMoneyService {
  /**
   * Initier un paiement Mobile Money
   */
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // 1. Vérifier le fournisseur
      const provider = await this.getProvider(request.provider);
      if (!provider || !provider.is_active) {
        throw new Error('Fournisseur de paiement indisponible');
      }

      // 2. Vérifier les limites
      if (request.amount < provider.min_amount || request.amount > provider.max_amount) {
        throw new Error(
          `Montant doit être entre ${provider.min_amount} et ${provider.max_amount} FCFA`
        );
      }

      // 3. Créer la transaction
      const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .insert({
          escrow_account_id: request.escrowId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          transaction_type: 'DEPOSIT',
          amount: request.amount,
          payment_method: request.provider,
          phone_number: request.phoneNumber,
          status: 'PENDING',
          description: request.description || 'Paiement Mobile Money',
        })
        .select()
        .single();

      if (error) throw error;

      // 4. Appeler l'API du fournisseur
      const providerResponse = await this.callProviderAPI(
        provider,
        request,
        transaction.id
      );

      // 5. Mettre à jour la transaction
      await supabase
        .from('payment_transactions')
        .update({
          provider_transaction_id: providerResponse.providerTransactionId,
          provider_reference: providerResponse.reference,
          status: providerResponse.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      return {
        transactionId: transaction.id,
        status: providerResponse.status,
        providerReference: providerResponse.reference,
        message: providerResponse.message,
      };
    } catch (error: any) {
      console.error('Erreur paiement Mobile Money:', error);
      throw error;
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    const { data: transaction, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) throw error;

    // Si déjà complété, retourner le statut
    if (transaction.status === 'COMPLETED' || transaction.status === 'FAILED') {
      return {
        transactionId: transaction.id,
        status: transaction.status,
        providerReference: transaction.provider_reference,
        message: transaction.status === 'COMPLETED' 
          ? 'Paiement réussi' 
          : transaction.failure_reason || 'Paiement échoué',
      };
    }

    // Sinon, vérifier auprès du fournisseur
    const provider = await this.getProvider(transaction.payment_method);
    if (!provider) throw new Error('Fournisseur introuvable');

    const status = await this.checkProviderStatus(
      provider,
      transaction.provider_transaction_id
    );

    // Mettre à jour la transaction
    await supabase
      .from('payment_transactions')
      .update({
        status: status.status,
        completed_at: status.status === 'COMPLETED' ? new Date().toISOString() : null,
        failed_at: status.status === 'FAILED' ? new Date().toISOString() : null,
        failure_reason: status.message,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId);

    // Si paiement complété, mettre à jour l'escrow
    if (status.status === 'COMPLETED') {
      await this.updateEscrowOnPayment(transaction);
    }

    return {
      transactionId: transaction.id,
      status: status.status,
      providerReference: transaction.provider_reference,
      message: status.message,
    };
  }

  /**
   * Récupérer les informations d'un fournisseur
   */
  private async getProvider(providerName: MobileMoneyProvider) {
    const { data, error } = await supabase
      .from('mobile_money_providers')
      .select('*')
      .eq('provider_name', providerName)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Appeler l'API du fournisseur
   * SIMULATION - À remplacer par de vraies API
   */
  private async callProviderAPI(
    provider: any,
    request: PaymentRequest,
    transactionId: string
  ): Promise<{
    providerTransactionId: string;
    reference: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    message: string;
  }> {
    // SIMULATION POUR DÉMONSTRATION
    // En production, utiliser les vraies API :
    // - Orange Money API: https://developer.orange.com/apis/orange-money-webpay/
    // - MTN MoMo API: https://momodeveloper.mtn.com/
    // - Moov Money API: https://developer.moov-africa.com/

    console.log('Appel API fournisseur:', {
      provider: provider.provider_name,
      amount: request.amount,
      phone: request.phoneNumber,
    });

    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simuler une réponse aléatoire
    const isSuccess = Math.random() > 0.1; // 90% de succès

    if (isSuccess) {
      return {
        providerTransactionId: `${provider.provider_name}_${Date.now()}`,
        reference: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'PENDING', // Le client doit confirmer sur son téléphone
        message: `Un code de confirmation a été envoyé au ${request.phoneNumber}. Veuillez composer *144# pour valider.`,
      };
    } else {
      return {
        providerTransactionId: `${provider.provider_name}_${Date.now()}`,
        reference: '',
        status: 'FAILED',
        message: 'Solde insuffisant ou erreur fournisseur',
      };
    }
  }

  /**
   * Vérifier le statut auprès du fournisseur
   * SIMULATION - À remplacer par de vraies API
   */
  private async checkProviderStatus(
    provider: any,
    providerTransactionId: string
  ): Promise<{
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    message: string;
  }> {
    // SIMULATION
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simuler validation
    const isValidated = Math.random() > 0.2; // 80% validé

    return {
      status: isValidated ? 'COMPLETED' : 'PENDING',
      message: isValidated 
        ? 'Paiement confirmé' 
        : 'En attente de validation client',
    };
  }

  /**
   * Mettre à jour l'escrow après paiement réussi
   */
  private async updateEscrowOnPayment(transaction: any): Promise<void> {
    const { data: escrow } = await supabase
      .from('escrow_accounts')
      .select('*')
      .eq('id', transaction.escrow_account_id)
      .single();

    if (!escrow) return;

    // Déterminer le nouveau statut
    let newStatus = escrow.status;
    if (escrow.status === 'PENDING') {
      newStatus = 'DEPOSIT_PAID';
    } else if (escrow.status === 'DEPOSIT_PAID') {
      newStatus = 'FULL_PAYMENT';
    }

    await supabase
      .from('escrow_accounts')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', escrow.id);

    // Notifier les parties
    await supabase.from('notifications').insert([
      {
        user_id: escrow.buyer_id,
        notification_type: 'PAYMENT_SENT',
        title: '✅ Paiement effectué',
        body: `Votre paiement de ${transaction.amount} FCFA a été confirmé`,
        data: { escrow_id: escrow.id, transaction_id: transaction.id },
      },
      {
        user_id: escrow.seller_id,
        notification_type: 'PAYMENT_RECEIVED',
        title: '💰 Paiement reçu',
        body: `Paiement de ${transaction.amount} FCFA reçu de l'acheteur`,
        data: { escrow_id: escrow.id, transaction_id: transaction.id },
      },
    ]);
  }

  /**
   * Récupérer l'historique des transactions d'un utilisateur
   */
  async getUserTransactions(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select(`
        *,
        escrow:escrow_accounts(
          id,
          property:properties(id, title, city_name)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les fournisseurs disponibles
   */
  async getAvailableProviders(): Promise<any[]> {
    const { data, error } = await supabase
      .from('mobile_money_providers')
      .select('*')
      .eq('is_active', true)
      .order('display_name');

    if (error) throw error;
    return data || [];
  }
}

// Export singleton
export const mobileMoneyService = new MobileMoneyService();