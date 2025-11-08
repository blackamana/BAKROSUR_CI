/**
 * SearchExample - Exemple complet d'utilisation des composants de recherche
 * Ce fichier montre comment intégrer tous les composants ensemble
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { PropertySearchBar } from './PropertySearchBar';
import { TransactionTypeTabs } from './TransactionTypeTabs';
import { MainFilters } from './MainFilters';
import { ActiveFiltersBar } from './ActiveFiltersBar';
import { SearchFilters, DEFAULT_FILTERS, SearchSuggestion } from '@/lib/types/search.types';

/**
 * Exemple d'écran de recherche complet
 */
export const SearchExample: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultCount] = useState(42); // Mock - à remplacer par le vrai comptage

  // Simulation de récupération de suggestions
  const fetchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
    // À remplacer par un vrai appel API
    return [
      {
        id: '1',
        type: 'city',
        label: 'Abidjan',
        metadata: { count: 120 },
      },
      {
        id: '2',
        type: 'neighborhood',
        label: 'Cocody',
        metadata: { city: 'Abidjan', count: 45 },
      },
      {
        id: '3',
        type: 'neighborhood',
        label: 'Plateau',
        metadata: { city: 'Abidjan', count: 30 },
      },
    ];
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Recherche:', query);
    // Ici, lancer la recherche avec les filtres actuels
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    console.log('Suggestion sélectionnée:', suggestion);
    // Mettre à jour les filtres en fonction de la suggestion
    if (suggestion.type === 'city') {
      updateFilters({ cityId: suggestion.id });
    } else if (suggestion.type === 'neighborhood') {
      updateFilters({ neighborhoodId: suggestion.id });
    }
  };

  const updateFilters = (partialFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...partialFilters,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchSection}>
        <PropertySearchBar
          placeholder="J'envisage d'acheter en..."
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          fetchSuggestions={fetchSuggestions}
          showHistory
          recentSearches={['Abidjan', 'Cocody', 'Plateau']}
        />
      </View>

      {/* Onglets de type de transaction */}
      <View style={styles.tabsSection}>
        <TransactionTypeTabs
          selectedType={filters.transactionType}
          onSelect={(type) => updateFilters({ transactionType: type })}
        />
      </View>

      {/* Résumé des filtres actifs */}
      <ActiveFiltersBar
        filters={filters}
        resultCount={resultCount}
        onReset={resetFilters}
        cityName="Abidjan"
        neighborhoodName="Cocody"
      />

      {/* Filtres principaux */}
      <ScrollView
        style={styles.filtersSection}
        contentContainerStyle={styles.filtersContent}
        showsVerticalScrollIndicator={false}
      >
        <MainFilters
          filters={filters}
          onChange={updateFilters}
          resultCount={resultCount}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tabsSection: {
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  filtersSection: {
    flex: 1,
  },
  filtersContent: {
    padding: 16,
  },
});
