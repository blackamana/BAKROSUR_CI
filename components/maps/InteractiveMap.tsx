/**
 * Carte Interactive avec Markers et Clustering
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin, Layers, TrendingUp, Filter } from 'lucide-react-native';
import { mapService, MapProperty } from '@/lib/maps/map.service';
import { PropertyMarker } from './PropertyMarker';
import { ClusterMarker } from './ClusterMarker';
import { PropertyPreviewCard } from './PropertyPreviewCard';

interface InteractiveMapProps {
  initialRegion?: Region;
  properties?: MapProperty[];
  onPropertyPress?: (property: MapProperty) => void;
  showFilters?: boolean;
  showHeatmap?: boolean;
  showAnalytics?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialRegion,
  properties: externalProperties,
  onPropertyPress,
  showFilters = true,
  showHeatmap = false,
  showAnalytics = false,
}) => {
  const mapRef = useRef<MapView>(null);
  const [properties, setProperties] = useState<MapProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region>(
    initialRegion || {
      latitude: 5.3599, // Abidjan
      longitude: -4.0083,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }
  );
  const [showHeatmapLayer, setShowHeatmapLayer] = useState(showHeatmap);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');

  useEffect(() => {
    if (externalProperties) {
      setProperties(externalProperties);
      setLoading(false);
    } else {
      loadProperties();
    }
  }, [externalProperties]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await mapService.getMapProperties({
        bounds: {
          northEast: {
            latitude: currentRegion.latitude + currentRegion.latitudeDelta / 2,
            longitude: currentRegion.longitude + currentRegion.longitudeDelta / 2,
          },
          southWest: {
            latitude: currentRegion.latitude - currentRegion.latitudeDelta / 2,
            longitude: currentRegion.longitude - currentRegion.longitudeDelta / 2,
          },
        },
      });
      setProperties(data);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region);
    if (!externalProperties) {
      loadProperties();
    }
  };

  const handleMarkerPress = (property: MapProperty) => {
    setSelectedProperty(property);
    
    // Centrer la carte sur le marker
    mapRef.current?.animateToRegion({
      latitude: property.latitude,
      longitude: property.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    // Incrémenter le compteur de vues
    mapService.incrementViewCount(property.id);
  };

  const handleMyLocation = async () => {
    const location = await mapService.getCurrentLocation();
    if (location) {
      mapRef.current?.animateToRegion({
        ...location,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleFitToProperties = () => {
    if (properties.length > 0) {
      const region = mapService.calculateRegion(properties);
      mapRef.current?.animateToRegion(region, 1000);
    }
  };

  const toggleMapType = () => {
    setMapType((prev) => {
      if (prev === 'standard') return 'satellite';
      if (prev === 'satellite') return 'hybrid';
      return 'standard';
    });
  };

  // Clustering des markers
  const zoomLevel = Math.log2(360 / currentRegion.longitudeDelta);
  const clusters = mapService.clusterMarkers(properties, zoomLevel);

  return (
    <View style={styles.container}>
      {/* Carte */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
        loadingEnabled
        loadingIndicatorColor="#EA580C"
      >
        {/* Markers avec clustering */}
        {clusters.map((cluster) =>
          cluster.isCluster ? (
            <ClusterMarker
              key={cluster.id}
              coordinate={{
                latitude: cluster.latitude,
                longitude: cluster.longitude,
              }}
              count={cluster.properties.length}
              onPress={() => {
                // Zoomer sur le cluster
                const region = mapService.calculateRegion(cluster.properties);
                mapRef.current?.animateToRegion(region, 500);
              }}
            />
          ) : (
            <PropertyMarker
              key={cluster.properties[0].id}
              property={cluster.properties[0]}
              onPress={() => handleMarkerPress(cluster.properties[0])}
            />
          )
        )}
      </MapView>

      {/* Indicateur de chargement */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EA580C" />
            <Text style={styles.loadingText}>Chargement des propriétés...</Text>
          </View>
        </View>
      )}

      {/* Contrôles flottants */}
      <View style={styles.controls}>
        {/* Bouton Ma Position */}
        <TouchableOpacity style={styles.controlButton} onPress={handleMyLocation}>
          <MapPin size={24} color="#000" />
        </TouchableOpacity>

        {/* Bouton Type de carte */}
        <TouchableOpacity style={styles.controlButton} onPress={toggleMapType}>
          <Layers size={24} color="#000" />
        </TouchableOpacity>

        {/* Bouton Analytics */}
        {showAnalytics && (
          <TouchableOpacity style={styles.controlButton}>
            <TrendingUp size={24} color="#000" />
          </TouchableOpacity>
        )}

        {/* Bouton Tout afficher */}
        <TouchableOpacity
          style={[styles.controlButton, styles.fitButton]}
          onPress={handleFitToProperties}
        >
          <Text style={styles.fitButtonText}>Tout afficher</Text>
        </TouchableOpacity>
      </View>

      {/* Compteur de propriétés */}
      <View style={styles.propertyCounter}>
        <Text style={styles.propertyCountText}>
          {properties.length} {properties.length > 1 ? 'propriétés' : 'propriété'}
        </Text>
      </View>

      {/* Carte de prévisualisation de la propriété sélectionnée */}
      {selectedProperty && (
        <PropertyPreviewCard
          property={selectedProperty}
          onPress={() => {
            if (onPropertyPress) {
              onPropertyPress(selectedProperty);
            }
          }}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  controls: {
    position: 'absolute',
    top: 60,
    right: 16,
    gap: 12,
  },
  controlButton: {
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fitButton: {
    width: 'auto',
    paddingHorizontal: 16,
  },
  fitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  propertyCounter: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  propertyCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});