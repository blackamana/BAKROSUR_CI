/**
 * Calque Heatmap pour visualiser la densité des propriétés
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Heatmap } from 'react-native-maps';
import { mapService, HeatmapPoint } from '@/lib/maps/map.service';

interface HeatmapLayerProps {
  mapRef: React.RefObject<MapView>;
  visible: boolean;
  currentRegion?: {
    northEast: { latitude: number; longitude: number };
    southWest: { latitude: number; longitude: number };
  };
}

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  mapRef,
  visible,
  currentRegion,
}) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadHeatmapData();
    }
  }, [visible, currentRegion]);

  const loadHeatmapData = async () => {
    try {
      setLoading(true);
      const data = await mapService.getHeatmapData(currentRegion);
      setHeatmapData(data);
    } catch (error) {
      console.error('Erreur chargement heatmap:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible || heatmapData.length === 0) {
    return null;
  }

  // Convertir les données pour react-native-maps
  const points = heatmapData.map((point) => ({
    latitude: point.latitude,
    longitude: point.longitude,
    weight: point.weight,
  }));

  return (
    <>
      {/* Note: Le composant Heatmap nécessite react-native-maps-heatmap */}
      {/* Pour l'instant, nous allons utiliser des cercles colorés comme fallback */}
      {heatmapData.map((point, index) => {
        // Couleur selon l'intensité
        const getColor = (intensity: number) => {
          if (intensity >= 80) return 'rgba(239, 68, 68, 0.6)'; // Rouge
          if (intensity >= 60) return 'rgba(249, 115, 22, 0.6)'; // Orange
          if (intensity >= 40) return 'rgba(245, 158, 11, 0.6)'; // Ambre
          if (intensity >= 20) return 'rgba(34, 197, 94, 0.6)'; // Vert
          return 'rgba(59, 130, 246, 0.6)'; // Bleu
        };

        const radius = Math.min(point.weight * 100, 500); // Max 500m

        return (
          <MapView.Circle
            key={`heatmap-${index}`}
            center={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            radius={radius}
            fillColor={getColor(point.intensity)}
            strokeColor="transparent"
          />
        );
      })}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#EA580C" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});