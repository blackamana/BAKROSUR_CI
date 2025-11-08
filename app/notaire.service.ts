/**
 * ================================================================
 * BAKRÔSUR - Service de Gestion des Notaires
 * ================================================================
 * Service pour gérer l'annuaire des notaires partenaires
 * ================================================================
 */

import { supabase } from '../lib/supabase';

// Types
export interface Notaire {
  id: string;
  user_id?: string;
  nom: string;
  prenoms: string;
  titre: string;
  cabinet_name: string;
  cabinet_address: string;
  city_id?: string;
  city_name?: string;
  neighborhood_id?: string;
  neighborhood_name?: string;
  phone: string;
  phone_secondary?: string;
  email: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  numero_chambre: string;
  date_inscription: string;
  numero_ordre?: string;
  assurance_rc_numero: string;
  assurance_rc_montant: number;
  assurance_rc_compagnie: string;
  assurance_rc_expiration: string;
  specialites: string[];
  zones_intervention: string[];
  langues_parlees: string[];
  tarif_consultation?: number;
  tarif_acte_vente?: any;
  tarif_acte_location?: any;
  tarif_hypotheque?: any;
  autres_tarifs?: any;
  horaires?: any;
  jours_fermeture?: string[];
  accepte_urgences: boolean;
  delai_rdv_moyen?: number;
  nb_transactions_bakrosur: number;
  nb_avis: number;
  note_moyenne: number;
  taux_reponse?: number;
  delai_reponse_moyen?: number;
  is_certified: boolean;
  certification_date?: string;
  certification_level?: 'BRONZE' | 'ARGENT' | 'OR' | 'PLATINE';
  status: 'ACTIF' | 'INACTIF' | 'SUSPENDU' | 'EN_ATTENTE';
  is_featured: boolean;
  is_available: boolean;
  bio?: string;
  photo_url?: string;
  cabinet_photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface NotaireSearchFilters {
  city_id?: string;
  specialite?: string;
  min_note?: number;
  certification_level?: string;
  is_available?: boolean;
  is_featured?: boolean;
  sortBy?: 'note' | 'transactions' | 'alphabetical' | 'proximity';
  latitude?: number;
  longitude?: number;
  limit?: number;
}

export interface DemandeRDV {
  id?: string;
  notaire_id: string;
  user_id: string;
  property_id?: string;
  type_rdv: 'CONSULTATION' | 'AUDIT_JURIDIQUE' | 'SIGNATURE_VENTE' | 'SIGNATURE_LOCATION' | 'CONSTITUTION_HYPOTHEQUE' | 'AUTRE';
  objet: string;
  date_souhaitee_1?: string;
  date_souhaitee_2?: string;
  date_souhaitee_3?: string;
  date_confirmee?: string;
  duree_estimee?: number;
  nom_complet: string;
  phone: string;
  email: string;
  documents_fournis?: string[];
  notes_complementaires?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

export interface NotaireAvis {
  id?: string;
  notaire_id: string;
  user_id: string;
  property_id?: string;
  note: number;
  professionnalisme?: number;
  reactivite?: number;
  clarte_explications?: number;
  rapport_qualite_prix?: number;
  titre?: string;
  commentaire?: string;
  type_prestation?: string;
  montant_transaction?: number;
  is_verified: boolean;
  is_published: boolean;
  notaire_response?: string;
  notaire_response_date?: string;
  created_at?: string;
}

export class NotaireService {
  
  /**
   * Rechercher des notaires avec filtres
   */
  static async searchNotaires(filters: NotaireSearchFilters = {}): Promise<Notaire[]> {
    try {
      let query = supabase
        .from('notaires')
        .select('*')
        .eq('status', 'ACTIF');
      
      // Appliquer les filtres
      if (filters.city_id) {
        query = query.eq('city_id', filters.city_id);
      }
      
      if (filters.specialite) {
        query = query.contains('specialites', [filters.specialite]);
      }
      
      if (filters.min_note !== undefined) {
        query = query.gte('note_moyenne', filters.min_note);
      }
      
      if (filters.certification_level) {
        query = query.eq('certification_level', filters.certification_level);
      }
      
      if (filters.is_available !== undefined) {
        query = query.eq('is_available', filters.is_available);
      }
      
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      
      // Tri
      switch (filters.sortBy) {
        case 'note':
          query = query.order('note_moyenne', { ascending: false });
          break;
        case 'transactions':
          query = query.order('nb_transactions_bakrosur', { ascending: false });
          break;
        case 'alphabetical':
          query = query.order('nom', { ascending: true });
          break;
        case 'proximity':
          // Pour le tri par proximité, on a besoin des coordonnées GPS
          if (filters.latitude && filters.longitude) {
            // Note: PostgreSQL avec PostGIS supporte la distance, mais nécessite une requête spéciale
            // Pour l'instant, on récupère tout et on trie côté client
          }
          break;
        default:
          query = query.order('note_moyenne', { ascending: false });
      }
      
      // Limite
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('[Notaire] Erreur lors de la recherche:', error);
        throw error;
      }
      
      // Si tri par proximité et coordonnées fournies, trier côté client
      if (filters.sortBy === 'proximity' && filters.latitude && filters.longitude && data) {
        return this.sortByProximity(data, filters.latitude, filters.longitude);
      }
      
      return data || [];
      
    } catch (error) {
      console.error('[Notaire] Erreur:', error);
      return [];
    }
  }
  
