/**
 * ActiveFiltersBar - Résumé des filtres actifs en langage naturel
 * Format: "Achat appartement à Abidjan - 2+ chambres - 50-100M FCFA - Titre vérifié"
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X, RotateCcw } from 'lucide-react-native';
import { SearchFilters, TransactionType, PropertyType } from '@/lib/types/search.types';

export interface ActiveFiltersBarProps {
  filters: SearchFilters;
  resultCount?: number;
  onReset: () => void;
  cityName?: string;
  neighborhoodName?: string;
}

export const ActiveFiltersBar: React.FC<ActiveFiltersBarProps> = ({
  filters,
  resultCount,
  onReset,
  cityName,
  neighborhoodName,
}) => {
  const buildFilterSummary = (): string[] => {
    const parts: string[] = [];

    // Type de transaction
    if (filters.transactionType) {
      const transactionLabels: Record<TransactionType, string> = {
        BUY: 'Achat',
        RENT: 'Location',
        NEW: 'Neuf',
        LAND: 'Terrain',
      };
      parts.push(transactionLabels[filters.transactionType]);
    }

    // Type de bien
    if (filters.propertyType) {
      const propertyLabels: Record<PropertyType, string> = {
        APPARTEMENT: 'appartement',
        MAISON: 'maison',
        TERRAIN: 'terrain',
        COMMERCE: 'commerce',
        BUREAU: 'bureau',
      };
      parts.push(propertyLabels[filters.propertyType]);
    }

    // Localisation
    if (neighborhoodName) {
      parts.push(`à ${neighborhoodName}`);
    } else if (cityName) {
      parts.push(`à ${cityName}`);
    }

    // Chambres
    if (filters.bedrooms) {
      parts.push(`${filters.bedrooms}+ ch`);
    }

    // Salles de bain
    if (filters.bathrooms) {
      parts.push(`${filters.bathrooms}+ sdb`);
    }

    // Prix
    if (filters.minPrice || filters.maxPrice) {
      const formatPrice = (price: number): string => {
        if (price >= 1000000) {
          return `${(price / 1000000).toFixed(0)}M`;
        }
        if (price >= 1000) {
          return `${(price / 1000).toFixed(0)}K`;
        }
        return price.toString();
      };

      if (filters.minPrice && filters.maxPrice) {
        parts.push(
          `${formatPrice(filters.minPrice)}-${formatPrice(filters.maxPrice)} FCFA`
        );
      } else if (filters.minPrice) {
        parts.push(`> ${formatPrice(filters.minPrice)} FCFA`);
      } else if (filters.maxPrice) {
        parts.push(`< ${formatPrice(filters.maxPrice)} FCFA`);
      }
    }

    // Surface
    if (filters.minSurface || filters.maxSurface) {
      if (filters.minSurface && filters.maxSurface) {
        parts.push(`${filters.minSurface}-${filters.maxSurface} m²`);
      } else if (filters.minSurface) {
        parts.push(`> ${filters.minSurface} m²`);
      } else if (filters.maxSurface) {
        parts.push(`< ${filters.maxSurface} m²`);
      }
    }

    // Titre vérifié
    if (filters.titleVerified) {
      parts.push('Titre vérifié');
    }

    // BakroScore minimum
    if (filters.bakroScoreMin) {
      parts.push(`Score ${filters.bakroScoreMin}+`);
    }

    // Équipements
    const selectedAmenities = Object.entries(filters.amenities)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const amenityLabels: Record<string, string> = {
          parking: 'Parking',
          garden: 'Jardin',
          pool: 'Piscine',
          elevator: 'Ascenseur',
          balcony: 'Balcon',
          terrace: 'Terrasse',
          basement: 'Sous-sol',
          security: 'Sécurité',
        };
        return amenityLabels[key] || key;
      });

    if (selectedAmenities.length > 0) {
      parts.push(selectedAmenities.join(', '));
    }

    return parts;
  };

  const hasActiveFilters = () => {
    return (
      filters.transactionType !== null ||
      filters.propertyType !== null ||
      filters.cityId !== null ||
      filters.neighborhoodId !== null ||
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.minSurface !== null ||
      filters.maxSurface !== null ||
      filters.bedrooms !== null ||
      filters.bathrooms !== null ||
      filters.titleVerified ||
      filters.bakroScoreMin !== null ||
      Object.values(filters.amenities).some((v) => v)
    );
  };

  if (!hasActiveFilters()) {
    return null;
  }

  const summaryParts = buildFilterSummary();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Résumé textuel */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>{summaryParts.join(' • ')}</Text>
        </View>

        {/* Compteur de résultats */}
        {resultCount !== undefined && (
          <View style={styles.resultBadge}>
            <Text style={styles.resultText}>{resultCount}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bouton Reset */}
      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <RotateCcw size={16} color="#6B7280" />
        <Text style={styles.resetText}>Réinitialiser</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  resultBadge: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    marginLeft: 12,
    gap: 6,
  },
  resetText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
});
