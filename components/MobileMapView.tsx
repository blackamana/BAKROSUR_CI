import { useRouter } from 'expo-router';
import {
  Layers,
  MapPin,
  Navigation,
  School,
  Bus,
  ShoppingBag,
  TrendingUp,
  Filter,
  X,
} from 'lucide-react-native';
import { useState, useMemo } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/colors';
import { PROPERTIES, Property } from '@/constants/properties';
import { SCHOOLS } from '@/constants/schools';
import { TRANSPORTS } from '@/constants/transport';
import { AMENITIES } from '@/constants/amenities';
import { NEIGHBORHOOD_PRICES } from '@/constants/neighborhood-prices';

type MapType = 'standard' | 'satellite';
type OverlayType = 'properties' | 'schools' | 'transport' | 'amenities' | 'heatmap';
type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M FCFA`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K FCFA`;
  }
  return `${price} FCFA`;
}

function getRecommendedNeighborhoods(budget: number, propertyType: string): string[] {
  const affordable = NEIGHBORHOOD_PRICES
    .filter((p) => p.propertyType === propertyType && p.avgPrice <= budget * 1.2)
    .sort((a, b) => a.avgPricePerSqm - b.avgPricePerSqm)
    .slice(0, 5)
    .map((p) => p.neighborhoodName);
  return affordable;
}

