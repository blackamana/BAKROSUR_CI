/**
 * Carte de Prévisualisation d'une Propriété
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X, MapPin, Home, Maximize } from 'lucide-react-native';
import { MapProperty } from '@/lib/maps/map.service';

interface PropertyPreviewCardProps {
  property: MapProperty;
  onPress: () => void;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export const PropertyPreviewCard: React.FC<PropertyPreviewCardProps> = ({
  property,
  onPress,
  onClose,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {/* Bouton fermer */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={20} color="#6B7280" />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Image */}
          {property.images && property.images[0] && (
            <Image
              source={{ uri: property.images[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          {/* Badges */}
          <View style={styles.badges}>
            {property.title_verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.badgeText}>✓ Vérifié SIGFU</Text>
              </View>
            )}
            {property.bakro_score && property.bakro_score >= 80 && (
              <View style={[styles.badge, styles.excellentBadge]}>
                <Text style={styles.badgeText}>Score: {property.bakro_score}</Text>
              </View>
            )}
          </View>

          {/* Informations */}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {property.title}
            </Text>

            <View style={styles.location}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.locationText} numberOfLines={1}>
                {property.neighborhood_name}, {property.city_name}
              </Text>
            </View>

            {/* Caractéristiques */}
            <View style={styles.features}>
              {property.surface_area && (
                <View style={styles.feature}>
                  <Maximize size={14} color="#6B7280" />
                  <Text style={styles.featureText}>{property.surface_area} m²</Text>
                </View>
              )}
              {property.bedrooms && (
                <View style={styles.feature}>
                  <Home size={14} color="#6B7280" />
                  <Text style={styles.featureText}>{property.bedrooms} ch.</Text>
                </View>
              )}
            </View>

            {/* Prix */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(property.price)} FCFA</Text>
              <Text style={styles.priceLabel}>
                {property.transaction_type === 'VENTE' ? 'À vendre' : 'À louer'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: CARD_WIDTH,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 140,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  badges: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  excellentBadge: {
    backgroundColor: '#3B82F6',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  info: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  features: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceContainer: {
    marginTop: 'auto',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EA580C',
  },
  priceLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
});