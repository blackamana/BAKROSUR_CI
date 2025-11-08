import { router, Stack } from 'expo-router';
import { FileText, Upload, AlertCircle, MapPin, Navigation } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { useVerification } from '@/contexts/VerificationContext';
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
import type { LegalStatus, PropertyType } from '@/constants/properties';

const PROPERTY_TYPES: { type: PropertyType; label: string; icon: string }[] = [
  { type: 'MAISON', label: 'Maison', icon: '🏠' },
  { type: 'APPARTEMENT', label: 'Appartement', icon: '🏢' },
  { type: 'TERRAIN', label: 'Terrain', icon: '📄' },
  { type: 'COMMERCE', label: 'Commerce', icon: '🏪' },
  { type: 'BUREAU', label: 'Bureau', icon: '💼' },
];

const LEGAL_STATUSES: { status: LegalStatus; label: string; description: string }[] = [
  { status: 'TF', label: 'Titre Foncier (TF)', description: 'Sécurité maximale' },
  { status: 'ACD', label: 'Arrêté de Concession Définitive', description: 'Validé' },
  { status: 'ADU', label: 'Attestation de Droit d&apos;Usage', description: 'Reconnu' },
  { status: 'AV', label: 'Attestation Villageoise', description: 'Coutumier' },
];

