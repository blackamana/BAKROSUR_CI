/**
 * Types pour la recherche de propriétés
 * Inspiré de Bien'ici pour BakroSur
 */

export type TransactionType = 'BUY' | 'RENT' | 'NEW' | 'LAND';
export type PropertyType = 'APPARTEMENT' | 'MAISON' | 'TERRAIN' | 'COMMERCE' | 'BUREAU';
export type LegalStatus = 'TITLE_VERIFIED' | 'PENDING' | 'NOT_VERIFIED';
export type DocumentType = 'TITLE_DEED' | 'SURVEY' | 'BUILDING_PERMIT' | 'OCCUPATION_PERMIT';
export type TravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';

export interface SearchFilters {
  // Transaction
  transactionType: TransactionType | null;

  // Type et localisation
  propertyType: PropertyType | null;
  cityId: string | null;
  neighborhoodId: string | null;

  // Prix et surface
  minPrice: number | null;
  maxPrice: number | null;
  minSurface: number | null;
  maxSurface: number | null;

  // Caractéristiques
  bedrooms: number | null;
  bathrooms: number | null;

  // Documents et légal (spécifique BakroSur)
  titleVerified: boolean;
  bakroScoreMin: number | null;
  legalStatuses: LegalStatus[];
  availableDocuments: DocumentType[];

  // Équipements
  amenities: {
    parking: boolean;
    garden: boolean;
    pool: boolean;
    elevator: boolean;
    balcony: boolean;
    terrace: boolean;
    basement: boolean;
    security: boolean;
  };

  // Proximité
  nearSchool: boolean;
  nearTransport: boolean;
  nearShops: boolean;
  nearHealthcare: boolean;
  maxDistanceFromPOI: number | null;

  // Recherche avancée
  drawnZone: Array<{ latitude: number; longitude: number }> | null;
  travelTime: {
    address: string;
    coordinates: { latitude: number; longitude: number };
    duration: number; // minutes
    mode: TravelMode;
  } | null;
  nearMeRadius: number | null; // en mètres
}

export interface SearchSuggestion {
  id: string;
  type: 'city' | 'neighborhood' | 'property';
  label: string;
  metadata?: {
    city?: string;
    count?: number;
    coordinates?: { latitude: number; longitude: number };
  };
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  notificationsEnabled: boolean;
}

export const DEFAULT_FILTERS: SearchFilters = {
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
  legalStatuses: [],
  availableDocuments: [],
  amenities: {
    parking: false,
    garden: false,
    pool: false,
    elevator: false,
    balcony: false,
    terrace: false,
    basement: false,
    security: false,
  },
  nearSchool: false,
  nearTransport: false,
  nearShops: false,
  nearHealthcare: false,
  maxDistanceFromPOI: null,
  drawnZone: null,
  travelTime: null,
  nearMeRadius: null,
};
