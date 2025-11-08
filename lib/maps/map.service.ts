/**
 * Service de Cartographie Interactive
 * Version utilisant les données locales de constants/properties.ts
 */

import * as Location from 'expo-location';
import { PROPERTIES } from '@/constants/properties';
import type { Property } from '@/constants/properties';

export interface MapProperty {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  price: number;
  property_type: string;
  transaction_type: string;
  images?: string[];
  city_name?: string;
  neighborhood_name?: string;
  surface_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  bakro_score?: number;
  title_verified?: boolean;
  map_marker_color?: string;
  map_marker_icon?: string;
}

export interface MarketAnalytics {
  city_id?: string;
  neighborhood_id?: string;
  total_properties: number;
  avg_price_sale?: number;
  avg_price_rent?: number;
  price_trend?: 'UP' | 'DOWN' | 'STABLE';
  price_change_percent?: number;
  popularity_score?: number;
  properties_for_sale?: number;
  properties_for_rent?: number;
  avg_price_per_sqm?: number;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  weight: number;
  intensity: number;
}

export class MapService {
  /**
   * Obtenir la position actuelle de l'utilisateur
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Permission de localisation refusée');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Erreur obtention position:', error);
      return null;
    }
  }

  /**
   * Charger les propriétés pour la carte
   */
  async getMapProperties(filters?: {
    bounds?: {
      northEast: { latitude: number; longitude: number };
      southWest: { latitude: number; longitude: number };
    };
    propertyType?: string;
    transactionType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    minBakroScore?: number;
    titleVerified?: boolean;
  }): Promise<MapProperty[]> {
    // Partir des données de constants/properties.ts
    let properties = PROPERTIES.filter((p: Property) => {
      // Ne garder que les propriétés avec coordonnées GPS
      return p.latitude != null && p.longitude != null;
    });

    // Appliquer les filtres de bounds (zone visible sur la carte)
    if (filters?.bounds) {
      properties = properties.filter((p: Property) => {
        if (!p.latitude || !p.longitude) return false;
        
        return (
          p.latitude >= filters.bounds!.southWest.latitude &&
          p.latitude <= filters.bounds!.northEast.latitude &&
          p.longitude >= filters.bounds!.southWest.longitude &&
          p.longitude <= filters.bounds!.northEast.longitude
        );
      });
    }

    // Filtre par type de propriété
    if (filters?.propertyType && filters.propertyType !== '') {
      properties = properties.filter((p: Property) => p.type === filters.propertyType);
    }

    // Filtre par type de transaction
    if (filters?.transactionType && filters.transactionType !== '') {
      properties = properties.filter((p: Property) => 
        p.transactionType === filters.transactionType
      );
    }

    // Filtre par prix minimum
    if (filters?.minPrice != null) {
      properties = properties.filter((p: Property) => p.price >= filters.minPrice!);
    }

    // Filtre par prix maximum
    if (filters?.maxPrice != null) {
      properties = properties.filter((p: Property) => p.price <= filters.maxPrice!);
    }

    // Filtre par nombre de chambres minimum
    if (filters?.minBedrooms != null && filters.minBedrooms > 0) {
      properties = properties.filter((p: Property) => 
        (p.bedrooms || 0) >= filters.minBedrooms!
      );
    }

    // Filtre par BakroScore minimum (on génère un score aléatoire pour la démo)
    if (filters?.minBakroScore != null && filters.minBakroScore > 0) {
      properties = properties.filter(() => {
        const randomScore = Math.floor(Math.random() * 40) + 60; // 60-100
        return randomScore >= filters.minBakroScore!;
      });
    }

    // Filtre par titre vérifié uniquement
    if (filters?.titleVerified === true) {
      // Pour la démo, on prend 30% des propriétés comme "vérifiées"
      properties = properties.filter(() => Math.random() > 0.7);
    }

    // Convertir au format MapProperty
    const mapProperties: MapProperty[] = properties.map((p: Property) => {
      // Générer un BakroScore aléatoire pour la démo (60-100)
      const bakroScore = Math.floor(Math.random() * 40) + 60;
      
      // 30% de chance d'être vérifié
      const titleVerified = Math.random() > 0.7;

      return {
        id: p.id,
        title: p.title,
        latitude: p.latitude!,
        longitude: p.longitude!,
        price: p.price,
        property_type: p.type,
        transaction_type: p.transactionType,
        images: p.images,
        city_name: p.cityName,
        neighborhood_name: p.neighborhoodName,
        surface_area: p.surfaceArea,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        bakro_score: bakroScore,
        title_verified: titleVerified,
        map_marker_color: this.getMarkerColorFromScore(bakroScore, titleVerified),
      };
    });

    console.log(`[MapService] Loaded ${mapProperties.length} properties`);
    return mapProperties;
  }

