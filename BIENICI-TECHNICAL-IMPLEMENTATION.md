# Guide d'implémentation technique - Fonctionnalités Bien'ici pour BakroSur

> **Date**: 2025-11-08
> **Version**: 1.0
> **Stack**: React Native + Expo + TypeScript

## Table des matières

1. [Prérequis et dépendances](#prérequis-et-dépendances)
2. [Architecture des composants](#architecture-des-composants)
3. [Services et utilitaires](#services-et-utilitaires)
4. [Plan d'implémentation détaillé](#plan-dimplémentation-détaillé)

---

## Prérequis et dépendances

### Dépendances déjà installées ✅

```json
{
  "react-native-maps": "1.20.1",
  "react-native-maps-directions": "^1.9.0",
  "expo-location": "~19.0.7",
  "expo-maps": "~0.12.8",
  "lucide-react-native": "^0.475.0",
  "@react-native-community/slider": "5.0.1",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-svg": "15.12.1"
}
```

### Nouvelles dépendances à installer ⚡

```bash
# Bottom Sheet pour les modals mobiles
npm install @gorhom/bottom-sheet@^5

# Reanimated (si pas la dernière version)
npm install react-native-reanimated@^3

# Pour les animations fluides
npm install react-native-animatable@^1.4.0

# Pour le dessin sur carte
npm install react-native-draw@^0.5.0
```

---

## Architecture des composants

### Structure des dossiers

```
components/
├── search/                    # Composants de recherche
│   ├── PropertySearchBar.tsx
│   ├── TransactionTypeTabs.tsx
│   ├── MainFilters.tsx
│   ├── AdvancedFilters.tsx
│   ├── ActiveFiltersBar.tsx
│   ├── SavedSearches.tsx
│   └── index.ts
│
├── maps/                      # Composants de carte
│   ├── enhanced/
│   │   ├── EnhancedPropertyMap.tsx
│   │   ├── MapDrawingTool.tsx
│   │   ├── TravelTimeFilter.tsx
│   │   ├── PointOfInterestLayer.tsx
│   │   └── MapControls.tsx
│   ├── markers/
│   │   ├── EnhancedPropertyMarker.tsx
│   │   ├── ClusterMarker.tsx          # Déjà existant
│   │   └── POIMarker.tsx
│   ├── previews/
│   │   └── PropertyPreviewCard.tsx
│   └── index.ts
│
├── properties/                # Composants de propriétés
│   ├── cards/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyCardList.tsx
│   │   ├── PropertyCardGrid.tsx
│   │   └── PropertyCardCompact.tsx
│   ├── lists/
│   │   ├── PropertyList.tsx
│   │   ├── PropertyGrid.tsx
│   │   └── SplitView.tsx
│   └── index.ts
│
├── ui/                        # Composants UI réutilisables
│   ├── inputs/
│   │   ├── RangeSlider.tsx
│   │   ├── MultiSelect.tsx
│   │   └── SearchInput.tsx
│   ├── buttons/
│   │   ├── FAB.tsx
│   │   ├── IconButton.tsx
│   │   └── ToggleButton.tsx
│   ├── feedback/
│   │   ├── Badge.tsx
│   │   ├── BakroScoreBadge.tsx       # Déjà existant
│   │   └── VerificationBadge.tsx     # Déjà existant
│   ├── overlays/
│   │   ├── BottomSheet.tsx
│   │   ├── Modal.tsx
│   │   └── Drawer.tsx
│   └── index.ts
│
└── layouts/
    ├── ResponsiveLayout.tsx
    └── SplitLayout.tsx

lib/
├── services/
│   ├── map.service.ts                 # Déjà existant
│   ├── geolocation.service.ts         # Nouveau
│   ├── isochrone.service.ts           # Nouveau
│   └── poi.service.ts                 # Nouveau
│
├── hooks/
│   ├── usePropertySearch.ts
│   ├── useMapFilters.ts
│   ├── useGeolocation.ts
│   └── useTravelTime.ts
│
├── utils/
│   ├── map-helpers.ts
│   ├── filter-helpers.ts
│   └── format-helpers.ts
│
└── types/
    ├── search.types.ts
    ├── map.types.ts
    └── property.types.ts
```

---

## Services et utilitaires

### 1. Service de géolocalisation

**Fichier**: `lib/services/geolocation.service.ts`

```typescript
import * as Location from 'expo-location';

export interface GeolocationConfig {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

class GeolocationService {
  private lastKnownLocation: UserLocation | null = null;

  /**
   * Demande les permissions de localisation
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Récupère la position actuelle de l'utilisateur
   */
  async getCurrentPosition(
    config: GeolocationConfig = {}
  ): Promise<UserLocation | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: config.enableHighAccuracy
          ? Location.Accuracy.High
          : Location.Accuracy.Balanced,
      });

      this.lastKnownLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        timestamp: location.timestamp,
      };

      return this.lastKnownLocation;
    } catch (error) {
      console.error('Error getting current position:', error);
      return this.lastKnownLocation;
    }
  }

  /**
   * Recherche "Autour de moi"
   */
  async searchNearMe(radiusInMeters: number = 5000) {
    const location = await this.getCurrentPosition({ enableHighAccuracy: true });
    if (!location) {
      return null;
    }

    return {
      center: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      radius: radiusInMeters,
    };
  }

  /**
   * Calcule la distance entre deux points (en mètres)
   */
  calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Vérifie si un point est dans un rayon donné
   */
  isWithinRadius(
    point: { latitude: number; longitude: number },
    center: { latitude: number; longitude: number },
    radiusInMeters: number
  ): boolean {
    const distance = this.calculateDistance(point, center);
    return distance <= radiusInMeters;
  }
}

export const geolocationService = new GeolocationService();
```

---

### 2. Service Isochrone (temps de trajet)

**Fichier**: `lib/services/isochrone.service.ts`

```typescript
import { GOOGLE_MAPS_API_KEY } from '@/constants/config';

export type TravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';

export interface IsochroneRequest {
  origin: {
    latitude: number;
    longitude: number;
  };
  durationMinutes: number;
  mode: TravelMode;
}

export interface IsochroneResponse {
  polygon: Array<{ latitude: number; longitude: number }>;
  center: { latitude: number; longitude: number };
  duration: number;
  mode: TravelMode;
}

class IsochroneService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Calcule une isochrone (zone accessible en X minutes)
   * Utilise l'API Google Maps Distance Matrix pour calculer
   * les distances/temps vers plusieurs points autour de l'origine
   */
  async calculateIsochrone(
    request: IsochroneRequest
  ): Promise<IsochroneResponse> {
    try {
      // Générer une grille de points autour de l'origine
      const gridPoints = this.generateGridPoints(
        request.origin,
        request.durationMinutes,
        request.mode
      );

      // Calculer le temps de trajet pour chaque point
      const pointsWithTime = await this.calculateTravelTimes(
        request.origin,
        gridPoints,
        request.mode
      );

      // Filtrer les points accessibles dans le temps donné
      const accessiblePoints = pointsWithTime.filter(
        (p) => p.duration <= request.durationMinutes * 60
      );

      // Créer un polygone englobant (convex hull)
      const polygon = this.createConvexHull(accessiblePoints);

      return {
        polygon,
        center: request.origin,
        duration: request.durationMinutes,
        mode: request.mode,
      };
    } catch (error) {
      console.error('Error calculating isochrone:', error);
      // Fallback: retourner un cercle simple
      return this.createCircularIsochrone(request);
    }
  }

  /**
   * Génère une grille de points autour de l'origine
   */
  private generateGridPoints(
    origin: { latitude: number; longitude: number },
    durationMinutes: number,
    mode: TravelMode
  ): Array<{ latitude: number; longitude: number }> {
    const points: Array<{ latitude: number; longitude: number }> = [];

    // Estimer la distance approximative en fonction du mode
    const speedKmH = this.getAverageSpeed(mode);
    const maxDistanceKm = (speedKmH * durationMinutes) / 60;

    // Générer une grille de points
    const gridSize = 8; // 8x8 = 64 points
    const deltaLat = (maxDistanceKm / 111.32) / gridSize; // 1° lat ≈ 111.32 km
    const deltaLng =
      deltaLat / Math.cos((origin.latitude * Math.PI) / 180);

    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        points.push({
          latitude: origin.latitude + i * deltaLat,
          longitude: origin.longitude + j * deltaLng,
        });
      }
    }

    return points;
  }

  /**
   * Calcule les temps de trajet vers plusieurs destinations
   */
  private async calculateTravelTimes(
    origin: { latitude: number; longitude: number },
    destinations: Array<{ latitude: number; longitude: number }>,
    mode: TravelMode
  ): Promise<Array<{ latitude: number; longitude: number; duration: number }>> {
    const results: Array<{
      latitude: number;
      longitude: number;
      duration: number;
    }> = [];

    // Diviser en batches de 25 (limite API)
    const batchSize = 25;
    for (let i = 0; i < destinations.length; i += batchSize) {
      const batch = destinations.slice(i, i + batchSize);

      const originsParam = `${origin.latitude},${origin.longitude}`;
      const destinationsParam = batch
        .map((d) => `${d.latitude},${d.longitude}`)
        .join('|');

      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originsParam}&destinations=${destinationsParam}&mode=${mode.toLowerCase()}&key=${this.apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
          data.rows[0].elements.forEach((element: any, index: number) => {
            if (element.status === 'OK') {
              results.push({
                ...batch[index],
                duration: element.duration.value, // en secondes
              });
            }
          });
        }
      } catch (error) {
        console.error('Error calculating travel times:', error);
      }
    }

    return results;
  }

  /**
   * Crée un polygone convexe (convex hull) à partir de points
   * Algorithme de Graham scan
   */
  private createConvexHull(
    points: Array<{ latitude: number; longitude: number }>
  ): Array<{ latitude: number; longitude: number }> {
    if (points.length < 3) return points;

    // Trouver le point le plus bas
    let p0 = points[0];
    for (const point of points) {
      if (
        point.latitude < p0.latitude ||
        (point.latitude === p0.latitude && point.longitude < p0.longitude)
      ) {
        p0 = point;
      }
    }

    // Trier les points par angle polaire
    const sorted = [...points].sort((a, b) => {
      const angleA = Math.atan2(
        a.latitude - p0.latitude,
        a.longitude - p0.longitude
      );
      const angleB = Math.atan2(
        b.latitude - p0.latitude,
        b.longitude - p0.longitude
      );
      return angleA - angleB;
    });

    // Graham scan
    const hull: Array<{ latitude: number; longitude: number }> = [
      sorted[0],
      sorted[1],
    ];

    for (let i = 2; i < sorted.length; i++) {
      while (
        hull.length >= 2 &&
        this.crossProduct(hull[hull.length - 2], hull[hull.length - 1], sorted[i]) <= 0
      ) {
        hull.pop();
      }
      hull.push(sorted[i]);
    }

    return hull;
  }

  /**
   * Produit vectoriel pour l'algorithme de convex hull
   */
  private crossProduct(
    p1: { latitude: number; longitude: number },
    p2: { latitude: number; longitude: number },
    p3: { latitude: number; longitude: number }
  ): number {
    return (
      (p2.longitude - p1.longitude) * (p3.latitude - p1.latitude) -
      (p2.latitude - p1.latitude) * (p3.longitude - p1.longitude)
    );
  }

  /**
   * Vitesse moyenne en km/h selon le mode de transport
   */
  private getAverageSpeed(mode: TravelMode): number {
    switch (mode) {
      case 'DRIVING':
        return 40;
      case 'WALKING':
        return 5;
      case 'BICYCLING':
        return 15;
      case 'TRANSIT':
        return 25;
      default:
        return 30;
    }
  }

  /**
   * Fallback: créer une isochrone circulaire simple
   */
  private createCircularIsochrone(
    request: IsochroneRequest
  ): IsochroneResponse {
    const speedKmH = this.getAverageSpeed(request.mode);
    const radiusKm = (speedKmH * request.durationMinutes) / 60;
    const radiusDegrees = radiusKm / 111.32;

    const points: Array<{ latitude: number; longitude: number }> = [];
    const numPoints = 32;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      points.push({
        latitude: request.origin.latitude + radiusDegrees * Math.cos(angle),
        longitude:
          request.origin.longitude +
          (radiusDegrees * Math.sin(angle)) /
            Math.cos((request.origin.latitude * Math.PI) / 180),
      });
    }

    return {
      polygon: points,
      center: request.origin,
      duration: request.durationMinutes,
      mode: request.mode,
    };
  }
}

// À configurer avec votre clé API Google Maps
export const isochroneService = new IsochroneService(
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ''
);
```

---

### 3. Service POI (Points d'intérêt)

**Fichier**: `lib/services/poi.service.ts`

```typescript
export type POIType =
  | 'SCHOOL'
  | 'TRANSPORT'
  | 'SHOP'
  | 'PARK'
  | 'HOSPITAL'
  | 'RESTAURANT'
  | 'BANK';

export interface PointOfInterest {
  id: string;
  type: POIType;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  icon: string;
  color: string;
}

class POIService {
  private readonly POI_ICONS: Record<POIType, string> = {
    SCHOOL: '🏫',
    TRANSPORT: '🚇',
    SHOP: '🛒',
    PARK: '🌳',
    HOSPITAL: '🏥',
    RESTAURANT: '🍽️',
    BANK: '🏦',
  };

  private readonly POI_COLORS: Record<POIType, string> = {
    SCHOOL: '#3B82F6',
    TRANSPORT: '#EF4444',
    SHOP: '#F59E0B',
    PARK: '#10B981',
    HOSPITAL: '#DC2626',
    RESTAURANT: '#8B5CF6',
    BANK: '#06B6D4',
  };

  /**
   * Récupère les POI autour d'une position
   */
  async getPOIsNearLocation(
    location: { latitude: number; longitude: number },
    radiusMeters: number = 1000,
    types?: POIType[]
  ): Promise<PointOfInterest[]> {
    try {
      // TODO: Intégrer avec votre API backend ou Google Places API
      // Pour l'instant, retourne des données mock
      return this.getMockPOIs(location, radiusMeters, types);
    } catch (error) {
      console.error('Error fetching POIs:', error);
      return [];
    }
  }

  /**
   * Récupère les POI dans une zone (bounds)
   */
  async getPOIsInBounds(
    bounds: {
      northEast: { latitude: number; longitude: number };
      southWest: { latitude: number; longitude: number };
    },
    types?: POIType[]
  ): Promise<PointOfInterest[]> {
    try {
      // TODO: Intégrer avec votre API
      return this.getMockPOIsInBounds(bounds, types);
    } catch (error) {
      console.error('Error fetching POIs in bounds:', error);
      return [];
    }
  }

  /**
   * Filtre les POI par type
   */
  filterPOIsByType(pois: PointOfInterest[], types: POIType[]): PointOfInterest[] {
    return pois.filter((poi) => types.includes(poi.type));
  }

  /**
   * Récupère l'icône d'un type de POI
   */
  getPOIIcon(type: POIType): string {
    return this.POI_ICONS[type];
  }

  /**
   * Récupère la couleur d'un type de POI
   */
  getPOIColor(type: POIType): string {
    return this.POI_COLORS[type];
  }

  // Données mock pour le développement
  private getMockPOIs(
    location: { latitude: number; longitude: number },
    radiusMeters: number,
    types?: POIType[]
  ): PointOfInterest[] {
    const mockData: PointOfInterest[] = [
      {
        id: '1',
        type: 'SCHOOL',
        name: 'École Primaire Jean Mermoz',
        latitude: location.latitude + 0.005,
        longitude: location.longitude + 0.005,
        icon: this.POI_ICONS.SCHOOL,
        color: this.POI_COLORS.SCHOOL,
      },
      {
        id: '2',
        type: 'TRANSPORT',
        name: 'Station de bus - Cocody',
        latitude: location.latitude - 0.003,
        longitude: location.longitude + 0.002,
        icon: this.POI_ICONS.TRANSPORT,
        color: this.POI_COLORS.TRANSPORT,
      },
      {
        id: '3',
        type: 'SHOP',
        name: 'Centre Commercial CAP SUD',
        latitude: location.latitude + 0.007,
        longitude: location.longitude - 0.004,
        icon: this.POI_ICONS.SHOP,
        color: this.POI_COLORS.SHOP,
      },
      {
        id: '4',
        type: 'PARK',
        name: 'Parc du Banco',
        latitude: location.latitude - 0.008,
        longitude: location.longitude - 0.006,
        icon: this.POI_ICONS.PARK,
        color: this.POI_COLORS.PARK,
      },
      {
        id: '5',
        type: 'HOSPITAL',
        name: 'CHU de Cocody',
        latitude: location.latitude + 0.01,
        longitude: location.longitude + 0.008,
        icon: this.POI_ICONS.HOSPITAL,
        color: this.POI_COLORS.HOSPITAL,
      },
    ];

    if (types) {
      return mockData.filter((poi) => types.includes(poi.type));
    }

    return mockData;
  }

  private getMockPOIsInBounds(
    bounds: {
      northEast: { latitude: number; longitude: number };
      southWest: { latitude: number; longitude: number };
    },
    types?: POIType[]
  ): PointOfInterest[] {
    const center = {
      latitude: (bounds.northEast.latitude + bounds.southWest.latitude) / 2,
      longitude: (bounds.northEast.longitude + bounds.southWest.longitude) / 2,
    };

    return this.getMockPOIs(center, 5000, types);
  }
}

export const poiService = new POIService();
```

---

## Plan d'implémentation détaillé

### Phase 1: Setup et infrastructure (Jour 1-2)

#### Étape 1.1: Installation des dépendances

```bash
# Bottom Sheet
npm install @gorhom/bottom-sheet@^5

# Animations
npm install react-native-animatable@^1.4.0

# Si Reanimated n'est pas à jour
npm install react-native-reanimated@^3
```

#### Étape 1.2: Configuration Reanimated

**Fichier**: `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Ajouter le plugin Reanimated en dernier
      'react-native-reanimated/plugin',
    ],
  };
};
```

#### Étape 1.3: Créer les types TypeScript

**Fichier**: `lib/types/search.types.ts`

```typescript
export type TransactionType = 'BUY' | 'RENT' | 'NEW' | 'LAND';
export type PropertyType = 'APPARTEMENT' | 'MAISON' | 'TERRAIN' | 'COMMERCE' | 'BUREAU';
export type LegalStatus = 'TITLE_VERIFIED' | 'PENDING' | 'NOT_VERIFIED';
export type DocumentType = 'TITLE_DEED' | 'SURVEY' | 'BUILDING_PERMIT' | 'OCCUPATION_PERMIT';

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
    mode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
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
```

#### Étape 1.4: Créer la structure des dossiers

```bash
# Créer les dossiers
mkdir -p components/search
mkdir -p components/maps/enhanced
mkdir -p components/maps/markers
mkdir -p components/maps/previews
mkdir -p components/properties/cards
mkdir -p components/properties/lists
mkdir -p components/ui/inputs
mkdir -p components/ui/buttons
mkdir -p components/ui/feedback
mkdir -p components/ui/overlays
mkdir -p lib/services
mkdir -p lib/hooks
mkdir -p lib/utils
mkdir -p lib/types
```

---

### Phase 2: Composants UI de base (Jour 3-4)

[Suite de l'implémentation détaillée...]

**Ce document sera complété au fur et à mesure de l'implémentation.**
