/**
 * Service de géolocalisation
 * Gère la localisation de l'utilisateur et les recherches "Autour de moi"
 */

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
   * Utilise la formule de Haversine
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

  /**
   * Formate la distance pour l'affichage
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }
}

export const geolocationService = new GeolocationService();
