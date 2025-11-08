import { router, Stack } from 'expo-router';
import { TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import CityAutocomplete from '@/components/CityAutocomplete';
import NeighborhoodAutocomplete from '@/components/NeighborhoodAutocomplete';
import type { PropertyType } from '@/constants/properties';

const PROPERTY_TYPES: { type: PropertyType; label: string; icon: string }[] = [
  { type: 'MAISON', label: 'Maison', icon: '🏠' },
  { type: 'APPARTEMENT', label: 'Appartement', icon: '🏢' },
  { type: 'TERRAIN', label: 'Terrain', icon: '📄' },
  { type: 'COMMERCE', label: 'Commerce', icon: '🏪' },
];

const PROPERTY_CONDITIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Neuf ou rénové récemment', multiplier: 1.2 },
  { value: 'bon', label: 'Bon', description: 'Bien entretenu', multiplier: 1 },
  { value: 'moyen', label: 'Moyen', description: 'Quelques travaux nécessaires', multiplier: 0.85 },
  { value: 'travaux', label: 'À rénover', description: 'Travaux importants', multiplier: 0.7 },
];

const EQUIPMENTS = [
  { value: 'piscine', label: 'Piscine' },
  { value: 'garage', label: 'Garage' },
  { value: 'jardin', label: 'Jardin' },
  { value: 'climatisation', label: 'Climatisation' },
  { value: 'securite', label: 'Sécurité 24h' },
  { value: 'vue', label: 'Belle vue' },
];

const CITY_PRICE_PER_SQM: Record<string, number> = {
  '1': 200000,
  default: 100000,
};

function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR') + ' FCFA';
}

