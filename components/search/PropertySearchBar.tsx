/**
 * PropertySearchBar - Barre de recherche avec suggestions automatiques
 * Inspiré de Bien'ici : suggestions dès 2 caractères, autocomplete villes/quartiers
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Keyboard,
} from 'react-native';
import { Search, MapPin, Home, X } from 'lucide-react-native';
import { SearchSuggestion } from '@/lib/types/search.types';

export interface PropertySearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  fetchSuggestions?: (query: string) => Promise<SearchSuggestion[]>;
  showHistory?: boolean;
  recentSearches?: string[];
}

export const PropertySearchBar: React.FC<PropertySearchBarProps> = ({
  placeholder = "J'envisage d'acheter en...",
  onSearch,
  onSuggestionSelect,
  fetchSuggestions,
  showHistory = true,
  recentSearches = [],
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (query.length >= 2 && fetchSuggestions) {
        const results = await fetchSuggestions(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else if (query.length === 0 && isFocused && showHistory) {
        // Afficher l'historique quand le champ est vide et focus
        const historySuggestions: SearchSuggestion[] = recentSearches.map(
          (search, index) => ({
            id: `history-${index}`,
            type: 'city',
            label: search,
          })
        );
        setSuggestions(historySuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, isFocused, fetchSuggestions, recentSearches, showHistory]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      Keyboard.dismiss();
      setShowSuggestions(false);
    }
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.label);
    setShowSuggestions(false);
    Keyboard.dismiss();
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      onSearch(suggestion.label);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'city':
      case 'neighborhood':
        return <MapPin size={20} color="#6B7280" />;
      case 'property':
        return <Home size={20} color="#6B7280" />;
      default:
        return <Search size={20} color="#6B7280" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          returnKeyType="search"
        />

        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <X size={20} color="#6B7280" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <View style={styles.suggestionIcon}>
                  {getSuggestionIcon(item.type)}
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionLabel}>{item.label}</Text>
                  {item.metadata?.city && (
                    <Text style={styles.suggestionMeta}>
                      {item.metadata.city}
                    </Text>
                  )}
                  {item.metadata?.count !== undefined && (
                    <Text style={styles.suggestionCount}>
                      {item.metadata.count} propriétés
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchBarFocused: {
    borderColor: '#EA580C',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  suggestionMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  suggestionCount: {
    fontSize: 12,
    color: '#EA580C',
    marginTop: 2,
  },
});
