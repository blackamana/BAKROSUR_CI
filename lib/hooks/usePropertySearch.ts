/**
 * Hook React pour la recherche de propriétés avec Supabase
 */

import { useState, useCallback } from 'react';
import { propertySearchService, Property } from '@/lib/services/property-search.service';
import { SearchFilters } from '@/lib/types/search.types';

export function usePropertySearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState(0);

  /**
   * Recherche de propriétés avec filtres
   */
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

  /**
   * Recherche par zone géographique
   */
  const searchInBounds = useCallback(
    async (
      bounds: {
        northEast: { latitude: number; longitude: number };
        southWest: { latitude: number; longitude: number };
      },
      filters?: Partial<SearchFilters>
    ) => {
      setIsLoading(true);
      setError(null);

      const data = await propertySearchService.searchPropertiesInBounds(bounds, filters);

      setProperties(data);
      setResultCount(data.length);
      setIsLoading(false);

      return data;
    },
    []
  );

  /**
   * Recherche "Autour de moi"
   */
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

  /**
   * Récupère une propriété par ID
   */
  const getById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    const property = await propertySearchService.getPropertyById(id);

    if (!property) {
      setError('Propriété non trouvée');
    }

    setIsLoading(false);
    return property;
  }, []);

  return {
    properties,
    isLoading,
    error,
    resultCount,
    search,
    searchInBounds,
    searchNearby,
    getById,
  };
}