export default function EstimatePropertyScreen() {
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);
  const [surfaceArea, setSurfaceArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [cityId, setCityId] = useState<string | null>(null);
  const [neighborhoodId, setNeighborhoodId] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [estimation, setEstimation] = useState<{
    value: number;
    min: number;
    max: number;
    pricePerSqm: number;
  } | null>(null);
  const [errors, setErrors] = useState<{
    type?: string;
    surfaceArea?: string;
    cityId?: string;
    condition?: string;
  }>({});

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipments((prev) =>
      prev.includes(equipment) ? prev.filter((e) => e !== equipment) : [...prev, equipment]
    );
  };

  const calculateEstimate = () => {
    const newErrors: typeof errors = {};

    if (!selectedType) {
      newErrors.type = 'Type de bien requis';
    }

    if (!surfaceArea.trim()) {
      newErrors.surfaceArea = 'Surface requise';
    } else if (parseInt(surfaceArea) <= 0) {
      newErrors.surfaceArea = 'Surface invalide';
    }

    if (!cityId) {
      newErrors.cityId = 'Ville requise';
    }

    if (!condition) {
      newErrors.condition = 'État du bien requis';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const surface = parseInt(surfaceArea);
    const priceBase = cityId && CITY_PRICE_PER_SQM[cityId] ? CITY_PRICE_PER_SQM[cityId] : CITY_PRICE_PER_SQM.default;
    
    const conditionData = PROPERTY_CONDITIONS.find((c) => c.value === condition);
    const conditionMultiplier = conditionData?.multiplier || 1;
    
    const bedroomsCount = parseInt(bedrooms || '0');
    const bedroomsMultiplier = bedroomsCount > 0 ? 1 + bedroomsCount * 0.05 : 1;
    
    const equipmentsMultiplier = 1 + selectedEquipments.length * 0.03;

    const estimatedValue = Math.round(
      surface * priceBase * conditionMultiplier * bedroomsMultiplier * equipmentsMultiplier
    );

    setEstimation({
      value: estimatedValue,
      min: Math.round(estimatedValue * 0.9),
      max: Math.round(estimatedValue * 1.1),
      pricePerSqm: priceBase,
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Estimer un bien',
          headerBackTitle: 'Retour',
          presentation: 'modal',
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <TrendingUp size={32} color={Colors.light.primary} />
            </View>
            <Text style={styles.title}>Estimer votre bien immobilier</Text>
            <Text style={styles.subtitle}>Estimation gratuite basée sur le marché actuel</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type de bien *</Text>
            <View style={styles.typeGrid}>
              {PROPERTY_TYPES.map((item) => (
                <Pressable
                  key={item.type}
                  style={[
                    styles.typeCard,
                    selectedType === item.type && styles.typeCardActive,
                  ]}
                  onPress={() => {
                    setSelectedType(item.type);
                    if (errors.type) setErrors({ ...errors, type: undefined });
                  }}
                >
                  <Text style={styles.typeIcon}>{item.icon}</Text>
                  <Text style={styles.typeLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
            {errors.type && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.type}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Surface (m²) *</Text>
            <TextInput
              style={[styles.input, errors.surfaceArea && styles.inputError]}
              placeholder="Ex: 250"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="numeric"
              value={surfaceArea}
              onChangeText={(text) => {
                setSurfaceArea(text);
                if (errors.surfaceArea) setErrors({ ...errors, surfaceArea: undefined });
              }}
            />
            {errors.surfaceArea && (
              <Text style={styles.errorTextInline}>{errors.surfaceArea}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Nombre de chambres</Text>
            <TextInput
              style={styles.input}
              placeholder="Si applicable"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="numeric"
              value={bedrooms}
              onChangeText={setBedrooms}
            />
          </View>

          <View style={styles.section}>
            <CityAutocomplete
              label="Ville *"
              value={cityId}
              onChange={(id) => {
                setCityId(id);
                setNeighborhoodId(null);
                if (errors.cityId) setErrors({ ...errors, cityId: undefined });
              }}
              placeholder="Sélectionner une ville"
            />
            {errors.cityId && (
              <Text style={styles.errorTextInline}>{errors.cityId}</Text>
            )}
          </View>

          <View style={styles.section}>
            <NeighborhoodAutocomplete
              label="Quartier (optionnel)"
              value={neighborhoodId}
              onChange={setNeighborhoodId}
              cityId={cityId}
              placeholder="Sélectionner un quartier"
              disabled={!cityId}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>État général du bien *</Text>
            <View style={styles.conditionGrid}>
              {PROPERTY_CONDITIONS.map((item) => (
                <Pressable
                  key={item.value}
                  style={[
                    styles.conditionCard,
                    condition === item.value && styles.conditionCardActive,
                  ]}
                  onPress={() => {
                    setCondition(item.value);
                    if (errors.condition) setErrors({ ...errors, condition: undefined });
                  }}
                >
                  <Text style={styles.conditionLabel}>{item.label}</Text>
                  <Text style={styles.conditionDescription}>{item.description}</Text>
                </Pressable>
              ))}
            </View>
            {errors.condition && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.condition}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Équipements et particularités</Text>
            <View style={styles.equipmentGrid}>
              {EQUIPMENTS.map((item) => (
                <Pressable
                  key={item.value}
                  style={[
                    styles.equipmentChip,
                    selectedEquipments.includes(item.value) && styles.equipmentChipActive,
                  ]}
                  onPress={() => toggleEquipment(item.value)}
                >
                  <Text
                    style={[
                      styles.equipmentChipText,
                      selectedEquipments.includes(item.value) &&
                        styles.equipmentChipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.calculateButton} onPress={calculateEstimate}>
            <Text style={styles.calculateButtonText}>📊 Calculer l&apos;estimation</Text>
          </Pressable>

          {estimation && (
            <View style={styles.estimationResult}>
              <Text style={styles.estimationLabel}>Estimation de votre bien</Text>
              <Text style={styles.estimationValue}>{formatPrice(estimation.value)}</Text>
              <Text style={styles.estimationRange}>
                Fourchette: {formatPrice(estimation.min)} - {formatPrice(estimation.max)}
              </Text>

              <View style={styles.estimationDetails}>
                <View style={styles.estimationDetailItem}>
                  <Text style={styles.estimationDetailLabel}>Prix au m²</Text>
                  <Text style={styles.estimationDetailValue}>
                    {formatPrice(estimation.pricePerSqm)}
                  </Text>
                </View>
                <View style={styles.estimationDetailItem}>
                  <Text style={styles.estimationDetailLabel}>Surface</Text>
                  <Text style={styles.estimationDetailValue}>{surfaceArea} m²</Text>
                </View>
                <View style={styles.estimationDetailItem}>
                  <Text style={styles.estimationDetailLabel}>État</Text>
                  <Text style={styles.estimationDetailValue}>
                    {PROPERTY_CONDITIONS.find((c) => c.value === condition)?.label}
                  </Text>
                </View>
                <View style={styles.estimationDetailItem}>
                  <Text style={styles.estimationDetailLabel}>Équipements</Text>
                  <Text style={styles.estimationDetailValue}>
                    {selectedEquipments.length} bonus
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.sellButton}
                onPress={() => {
                  router.back();
                  router.push('/sell-property' as any);
                }}
              >
                <Text style={styles.sellButtonText}>💰 Vendre à ce prix</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '48%',
    aspectRatio: 1.5,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.background,
  },
  typeIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  errorContainer: {
    backgroundColor: `${Colors.light.error}15`,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    fontSize: 13,
    color: Colors.light.error,
  },
  errorTextInline: {
    fontSize: 13,
    color: Colors.light.error,
    marginTop: 4,
  },
  conditionGrid: {
    gap: 12,
  },
  conditionCard: {
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  conditionCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.background,
  },
  conditionLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  conditionDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  equipmentChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  equipmentChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  equipmentChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  equipmentChipTextActive: {
    color: Colors.light.background,
  },
  calculateButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  estimationResult: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    padding: 24,
  },
  estimationLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  estimationValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  estimationRange: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  estimationDetails: {
    gap: 16,
    marginBottom: 24,
  },
  estimationDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimationDetailLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  estimationDetailValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  sellButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sellButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
});
