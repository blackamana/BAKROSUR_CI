/**
 * ================================================================
 * BAKRÔSUR - Service BakroScore
 * ================================================================
 * Service pour calculer et gérer les scores de confiance des propriétés
 * ================================================================
 */

import { supabase } from '../lib/supabase';

// Types
export interface BakroScore {
  id: string;
  property_id: string;
  total_score: number;
  titre_score: number;
  documents_score: number;
  proprietaire_score: number;
  localisation_score: number;
  historique_score: number;
  transparence_score: number;
  confidence_level: 'EXCELLENT' | 'BON' | 'MOYEN' | 'FAIBLE' | 'TRES_FAIBLE';
  badge_color?: string;
  badge_text?: string;
  recommendations?: string[];
  risk_factors?: string[];
  has_sigfu_verification: boolean;
  has_notary_validation: boolean;
  has_complete_documents: boolean;
  has_no_litigation: boolean;
  owner_kyc_verified: boolean;
  calculated_at: string;
  expires_at?: string;
}

export interface ScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  details: string[];
}

export class BakroScoreService {
  
  /**
   * Calculer ou recalculer le score d'une propriété
   */
  static async calculateScore(propertyId: string): Promise<BakroScore | null> {
    try {
      console.log(`[BakroScore] Calcul du score pour la propriété ${propertyId}`);
      
      // Appeler la fonction PostgreSQL
      const { data, error } = await supabase.rpc('calculate_bakro_score', {
        p_property_id: propertyId
      });
      
      if (error) {
        console.error('[BakroScore] Erreur lors du calcul:', error);
        throw error;
      }
      
      console.log(`[BakroScore] Score calculé: ${data}`);
      
      // Récupérer le score complet
      return await this.getScore(propertyId);
      
    } catch (error) {
      console.error('[BakroScore] Erreur:', error);
      return null;
    }
  }
  
  /**
   * Obtenir le score d'une propriété
   */
  static async getScore(propertyId: string): Promise<BakroScore | null> {
    const { data, error } = await supabase
      .from('bakro_scores')
      .select('*')
      .eq('property_id', propertyId)
      .single();
    
    if (error) {
      console.error('[BakroScore] Erreur lors de la récupération:', error);
      return null;
    }
    
    return data;
  }
  
  /**
   * Obtenir le détail du score avec explications
   */
  static async getScoreBreakdown(propertyId: string): Promise<ScoreBreakdown[]> {
    const score = await this.getScore(propertyId);
    
    if (!score) {
      return [];
    }
    
    const breakdown: ScoreBreakdown[] = [
      {
        category: 'Titre Foncier',
        score: score.titre_score,
        maxScore: 40,
        percentage: (score.titre_score / 40) * 100,
        status: this.getStatusFromPercentage((score.titre_score / 40) * 100),
        details: this.getTitreDetails(score)
      },
      {
        category: 'Documents',
        score: score.documents_score,
        maxScore: 20,
        percentage: (score.documents_score / 20) * 100,
        status: this.getStatusFromPercentage((score.documents_score / 20) * 100),
        details: this.getDocumentsDetails(score)
      },
      {
        category: 'Propriétaire',
        score: score.proprietaire_score,
        maxScore: 15,
        percentage: (score.proprietaire_score / 15) * 100,
        status: this.getStatusFromPercentage((score.proprietaire_score / 15) * 100),
        details: this.getProprietaireDetails(score)
      },
      {
        category: 'Localisation',
        score: score.localisation_score,
        maxScore: 10,
        percentage: (score.localisation_score / 10) * 100,
        status: this.getStatusFromPercentage((score.localisation_score / 10) * 100),
        details: this.getLocalisationDetails(score)
      },
      {
        category: 'Historique',
        score: score.historique_score,
        maxScore: 10,
        percentage: (score.historique_score / 10) * 100,
        status: this.getStatusFromPercentage((score.historique_score / 10) * 100),
        details: this.getHistoriqueDetails(score)
      },
      {
        category: 'Transparence',
        score: score.transparence_score,
        maxScore: 5,
        percentage: (score.transparence_score / 5) * 100,
        status: this.getStatusFromPercentage((score.transparence_score / 5) * 100),
        details: this.getTransparenceDetails(score)
      }
    ];
    
    return breakdown;
  }
  