export default function SellPropertyScreen() {
  const { isAuthenticated } = useAuth();
  const { kycData } = useVerification();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);
  const [transactionType, setTransactionType] = useState<'VENTE' | 'LOCATION'>('VENTE');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    surfaceArea: '',
    bedrooms: '',
    bathrooms: '',
    cityId: null as string | null,
    neighborhoodId: null as string | null,
    legalStatus: null as LegalStatus | null,
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    locationType: 'MANUAL' as 'GPS' | 'MANUAL',
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    type?: string;
    title?: string;
    price?: string;
    surfaceArea?: string;
    cityId?: string;
    neighborhoodId?: string;
    legalStatus?: string;
    address?: string;
  }>({});

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour déposer une annonce.',
        [
          {
            text: 'Se connecter',
            onPress: () => router.replace('/auth/login'),
          },
          {
            text: 'Annuler',
            onPress: () => router.back(),
            style: 'cancel',
          },
        ]
      );
    } else if (kycData?.status !== 'APPROVED') {
      Alert.alert(
        'Vérification requise',
        'Votre compte doit être vérifié avant de pouvoir déposer une annonce. Veuillez compléter la vérification KYC.',
        [
          {
            text: 'Vérifier mon compte',
            onPress: () => router.replace('/verification/kyc'),
          },
          {
            text: 'Annuler',
            onPress: () => router.back(),
            style: 'cancel',
          },
        ]
      );
    }
  }, [isAuthenticated, kycData]);

  const validateStep = () => {
    const newErrors: typeof errors = {};

    if (step === 1) {
      if (!selectedType) {
        newErrors.type = 'Veuillez sélectionner un type de bien';
      }
    }

    if (step === 2) {
      if (!formData.title.trim()) {
        newErrors.title = 'Titre requis';
      }

      if (!formData.price.trim()) {
        newErrors.price = 'Prix requis';
      } else if (parseInt(formData.price) <= 0) {
        newErrors.price = 'Prix invalide';
      }

      if (!formData.surfaceArea.trim()) {
        newErrors.surfaceArea = 'Surface requise';
      } else if (parseInt(formData.surfaceArea) <= 0) {
        newErrors.surfaceArea = 'Surface invalide';
      }

      if (!formData.cityId) {
        newErrors.cityId = 'Ville requise';
      }

      if (!formData.neighborhoodId) {
        newErrors.neighborhoodId = 'Quartier requis';
      }

      if (!formData.legalStatus) {
        newErrors.legalStatus = 'Statut juridique requis';
      }

      if (!formData.address.trim()) {
        newErrors.address = 'Adresse requise';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    Alert.alert(
      'Annonce soumise',
      'Votre annonce a été soumise avec succès ! Elle sera vérifiée avant publication.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleFileUpload = () => {
    Alert.alert('Upload', 'Fonctionnalité d&apos;upload de fichiers à venir');
    setUploadedFiles([...uploadedFiles, 'Document.pdf']);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: transactionType === 'VENTE' ? 'Vendre un bien' : 'Louer un bien',
          headerBackTitle: 'Retour',
          presentation: 'modal',
        }}
      />

      {!isAuthenticated || kycData?.status !== 'APPROVED' ? (
        <View style={styles.restrictedContainer}>
          <AlertCircle size={64} color={Colors.light.error} />
          <Text style={styles.restrictedTitle}>
            {!isAuthenticated ? 'Connexion requise' : 'Vérification requise'}
          </Text>
          <Text style={styles.restrictedMessage}>
            {!isAuthenticated
              ? 'Vous devez être connecté pour déposer une annonce.'
              : 'Votre compte doit être vérifié avant de pouvoir déposer une annonce.'}
          </Text>
          <Pressable
            style={styles.restrictedButton}
            onPress={() => {
              if (!isAuthenticated) {
                router.replace('/auth/login');
              } else {
                router.replace('/verification/kyc');
              }
            }}
          >
            <Text style={styles.restrictedButtonText}>
              {!isAuthenticated ? 'Se connecter' : 'Vérifier mon compte'}
            </Text>
          </Pressable>
        </View>
      ) : (
      <View style={styles.container}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
            <Text style={[styles.progressStepText, step >= 1 && styles.progressStepTextActive]}>
              1
            </Text>
          </View>
          <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
          <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
            <Text style={[styles.progressStepText, step >= 2 && styles.progressStepTextActive]}>
              2
            </Text>
          </View>
          <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
          <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]}>
            <Text style={[styles.progressStepText, step >= 3 && styles.progressStepTextActive]}>
              3
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Type de bien</Text>
              <Text style={styles.stepSubtitle}>Sélectionnez le type de bien que vous souhaitez vendre ou louer</Text>
              {errors.type && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.type}</Text>
                </View>
              )}

              <View style={styles.typeGrid}>
                {PROPERTY_TYPES.map((item) => (
                  <Pressable
                    key={item.type}
                    style={[
                      styles.typeCard,
                      selectedType === item.type && styles.typeCardActive,
                    ]}
                    onPress={() => setSelectedType(item.type)}
                  >
                    <Text style={styles.typeIcon}>{item.icon}</Text>
                    <Text style={styles.typeLabel}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Type de transaction</Text>
                <View style={styles.transactionTypes}>
                  <Pressable
                    style={[
                      styles.transactionType,
                      transactionType === 'VENTE' && styles.transactionTypeActive,
                    ]}
                    onPress={() => setTransactionType('VENTE')}
                  >
                    <Text
                      style={[
                        styles.transactionTypeText,
                        transactionType === 'VENTE' && styles.transactionTypeTextActive,
                      ]}
                    >
                      Vendre
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.transactionType,
                      transactionType === 'LOCATION' && styles.transactionTypeActive,
                    ]}
                    onPress={() => setTransactionType('LOCATION')}
                  >
                    <Text
                      style={[
                        styles.transactionTypeText,
                        transactionType === 'LOCATION' && styles.transactionTypeTextActive,
                      ]}
                    >
                      Louer
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Informations du bien</Text>
              <Text style={styles.stepSubtitle}>Renseignez les détails de votre propriété</Text>

              <View style={styles.section}>
                <Text style={styles.label}>Titre de l&apos;annonce *</Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="Ex: Villa moderne avec piscine à Cocody"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={formData.title}
                  onChangeText={(text) => {
                    setFormData({ ...formData, title: text });
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>
                  Prix {transactionType === 'VENTE' ? 'de vente' : 'mensuel'} (FCFA) *
                </Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  placeholder="Ex: 85000000"
                  placeholderTextColor={Colors.light.textSecondary}
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={(text) => {
                    setFormData({ ...formData, price: text });
                    if (errors.price) setErrors({ ...errors, price: undefined });
                  }}
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Surface (m²) *</Text>
                <TextInput
                  style={[styles.input, errors.surfaceArea && styles.inputError]}
                  placeholder="Ex: 350"
                  placeholderTextColor={Colors.light.textSecondary}
                  keyboardType="numeric"
                  value={formData.surfaceArea}
                  onChangeText={(text) => {
                    setFormData({ ...formData, surfaceArea: text });
                    if (errors.surfaceArea) setErrors({ ...errors, surfaceArea: undefined });
                  }}
                />
                {errors.surfaceArea && <Text style={styles.errorText}>{errors.surfaceArea}</Text>}
              </View>

              <View style={styles.row}>
                <View style={[styles.section, styles.halfWidth]}>
                  <Text style={styles.label}>Chambres</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.light.textSecondary}
                    keyboardType="numeric"
                    value={formData.bedrooms}
                    onChangeText={(text) => setFormData({ ...formData, bedrooms: text })}
                  />
                </View>

                <View style={[styles.section, styles.halfWidth]}>
                  <Text style={styles.label}>Salles de bain</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor={Colors.light.textSecondary}
                    keyboardType="numeric"
                    value={formData.bathrooms}
                    onChangeText={(text) => setFormData({ ...formData, bathrooms: text })}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <CityAutocomplete
                  label="Ville *"
                  value={formData.cityId}
                  onChange={(cityId) => {
                    setFormData({ ...formData, cityId, neighborhoodId: null });
                    if (errors.cityId) setErrors({ ...errors, cityId: undefined });
                  }}
                  placeholder="Sélectionner une ville"
                />
                {errors.cityId && <Text style={styles.errorText}>{errors.cityId}</Text>}
              </View>

              <View style={styles.section}>
                <NeighborhoodAutocomplete
                  label="Quartier *"
                  value={formData.neighborhoodId}
                  onChange={(neighborhoodId) => {
                    setFormData({ ...formData, neighborhoodId });
                    if (errors.neighborhoodId) setErrors({ ...errors, neighborhoodId: undefined });
                  }}
                  cityId={formData.cityId}
                  placeholder="Sélectionner un quartier"
                  disabled={!formData.cityId}
                />
                {errors.neighborhoodId && <Text style={styles.errorText}>{errors.neighborhoodId}</Text>}
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Statut juridique *</Text>
                <View style={styles.legalStatusGrid}>
                  {LEGAL_STATUSES.map((item) => (
                    <Pressable
                      key={item.status}
                      style={[
                        styles.legalStatusCard,
                        formData.legalStatus === item.status && styles.legalStatusCardActive,
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, legalStatus: item.status });
                        if (errors.legalStatus) setErrors({ ...errors, legalStatus: undefined });
                      }}
                    >
                      <Text style={styles.legalStatusLabel}>{item.status}</Text>
                      <Text style={styles.legalStatusDescription}>{item.description}</Text>
                    </Pressable>
                  ))}
                </View>
                {errors.legalStatus && <Text style={styles.errorText}>{errors.legalStatus}</Text>}
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Adresse du bien *</Text>
                <Text style={styles.helperText}>
                  L&apos;adresse exacte sera communiquée uniquement lors de la planification d&apos;une visite
                </Text>
                <View style={styles.locationActions}>
                  <Pressable
                    style={[styles.locationButton, formData.locationType === 'GPS' && styles.locationButtonActive]}
                    onPress={async () => {
                      setIsLoadingLocation(true);
                      try {
                        const { status } = await Location.requestForegroundPermissionsAsync();
                        if (status !== 'granted') {
                          Alert.alert('Permission refusée', 'Veuillez autoriser l&apos;accès à votre localisation');
                          setIsLoadingLocation(false);
                          return;
                        }

                        const location = await Location.getCurrentPositionAsync({});
                        const { latitude, longitude } = location.coords;

                        const [addressResult] = await Location.reverseGeocodeAsync({ latitude, longitude });
                        const addressText = [
                          addressResult.streetNumber,
                          addressResult.street,
                          addressResult.district,
                          addressResult.city,
                        ].filter(Boolean).join(', ');

                        setFormData({
                          ...formData,
                          address: addressText || `${latitude}, ${longitude}`,
                          latitude,
                          longitude,
                          locationType: 'GPS',
                        });
                        if (errors.address) setErrors({ ...errors, address: undefined });
                      } catch {
                        Alert.alert('Erreur', 'Impossible de récupérer votre position');
                      } finally {
                        setIsLoadingLocation(false);
                      }
                    }}
                    disabled={isLoadingLocation}
                  >
                    <Navigation size={18} color={formData.locationType === 'GPS' ? Colors.light.background : Colors.light.primary} />
                    <Text style={[styles.locationButtonText, formData.locationType === 'GPS' && styles.locationButtonTextActive]}>
                      {isLoadingLocation ? 'Localisation...' : 'Utiliser GPS'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.locationButton, formData.locationType === 'MANUAL' && styles.locationButtonActive]}
                    onPress={() => {
                      setFormData({ ...formData, locationType: 'MANUAL' });
                    }}
                  >
                    <MapPin size={18} color={formData.locationType === 'MANUAL' ? Colors.light.background : Colors.light.primary} />
                    <Text style={[styles.locationButtonText, formData.locationType === 'MANUAL' && styles.locationButtonTextActive]}>
                      Saisie manuelle
                    </Text>
                  </Pressable>
                </View>
                <TextInput
                  style={[styles.input, styles.textArea, { minHeight: 80 }, errors.address && styles.inputError]}
                  placeholder="Ex: Cocody Riviera Golf, près de la pharmacie centrale"
                  placeholderTextColor={Colors.light.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={formData.address}
                  onChangeText={(text) => {
                    setFormData({ ...formData, address: text });
                    if (errors.address) setErrors({ ...errors, address: undefined });
                  }}
                />
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Description du bien</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Décrivez votre bien (points forts, équipements, état général...)"
                  placeholderTextColor={Colors.light.textSecondary}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Documents et photos</Text>
              <Text style={styles.stepSubtitle}>
                Ajoutez des documents et photos pour valoriser votre bien
              </Text>

              <View style={styles.infoBox}>
                <FileText size={20} color={Colors.light.primary} />
                <Text style={styles.infoBoxText}>
                  Documents requis : Titre foncier, photos, plans (PDF, JPG, PNG - max 10MB)
                </Text>
              </View>

              <Pressable style={styles.uploadButton} onPress={handleFileUpload}>
                <Upload size={24} color={Colors.light.primary} />
                <View style={styles.uploadButtonContent}>
                  <Text style={styles.uploadButtonTitle}>Télécharger des fichiers</Text>
                  <Text style={styles.uploadButtonSubtitle}>
                    Glissez vos documents ici ou appuyez pour parcourir
                  </Text>
                </View>
              </Pressable>

              {uploadedFiles.length > 0 && (
                <View style={styles.uploadedFiles}>
                  {uploadedFiles.map((file, index) => (
                    <View key={index} style={styles.uploadedFile}>
                      <FileText size={20} color={Colors.light.primary} />
                      <Text style={styles.uploadedFileName}>{file}</Text>
                      <Pressable
                        onPress={() =>
                          setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                        }
                      >
                        <Text style={styles.removeFile}>×</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Résumé de l&apos;annonce</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Titre</Text>
                  <Text style={styles.summaryValue}>{formData.title}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Type de bien</Text>
                  <Text style={styles.summaryValue}>{selectedType}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Transaction</Text>
                  <Text style={styles.summaryValue}>{transactionType}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Prix</Text>
                  <Text style={styles.summaryValue}>
                    {parseInt(formData.price || '0').toLocaleString('fr-FR')} FCFA
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Surface</Text>
                  <Text style={styles.summaryValue}>{formData.surfaceArea} m²</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Statut juridique</Text>
                  <Text style={styles.summaryValue}>{formData.legalStatus}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Localisation</Text>
                  <Text style={styles.summaryValue}>{formData.locationType === 'GPS' ? 'GPS' : 'Manuelle'}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step > 1 && (
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Retour</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.nextButton, step === 1 && styles.nextButtonFull]}
            onPress={step === 3 ? handleSubmit : handleNext}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? 'Publier l&apos;annonce' : 'Suivant'}
            </Text>
          </Pressable>
        </View>
      </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  progressStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepActive: {
    backgroundColor: Colors.light.primary,
  },
  progressStepText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.textSecondary,
  },
  progressStepTextActive: {
    color: Colors.light.background,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.light.border,
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: Colors.light.primary,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    width: '31%',
    aspectRatio: 1,
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
    fontSize: 40,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  transactionTypes: {
    flexDirection: 'row',
    gap: 12,
  },
  transactionType: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  transactionTypeActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.background,
  },
  transactionTypeText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  transactionTypeTextActive: {
    color: Colors.light.primary,
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
    marginTop: 4,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  legalStatusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legalStatusCard: {
    width: '48%',
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  legalStatusCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.background,
  },
  legalStatusLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  legalStatusDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.light.backgroundSecondary,
    marginBottom: 20,
  },
  uploadButtonContent: {
    flex: 1,
  },
  uploadButtonTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  uploadButtonSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  uploadedFiles: {
    gap: 12,
    marginBottom: 20,
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
  },
  uploadedFileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  removeFile: {
    fontSize: 24,
    color: Colors.light.error,
  },
  summaryBox: {
    padding: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    gap: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  restrictedContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  restrictedTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  restrictedMessage: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  restrictedButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  restrictedButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  helperText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  locationActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.background,
  },
  locationButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  locationButtonTextActive: {
    color: Colors.light.background,
  },
});
