/**
 * MainFilters - Filtres principaux visibles par défaut
 * Budget, Type de bien, Nombre de pièces, Surface
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Home, Building, MapPin, ShoppingCart, Briefcase } from 'lucide-react-native';
import { RangeSlider } from '@/components/ui/inputs/RangeSlider';
import { PropertyType, SearchFilters } from '@/lib/types/search.types';

export interface MainFiltersProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
  resultCount?: number;
}

interface PropertyTypeOption {
  id: PropertyType;
  label: string;
  icon: React.ReactNode;
}

const PROPERTY_TYPES: PropertyTypeOption[] = [
  { id: 'APPARTEMENT', label: 'Appartement', icon: <Building size={20} /> },
  { id: 'MAISON', label: 'Maison', icon: <Home size={20} /> },
  { id: 'TERRAIN', label: 'Terrain', icon: <MapPin size={20} /> },
  { id: 'COMMERCE', label: 'Commerce', icon: <ShoppingCart size={20} /> },
  { id: 'BUREAU', label: 'Bureau', icon: <Briefcase size={20} /> },
];

const ROOM_OPTIONS = [
  { value: null, label: 'Tous' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
];

export const MainFilters: React.FC<MainFiltersProps> = ({
  filters,
  onChange,
  resultCount,
}) => {
  const formatPrice = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Type de bien */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type de bien</Text>
        <View style={styles.propertyTypeGrid}>
          {PROPERTY_TYPES.map((type) => {
            const isSelected = filters.propertyType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.propertyTypeButton,
                  isSelected && styles.propertyTypeButtonSelected,
                ]}
                onPress={() =>
                  onChange({
                    propertyType: isSelected ? null : type.id,
                  })
                }
              >
                <View style={styles.propertyTypeIcon}>
                  {React.cloneElement(type.icon as React.ReactElement, {
                    color: isSelected ? '#EA580C' : '#6B7280',
                  })}
                </View>
                <Text
                  style={[
                    styles.propertyTypeLabel,
                    isSelected && styles.propertyTypeLabelSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Budget */}
      <View style={styles.section}>
        <RangeSlider
          label="Budget"
          min={0}
          max={500000000}
          step={5000000}
          values={[
            filters.minPrice || 0,
            filters.maxPrice || 500000000,
          ]}
          onChange={([min, max]) =>
            onChange({
              minPrice: min === 0 ? null : min,
              maxPrice: max === 500000000 ? null : max,
            })
          }
          formatValue={formatPrice}
          unit=" FCFA"
        />
      </View>

      {/* Nombre de chambres */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chambres</Text>
        <View style={styles.roomGrid}>
          {ROOM_OPTIONS.map((option) => {
            const isSelected = filters.bedrooms === option.value;
            return (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.roomButton,
                  isSelected && styles.roomButtonSelected,
                ]}
                onPress={() => onChange({ bedrooms: option.value })}
              >
                <Text
                  style={[
                    styles.roomLabel,
                    isSelected && styles.roomLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Nombre de salles de bain */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salles de bain</Text>
        <View style={styles.roomGrid}>
          {ROOM_OPTIONS.slice(0, 4).map((option) => {
            const isSelected = filters.bathrooms === option.value;
            return (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.roomButton,
                  isSelected && styles.roomButtonSelected,
                ]}
                onPress={() => onChange({ bathrooms: option.value })}
              >
                <Text
                  style={[
                    styles.roomLabel,
                    isSelected && styles.roomLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Surface */}
      <View style={styles.section}>
        <RangeSlider
          label="Surface"
          min={0}
          max={1000}
          step={10}
          values={[
            filters.minSurface || 0,
            filters.maxSurface || 1000,
          ]}
          onChange={([min, max]) =>
            onChange({
              minSurface: min === 0 ? null : min,
              maxSurface: max === 1000 ? null : max,
            })
          }
          unit=" m²"
        />
      </View>

      {/* Compteur de résultats */}
      {resultCount !== undefined && (
        <View style={styles.resultCounter}>
          <Text style={styles.resultCountText}>
            {resultCount} {resultCount > 1 ? 'propriétés trouvées' : 'propriété trouvée'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  propertyTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  propertyTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  propertyTypeButtonSelected: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED',
  },
  propertyTypeIcon: {
    // Les styles sont appliqués dynamiquement
  },
  propertyTypeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  propertyTypeLabelSelected: {
    color: '#EA580C',
    fontWeight: '600',
  },
  roomGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  roomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  roomButtonSelected: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED',
  },
  roomLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  roomLabelSelected: {
    color: '#EA580C',
  },
  resultCounter: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EA580C',
  },
});