  /**
   * Trier les notaires par proximité
   */
  private static sortByProximity(notaires: Notaire[], userLat: number, userLon: number): Notaire[] {
    return notaires
      .filter(n => n.latitude && n.longitude)
      .map(n => ({
        ...n,
        distance: this.calculateDistance(userLat, userLon, n.latitude!, n.longitude!)
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }
  
  /**
   * Calculer la distance entre deux points GPS (Haversine formula)
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance en km
    return Math.round(distance * 10) / 10; // Arrondi à 1 décimale
  }
  
  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  
  /**
   * Obtenir un notaire par ID
   */
  static async getNotaire(notaireId: string): Promise<Notaire | null> {
    const { data, error } = await supabase
      .from('notaires')
      .select('*')
      .eq('id', notaireId)
      .single();
    
    if (error) {
      console.error('[Notaire] Erreur lors de la récupération:', error);
      return null;
    }
    
    return data;
  }
  
  /**
   * Obtenir les notaires en vedette (featured)
   */
  static async getFeaturedNotaires(limit: number = 5): Promise<Notaire[]> {
    const { data, error } = await supabase
      .from('notaires')
      .select('*')
      .eq('status', 'ACTIF')
      .eq('is_featured', true)
      .order('note_moyenne', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('[Notaire] Erreur lors de la récupération des featured:', error);
      return [];
    }
    
    return data || [];
  }
  
  /**
   * Obtenir le top 10 des notaires
   */
  static async getTopNotaires(): Promise<Notaire[]> {
    const { data, error } = await supabase
      .from('top_notaires')
      .select('*');
    
    if (error) {
      console.error('[Notaire] Erreur lors de la récupération du top:', error);
      return [];
    }
    
    return data || [];
  }
  
  /**
   * Créer une demande de rendez-vous
   */
  static async createDemandeRDV(demande: DemandeRDV): Promise<DemandeRDV | null> {
    try {
      const { data, error } = await supabase
        .from('notaire_demandes_rdv')
        .insert({
          ...demande,
          status: 'PENDING',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('[Notaire] Erreur lors de la création de la demande:', error);
        throw error;
      }
      
      // Envoyer une notification au notaire (TODO: implémenter)
      await this.notifyNotaireNewDemande(demande.notaire_id, data.id);
      
      return data;
      
    } catch (error) {
      console.error('[Notaire] Erreur:', error);
      return null;
    }
  }
  
  /**
   * Obtenir les demandes de RDV d'un utilisateur
   */
  static async getUserDemandes(userId: string): Promise<DemandeRDV[]> {
    const { data, error } = await supabase
      .from('notaire_demandes_rdv')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[Notaire] Erreur lors de la récupération des demandes:', error);
      return [];
    }
    
    return data || [];
  }
  
  /**
   * Obtenir les demandes de RDV d'un notaire
   */
  static async getNotaireDemandes(notaireId: string): Promise<DemandeRDV[]> {
    const { data, error } = await supabase
      .from('notaire_demandes_rdv')
      .select('*')
      .eq('notaire_id', notaireId)
      .order('created_at', { ascending: false});
    
    if (error) {
      console.error('[Notaire] Erreur lors de la récupération des demandes:', error);
      return [];
    }
    
    return data || [];
  }
  
  /**
   * Confirmer un rendez-vous
   */
  static async confirmRDV(demandeId: string, dateConfirmee: string): Promise<boolean> {
    const { error } = await supabase
      .from('notaire_demandes_rdv')
      .update({
        status: 'CONFIRMED',
        date_confirmee: dateConfirmee,
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', demandeId);
    
    if (error) {
      console.error('[Notaire] Erreur lors de la confirmation:', error);
      return false;
    }
    
    // Notifier l'utilisateur (TODO: implémenter)
    
    return true;
  }
  
  /**
   * Annuler un rendez-vous
   */
  static async cancelRDV(
    demandeId: string,
    reason: string,
    cancelledBy: 'USER' | 'NOTAIRE' | 'SYSTEM'
  ): Promise<boolean> {
    const { error } = await supabase
      .from('notaire_demandes_rdv')
      .update({
        status: 'CANCELLED',
        cancellation_reason: reason,
        cancelled_by: cancelledBy,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', demandeId);
    
    if (error) {
      console.error('[Notaire] Erreur lors de l\'annulation:', error);
      return false;
    }
    
    return true;
  }
  
  /**
   * Créer un avis sur un notaire
   */
  static async createAvis(avis: NotaireAvis): Promise<NotaireAvis | null> {
    try {
      const { data, error } = await supabase
        .from('notaire_avis')
        .insert({
          ...avis,
          is_verified: false,
          is_published: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('[Notaire] Erreur lors de la création de l\'avis:', error);
        throw error;
      }
      
      // La note moyenne sera mise à jour automatiquement par le trigger
      
      return data;
      
    } catch (error) {
      console.error('[Notaire] Erreur:', error);
      return null;
    }
  }
  
  /**
   * Obtenir les avis d'un notaire
   */
  static async getNotaireAvis(notaireId: string, limit: number = 10): Promise<NotaireAvis[]> {
    const { data, error } = await supabase
      .from('notaire_avis')
      .select('*')
      .eq('notaire_id', notaireId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('[Notaire] Erreur lors de la récupération des avis:', error);
      return [];
    }
    
    return data || [];
  }
  
  /**
   * Répondre à un avis (pour les notaires)
   */
  static async respondToAvis(avisId: string, response: string): Promise<boolean> {
    const { error } = await supabase
      .from('notaire_avis')
      .update({
        notaire_response: response,
        notaire_response_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', avisId);
    
    if (error) {
      console.error('[Notaire] Erreur lors de la réponse:', error);
      return false;
    }
    
    return true;
  }
  
  /**
   * Obtenir les statistiques d'un notaire
   */
  static async getNotaireStats(notaireId: string): Promise<{
    total_demandes: number;
    demandes_pending: number;
    demandes_confirmed: number;
    demandes_completed: number;
    taux_completion: number;
    note_moyenne: number;
    nb_avis: number;
    repartition_notes: Record<number, number>;
  }> {
    // Récupérer les demandes
    const { data: demandes } = await supabase
      .from('notaire_demandes_rdv')
      .select('status')
      .eq('notaire_id', notaireId);
    
    // Récupérer les avis
    const { data: avis } = await supabase
      .from('notaire_avis')
      .select('note')
      .eq('notaire_id', notaireId)
      .eq('is_published', true);
    
    const total_demandes = demandes?.length || 0;
    const demandes_pending = demandes?.filter(d => d.status === 'PENDING').length || 0;
    const demandes_confirmed = demandes?.filter(d => d.status === 'CONFIRMED').length || 0;
    const demandes_completed = demandes?.filter(d => d.status === 'COMPLETED').length || 0;
    const taux_completion = total_demandes > 0 
      ? Math.round((demandes_completed / total_demandes) * 100)
      : 0;
    
    const nb_avis = avis?.length || 0;
    const note_moyenne = nb_avis > 0
      ? Math.round((avis.reduce((sum, a) => sum + a.note, 0) / nb_avis) * 100) / 100
      : 0;
    
    const repartition_notes: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    avis?.forEach(a => {
      repartition_notes[a.note] = (repartition_notes[a.note] || 0) + 1;
    });
    
    return {
      total_demandes,
      demandes_pending,
      demandes_confirmed,
      demandes_completed,
      taux_completion,
      note_moyenne,
      nb_avis,
      repartition_notes
    };
  }
  
  /**
   * Vérifier la disponibilité d'un notaire
   */
  static async checkAvailability(notaireId: string, date: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('notaire_disponibilites')
      .select('*')
      .eq('notaire_id', notaireId)
      .eq('date', date)
      .eq('is_available', true)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Notifier un notaire d'une nouvelle demande (TODO: implémenter vraiment)
   */
  private static async notifyNotaireNewDemande(notaireId: string, demandeId: string): Promise<void> {
    console.log(`[Notaire] Notification nouvelle demande ${demandeId} pour notaire ${notaireId}`);
    // TODO: Envoyer email/SMS/push notification
  }
  
  /**
   * Obtenir les spécialités disponibles
   */
  static getSpecialites(): string[] {
    return [
      'Immobilier',
      'Droit des affaires',
      'Succession',
      'Droit de la famille',
      'Constitution de sociétés',
      'Hypothèques',
      'Contrats',
      'Donations',
      'Droit rural'
    ];
  }
  
  /**
   * Obtenir les villes avec des notaires
   */
  static async getCitiesWithNotaires(): Promise<Array<{ city_id: string; city_name: string; count: number }>> {
    const { data, error } = await supabase
      .from('notaires')
      .select('city_id, city_name')
      .eq('status', 'ACTIF');
    
    if (error || !data) {
      return [];
    }
    
    // Grouper par ville
    const cityMap = new Map<string, { city_id: string; city_name: string; count: number }>();
    
    data.forEach(n => {
      if (n.city_id && n.city_name) {
        if (cityMap.has(n.city_id)) {
          cityMap.get(n.city_id)!.count++;
        } else {
          cityMap.set(n.city_id, { city_id: n.city_id, city_name: n.city_name, count: 1 });
        }
      }
    });
    
    return Array.from(cityMap.values()).sort((a, b) => b.count - a.count);
  }
}

export default NotaireService;
