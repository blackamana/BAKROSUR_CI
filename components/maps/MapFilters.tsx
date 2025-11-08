/**
 * Filtres pour la Carte Interactive
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { X, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';

export interface FilterValues {
  propertyType?: string;
  transactionType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBakroScore?: number;
  titleVerified?: boolean;
}

interface MapFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  onClose: () => void;
}

const PROPERTY_TYPES = [
  { value: '', label: 'Tous' },
  { value: 'MAISON', label: '🏠 Maison' },
  { value: 'APPARTEMENT', label: '🏢 Appartement' },
  { value: 'TERRAIN', label: '🌳 Terrain' },
  { value: 'COMMERCE', label: '🏪 Commerce' },
  { value: 'BUREAU', label: '💼 Bureau' },
];

const TRANSACTION_TYPES = [
  { value: '', label: 'Tous' },
  { value: 'VENTE', label: 'À vendre' },
  { value: 'LOCATION', label: 'À louer' },
];

const BEDROOMS = [
  { value: 0, label: 'Toutes' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
];

const BAKRO_SCORES = [
  { value: 0, label: 'Tous' },
  { value: 40, label: '40+' },
  { value: 60, label: '60+' },
  { value: 80, label: '80+' },
];

export const MapFilters: React.FC<MapFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const updateFilter = (key: keyof FilterValues, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const resetFilters = () => {
    onFiltersChange({});
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Filter size={24} color={Colors.light.primary} />
          <Text style={styles.headerTitle}>Filtres</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type de propriété */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type de propriété</Text>
          <View style={styles.optionsGrid}>
            {PROPERTY_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.option,
                  filters.propertyType === type.value && styles.optionActive,
                ]}
                onPress={() => updateFilter('propertyType', type.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.propertyType === type.value && styles.optionTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Type de transaction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type de transaction</Text>
          <View style={styles.optionsRow}>
            {TRANSACTION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.option,
                  styles.optionFlex,
                  filters.transactionType === type.value && styles.optionActive,
                ]}
                onPress={() => updateFilter('transactionType', type.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.transactionType === type.value && styles.optionTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prix (FCFA)</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="numeric"
              value={filters.minPrice?.toString() || ''}
              onChangeText={(text) =>
                updateFilter('minPrice', text ? parseInt(text, 10) : undefined)
              }
            />
            <Text style={styles.separator}>→</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="numeric"
              value={filters.maxPrice?.toString() || ''}
              onChangeText={(text) =>
                updateFilter('maxPrice', text ? parseInt(text, 10) : undefined)
              }
            />
          </View>
        </View>

        {/* Chambres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chambres minimum</Text>
          <View style={styles.optionsRow}>
            {BEDROOMS.map((bed) => (
              <TouchableOpacity
                key={bed.value}
                style={[
                  styles.option,
                  styles.optionSmall,
                  filters.minBedrooms === bed.value && styles.optionActive,
                ]}
                onPress={() => updateFilter('minBedrooms', bed.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.minBedrooms === bed.value && styles.optionTextActive,
                  ]}
                >
                  {bed.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BakroScore */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BakroScore minimum</Text>
          <View style={styles.optionsRow}>
            {BAKRO_SCORES.map((score) => (
              <TouchableOpacity
                key={score.value}
                style={[
                  styles.option,
                  styles.optionSmall,
                  filters.minBakroScore === score.value && styles.optionActive,
                ]}
                onPress={() => updateFilter('minBakroScore', score.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.minBakroScore === score.value && styles.optionTextActive,
                  ]}
                >
                  {score.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Titre vérifié */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Titres vérifiés SIGFU uniquement</Text>
              <Text style={styles.switchDescription}>
                Propriétés avec titres vérifiés par le gouvernement
              </Text>
            </View>
            <Switch
              value={filters.titleVerified || false}
              onValueChange={(value) => updateFilter('titleVerified', value)}
              trackColor={{
                false: Colors.light.border,
                true: Colors.light.primary,
              }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetButtonText}>Réinitialiser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={onClose}>
          <Text style={styles.applyButtonText}>Appliquer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  optionFlex: {
    flex: 1,
    alignItems: 'center',
  },
  optionSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  optionTextActive: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  separator: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  resetButton: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  applyButton: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
});