  /**
   * Déterminer le statut à partir du pourcentage
   */
  private static getStatusFromPercentage(percentage: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (percentage >= 85) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 50) return 'average';
    return 'poor';
  }
  
  /**
   * Détails du score Titre
   */
  private static getTitreDetails(score: BakroScore): string[] {
    const details: string[] = [];
    
    if (score.has_sigfu_verification) {
      details.push('✅ Titre vérifié par SIGFU');
    } else {
      details.push('⚠️ Titre non vérifié par SIGFU');
    }
    
    if (score.has_no_litigation) {
      details.push('✅ Aucun litige enregistré');
    } else {
      details.push('⚠️ Litige(s) en cours');
    }
    
    if (score.titre_score >= 35) {
      details.push('✅ Titre en règle et sécurisé');
    } else if (score.titre_score >= 25) {
      details.push('⚠️ Titre valide mais attention requise');
    } else {
      details.push('❌ Problèmes détectés sur le titre');
    }
    
    return details;
  }
  
  /**
   * Détails du score Documents
   */
  private static getDocumentsDetails(score: BakroScore): string[] {
    const details: string[] = [];
    
    if (score.has_complete_documents) {
      details.push('✅ Documents complets');
    } else {
      details.push('⚠️ Documents incomplets');
    }
    
    if (score.documents_score >= 18) {
      details.push('✅ Tous les documents fournis et vérifiés');
    } else if (score.documents_score >= 12) {
      details.push('⚠️ Quelques documents manquants');
    } else {
      details.push('❌ Documents insuffisants');
    }
    
    return details;
  }
  
  /**
   * Détails du score Propriétaire
   */
  private static getProprietaireDetails(score: BakroScore): string[] {
    const details: string[] = [];
    
    if (score.owner_kyc_verified) {
      details.push('✅ Identité du propriétaire vérifiée (KYC)');
    } else {
      details.push('⚠️ KYC du propriétaire non complété');
    }
    
    if (score.proprietaire_score >= 12) {
      details.push('✅ Propriétaire pleinement vérifié');
    } else if (score.proprietaire_score >= 8) {
      details.push('⚠️ Vérification partielle du propriétaire');
    } else {
      details.push('❌ Propriétaire non vérifié');
    }
    
    return details;
  }
  
  /**
   * Détails du score Localisation
   */
  private static getLocalisationDetails(score: BakroScore): string[] {
    const details: string[] = [];
    
    if (score.localisation_score >= 9) {
      details.push('✅ Localisation précise avec coordonnées GPS');
    } else if (score.localisation_score >= 6) {
      details.push('✅ Localisation avec ville et quartier');
    } else if (score.localisation_score >= 3) {
      details.push('⚠️ Localisation partielle (ville uniquement)');
    } else {
      details.push('❌ Localisation insuffisante');
    }
    
    return details;
  }
  
  /**
   * Détails du score Historique
   */
  private static getHistoriqueDetails(score: BakroScore): string[] {
    const details: string[] = [];
    
    if (score.has_no_litigation) {
      details.push('✅ Aucun litige dans l\'historique');
    } else {
      details.push('⚠️ Litige(s) détecté(s)');
    }
    
    if (score.historique_score >= 8) {
      details.push('✅ Historique clair et sans problème');
    } else {
      details.push('⚠️ Éléments à vérifier dans l\'historique');
    }
    
    return details;
  }
  
  /**
   * Détails du score Transparence
   */
  private static getTransparenceDetails(score: BakroScore): string[] {
    const details: string[] = [];
    
    if (score.transparence_score >= 4) {
      details.push('✅ Annonce complète et détaillée');
    } else if (score.transparence_score >= 2) {
      details.push('⚠️ Description partiellement complète');
    } else {
      details.push('❌ Description insuffisante');
    }
    
    return details;
  }
  
  /**
   * Obtenir les recommandations pour améliorer le score
   */
  static async getRecommendations(propertyId: string): Promise<string[]> {
    const score = await this.getScore(propertyId);
    
    if (!score) {
      return [];
    }
    
    const recommendations: string[] = [];
    
    // Recommandations basées sur les points manquants
    if (!score.has_sigfu_verification) {
      recommendations.push('🔍 Faire vérifier le titre foncier via SIGFU pour gagner jusqu\'à 40 points');
    }
    
    if (!score.has_complete_documents) {
      recommendations.push('📄 Compléter les documents (contrat, plan, photos) pour gagner jusqu\'à 20 points');
    }
    
    if (!score.owner_kyc_verified) {
      recommendations.push('👤 Compléter votre vérification d\'identité (KYC) pour gagner jusqu\'à 15 points');
    }
    
    if (!score.has_notary_validation) {
      recommendations.push('⚖️ Faire valider par un notaire partenaire pour plus de crédibilité');
    }
    
    if (score.localisation_score < 9) {
      recommendations.push('📍 Ajouter les coordonnées GPS précises pour gagner jusqu\'à 10 points');
    }
    
    if (score.transparence_score < 4) {
      recommendations.push('📝 Enrichir la description de votre bien pour gagner jusqu\'à 5 points');
    }
    
    return recommendations;
  }
  
  /**
   * Obtenir le badge à afficher
   */
  static getBadgeInfo(score: BakroScore): {
    color: string;
    text: string;
    icon: string;
  } {
    const level = score.confidence_level;
    const scoreValue = score.total_score;
    
    switch (level) {
      case 'EXCELLENT':
        return {
          color: 'green',
          text: `Excellent (${Math.round(scoreValue)}/100)`,
          icon: '🌟'
        };
      case 'BON':
        return {
          color: 'blue',
          text: `Bon (${Math.round(scoreValue)}/100)`,
          icon: '✅'
        };
      case 'MOYEN':
        return {
          color: 'yellow',
          text: `Moyen (${Math.round(scoreValue)}/100)`,
          icon: '⚠️'
        };
      case 'FAIBLE':
        return {
          color: 'orange',
          text: `Faible (${Math.round(scoreValue)}/100)`,
          icon: '⚠️'
        };
      case 'TRES_FAIBLE':
        return {
          color: 'red',
          text: `Très faible (${Math.round(scoreValue)}/100)`,
          icon: '❌'
        };
      default:
        return {
          color: 'gray',
          text: 'Non évalué',
          icon: '❓'
        };
    }
  }
  
  /**
   * Obtenir les propriétés les mieux notées
   */
  static async getTopScoredProperties(limit: number = 10): Promise<BakroScore[]> {
    const { data, error } = await supabase
      .from('bakro_scores')
      .select('*')
      .gte('total_score', 70)
      .order('total_score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('[BakroScore] Erreur lors de la récupération des tops:', error);
      return [];
    }
    
    return data || [];
  }
  
  /**
   * Vérifier si le score doit être recalculé
   */
  static shouldRecalculate(score: BakroScore): boolean {
    if (!score.expires_at) return true;
    
    const expirationDate = new Date(score.expires_at);
    const now = new Date();
    
    return expirationDate < now;
  }
  
  /**
   * Recalculer tous les scores expirés (tâche batch)
   */
  static async recalculateExpiredScores(): Promise<number> {
    console.log('[BakroScore] Démarrage du recalcul des scores expirés...');
    
    // Récupérer tous les scores expirés
    const { data: expiredScores, error } = await supabase
      .from('bakro_scores')
      .select('property_id')
      .lt('expires_at', new Date().toISOString());
    
    if (error || !expiredScores) {
      console.error('[BakroScore] Erreur lors de la récupération des scores expirés:', error);
      return 0;
    }
    
    let recalculatedCount = 0;
    
    // Recalculer chaque score
    for (const score of expiredScores) {
      try {
        await this.calculateScore(score.property_id);
        recalculatedCount++;
      } catch (error) {
        console.error(`[BakroScore] Erreur lors du recalcul de ${score.property_id}:`, error);
      }
    }
    
    console.log(`[BakroScore] ${recalculatedCount}/${expiredScores.length} scores recalculés`);
    
    return recalculatedCount;
  }
  
  /**
   * Obtenir les statistiques globales des scores
   */
  static async getGlobalStats(): Promise<{
    total: number;
    avgScore: number;
    byLevel: Record<string, number>;
  }> {
    const { data, error } = await supabase
      .from('bakro_scores')
      .select('total_score, confidence_level');
    
    if (error || !data) {
      return {
        total: 0,
        avgScore: 0,
        byLevel: {}
      };
    }
    
    const total = data.length;
    const avgScore = data.reduce((sum, s) => sum + s.total_score, 0) / total;
    
    const byLevel: Record<string, number> = {};
    data.forEach(s => {
      byLevel[s.confidence_level] = (byLevel[s.confidence_level] || 0) + 1;
    });
    
    return {
      total,
      avgScore: Math.round(avgScore * 100) / 100,
      byLevel
    };
  }
}

export default BakroScoreService;
