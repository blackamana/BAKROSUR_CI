# Guide d'intégration Supabase avec Claude Code

> **Date**: 2025-11-08
> **Projet**: BakroSur CI
> **Stack**: React Native + Expo + Supabase

## Table des matières

1. [Configuration actuelle](#configuration-actuelle)
2. [Vérification de la connexion](#vérification-de-la-connexion)
3. [Services Supabase pour la recherche](#services-supabase-pour-la-recherche)
4. [Intégration avec les composants](#intégration-avec-les-composants)
5. [Hooks personnalisés](#hooks-personnalisés)
6. [Exemples pratiques](#exemples-pratiques)

---

## Configuration actuelle

### ✅ Ce qui est déjà configuré

Votre projet dispose déjà de :

1. **Client Supabase** : `lib/supabase.ts`
   ```typescript
   import { supabase } from '@/lib/supabase';

   // Le client est prêt à être utilisé
   ```

2. **Variables d'environnement** : `.env`
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://ogczokdoufahfrhvkyig.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Dépendances installées** :
   - `@supabase/supabase-js` ✅
   - `@react-native-async-storage/async-storage` ✅

### 🔍 Vérifier votre configuration

```bash
# Vérifier que les variables sont bien chargées
cat .env | grep SUPABASE

# Tester la connexion (créer ce script si nécessaire)
node test-supabase.js
```

---

## Vérification de la connexion

### Test rapide de connexion

Créez un fichier de test pour vérifier que Supabase fonctionne :

**Fichier** : `test-supabase-connection.ts`

```typescript
import { supabase } from './lib/supabase';

export async function testSupabaseConnection() {
  if (!supabase) {
    console.error('❌ Client Supabase non initialisé');
    console.log('Vérifiez vos variables d\'environnement :');
    console.log('- EXPO_PUBLIC_SUPABASE_URL');
    console.log('- EXPO_PUBLIC_SUPABASE_ANON_KEY');
    return false;
  }

  try {
    // Test 1: Vérifier la connexion
    const { data, error } = await supabase.from('properties').select('count');

    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      return false;
    }

    console.log('✅ Connexion Supabase réussie !');
    console.log(`📊 Nombre de propriétés: ${data?.length || 0}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
}

// Utilisation
testSupabaseConnection();
```

---

## Services Supabase pour la recherche

Créons des services pour intégrer Supabase avec vos nouveaux composants de recherche.

### 1. Service de recherche de propriétés

**Fichier** : `lib/services/property-search.service.ts`

```typescript
import { supabase } from '@/lib/supabase';
import { SearchFilters, PropertyType, TransactionType } from '@/lib/types/search.types';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  transaction_type: TransactionType;
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  city_id: string;
  city_name: string;
  neighborhood_id: string;
  neighborhood_name: string;
  latitude: number;
  longitude: number;
  images: string[];

  // Spécifique BakroSur
  title_verified: boolean;
  bakro_score: number;
  available_documents: string[];
  legal_status: string;

  // Équipements
  has_parking: boolean;
  has_garden: boolean;
  has_pool: boolean;
  has_elevator: boolean;
  has_balcony: boolean;
  has_terrace: boolean;
  has_basement: boolean;
  has_security: boolean;

  created_at: string;
  updated_at: string;
}

class PropertySearchService {
  /**
   * Recherche de propriétés avec filtres
   */
  async searchProperties(
    filters: SearchFilters,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ data: Property[]; count: number; error?: string }> {
    if (!supabase) {
      return { data: [], count: 0, error: 'Supabase non configuré' };
    }

    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' });

      // Filtre type de transaction
      if (filters.transactionType) {
        query = query.eq('transaction_type', filters.transactionType);
      }

      // Filtre type de propriété
      if (filters.propertyType) {
        query = query.eq('type', filters.propertyType);
      }

      // Filtre ville
      if (filters.cityId) {
        query = query.eq('city_id', filters.cityId);
      }

      // Filtre quartier
      if (filters.neighborhoodId) {
        query = query.eq('neighborhood_id', filters.neighborhoodId);
      }

      // Filtre prix
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      // Filtre surface
      if (filters.minSurface) {
        query = query.gte('surface', filters.minSurface);
      }
      if (filters.maxSurface) {
        query = query.lte('surface', filters.maxSurface);
      }

      // Filtre chambres
      if (filters.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }

      // Filtre salles de bain
      if (filters.bathrooms) {
        query = query.gte('bathrooms', filters.bathrooms);
      }

      // Filtre titre vérifié
      if (filters.titleVerified) {
        query = query.eq('title_verified', true);
      }

      // Filtre BakroScore minimum
      if (filters.bakroScoreMin) {
        query = query.gte('bakro_score', filters.bakroScoreMin);
      }

      // Filtres équipements
      if (filters.amenities.parking) {
        query = query.eq('has_parking', true);
      }
      if (filters.amenities.garden) {
        query = query.eq('has_garden', true);
      }
      if (filters.amenities.pool) {
        query = query.eq('has_pool', true);
      }
      if (filters.amenities.elevator) {
        query = query.eq('has_elevator', true);
      }
      if (filters.amenities.balcony) {
        query = query.eq('has_balcony', true);
      }
      if (filters.amenities.terrace) {
        query = query.eq('has_terrace', true);
      }
      if (filters.amenities.basement) {
        query = query.eq('has_basement', true);
      }
      if (filters.amenities.security) {
        query = query.eq('has_security', true);
      }

      // Pagination
      query = query.range(offset, offset + limit - 1);

      // Tri par date de création (plus récent en premier)
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Erreur recherche propriétés:', error);
        return { data: [], count: 0, error: error.message };
      }

      return {
        data: data as Property[],
        count: count || 0,
      };
    } catch (error) {
      console.error('Erreur recherche propriétés:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Recherche par zone géographique (bounds)
   */
  async searchPropertiesInBounds(
    bounds: {
      northEast: { latitude: number; longitude: number };
      southWest: { latitude: number; longitude: number };
    },
    filters?: Partial<SearchFilters>
  ): Promise<Property[]> {
    if (!supabase) return [];

    try {
      let query = supabase
        .from('properties')
        .select('*')
        .gte('latitude', bounds.southWest.latitude)
        .lte('latitude', bounds.northEast.latitude)
        .gte('longitude', bounds.southWest.longitude)
        .lte('longitude', bounds.northEast.longitude);

      // Appliquer les filtres additionnels si fournis
      if (filters?.transactionType) {
        query = query.eq('transaction_type', filters.transactionType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur recherche par bounds:', error);
        return [];
      }

      return data as Property[];
    } catch (error) {
      console.error('Erreur recherche par bounds:', error);
      return [];
    }
  }

  /**
   * Recherche "Autour de moi"
   */
  async searchPropertiesNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
    filters?: Partial<SearchFilters>
  ): Promise<Property[]> {
    if (!supabase) return [];

    // Approximation: 1 degré ≈ 111 km
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

    const bounds = {
      northEast: {
        latitude: latitude + latDelta,
        longitude: longitude + lngDelta,
      },
      southWest: {
        latitude: latitude - latDelta,
        longitude: longitude - lngDelta,
      },
    };

    return this.searchPropertiesInBounds(bounds, filters);
  }
}

export const propertySearchService = new PropertySearchService();
```

---

### 2. Service de suggestions

**Fichier** : `lib/services/search-suggestions.service.ts`

```typescript
import { supabase } from '@/lib/supabase';
import { SearchSuggestion } from '@/lib/types/search.types';

class SearchSuggestionsService {
  /**
   * Récupère les suggestions de recherche
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!supabase || query.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];

    try {
      // Recherche dans les villes
      const { data: cities } = await supabase
        .from('cities')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (cities) {
        cities.forEach((city) => {
          suggestions.push({
            id: city.id,
            type: 'city',
            label: city.name,
            metadata: {
              count: 0, // À calculer
            },
          });
        });
      }

      // Recherche dans les quartiers
      const { data: neighborhoods } = await supabase
        .from('neighborhoods')
        .select('id, name, city:cities(name)')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (neighborhoods) {
        neighborhoods.forEach((neighborhood: any) => {
          suggestions.push({
            id: neighborhood.id,
            type: 'neighborhood',
            label: neighborhood.name,
            metadata: {
              city: neighborhood.city?.name,
              count: 0, // À calculer
            },
          });
        });
      }

      // Recherche dans les propriétés (titres)
      const { data: properties } = await supabase
        .from('properties')
        .select('id, title, city_name')
        .ilike('title', `%${query}%`)
        .limit(3);

      if (properties) {
        properties.forEach((property) => {
          suggestions.push({
            id: property.id,
            type: 'property',
            label: property.title,
            metadata: {
              city: property.city_name,
            },
          });
        });
      }

      return suggestions;
    } catch (error) {
      console.error('Erreur récupération suggestions:', error);
      return [];
    }
  }

  /**
   * Sauvegarde une recherche dans l'historique
   */
  async saveSearchToHistory(userId: string, query: string): Promise<void> {
    if (!supabase) return;

    try {
      await supabase.from('search_history').insert({
        user_id: userId,
        query,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erreur sauvegarde historique:', error);
    }
  }

  /**
   * Récupère l'historique de recherche
   */
  async getSearchHistory(userId: string, limit: number = 5): Promise<string[]> {
    if (!supabase) return [];

    try {
      const { data } = await supabase
        .from('search_history')
        .select('query')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return data?.map((item) => item.query) || [];
    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return [];
    }
  }
}

export const searchSuggestionsService = new SearchSuggestionsService();
```

---

## Hooks personnalisés

Créons des hooks React pour faciliter l'utilisation de Supabase dans vos composants.

### Hook de recherche de propriétés

**Fichier** : `lib/hooks/usePropertySearch.ts`

```typescript
import { useState, useCallback } from 'react';
import { propertySearchService, Property } from '@/lib/services/property-search.service';
import { SearchFilters } from '@/lib/types/search.types';

export function usePropertySearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState(0);

  const search = useCallback(async (filters: SearchFilters, limit = 50, offset = 0) => {
    setIsLoading(true);
    setError(null);

    const result = await propertySearchService.searchProperties(filters, limit, offset);

    if (result.error) {
      setError(result.error);
      setProperties([]);
      setResultCount(0);
    } else {
      setProperties(result.data);
      setResultCount(result.count);
    }

    setIsLoading(false);
    return result;
  }, []);

  const searchNearby = useCallback(
    async (latitude: number, longitude: number, radiusKm = 5, filters?: Partial<SearchFilters>) => {
      setIsLoading(true);
      setError(null);

      const data = await propertySearchService.searchPropertiesNearby(
        latitude,
        longitude,
        radiusKm,
        filters
      );

      setProperties(data);
      setResultCount(data.length);
      setIsLoading(false);

      return data;
    },
    []
  );

  return {
    properties,
    isLoading,
    error,
    resultCount,
    search,
    searchNearby,
  };
}
```

---

### Hook de suggestions

**Fichier** : `lib/hooks/useSearchSuggestions.ts`

```typescript
import { useState, useCallback } from 'react';
import { searchSuggestionsService } from '@/lib/services/search-suggestions.service';
import { SearchSuggestion } from '@/lib/types/search.types';

export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return [];
    }

    setIsLoading(true);
    const data = await searchSuggestionsService.getSuggestions(query);
    setSuggestions(data);
    setIsLoading(false);

    return data;
  }, []);

  return {
    suggestions,
    isLoading,
    fetchSuggestions,
  };
}
```

---

## Intégration avec les composants

Maintenant, intégrons Supabase avec vos composants de recherche.

### Exemple : Écran de recherche complet avec Supabase

**Fichier** : `app/(tabs)/search-with-supabase.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import {
  PropertySearchBar,
  TransactionTypeTabs,
  MainFilters,
  ActiveFiltersBar,
} from '@/components/search';
import { FAB } from '@/components/ui/buttons';
import { Map } from 'lucide-react-native';
import { SearchFilters, DEFAULT_FILTERS } from '@/lib/types/search.types';
import { usePropertySearch } from '@/lib/hooks/usePropertySearch';
import { useSearchSuggestions } from '@/lib/hooks/useSearchSuggestions';
import { router } from 'expo-router';

export default function SearchWithSupabaseScreen() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');

  // Hooks Supabase
  const { properties, isLoading, error, resultCount, search } = usePropertySearch();
  const { fetchSuggestions } = useSearchSuggestions();

  // Recherche automatique quand les filtres changent
  useEffect(() => {
    search(filters);
  }, [filters, search]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Lancer la recherche avec le query
    search(filters);
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
      {/* Barre de recherche avec suggestions Supabase */}
      <View style={styles.searchSection}>
        <PropertySearchBar
          placeholder="J'envisage d'acheter en..."
          onSearch={handleSearch}
          fetchSuggestions={fetchSuggestions}
          showHistory
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

        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EA580C" />
          </View>
        )}

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erreur: {error}</Text>
          </View>
        )}
      </ScrollView>

      {/* FAB pour voir sur la carte */}
      <FAB
        icon={<Map size={24} color="#FFFFFF" />}
        label="Voir sur carte"
        variant="extended"
        position="bottom-right"
        onPress={() => router.push('/(tabs)/map')}
      />
    </SafeAreaView>
  );
}

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
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});
```

---

## Exemples pratiques

### 1. Recherche simple

```typescript
import { usePropertySearch } from '@/lib/hooks/usePropertySearch';
import { DEFAULT_FILTERS } from '@/lib/types/search.types';

