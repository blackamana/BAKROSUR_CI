import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { Filter, MapPin, X, Grid3x3, List, SortAsc, Heart, Save } from 'lucide-react-native';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import CityAutocomplete from '@/components/CityAutocomplete';
import NeighborhoodAutocomplete from '@/components/NeighborhoodAutocomplete';
import { PROPERTIES, PropertyType, TransactionType, LegalStatus, DocumentType } from '@/constants/properties';

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M FCFA`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K FCFA`;
  }
  return `${price} FCFA`;
}

interface Filters {
  type: PropertyType | null;
  transactionType: TransactionType | null;
  cityId: string | null;
  neighborhoodId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minSurface: number | null;
  maxSurface: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  legalStatuses: LegalStatus[];
  availableDocuments: DocumentType[];
  featured: boolean | null;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'surface-asc' | 'surface-desc';

interface SavedSearch {
  id: string;
  name: string;
  filters: Filters;
  createdAt: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [savedSearchName, setSavedSearchName] = useState('');
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: null,
    transactionType: null,
    cityId: null,
    neighborhoodId: null,
    minPrice: null,
    maxPrice: null,
    minSurface: null,
    maxSurface: null,
    bedrooms: null,
    bathrooms: null,
    legalStatuses: [],
    availableDocuments: [],
    featured: null,
  });

  const filteredAndSortedProperties = PROPERTIES.filter((property) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.cityName.toLowerCase().includes(query) ||
        property.neighborhoodName.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (filters.type && property.type !== filters.type) return false;
    if (filters.transactionType && property.transactionType !== filters.transactionType)
      return false;
    if (filters.cityId && property.cityId !== filters.cityId) return false;
    if (filters.neighborhoodId && property.neighborhoodId !== filters.neighborhoodId)
      return false;
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    if (filters.minSurface && property.surfaceArea < filters.minSurface) return false;
    if (filters.maxSurface && property.surfaceArea > filters.maxSurface) return false;
    if (filters.bedrooms && property.bedrooms && property.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms && property.bathrooms && property.bathrooms < filters.bathrooms) return false;
    if (filters.featured !== null && property.featured !== filters.featured) return false;
    if (filters.legalStatuses.length > 0 && property.legalStatus && !filters.legalStatuses.includes(property.legalStatus)) return false;
    if (filters.availableDocuments.length > 0) {
      const hasAllDocs = filters.availableDocuments.every(
        (doc) => property.availableDocuments?.includes(doc)
      );
      if (!hasAllDocs) return false;
    }

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

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'legalStatuses' || key === 'availableDocuments') {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== null;
  }).length;

  const resetFilters = () => {
    setFilters({
      type: null,
      transactionType: null,
      cityId: null,
      neighborhoodId: null,
      minPrice: null,
      maxPrice: null,
      minSurface: null,
      maxSurface: null,
      bedrooms: null,
      bathrooms: null,
      legalStatuses: [],
      availableDocuments: [],
      featured: null,
    });
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const saveCurrentSearch = () => {
    if (!savedSearchName.trim()) return;
    
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: savedSearchName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };
    
    setSavedSearches((prev) => [...prev, newSearch]);
    setSavedSearchName('');
    setShowSaveSearch(false);
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    setShowFilters(false);
  };

  const deleteSavedSearch = (searchId: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
  };

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case 'price-asc': return 'Prix croissant';
      case 'price-desc': return 'Prix décroissant';
      case 'surface-asc': return 'Surface croissante';
      case 'surface-desc': return 'Surface décroissante';
      case 'recent': default: return 'Plus récents';
    }
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
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher par ville, quartier..."
              placeholderTextColor={Colors.light.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <X size={18} color={Colors.light.textSecondary} />
              </Pressable>
            )}
          </View>

          <Pressable
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color={Colors.light.primary} />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.toolbarContainer}>
          <Text style={styles.resultsCount}>
            {`${filteredAndSortedProperties.length} bien${filteredAndSortedProperties.length !== 1 ? 's' : ''}`}
          </Text>
          
          <View style={styles.toolbarButtons}>
            <Pressable
              style={styles.toolbarButton}
              onPress={() => setShowSortOptions(true)}
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
            
            <Pressable
              style={styles.toolbarButton}
              onPress={() => setShowSaveSearch(true)}
            >
              <Save size={18} color={Colors.light.primary} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={viewMode === 'grid' ? styles.propertiesGrid : styles.propertiesList}>
            {filteredAndSortedProperties.map((property) => {
              const isFavorite = favorites.includes(property.id);
              
              return (
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
                  <Pressable
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property.id);
                    }}
                  >
                    <Heart
                      size={20}
                      color={isFavorite ? Colors.light.primary : Colors.light.background}
                      fill={isFavorite ? Colors.light.primary : 'transparent'}
                    />
                  </Pressable>
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
              );
            })}
          </View>
        </ScrollView>

        <Modal
          visible={showFilters}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowFilters(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <X size={24} color={Colors.light.text} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Type de transaction</Text>
                <View style={styles.filterChips}>
                  <Pressable
                    style={[
                      styles.filterChip,
                      filters.transactionType === 'VENTE' && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        transactionType: prev.transactionType === 'VENTE' ? null : 'VENTE',
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.transactionType === 'VENTE' &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      Vente
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.filterChip,
                      filters.transactionType === 'LOCATION' &&
                        styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        transactionType:
                          prev.transactionType === 'LOCATION' ? null : 'LOCATION',
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.transactionType === 'LOCATION' &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      Location
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Type de bien</Text>
                <View style={styles.filterChips}>
                  {(['MAISON', 'APPARTEMENT', 'TERRAIN', 'COMMERCE', 'BUREAU'] as PropertyType[]).map(
                    (type) => (
                      <Pressable
                        key={type}
                        style={[
                          styles.filterChip,
                          filters.type === type && styles.filterChipActive,
                        ]}
                        onPress={() =>
                          setFilters((prev) => ({
                            ...prev,
                            type: prev.type === type ? null : type,
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            filters.type === type && styles.filterChipTextActive,
                          ]}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    )
                  )}
                </View>
              </View>

              <View style={styles.filterSection}>
                <CityAutocomplete
                  label="Ville"
                  value={filters.cityId}
                  onChange={(cityId) =>
                    setFilters((prev) => ({
                      ...prev,
                      cityId,
                      neighborhoodId: null,
                    }))
                  }
                  placeholder="Toutes les villes"
                />
              </View>

              <View style={styles.filterSection}>
                <NeighborhoodAutocomplete
                  label="Quartier"
                  value={filters.neighborhoodId}
                  onChange={(neighborhoodId) =>
                    setFilters((prev) => ({
                      ...prev,
                      neighborhoodId,
                    }))
                  }
                  cityId={filters.cityId}
                  placeholder="Tous les quartiers"
                  disabled={!filters.cityId}
                />
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>
                  {filters.transactionType === 'LOCATION' ? 'Prix max (FCFA/mois)' : 'Prix (FCFA)'}
                </Text>
                {filters.transactionType === 'LOCATION' ? (
                  <View style={styles.filterInputWrapper}>
                    <Text style={styles.filterInputLabel}>Max</Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="∞"
                      placeholderTextColor={Colors.light.textSecondary}
                      keyboardType="numeric"
                      value={filters.maxPrice?.toString() || ''}
                      onChangeText={(text) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: text ? parseInt(text) : null,
                        }))
                      }
                    />
                  </View>
                ) : (
                  <View style={styles.filterInputRow}>
                    <View style={styles.filterInputWrapper}>
                      <Text style={styles.filterInputLabel}>Min</Text>
                      <TextInput
                        style={styles.filterInput}
                        placeholder="0"
                        placeholderTextColor={Colors.light.textSecondary}
                        keyboardType="numeric"
                        value={filters.minPrice?.toString() || ''}
                        onChangeText={(text) =>
                          setFilters((prev) => ({
                            ...prev,
                            minPrice: text ? parseInt(text) : null,
                          }))
                        }
                      />
                    </View>
                    <View style={styles.filterInputWrapper}>
                      <Text style={styles.filterInputLabel}>Max</Text>
                      <TextInput
                        style={styles.filterInput}
                        placeholder="∞"
                        placeholderTextColor={Colors.light.textSecondary}
                        keyboardType="numeric"
                        value={filters.maxPrice?.toString() || ''}
                        onChangeText={(text) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxPrice: text ? parseInt(text) : null,
                          }))
                        }
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>
                  {filters.transactionType === 'LOCATION' ? 'Surface min (m²)' : 'Surface (m²)'}
                </Text>
                {filters.transactionType === 'LOCATION' ? (
                  <View style={styles.filterInputWrapper}>
                    <Text style={styles.filterInputLabel}>Min</Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="0"
                      placeholderTextColor={Colors.light.textSecondary}
                      keyboardType="numeric"
                      value={filters.minSurface?.toString() || ''}
                      onChangeText={(text) =>
                        setFilters((prev) => ({
                          ...prev,
                          minSurface: text ? parseInt(text) : null,
                        }))
                      }
                    />
                  </View>
                ) : (
                  <View style={styles.filterInputRow}>
                    <View style={styles.filterInputWrapper}>
                      <Text style={styles.filterInputLabel}>Min</Text>
                      <TextInput
                        style={styles.filterInput}
                        placeholder="0"
                        placeholderTextColor={Colors.light.textSecondary}
                        keyboardType="numeric"
                        value={filters.minSurface?.toString() || ''}
                        onChangeText={(text) =>
                          setFilters((prev) => ({
                            ...prev,
                            minSurface: text ? parseInt(text) : null,
                          }))
                        }
                      />
                    </View>
                    <View style={styles.filterInputWrapper}>
                      <Text style={styles.filterInputLabel}>Max</Text>
                      <TextInput
                        style={styles.filterInput}
                        placeholder="∞"
                        placeholderTextColor={Colors.light.textSecondary}
                        keyboardType="numeric"
                        value={filters.maxSurface?.toString() || ''}
                        onChangeText={(text) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxSurface: text ? parseInt(text) : null,
                          }))
                        }
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Nombre de chambres</Text>
                <View style={styles.filterChips}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Pressable
                      key={num}
                      style={[
                        styles.filterChip,
                        filters.bedrooms === num && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          bedrooms: prev.bedrooms === num ? null : num,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.bedrooms === num && styles.filterChipTextActive,
                        ]}
                      >
                        {num}+
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Nombre de salles de bain</Text>
                <View style={styles.filterChips}>
                  {[1, 2, 3, 4].map((num) => (
                    <Pressable
                      key={num}
                      style={[
                        styles.filterChip,
                        filters.bathrooms === num && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          bathrooms: prev.bathrooms === num ? null : num,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.bathrooms === num && styles.filterChipTextActive,
                        ]}
                      >
                        {num}+
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Propriétés en vedette</Text>
                <View style={styles.filterChips}>
                  <Pressable
                    style={[
                      styles.filterChip,
                      filters.featured === true && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        featured: prev.featured === true ? null : true,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.featured === true && styles.filterChipTextActive,
                      ]}
                    >
                      Uniquement les vedettes
                    </Text>
                  </Pressable>
                </View>
              </View>

              {filters.transactionType !== 'LOCATION' && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Statut juridique</Text>
                  <View style={styles.filterChips}>
                    {(['TF', 'ACD', 'ADU', 'AV'] as LegalStatus[]).map((status) => (
                      <Pressable
                        key={status}
                        style={[
                          styles.filterChip,
                          filters.legalStatuses.includes(status) && styles.filterChipActive,
                        ]}
                        onPress={() =>
                          setFilters((prev) => ({
                            ...prev,
                            legalStatuses: prev.legalStatuses.includes(status)
                              ? prev.legalStatuses.filter((s) => s !== status)
                              : [...prev.legalStatuses, status],
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            filters.legalStatuses.includes(status) && styles.filterChipTextActive,
                          ]}
                        >
                          {status}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {filters.transactionType !== 'LOCATION' && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Documents disponibles</Text>
                  <View style={styles.filterChips}>
                    {(['TF', 'PHOTOS', 'PLANS', 'CADASTRE', 'NOTAIRE'] as DocumentType[]).map(
                      (doc) => (
                        <Pressable
                          key={doc}
                          style={[
                            styles.filterChip,
                            filters.availableDocuments.includes(doc) && styles.filterChipActive,
                          ]}
                          onPress={() =>
                            setFilters((prev) => ({
                              ...prev,
                              availableDocuments: prev.availableDocuments.includes(doc)
                                ? prev.availableDocuments.filter((d) => d !== doc)
                                : [...prev.availableDocuments, doc],
                            }))
                          }
                        >
                          <Text
                            style={[
                              styles.filterChipText,
                              filters.availableDocuments.includes(doc) &&
                                styles.filterChipTextActive,
                            ]}
                          >
                            {doc}
                          </Text>
                        </Pressable>
                      )
                    )}
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.resetButtonText}>Réinitialiser</Text>
              </Pressable>
              <Pressable
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Appliquer</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showSortOptions}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowSortOptions(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Trier par</Text>
              <Pressable onPress={() => setShowSortOptions(false)}>
                <X size={24} color={Colors.light.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalScroll}>
              {(['recent', 'price-asc', 'price-desc', 'surface-asc', 'surface-desc'] as SortOption[]).map(
                (option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.sortOption,
                      sortBy === option && styles.sortOptionActive,
                    ]}
                    onPress={() => {
                      setSortBy(option);
                      setShowSortOptions(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        sortBy === option && styles.sortOptionTextActive,
                      ]}
                    >
                      {getSortLabel(option)}
                    </Text>
                  </Pressable>
                )
              )}
            </ScrollView>
          </View>
        </Modal>

        <Modal
          visible={showSaveSearch}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowSaveSearch(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sauvegarder la recherche</Text>
              <Pressable onPress={() => setShowSaveSearch(false)}>
                <X size={24} color={Colors.light.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Nom de la recherche</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Ex: Villas Cocody"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={savedSearchName}
                  onChangeText={setSavedSearchName}
                />
              </View>

              {savedSearches.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Recherches sauvegardées</Text>
                  {savedSearches.map((search) => (
                    <View key={search.id} style={styles.savedSearchItem}>
                      <Pressable
                        style={styles.savedSearchInfo}
                        onPress={() => loadSavedSearch(search)}
                      >
                        <Text style={styles.savedSearchName}>{search.name}</Text>
                        <Text style={styles.savedSearchDate}>
                          {new Date(search.createdAt).toLocaleDateString('fr-FR')}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => deleteSavedSearch(search.id)}
                        style={styles.deleteSavedSearch}
                      >
                        <X size={16} color={Colors.light.textSecondary} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={styles.resetButton}
                onPress={() => {
                  setSavedSearchName('');
                  setShowSaveSearch(false);
                }}
              >
                <Text style={styles.resetButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.applyButton,
                  !savedSearchName.trim() && styles.applyButtonDisabled,
                ]}
                onPress={saveCurrentSearch}
                disabled={!savedSearchName.trim()}
              >
                <Text style={styles.applyButtonText}>Sauvegarder</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    position: 'relative',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.light.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.light.background,
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
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
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  modalScroll: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChipsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  filterChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  filterChipTextActive: {
    color: Colors.light.background,
  },
  filterInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterInputWrapper: {
    flex: 1,
  },
  filterInputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.light.text,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  sortOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sortOptionActive: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  sortOptionText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  sortOptionTextActive: {
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  savedSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 8,
  },
  savedSearchInfo: {
    flex: 1,
  },
  savedSearchName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  savedSearchDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  deleteSavedSearch: {
    padding: 8,
  },
});
