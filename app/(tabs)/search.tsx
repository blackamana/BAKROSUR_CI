import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { MapPin, Grid3x3, List, SortAsc } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { PROPERTIES, PropertyType } from '@/constants/properties';
import { SearchFilters, TransactionType } from '@/lib/types/search.types';

// Import des nouveaux composants inspirés de Bien'ici
import PropertySearchBar from '@/components/search/PropertySearchBar';
import TransactionTypeTabs from '@/components/search/TransactionTypeTabs';
import MainFilters from '@/components/search/MainFilters';
import ActiveFiltersBar from '@/components/search/ActiveFiltersBar';

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M FCFA`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K FCFA`;
  }
  return `${price} FCFA`;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'surface-asc' | 'surface-desc';

export default function SearchScreen() {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Utilisation du nouveau type SearchFilters
  const [filters, setFilters] = useState<SearchFilters>({
    transactionType: null,
    propertyType: null,
    cityId: null,
    neighborhoodId: null,
    minPrice: null,
    maxPrice: null,
    minSurface: null,
    maxSurface: null,
    bedrooms: null,
    bathrooms: null,
    titleVerified: false,
    bakroScoreMin: null,
    amenities: {
      parking: false,
      garden: false,
      pool: false,
      security: false,
      elevator: false,
      airConditioning: false,
      furnished: false,
    },
  });

  const filteredAndSortedProperties = PROPERTIES.filter((property) => {
    // Conversion des types pour compatibilité
    const transactionTypeMap: Record<string, TransactionType> = {
      'VENTE': 'BUY',
      'LOCATION': 'RENT',
    };

    const propertyTypeMap: Record<string, any> = {
      'MAISON': 'MAISON',
      'APPARTEMENT': 'APPARTEMENT',
      'TERRAIN': 'TERRAIN',
      'COMMERCE': 'COMMERCE',
      'BUREAU': 'BUREAU',
    };

    if (filters.transactionType) {
      const mappedTransaction = filters.transactionType === 'BUY' ? 'VENTE' : 'LOCATION';
      if (property.transactionType !== mappedTransaction) return false;
    }

    if (filters.propertyType && property.type !== filters.propertyType) return false;
    if (filters.cityId && property.cityId !== filters.cityId) return false;
    if (filters.neighborhoodId && property.neighborhoodId !== filters.neighborhoodId) return false;
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    if (filters.minSurface && property.surfaceArea < filters.minSurface) return false;
    if (filters.maxSurface && property.surfaceArea > filters.maxSurface) return false;
    if (filters.bedrooms && property.bedrooms && property.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms && property.bathrooms && property.bathrooms < filters.bathrooms) return false;

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'surface-asc':
        return a.surfaceArea - b.surfaceArea;
      case 'surface-desc':
        return b.surfaceArea - a.surfaceArea;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleSearch = (query: string) => {
    console.log('Recherche:', query);
    // TODO: Implémenter la recherche avec Supabase
  };

  const handleSuggestionSelect = (suggestion: any) => {
    console.log('Suggestion sélectionnée:', suggestion);
    // TODO: Naviguer vers les résultats
  };

  const fetchSuggestions = async (query: string) => {
    // TODO: Implémenter avec Supabase
    return [];
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleReset = () => {
    setFilters({
      transactionType: null,
      propertyType: null,
      cityId: null,
      neighborhoodId: null,
      minPrice: null,
      maxPrice: null,
      minSurface: null,
      maxSurface: null,
      bedrooms: null,
      bathrooms: null,
      titleVerified: false,
      bakroScoreMin: null,
      amenities: {
        parking: false,
        garden: false,
        pool: false,
        security: false,
        elevator: false,
        airConditioning: false,
        furnished: false,
      },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Recherche',
          headerLargeTitle: false,
        }}
      />
      <View style={styles.container}>
        {/* Barre de recherche Bien'ici */}
        <View style={styles.searchSection}>
          <PropertySearchBar
            placeholder="J'envisage d'acheter en..."
            onSearch={handleSearch}
            onSuggestionSelect={handleSuggestionSelect}
            fetchSuggestions={fetchSuggestions}
            showHistory={true}
          />
        </View>

        {/* Onglets de type de transaction Bien'ici */}
        <TransactionTypeTabs
          selected={filters.transactionType}
          onSelect={(type) => handleFilterChange({ transactionType: type })}
        />

        {/* Filtres principaux Bien'ici */}
        <MainFilters
          filters={filters}
          onChange={handleFilterChange}
          resultCount={filteredAndSortedProperties.length}
        />

        {/* Barre de filtres actifs Bien'ici */}
        <ActiveFiltersBar
          filters={filters}
          resultCount={filteredAndSortedProperties.length}
          onReset={handleReset}
        />

        {/* Toolbar avec tri et affichage */}
        <View style={styles.toolbarContainer}>
          <Text style={styles.resultsCount}>
            {`${filteredAndSortedProperties.length} bien${filteredAndSortedProperties.length !== 1 ? 's' : ''}`}
          </Text>

          <View style={styles.toolbarButtons}>
            <Pressable
              style={styles.toolbarButton}
              onPress={() => setShowSortOptions(!showSortOptions)}
            >
              <SortAsc size={18} color={Colors.light.primary} />
            </Pressable>

            <Pressable
              style={styles.toolbarButton}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <List size={18} color={Colors.light.primary} />
              ) : (
                <Grid3x3 size={18} color={Colors.light.primary} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Liste des résultats */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={viewMode === 'grid' ? styles.propertiesGrid : styles.propertiesList}>
            {filteredAndSortedProperties.map((property) => (
              <Pressable
                key={property.id}
                style={viewMode === 'grid' ? styles.propertyCardGrid : styles.propertyCard}
                onPress={() => {
                  router.push(`/property/${property.id}` as any);
                }}
              >
                <View style={viewMode === 'grid' ? styles.propertyImageContainerGrid : styles.propertyImageContainer}>
                  <Image
                    source={{ uri: property.images[0] }}
                    style={styles.propertyImage}
                    contentFit="cover"
                  />
                  <View style={styles.propertyTypeBadge}>
                    <Text style={styles.propertyTypeBadgeText}>{property.type}</Text>
                  </View>
                  {property.featured && (
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredBadgeText}>Vedette</Text>
                    </View>
                  )}
                </View>

                <View style={styles.propertyInfo}>
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
                      <View style={styles.propertyDetailItem}>
                        <Text style={styles.propertyDetailText}>
                          {property.bedrooms} ch.
                        </Text>
                      </View>
                    )}
                    {property.bathrooms && (
                      <View style={styles.propertyDetailItem}>
                        <Text style={styles.propertyDetailText}>
                          {property.bathrooms} sdb.
                        </Text>
                      </View>
                    )}
                    <View style={styles.propertyDetailItem}>
                      <Text style={styles.propertyDetailText}>
                        {property.surfaceArea}m²
                      </Text>
                    </View>
                  </View>

                  <View style={styles.propertyPriceRow}>
                    <Text style={styles.propertyPrice}>
                      {formatPrice(property.price)}
                    </Text>
                    <Text style={styles.propertyPriceType}>
                      {property.transactionType === 'VENTE' ? 'Vente' : '/mois'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  toolbarButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  toolbarButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  propertiesList: {
    padding: 20,
    gap: 16,
  },
  propertiesGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  propertyCardGrid: {
    width: '48%',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  propertyImageContainer: {
    position: 'relative',
    width: 120,
    height: 140,
  },
  propertyImageContainerGrid: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  propertyTypeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  propertyTypeBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  propertyInfo: {
    flex: 1,
    padding: 12,
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  propertyLocationText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  propertyDetails: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  propertyDetailItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 6,
  },
  propertyDetailText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  propertyPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  propertyPriceType: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
