/**
 * Filtres Avancés pour la Carte
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { X, Filter, DollarSign, Home, TrendingUp, CheckCircle } from 'lucide-react-native';

interface MapFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialValues?: FilterValues;
}

export interface FilterValues {
  propertyType?: string;
  transactionType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBakroScore?: number;
  titleVerified?: boolean;
  bedrooms?: number;
  minSurfaceArea?: number;
}

const PROPERTY_TYPES = [
  { value: 'MAISON', label: 'Maison', icon: '🏠' },
  { value: 'APPARTEMENT', label: 'Appartement', icon: '🏢' },
  { value: 'TERRAIN', label: 'Terrain', icon: '📍' },
  { value: 'COMMERCE', label: 'Commerce', icon: '🏪' },
  { value: 'BUREAU', label: 'Bureau', icon: '💼' },
];

const TRANSACTION_TYPES = [
  { value: 'VENTE', label: 'Vente', icon: '💰' },
  { value: 'LOCATION', label: 'Location', icon: '🔑' },
];

const BAKRO_SCORE_LEVELS = [
  { value: 0, label: 'Tous', color: '#6B7280' },
  { value: 40, label: 'Moyen (40+)', color: '#F59E0B' },
  { value: 60, label: 'Bon (60+)', color: '#3B82F6' },
  { value: 80, label: 'Excellent (80+)', color: '#10B981' },
];

export const MapFilters: React.FC<MapFiltersProps> = ({
  visible,
  onClose,
  onApply,
  initialValues = {},
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialValues);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
  };

  const updateFilter = (key: keyof FilterValues, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Filter size={24} color="#EA580C" />
              <Text style={styles.headerTitle}>Filtres</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Type de propriété */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type de propriété</Text>
              <View style={styles.optionsGrid}>
                {PROPERTY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.optionButton,
                      filters.propertyType === type.value && styles.optionButtonActive,
                    ]}
                    onPress={() =>
                      updateFilter(
                        'propertyType',
                        filters.propertyType === type.value ? undefined : type.value
                      )
                    }
                  >
                    <Text style={styles.optionIcon}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        filters.propertyType === type.value && styles.optionLabelActive,
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
                      styles.radioButton,
                      filters.transactionType === type.value && styles.radioButtonActive,
                    ]}
                    onPress={() =>
                      updateFilter(
                        'transactionType',
                        filters.transactionType === type.value ? undefined : type.value
                      )
                    }
                  >
                    <Text style={styles.optionIcon}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.radioLabel,
                        filters.transactionType === type.value && styles.radioLabelActive,
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
              <Text style={styles.sectionTitle}>Budget (FCFA)</Text>
              <View style={styles.priceInputs}>
                <View style={styles.priceInput}>
                  <Text style={styles.inputLabel}>Min</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={filters.minPrice?.toString() || ''}
                    onChangeText={(text) =>
                      updateFilter('minPrice', text ? parseInt(text) : undefined)
                    }
                  />
                </View>
                <Text style={styles.priceSeparator}>-</Text>
                <View style={styles.priceInput}>
                  <Text style={styles.inputLabel}>Max</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Illimité"
                    keyboardType="numeric"
                    value={filters.maxPrice?.toString() || ''}
                    onChangeText={(text) =>
                      updateFilter('maxPrice', text ? parseInt(text) : undefined)
                    }
                  />
                </View>
              </View>
            </View>

            {/* BakroScore */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Score BakroSur minimum</Text>
              <View style={styles.scoreButtons}>
                {BAKRO_SCORE_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.scoreButton,
                      filters.minBakroScore === level.value && styles.scoreButtonActive,
                      {
                        borderColor:
                          filters.minBakroScore === level.value ? level.color : '#E5E7EB',
                      },
                    ]}
                    onPress={() =>
                      updateFilter(
                        'minBakroScore',
                        level.value === 0 ? undefined : level.value
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.scoreLabel,
                        filters.minBakroScore === level.value && { color: level.color },
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Titre vérifié SIGFU */}
            <View style={styles.section}>
              <View style={styles.switchRow}>
                <View style={styles.switchLeft}>
                  <CheckCircle size={20} color="#10B981" />
                  <View style={styles.switchInfo}>
                    <Text style={styles.switchLabel}>Titre vérifié SIGFU</Text>
                    <Text style={styles.switchDescription}>
                      Propriétés avec titre de propriété vérifié
                    </Text>
                  </View>
                </View>
                <Switch
                  value={filters.titleVerified || false}
                  onValueChange={(value) => updateFilter('titleVerified', value)}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Nombre de chambres */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nombre de chambres minimum</Text>
              <View style={styles.bedroomButtons}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.bedroomButton,
                      filters.bedrooms === num && styles.bedroomButtonActive,
                    ]}
                    onPress={() =>
                      updateFilter('bedrooms', filters.bedrooms === num ? undefined : num)
                    }
                  >
                    <Text
                      style={[
                        styles.bedroomLabel,
                        filters.bedrooms === num && styles.bedroomLabelActive,
                      ]}
                    >
                      {num}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Surface minimum */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Surface minimum (m²)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 100"
                keyboardType="numeric"
                value={filters.minSurfaceArea?.toString() || ''}
                onChangeText={(text) =>
                  updateFilter('minSurfaceArea', text ? parseInt(text) : undefined)
                }
              />
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Footer avec boutons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  optionLabelActive: {
    color: '#EA580C',
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButtonActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C',
  },
  radioLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  radioLabelActive: {
    color: '#EA580C',
    fontWeight: '600',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  priceSeparator: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  scoreButtons: {
    gap: 8,
  },
  scoreButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  scoreButtonActive: {
    backgroundColor: '#F9FAFB',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchInfo: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  bedroomButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  bedroomButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  bedroomButtonActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C',
  },
  bedroomLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  bedroomLabelActive: {
    color: '#EA580C',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  resetButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  applyButton: {
    flex: 2,
    padding: 16,
    backgroundColor: '#EA580C',
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});