function MyComponent() {
  const { properties, search, isLoading } = usePropertySearch();

  const handleSearch = async () => {
    await search({
      ...DEFAULT_FILTERS,
      transactionType: 'BUY',
      cityId: 'abidjan',
      minPrice: 10000000,
      maxPrice: 100000000,
    });
  };

  return (
    <Button onPress={handleSearch}>
      {isLoading ? 'Recherche...' : 'Rechercher'}
    </Button>
  );
}
```

### 2. Recherche "Autour de moi"

```typescript
import { usePropertySearch } from '@/lib/hooks/usePropertySearch';
import { geolocationService } from '@/lib/services/geolocation.service';

function SearchNearMe() {
  const { searchNearby, properties } = usePropertySearch();

  const handleSearchNearMe = async () => {
    const location = await geolocationService.getCurrentPosition();
    if (location) {
      await searchNearby(
        location.latitude,
        location.longitude,
        5, // 5 km de rayon
        { transactionType: 'BUY' }
      );
    }
  };

  return (
    <FAB
      icon={<MapPin />}
      label="Autour de moi"
      onPress={handleSearchNearMe}
    />
  );
}
```

### 3. Suggestions de recherche

```typescript
import { PropertySearchBar } from '@/components/search';
import { useSearchSuggestions } from '@/lib/hooks/useSearchSuggestions';