function MobileMapViewComponent({ MapView, Marker, PROVIDER_GOOGLE, Heatmap }: {
  MapView: any;
  Marker: any;
  PROVIDER_GOOGLE: any;
  Heatmap: any;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  useTranslation();
  const [mapType, setMapType] = useState<MapType>('standard');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [overlays, setOverlays] = useState<Set<OverlayType>>(new Set(['properties']));
  const [showFilters, setShowFilters] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const initialRegion: Region = {
    latitude: 5.3473,
    longitude: -3.9856,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  const recommendedNeighborhoods = useMemo(
    () => getRecommendedNeighborhoods(50000000, 'MAISON'),
    []
  );

  const heatmapData = useMemo(
    () =>
      NEIGHBORHOOD_PRICES.filter((p) => p.transactionType === 'VENTE').map((p) => {
        const property = PROPERTIES.find((prop) => prop.neighborhoodId === p.neighborhoodId);
        return {
          latitude: property?.latitude || 5.3473,
          longitude: property?.longitude || -3.9856,
          weight: p.avgPricePerSqm / 300000,
        };
      }),
    []
  );

  const toggleOverlay = (overlay: OverlayType) => {
    setOverlays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(overlay)) {
        newSet.delete(overlay);
      } else {
        newSet.add(overlay);
      }
      return newSet;
    });
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'MAISON':
        return '🏠';
      case 'APPARTEMENT':
        return '🏢';
      case 'TERRAIN':
        return '🌳';
      case 'COMMERCE':
        return '🏪';
      case 'BUREAU':
        return '💼';
      case 'VILLA':
        return '🏰';
      default:
        return '📍';
    }
  };

  const openDirections = (lat: number, lng: number, name: string) => {
    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
    const url = Platform.select({
      ios: `${scheme}${lat},${lng}?q=${encodeURIComponent(name)}`,
      android: `${scheme}${lat},${lng}?q=${encodeURIComponent(name)}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        Linking.openURL(googleMapsUrl);
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton
      >
        {overlays.has('properties') &&
          PROPERTIES.map((property) => (
            <Marker
              key={property.id}
              coordinate={{
                latitude: property.latitude,
                longitude: property.longitude,
              }}
              onPress={() => setSelectedProperty(property)}
            >
              <View style={styles.propertyMarker}>
                <Text style={styles.propertyMarkerEmoji}>
                  {getPropertyIcon(property.type)}
                </Text>
                <Text style={styles.propertyMarkerText}>
                  {formatPrice(property.price).replace(' FCFA', '')}
                </Text>
              </View>
            </Marker>
          ))}

        {overlays.has('schools') &&
          SCHOOLS.map((school) => (
            <Marker
              key={school.id}
              coordinate={{
                latitude: school.latitude,
                longitude: school.longitude,
              }}
              pinColor="#4CAF50"
            />
          ))}

        {overlays.has('transport') &&
          TRANSPORTS.map((transport) => (
            <Marker
              key={transport.id}
              coordinate={{
                latitude: transport.latitude,
                longitude: transport.longitude,
              }}
              pinColor="#2196F3"
            />
          ))}

        {overlays.has('amenities') &&
          AMENITIES.map((amenity) => (
            <Marker
              key={amenity.id}
              coordinate={{
                latitude: amenity.latitude,
                longitude: amenity.longitude,
              }}
              pinColor="#FF9800"
            />
          ))}

        {overlays.has('heatmap') && (
          <Heatmap
            points={heatmapData}
            opacity={0.7}
            radius={40}
            gradient={{
              colors: ['#00FF00', '#FFFF00', '#FF0000'],
              startPoints: [0.1, 0.5, 1.0],
              colorMapSize: 256,
            }}
          />
        )}
      </MapView>

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Carte & Localisation</Text>
        <Text style={styles.subtitle}>{PROPERTIES.length} biens disponibles</Text>
      </View>

      <View style={[styles.controls, { top: insets.top + 100 }]}>
        <Pressable
          style={[
            styles.controlButton,
            mapType === 'satellite' && styles.controlButtonActive,
          ]}
          onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
        >
          <Layers size={20} color={Colors.light.text} />
          <Text style={styles.controlButtonText}>
            {mapType === 'satellite' ? 'Standard' : 'Satellite'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.controlButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={Colors.light.text} />
          <Text style={styles.controlButtonText}>Points d&apos;intérêt</Text>
        </Pressable>

        <Pressable
          style={styles.controlButton}
          onPress={() => setShowRecommendations(true)}
        >
          <TrendingUp size={20} color={Colors.light.text} />
          <Text style={styles.controlButtonText}>Quartiers recommandés</Text>
        </Pressable>
      </View>

      {selectedProperty && (
        <View style={[styles.propertyCard, { bottom: insets.bottom + 20 }]}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setSelectedProperty(null)}
          >
            <X size={20} color={Colors.light.text} />
          </Pressable>
          <Pressable
            onPress={() => router.push(`/property/${selectedProperty.id}`)}
          >
            <Image
              source={{ uri: selectedProperty.images[0] }}
              style={styles.propertyCardImage}
            />
            <View style={styles.propertyCardContent}>
              <Text style={styles.propertyCardTitle} numberOfLines={2}>
                {selectedProperty.title}
              </Text>
              <Text style={styles.propertyCardPrice}>
                {formatPrice(selectedProperty.price)}
              </Text>
              <View style={styles.propertyCardLocation}>
                <MapPin size={14} color={Colors.light.textSecondary} />
                <Text style={styles.propertyCardLocationText} numberOfLines={1}>
                  {selectedProperty.neighborhoodName}, {selectedProperty.cityName}
                </Text>
              </View>
              <Pressable
                style={styles.directionsButton}
                onPress={() =>
                  openDirections(
                    selectedProperty.latitude,
                    selectedProperty.longitude,
                    selectedProperty.title
                  )
                }
              >
                <Navigation size={16} color={Colors.light.background} />
                <Text style={styles.directionsButtonText}>Itinéraire</Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      )}

      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Points d&apos;intérêt</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <X size={24} color={Colors.light.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Pressable
                style={[
                  styles.filterOption,
                  overlays.has('properties') && styles.filterOptionActive,
                ]}
                onPress={() => toggleOverlay('properties')}
              >
                <MapPin size={20} color={Colors.light.text} />
                <Text style={styles.filterOptionText}>Biens immobiliers</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterOption,
                  overlays.has('schools') && styles.filterOptionActive,
                ]}
                onPress={() => toggleOverlay('schools')}
              >
                <School size={20} color={Colors.light.text} />
                <Text style={styles.filterOptionText}>Écoles</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterOption,
                  overlays.has('transport') && styles.filterOptionActive,
                ]}
                onPress={() => toggleOverlay('transport')}
              >
                <Bus size={20} color={Colors.light.text} />
                <Text style={styles.filterOptionText}>Transports</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterOption,
                  overlays.has('amenities') && styles.filterOptionActive,
                ]}
                onPress={() => toggleOverlay('amenities')}
              >
                <ShoppingBag size={20} color={Colors.light.text} />
                <Text style={styles.filterOptionText}>Commodités</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.filterOption,
                  overlays.has('heatmap') && styles.filterOptionActive,
                ]}
                onPress={() => toggleOverlay('heatmap')}
              >
                <TrendingUp size={20} color={Colors.light.text} />
                <Text style={styles.filterOptionText}>Heatmap des prix</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRecommendations}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRecommendations(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quartiers recommandés</Text>
              <Pressable onPress={() => setShowRecommendations(false)}>
                <X size={24} color={Colors.light.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.recommendationSubtitle}>
                Basé sur votre budget et vos préférences
              </Text>
              {recommendedNeighborhoods.map((neighborhood, index) => {
                const priceData = NEIGHBORHOOD_PRICES.find(
                  (p) => p.neighborhoodName === neighborhood
                );
                return (
                  <View key={index} style={styles.recommendationCard}>
                    <Text style={styles.recommendationName}>{neighborhood}</Text>
                    {priceData && (
                      <Text style={styles.recommendationPrice}>
                        Moyenne: {formatPrice(priceData.avgPrice)}
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function MobileMapView() {
  if (Platform.OS === 'web') {
    return null;
  }
  
  const MapView = require('react-native-maps').default;
  const { Marker, PROVIDER_GOOGLE, Heatmap } = require('react-native-maps');
  
  return <MobileMapViewComponent MapView={MapView} Marker={Marker} PROVIDER_GOOGLE={PROVIDER_GOOGLE} Heatmap={Heatmap} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  controls: {
    position: 'absolute',
    right: 16,
    gap: 8,
    zIndex: 5,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  propertyMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  propertyMarkerEmoji: {
    fontSize: 14,
  },
  propertyMarkerText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  propertyCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  propertyCardImage: {
    width: '100%',
    height: 160,
  },
  propertyCardContent: {
    padding: 16,
  },
  propertyCardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  propertyCardPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginBottom: 8,
  },
  propertyCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  propertyCardLocationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  directionsButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  filterOptionActive: {
    backgroundColor: Colors.light.primary + '20',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  recommendationSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  recommendationCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    marginBottom: 12,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  recommendationPrice: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
