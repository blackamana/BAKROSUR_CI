/**
 * ================================================================
 * BAKRÔSUR - Composant BakroScore Detail
 * ================================================================
 * Affiche le détail complet du score avec graphiques
 * ================================================================
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BakroScoreService, { BakroScore, ScoreBreakdown } from '../services/bakro-score.service';
import BakroScoreBadge from './BakroScoreBadge';

interface BakroScoreDetailProps {
  propertyId: string;
}

const { width } = Dimensions.get('window');
const BAR_WIDTH = width - 80;

export const BakroScoreDetail: React.FC<BakroScoreDetailProps> = ({ propertyId }) => {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<BakroScore | null>(null);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    loadScoreData();
  }, [propertyId]);

  const loadScoreData = async () => {
    try {
      setLoading(true);
      
      // Charger le score
      const scoreData = await BakroScoreService.getScore(propertyId);
      
      if (!scoreData) {
        // Si pas de score, le calculer
        await BakroScoreService.calculateScore(propertyId);
        const newScore = await BakroScoreService.getScore(propertyId);
        setScore(newScore);
        
        if (newScore) {
          const breakdownData = await BakroScoreService.getScoreBreakdown(propertyId);
          const recoData = await BakroScoreService.getRecommendations(propertyId);
          setBreakdown(breakdownData);
          setRecommendations(recoData);
        }
      } else {
        setScore(scoreData);
        const breakdownData = await BakroScoreService.getScoreBreakdown(propertyId);
        const recoData = await BakroScoreService.getRecommendations(propertyId);
        setBreakdown(breakdownData);
        setRecommendations(recoData);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement du score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Calcul du BakroScore...</Text>
      </View>
    );
  }

  if (!score) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Impossible de calculer le score</Text>
      </View>
    );
  }

  const badgeInfo = BakroScoreService.getBadgeInfo(score);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec badge principal */}
      <View style={styles.header}>
        <Text style={styles.title}>BakroScore™</Text>
        <Text style={styles.subtitle}>
          Score de confiance de ce bien immobilier
        </Text>
        
        <View style={styles.badgeContainer}>
          <BakroScoreBadge
            score={score.total_score}
            level={score.confidence_level}
            size="large"
          />
        </View>
        
        <Text style={styles.description}>
          {getDescriptionByLevel(score.confidence_level)}
        </Text>
      </View>

      {/* Détails par catégorie */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détail du score</Text>
        
        {breakdown.map((item, index) => (
          <View key={index} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>{item.category}</Text>
              <Text style={styles.categoryScore}>
                {Math.round(item.score)}/{item.maxScore}
              </Text>
            </View>
            
            {/* Barre de progression */}
            <View style={styles.progressBar}>
              <LinearGradient
                colors={getGradientColors(item.status)}
                style={[
                  styles.progressFill,
                  { width: `${item.percentage}%` }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            
            {/* Détails */}
            {item.details.map((detail, idx) => (
              <Text key={idx} style={styles.detail}>
                {detail}
              </Text>
            ))}
          </View>
        ))}
      </View>

      {/* Recommandations */}
      {recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Comment améliorer votre score</Text>
          
          {recommendations.map((reco, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>{reco}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Critères vérifiés */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✓ Critères vérifiés</Text>
        
        <View style={styles.criteriaGrid}>
          <CriteriaItem 
            label="SIGFU vérifié" 
            value={score.has_sigfu_verification} 
          />
          <CriteriaItem 
            label="Documents complets" 
            value={score.has_complete_documents} 
          />
          <CriteriaItem 
            label="KYC propriétaire" 
            value={score.owner_kyc_verified} 
          />
          <CriteriaItem 
            label="Sans litige" 
            value={score.has_no_litigation} 
          />
          <CriteriaItem 
            label="Notaire validé" 
            value={score.has_notary_validation} 
          />
        </View>
      </View>

      {/* Info mise à jour */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Dernière mise à jour : {new Date(score.calculated_at).toLocaleDateString('fr-FR')}
        </Text>
        <Text style={styles.footerNote}>
          Le BakroScore est recalculé automatiquement tous les 30 jours
        </Text>
      </View>
    </ScrollView>
  );
};

// Composant critère
const CriteriaItem: React.FC<{ label: string; value: boolean }> = ({ label, value }) => (
  <View style={styles.criteriaItem}>
    <Text style={styles.criteriaIcon}>{value ? '✅' : '❌'}</Text>
    <Text style={[styles.criteriaLabel, !value && styles.criteriaLabelDisabled]}>
      {label}
    </Text>
  </View>
);

// Helpers
const getDescriptionByLevel = (level: string): string => {
  switch (level) {
    case 'EXCELLENT':
      return 'Cette propriété présente d\'excellentes garanties de sécurité juridique. Vous pouvez acheter en toute confiance ! 🎉';
    case 'BON':
      return 'Cette propriété offre de bonnes garanties. Les documents principaux sont vérifiés et en ordre. ✅';
    case 'MOYEN':
      return 'Cette propriété nécessite une vérification approfondie. Certains documents ou informations sont manquants. ⚠️';
    case 'FAIBLE':
      return 'Attention : cette propriété présente plusieurs points à éclaircir. Nous recommandons fortement un audit juridique. ⚠️';
    case 'TRES_FAIBLE':
      return 'PRUDENCE : cette propriété présente des risques importants. Contactez impérativement un notaire avant toute transaction. 🚨';
    default:
      return 'Score non évalué';
  }
};

const getGradientColors = (status: string): string[] => {
  switch (status) {
    case 'excellent':
      return ['#10b981', '#059669'];
    case 'good':
      return ['#3b82f6', '#2563eb'];
    case 'average':
      return ['#f59e0b', '#d97706'];
    case 'poor':
      return ['#ef4444', '#dc2626'];
    default:
      return ['#9ca3af', '#6b7280'];
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  badgeContainer: {
    marginVertical: 24,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  categoryScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7A00',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  detail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    paddingLeft: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF7A00',
    marginTop: 6,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  criteriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  criteriaItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
  },
  criteriaIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  criteriaLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  criteriaLabelDisabled: {
    color: '#94a3b8',
  },
  footer: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  footerNote: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default BakroScoreDetail;
