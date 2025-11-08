/**
 * ================================================================
 * BAKRÔSUR - Service d'intégration SIGFU
 * ================================================================
 * Service pour interagir avec l'API du Système Intégré de Gestion
 * du Foncier Urbain (SIGFU) de la Côte d'Ivoire
 * ================================================================
 */

import { supabase } from '../lib/supabase';

// Types
export interface SIGFUVerification {
  id: string;
  property_id: string;
  titre_foncier_number: string;
  type_titre: 'TF' | 'ACD' | 'ADU' | 'AV' | 'AUTRE';
  sigfu_status: 'PENDING' | 'VERIFIED' | 'INVALID' | 'NOT_FOUND' | 'CONFLICT' | 'EXPIRED' | 'ERROR';
  sigfu_response: any;
  proprietaire_nom?: string;
  proprietaire_prenom?: string;
  superficie_cadastrale?: number;
  has_conflict: boolean;
  has_hypotheque: boolean;
  has_litige: boolean;
  reliability_score?: number;
  created_at: string;
  updated_at: string;
}

export interface SIGFUApiResponse {
  success: boolean;
  data?: {
    titre_foncier: string;
    type: string;
    proprietaire: {
      nom: string;
      prenom: string;
      cni: string;
    };
    cadastre: {
      superficie: number;
      commune: string;
      quartier: string;
      ilot: string;
      parcelle: string;
      coordonnees: {
        latitude: number;
        longitude: number;
      };
    };
    juridique: {
      hypotheques: Array<{
        numero: string;
        montant: number;
        beneficiaire: string;
        date_inscription: string;
      }>;
      servitudes: Array<{
        type: string;
        description: string;
      }>;
      litiges: Array<{
        numero: string;
        tribunal: string;
        parties: string[];
        statut: string;
      }>;
      derniere_mutation: string;
    };
    statut: 'VALIDE' | 'INVALIDE' | 'EXPIRE';
    date_creation: string;
    date_derniere_modification: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export class SIGFUService {
  private static API_BASE_URL = process.env.NEXT_PUBLIC_SIGFU_API_URL || 'https://api.sigfu.gouv.ci/v1';
  private static API_KEY = process.env.SIGFU_API_KEY || '';
  
  /**
   * Vérifier un titre foncier via l'API SIGFU
   */
  static async verifyTitreFoncier(
    propertyId: string,
    titreFoncierNumber: string,
    typeTitre: 'TF' | 'ACD' | 'ADU' | 'AV' | 'AUTRE'
  ): Promise<SIGFUVerification> {
    try {
      console.log(`[SIGFU] Vérification du titre ${titreFoncierNumber} pour la propriété ${propertyId}`);
      
      // 1. Appeler l'API SIGFU
      const sigfuResponse = await this.callSIGFUApi(titreFoncierNumber);
      
      // 2. Analyser la réponse
      const verification = this.analyzeResponse(sigfuResponse, propertyId, titreFoncierNumber, typeTitre);
      
      // 3. Enregistrer dans la base de données
      const { data, error } = await supabase
        .from('sigfu_verifications')
        .insert(verification)
        .select()
        .single();
      
      if (error) {
        console.error('[SIGFU] Erreur lors de l\'enregistrement:', error);
        throw new Error(`Erreur d'enregistrement: ${error.message}`);
      }
      
      console.log('[SIGFU] Vérification enregistrée avec succès:', data.id);
      
      // 4. Déclencher le recalcul du BakroScore
      await this.triggerScoreRecalculation(propertyId);
      
      return data;
      
    } catch (error) {
      console.error('[SIGFU] Erreur lors de la vérification:', error);
      
      // En cas d'erreur, enregistrer quand même avec le statut ERROR
      const errorVerification = {
        property_id: propertyId,
        titre_foncier_number: titreFoncierNumber,
        type_titre: typeTitre,
        sigfu_status: 'ERROR' as const,
        sigfu_response: { error: error.message },
        has_conflict: false,
        has_hypotheque: false,
        has_litige: false,
        sigfu_api_call_date: new Date().toISOString(),
      };
      
      const { data } = await supabase
        .from('sigfu_verifications')
        .insert(errorVerification)
        .select()
        .single();
      
      return data;
    }
  }
  
  /**
   * Appeler l'API SIGFU
   */
  private static async callSIGFUApi(titreFoncierNumber: string): Promise<SIGFUApiResponse> {
    // IMPORTANT: En production, remplacer par le vrai endpoint SIGFU
    // Pour le développement, on simule une réponse
    
    if (process.env.NODE_ENV === 'development' || !this.API_KEY) {
      console.warn('[SIGFU] Mode développement - Simulation de réponse');
      return this.simulateApiResponse(titreFoncierNumber);
    }
    
    try {
      const response = await fetch(`${this.API_BASE_URL}/titres/${titreFoncierNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Titre foncier non trouvé dans la base SIGFU'
            }
          };
        }
        
        throw new Error(`Erreur API SIGFU: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
      
    } catch (error) {
      console.error('[SIGFU] Erreur API:', error);
      throw error;
    }
  }
  
  /**
   * Simuler une réponse API (pour développement)
   */
  private static simulateApiResponse(titreFoncierNumber: string): SIGFUApiResponse {
    // Simuler différents cas selon le numéro
    const lastDigit = parseInt(titreFoncierNumber.slice(-1)) || 0;
    
    // Cas 1: Titre valide sans problème (60% des cas)
    if (lastDigit <= 5) {
      return {
        success: true,
        data: {
          titre_foncier: titreFoncierNumber,
          type: 'TF',
          proprietaire: {
            nom: 'KOUASSI',
            prenom: 'Jean',
            cni: 'CI123456789'
          },
          cadastre: {
            superficie: 500,
            commune: 'Cocody',
            quartier: 'Riviera 3',
            ilot: 'R3-125',
            parcelle: 'P-456',
            coordonnees: {
              latitude: 5.3599,
              longitude: -4.0082
            }
          },
          juridique: {
            hypotheques: [],
            servitudes: [],
            litiges: [],
            derniere_mutation: '2020-01-15'
          },
          statut: 'VALIDE',
          date_creation: '2015-06-10',
          date_derniere_modification: '2020-01-15'
        }
      };
    }
    
    // Cas 2: Titre avec hypothèque (20% des cas)
    if (lastDigit === 6 || lastDigit === 7) {
      return {
        success: true,
        data: {
          titre_foncier: titreFoncierNumber,
          type: 'ACD',
          proprietaire: {
            nom: 'N\'GUESSAN',
            prenom: 'Marie',
            cni: 'CI987654321'
          },
          cadastre: {
            superficie: 350,
            commune: 'Yopougon',
            quartier: 'Niangon',
            ilot: 'N-89',
            parcelle: 'P-123',
            coordonnees: {
              latitude: 5.3345,
              longitude: -4.0892
            }
          },
          juridique: {
            hypotheques: [{
              numero: 'HYP-2023-0045',
              montant: 25000000,
              beneficiaire: 'Banque Atlantique CI',
              date_inscription: '2023-03-20'
            }],
            servitudes: [],
            litiges: [],
            derniere_mutation: '2023-03-15'
          },
          statut: 'VALIDE',
          date_creation: '2021-04-10',
          date_derniere_modification: '2023-03-20'
        }
      };
    }
    
    // Cas 3: Titre avec litige (10% des cas)
    if (lastDigit === 8) {
      return {
        success: true,
        data: {
          titre_foncier: titreFoncierNumber,
          type: 'TF',
          proprietaire: {
            nom: 'TRAORE',
            prenom: 'Ibrahim',
            cni: 'CI456789123'
          },
          cadastre: {
            superficie: 1000,
            commune: 'Abobo',
            quartier: 'PK18',
            ilot: 'A-256',
            parcelle: 'P-789',
            coordonnees: {
              latitude: 5.4245,
              longitude: -4.0195
            }
          },
          juridique: {
            hypotheques: [],
            servitudes: [],
            litiges: [{
              numero: 'LIT-2024-0123',
              tribunal: 'Tribunal de Première Instance d\'Abidjan',
              parties: ['TRAORE Ibrahim', 'KOUAME Jean'],
              statut: 'EN_COURS'
            }],
            derniere_mutation: '2019-08-10'
          },
          statut: 'VALIDE',
          date_creation: '2010-02-15',
          date_derniere_modification: '2019-08-10'
        }
      };
    }
    
    // Cas 4: Titre non trouvé (10% des cas)
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Titre foncier non trouvé dans la base SIGFU'
      }
    };
  }
  
  /**
   * Analyser la réponse SIGFU et créer l'objet de vérification
   */
  private static analyzeResponse(
    response: SIGFUApiResponse,
    propertyId: string,
    titreFoncierNumber: string,
    typeTitre: string
  ): any {
    if (!response.success) {
      return {
        property_id: propertyId,
        titre_foncier_number: titreFoncierNumber,
        type_titre: typeTitre,
        sigfu_status: response.error?.code === 'NOT_FOUND' ? 'NOT_FOUND' : 'ERROR',
        sigfu_response: response,
        has_conflict: false,
        has_hypotheque: false,
        has_litige: false,
        reliability_score: 0,
        sigfu_api_call_date: new Date().toISOString(),
      };
    }
    
    const data = response.data!;
    const hasHypotheque = data.juridique.hypotheques.length > 0;
    const hasLitige = data.juridique.litiges.length > 0;
    const hasServitude = data.juridique.servitudes.length > 0;
    const hasConflict = hasLitige; // Pour l'instant, conflit = litige
    
    // Calculer le score de fiabilité (0-100)
    let reliabilityScore = 100;
    
    if (data.statut !== 'VALIDE') reliabilityScore -= 50;
    if (hasHypotheque) reliabilityScore -= 15;
    if (hasLitige) reliabilityScore -= 25;
    if (hasServitude) reliabilityScore -= 5;
    
    // Vérifier l'ancienneté de la dernière mutation
    const lastMutation = new Date(data.juridique.derniere_mutation);
    const yearsSinceLastMutation = (Date.now() - lastMutation.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsSinceLastMutation > 10) reliabilityScore -= 5;
    
    reliabilityScore = Math.max(0, reliabilityScore);
    
    // Déterminer le statut
    let sigfuStatus: 'VERIFIED' | 'INVALID' | 'CONFLICT' | 'EXPIRED' = 'VERIFIED';
    
    if (data.statut === 'INVALIDE') {
      sigfuStatus = 'INVALID';
    } else if (data.statut === 'EXPIRE') {
      sigfuStatus = 'EXPIRED';
    } else if (hasLitige) {
      sigfuStatus = 'CONFLICT';
    }
    
    // Construire les messages d'alerte
    const warnings: string[] = [];
    if (hasHypotheque) {
      warnings.push(`${data.juridique.hypotheques.length} hypothèque(s) en cours`);
    }
    if (hasLitige) {
      warnings.push(`${data.juridique.litiges.length} litige(s) en cours`);
    }
    if (hasServitude) {
      warnings.push(`${data.juridique.servitudes.length} servitude(s) enregistrée(s)`);
    }
    
    return {
      property_id: propertyId,
      titre_foncier_number: titreFoncierNumber,
      type_titre: typeTitre,
      sigfu_status: sigfuStatus,
      sigfu_response: response,
      sigfu_api_call_date: new Date().toISOString(),
      
      proprietaire_nom: data.proprietaire.nom,
      proprietaire_prenom: data.proprietaire.prenom,
      proprietaire_cni: data.proprietaire.cni,
      
      superficie_cadastrale: data.cadastre.superficie,
      localisation: {
        commune: data.cadastre.commune,
        quartier: data.cadastre.quartier,
        ilot: data.cadastre.ilot,
        parcelle: data.cadastre.parcelle,
      },
      coordonnees_gps: data.cadastre.coordonnees,
      
      hypotheques: data.juridique.hypotheques,
      servitudes: data.juridique.servitudes,
      litiges: data.juridique.litiges,
      date_derniere_mutation: data.juridique.derniere_mutation,
      
      has_conflict: hasConflict,
      has_hypotheque: hasHypotheque,
      has_litige: hasLitige,
      conflict_details: hasLitige ? 
        `Litige en cours: ${data.juridique.litiges[0].numero}` : null,
      warning_messages: warnings,
      
      reliability_score: reliabilityScore,
      
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
    };
  }
  
  /**
   * Déclencher le recalcul du BakroScore après une vérification SIGFU
   */
  private static async triggerScoreRecalculation(propertyId: string): Promise<void> {
    try {
      // Appeler la fonction PostgreSQL de calcul du score
      const { error } = await supabase.rpc('calculate_bakro_score', {
        p_property_id: propertyId
      });
      
      if (error) {
        console.error('[SIGFU] Erreur lors du recalcul du score:', error);
      } else {
        console.log('[SIGFU] BakroScore recalculé avec succès');
      }
    } catch (error) {
      console.error('[SIGFU] Erreur lors du déclenchement du recalcul:', error);
    }
  }
  
  /**
   * Obtenir la dernière vérification SIGFU pour une propriété
   */
  static async getLatestVerification(propertyId: string): Promise<SIGFUVerification | null> {
    const { data, error } = await supabase
      .from('sigfu_verifications')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('[SIGFU] Erreur lors de la récupération:', error);
      return null;
    }
    
    return data;
  }
  
  /**
   * Vérifier si une vérification est encore valide
   */
  static isVerificationValid(verification: SIGFUVerification): boolean {
    if (!verification.expires_at) return false;
    return new Date(verification.expires_at) > new Date();
  }
  
  /**
   * Obtenir les statistiques SIGFU globales
   */
  static async getStats(): Promise<any> {
    const { data, error } = await supabase
      .from('sigfu_stats')
      .select('*')
      .single();
    
    if (error) {
      console.error('[SIGFU] Erreur lors de la récupération des stats:', error);
      return null;
    }
    
    return data;
  }
}

export default SIGFUService;
