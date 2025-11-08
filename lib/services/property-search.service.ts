/**
 * Service de recherche de propriétés avec Supabase
 * Intégration avec les composants de recherche inspirés de Bien'ici
 */

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

  /**
   * Récupère une propriété par ID
   */
  async getPropertyById(id: string): Promise<Property | null> {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur récupération propriété:', error);
        return null;
      }

      return data as Property;
    } catch (error) {
      console.error('Erreur récupération propriété:', error);
      return null;
    }
  }
}

export const propertySearchService = new PropertySearchService();
