/**
 * Marker Personnalisé pour les Propriétés
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Home, Building, MapPin, ShoppingCart, Briefcase } from 'lucide-react-native';
import { MapProperty, mapService } from '@/lib/maps/map.service';

interface PropertyMarkerProps {
  property: MapProperty;
  onPress: () => void;
}

export const PropertyMarker: React.FC<PropertyMarkerProps> = ({
  property,
  onPress,
}) => {
  const color = mapService.getMarkerColor(property);

  const getIcon = () => {
    const iconSize = 20;
    const iconColor = '#FFFFFF';

    switch (property.property_type) {
      case 'MAISON':
        return <Home size={iconSize} color={iconColor} />;
      case 'APPARTEMENT':
        return <Building size={iconSize} color={iconColor} />;
      case 'TERRAIN':
        return <MapPin size={iconSize} color={iconColor} />;
      case 'COMMERCE':
        return <ShoppingCart size={iconSize} color={iconColor} />;
      case 'BUREAU':
        return <Briefcase size={iconSize} color={iconColor} />;
      default:
        return <Home size={iconSize} color={iconColor} />;
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}k`;
    }
    return price.toString();
  };

  return (
    <Marker
      coordinate={{
        latitude: property.latitude,
        longitude: property.longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.markerContainer}>
        {/* Badge de certification (si vérifié) */}
        {property.title_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        )}

        {/* Marker principal */}
        <View style={[styles.marker, { backgroundColor: color }]}>
          {getIcon()}
        </View>

        {/* Prix */}
        <View style={[styles.priceTag, { backgroundColor: color }]}>
          <Text style={styles.priceText}>{formatPrice(property.price)}</Text>
        </View>

        {/* Pointe du marker */}
        <View style={[styles.markerTip, { borderTopColor: color }]} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#10B981',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  priceTag: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markerTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
});