function SearchWithSuggestions() {
  const { fetchSuggestions } = useSearchSuggestions();

  return (
    <PropertySearchBar
      placeholder="Rechercher un bien..."
      onSearch={(q) => console.log('Search:', q)}
      fetchSuggestions={fetchSuggestions}
    />
  );
}
```

---

## Schéma de base de données recommandé

Voici le schéma Supabase recommandé pour vos propriétés :

```sql
-- Table properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('APPARTEMENT', 'MAISON', 'TERRAIN', 'COMMERCE', 'BUREAU')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'RENT', 'NEW', 'LAND')),

  -- Prix et dimensions
  price BIGINT NOT NULL,
  surface NUMERIC(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,

  -- Localisation
  city_id UUID REFERENCES cities(id),
  city_name TEXT,
  neighborhood_id UUID REFERENCES neighborhoods(id),
  neighborhood_name TEXT,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),

  -- Médias
  images TEXT[],

  -- Spécifique BakroSur
  title_verified BOOLEAN DEFAULT FALSE,
  bakro_score INTEGER CHECK (bakro_score >= 0 AND bakro_score <= 100),
  available_documents TEXT[],
  legal_status TEXT,

  -- Équipements
  has_parking BOOLEAN DEFAULT FALSE,
  has_garden BOOLEAN DEFAULT FALSE,
  has_pool BOOLEAN DEFAULT FALSE,
  has_elevator BOOLEAN DEFAULT FALSE,
  has_balcony BOOLEAN DEFAULT FALSE,
  has_terrace BOOLEAN DEFAULT FALSE,
  has_basement BOOLEAN DEFAULT FALSE,
  has_security BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX idx_properties_city_id ON properties(city_id);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_location ON properties USING GIST (
  ll_to_earth(latitude, longitude)
);

-- Table cities
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table neighborhoods
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city_id UUID REFERENCES cities(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table search_history
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  query TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Checklist de connexion

- [ ] Variables d'environnement configurées
- [ ] Client Supabase initialisé
- [ ] Test de connexion réussi
- [ ] Services créés (property-search, suggestions)
- [ ] Hooks créés (usePropertySearch, useSearchSuggestions)
- [ ] Schéma de base de données créé
- [ ] Index ajoutés pour les performances
- [ ] Intégration avec les composants de recherche

---

## Support et ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase avec React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- `lib/supabase.ts` - Client Supabase
- `BIENICI-UI-SPECIFICATIONS.md` - Spécifications UI
- `components/search/README.md` - Documentation composants

---

**Dernière mise à jour** : 2025-11-08
