import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { Heart, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { PROPERTIES } from '@/constants/properties';

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M FCFA`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K FCFA`;
  }
  return `${price} FCFA`;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>(
    PROPERTIES.filter((p) => p.featured).map((p) => p.id)
  );

  const favoriteProperties = PROPERTIES.filter((p) => favorites.includes(p.id));

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Mes favoris' }} />
      <View style={styles.container}>
        {favoriteProperties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Heart size={64} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>Aucun favori</Text>
            <Text style={styles.emptySubtitle}>
              Ajoutez des biens à vos favoris pour les retrouver facilement
            </Text>
            <Pressable
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)/search' as any)}
            >
              <Text style={styles.browseButtonText}>Parcourir les biens</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.header}>
              {favoriteProperties.length} bien{favoriteProperties.length !== 1 ? 's' : ''}{' '}
              en favori{favoriteProperties.length !== 1 ? 's' : ''}
            </Text>

            {favoriteProperties.map((property) => (
              <Pressable
                key={property.id}
                style={styles.propertyCard}
                onPress={() => router.push(`/property/${property.id}` as any)}
              >
                <Image
                  source={{ uri: property.images[0] }}
                  style={styles.propertyImage}
                  contentFit="cover"
                />

                <Pressable
                  style={styles.favoriteButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                >
                  <Heart size={20} color={Colors.light.primary} fill={Colors.light.primary} />
                </Pressable>

                {property.featured && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>★ Vedette</Text>
                  </View>
                )}

                <View style={styles.propertyContent}>
                  <Text style={styles.propertyTitle} numberOfLines={2}>
                    {property.title}
                  </Text>

                  <View style={styles.propertyLocation}>
                    <MapPin size={14} color={Colors.light.textSecondary} />
                    <Text style={styles.propertyLocationText}>
                      {property.neighborhoodName}, {property.cityName}
                    </Text>
                  </View>

                  <View style={styles.propertyDetails}>
                    {property.bedrooms && (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailText}>{property.bedrooms} ch.</Text>
                      </View>
                    )}
                    {property.bathrooms && (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailText}>{property.bathrooms} sdb.</Text>
                      </View>
                    )}
                    <View style={styles.detailItem}>
                      <Text style={styles.detailText}>{property.surfaceArea}m²</Text>
                    </View>
                  </View>

                  <View style={styles.propertyPriceRow}>
                    <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>
                    <Text style={styles.propertyPriceType}>
                      {property.transactionType === 'VENTE' ? 'Vente' : '/mois'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  browseButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  propertyCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  propertyContent: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  propertyLocationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  propertyDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  propertyPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  propertyPriceType: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