  /**
   * Rechercher des propriétés à proximité
   */
  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<MapProperty[]> {
    const allProperties = await this.getMapProperties();

    // Filtrer par distance (formule de Haversine simplifiée)
    return allProperties.filter((p) => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        p.latitude,
        p.longitude
      );
      return distance <= radiusKm;
    });
  }

  /**
   * Calculer la distance entre deux points GPS (en km)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Obtenir les analytics du marché pour une zone
   */
  async getMarketAnalytics(
    cityId?: string,
    neighborhoodId?: string
  ): Promise<MarketAnalytics | null> {
    const allProperties = await this.getMapProperties();
    
    // Filtrer par ville/quartier si spécifié
    let filteredProps = allProperties;
    
    if (cityId) {
      filteredProps = filteredProps.filter(p => p.city_name === cityId);
    }
    
    if (neighborhoodId) {
      filteredProps = filteredProps.filter(p => p.neighborhood_name === neighborhoodId);
    }

    if (filteredProps.length === 0) {
      return null;
    }

    // Calculer les statistiques
    const forSale = filteredProps.filter(p => p.transaction_type === 'VENTE');
    const forRent = filteredProps.filter(p => p.transaction_type === 'LOCATION');

    const avgPriceSale = forSale.length > 0
      ? forSale.reduce((sum, p) => sum + p.price, 0) / forSale.length
      : undefined;

    const avgPriceRent = forRent.length > 0
      ? forRent.reduce((sum, p) => sum + p.price, 0) / forRent.length
      : undefined;

    // Calculer prix au m² moyen
    const propsWithArea = filteredProps.filter(p => p.surface_area && p.surface_area > 0);
    const avgPricePerSqm = propsWithArea.length > 0
      ? propsWithArea.reduce((sum, p) => sum + (p.price / p.surface_area!), 0) / propsWithArea.length
      : undefined;

    // Tendance simulée
    const trends: Array<'UP' | 'DOWN' | 'STABLE'> = ['UP', 'DOWN', 'STABLE'];
    const priceTrend = trends[Math.floor(Math.random() * trends.length)];
    
    const priceChangePercent = priceTrend === 'UP' 
      ? Math.random() * 15 + 2  // +2% à +17%
      : priceTrend === 'DOWN'
      ? -(Math.random() * 10 + 1) // -1% à -11%
      : Math.random() * 2 - 1; // -1% à +1%

    // Score de popularité (basé sur le nombre de propriétés)
    const popularityScore = Math.min(100, Math.floor((filteredProps.length / 10) * 100));

    return {
      city_id: cityId,
      neighborhood_id: neighborhoodId,
      total_properties: filteredProps.length,
      avg_price_sale: avgPriceSale,
      avg_price_rent: avgPriceRent,
      price_trend: priceTrend,
      price_change_percent: Math.round(priceChangePercent * 10) / 10,
      popularity_score: popularityScore,
      properties_for_sale: forSale.length,
      properties_for_rent: forRent.length,
      avg_price_per_sqm: avgPricePerSqm,
    };
  }

  /**
   * Obtenir les données de la heatmap
   */
  async getHeatmapData(
    bounds?: {
      northEast: { latitude: number; longitude: number };
      southWest: { latitude: number; longitude: number };
    }
  ): Promise<HeatmapPoint[]> {
    const properties = await this.getMapProperties({ bounds });

    // Créer une grille de densité
    const gridSize = 0.01; // ~1km
    const heatmap = new Map<string, HeatmapPoint>();

    properties.forEach((p) => {
      const lat = Math.floor(p.latitude / gridSize) * gridSize;
      const lng = Math.floor(p.longitude / gridSize) * gridSize;
      const key = `${lat},${lng}`;

      if (heatmap.has(key)) {
        const point = heatmap.get(key)!;
        point.weight += 1;
      } else {
        heatmap.set(key, {
          latitude: lat,
          longitude: lng,
          weight: 1,
          intensity: 0,
        });
      }
    });

    // Calculer l'intensité (0-100)
    const points = Array.from(heatmap.values());
    const maxWeight = Math.max(...points.map(p => p.weight));

    return points.map(p => ({
      ...p,
      intensity: Math.floor((p.weight / maxWeight) * 100),
    }));
  }

  /**
   * Calculer la couleur du marker selon le statut
   */
  getMarkerColor(property: MapProperty): string {
    // Priorité au titre vérifié
    if (property.title_verified) {
      return '#10B981'; // Vert
    }

    // Selon le BakroScore
    if (property.bakro_score) {
      if (property.bakro_score >= 80) return '#10B981'; // Excellent - Vert
      if (property.bakro_score >= 60) return '#3B82F6'; // Bon - Bleu
      if (property.bakro_score >= 40) return '#F59E0B'; // Moyen - Orange
      return '#EF4444'; // Faible - Rouge
    }

    // Couleur par défaut
    return property.map_marker_color || '#EA580C'; // Orange Bakrosur
  }

  /**
   * Calculer la couleur depuis le score (helper interne)
   */
  private getMarkerColorFromScore(score: number, verified: boolean): string {
    if (verified) return '#10B981';
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#3B82F6';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  }

  /**
   * Obtenir l'icône du marker selon le type de propriété
   */
  getMarkerIcon(propertyType: string): string {
    const icons: Record<string, string> = {
      MAISON: 'home',
      APPARTEMENT: 'building',
      TERRAIN: 'map',
      COMMERCE: 'shopping-cart',
      BUREAU: 'briefcase',
    };
    return icons[propertyType] || 'home';
  }

  /**
   * Calculer le centre et le zoom optimal pour afficher plusieurs propriétés
   */
  calculateRegion(properties: MapProperty[]): {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } {
    if (properties.length === 0) {
      // Défaut: Abidjan
      return {
        latitude: 5.3599,
        longitude: -4.0083,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }

    if (properties.length === 1) {
      return {
        latitude: properties[0].latitude,
        longitude: properties[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    // Calculer les limites
    const lats = properties.map((p) => p.latitude);
    const lngs = properties.map((p) => p.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    const latDelta = (maxLat - minLat) * 1.3; // Padding 30%
    const lngDelta = (maxLng - minLng) * 1.3;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  }

  /**
   * Incrémenter le compteur de vues
   */
  async incrementViewCount(propertyId: string): Promise<void> {
    console.log(`[MapService] View count incremented for property: ${propertyId}`);
    // TODO: Implémenter avec Supabase plus tard
  }

  /**
   * Grouper les markers proches (clustering)
   */
  clusterMarkers(
    properties: MapProperty[],
    zoomLevel: number
  ): Array<{
    id: string;
    latitude: number;
    longitude: number;
    properties: MapProperty[];
    isCluster: boolean;
  }> {
    // Distance minimale en degrés selon le niveau de zoom
    const clusterDistance = 0.1 / Math.pow(2, zoomLevel - 10);

    const clusters: any[] = [];
    const processed = new Set<string>();

    properties.forEach((property) => {
      if (processed.has(property.id)) return;

      const cluster = {
        id: property.id,
        latitude: property.latitude,
        longitude: property.longitude,
        properties: [property],
        isCluster: false,
      };

      // Trouver les propriétés proches
      properties.forEach((other) => {
        if (other.id === property.id || processed.has(other.id)) return;

        const distance = Math.sqrt(
          Math.pow(property.latitude - other.latitude, 2) +
            Math.pow(property.longitude - other.longitude, 2)
        );

        if (distance < clusterDistance) {
          cluster.properties.push(other);
          processed.add(other.id);
        }
      });

      processed.add(property.id);

      // Si plusieurs propriétés, c'est un cluster
      if (cluster.properties.length > 1) {
        cluster.isCluster = true;
        // Calculer le centre du cluster
        cluster.latitude =
          cluster.properties.reduce((sum, p) => sum + p.latitude, 0) /
          cluster.properties.length;
        cluster.longitude =
          cluster.properties.reduce((sum, p) => sum + p.longitude, 0) /
          cluster.properties.length;
      }

      clusters.push(cluster);
    });

    return clusters;
  }
}

// Export singleton
export const mapService = new MapService();