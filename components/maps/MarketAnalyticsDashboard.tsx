/**
 * Dashboard des Analytics du Marché Immobilier
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Home,
  DollarSign,
  MapPin,
  Clock,
  BarChart3,
  X,
} from 'lucide-react-native';
import { mapService, MarketAnalytics } from '@/lib/maps/map.service';

interface MarketAnalyticsDashboardProps {
  cityId?: string;
  neighborhoodId?: string;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const MarketAnalyticsDashboard: React.FC<MarketAnalyticsDashboardProps> = ({
  cityId,
  neighborhoodId,
  onClose,
}) => {
  const [analytics, setAnalytics] = useState<MarketAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [cityId, neighborhoodId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await mapService.getMarketAnalytics(cityId, neighborhoodId);
      setAnalytics(data);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'UP':
        return <TrendingUp size={20} color="#10B981" />;
      case 'DOWN':
        return <TrendingDown size={20} color="#EF4444" />;
      default:
        return <Minus size={20} color="#6B7280" />;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'UP':
        return '#10B981';
      case 'DOWN':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getPopularityColor = (score?: number) => {
    if (!score) return '#6B7280';
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#3B82F6';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EA580C" />
          <Text style={styles.loadingText}>Chargement des analytics...</Text>
        </View>
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics du Marché</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <BarChart3 size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>Aucune donnée disponible</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Analytics du Marché</Text>
          <Text style={styles.headerSubtitle}>
            Données en temps réel
          </Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Score de Popularité */}
        {analytics.popularity_score && (
          <View style={styles.popularityCard}>
            <View style={styles.popularityHeader}>
              <Text style={styles.sectionTitle}>Score de Popularité</Text>
              <View
                style={[
                  styles.popularityBadge,
                  { backgroundColor: getPopularityColor(analytics.popularity_score) },
                ]}
              >
                <Text style={styles.popularityScore}>
                  {analytics.popularity_score}/100
                </Text>
              </View>
            </View>
            <View style={styles.popularityBar}>
              <View
                style={[
                  styles.popularityFill,
                  {
                    width: `${analytics.popularity_score}%`,
                    backgroundColor: getPopularityColor(analytics.popularity_score),
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Statistiques générales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Home size={24} color="#EA580C" />
              </View>
              <Text style={styles.statValue}>{analytics.total_properties}</Text>
              <Text style={styles.statLabel}>Propriétés</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <MapPin size={24} color="#3B82F6" />
              </View>
              <Text style={styles.statValue}>
                {analytics.properties_for_sale || 0}
              </Text>
              <Text style={styles.statLabel}>À vendre</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Clock size={24} color="#10B981" />
              </View>
              <Text style={styles.statValue}>
                {analytics.properties_for_rent || 0}
              </Text>
              <Text style={styles.statLabel}>À louer</Text>
            </View>
          </View>
        </View>

        {/* Prix moyens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prix moyens</Text>

          {analytics.avg_price_sale && (
            <View style={styles.priceCard}>
              <View style={styles.priceHeader}>
                <Text style={styles.priceLabel}>Prix moyen de vente</Text>
                <View style={styles.trendBadge}>
                  {getTrendIcon(analytics.price_trend)}
                  {analytics.price_change_percent && (
                    <Text
                      style={[
                        styles.trendText,
                        { color: getTrendColor(analytics.price_trend) },
                      ]}
                    >
                      {Math.abs(analytics.price_change_percent)}%
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.priceValue}>
                {formatPrice(analytics.avg_price_sale)} FCFA
              </Text>
            </View>
          )}

          {analytics.avg_price_rent && (
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Prix moyen de location</Text>
              <Text style={styles.priceValue}>
                {formatPrice(analytics.avg_price_rent)} FCFA/mois
              </Text>
            </View>
          )}

          {analytics.avg_price_per_sqm && (
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Prix moyen au m²</Text>
              <Text style={styles.priceValue}>
                {formatPrice(analytics.avg_price_per_sqm)} FCFA/m²
              </Text>
            </View>
          )}
        </View>

        {/* Tendances */}
        {analytics.price_trend && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tendance du marché</Text>
            <View
              style={[
                styles.trendCard,
                { borderLeftColor: getTrendColor(analytics.price_trend) },
              ]}
            >
              <View style={styles.trendContent}>
                {getTrendIcon(analytics.price_trend)}
                <View style={styles.trendInfo}>
                  <Text style={styles.trendTitle}>
                    {analytics.price_trend === 'UP' && 'Marché en hausse'}
                    {analytics.price_trend === 'DOWN' && 'Marché en baisse'}
                    {analytics.price_trend === 'STABLE' && 'Marché stable'}
                  </Text>
                  {analytics.price_change_percent && (
                    <Text style={styles.trendDescription}>
                      Les prix ont{' '}
                      {analytics.price_trend === 'UP' ? 'augmenté' : 'diminué'} de{' '}
                      {Math.abs(analytics.price_change_percent)}% sur la période
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Recommandations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Recommandations</Text>
          <View style={styles.recommendationCard}>
            {analytics.price_trend === 'UP' && (
              <Text style={styles.recommendationText}>
                ✓ Bon moment pour vendre{'\n'}
                ⚠️ Les prix augmentent, attendez pour acheter
              </Text>
            )}
            {analytics.price_trend === 'DOWN' && (
              <Text style={styles.recommendationText}>
                ✓ Bon moment pour acheter{'\n'}
                ⚠️ Envisagez de retarder une vente
              </Text>
            )}
            {analytics.price_trend === 'STABLE' && (
              <Text style={styles.recommendationText}>
                ✓ Marché équilibré{'\n'}
                ✓ Conditions favorables pour acheter ou vendre
              </Text>
            )}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
  },
  popularityCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  popularityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  popularityScore: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  popularityBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  popularityFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  priceCard: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendCard: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  trendContent: {
    flexDirection: 'row',
    gap: 12,
  },
  trendInfo: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  trendDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  recommendationCard: {
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  recommendationText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});