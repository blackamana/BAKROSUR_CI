import * as ImagePicker from 'expo-image-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Camera, CheckCircle, FileText, Upload } from 'lucide-react-native';
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
import { PROPERTY_DOCUMENT_REQUIREMENTS, PropertyDocumentType } from '@/constants/verification';
import { useAuth } from '@/contexts/AuthContext';
import { useVerification } from '@/contexts/VerificationContext';

type LegalStatus = 'TF' | 'ACD' | 'ADU' | 'AV';

const LEGAL_STATUS_LABELS: Record<LegalStatus, string> = {
  TF: 'Titre Foncier',
  ACD: 'Arrêté de Concession Définitive',
  ADU: 'Arrêté de Concession d\\u0027Urbanisme',
  AV: 'Attestation Villageoise',
};

export default function PropertyVerificationScreen() {
  const { propertyId } = useLocalSearchParams<{ propertyId?: string }>();
  const { user } = useAuth();
  const { submitPropertyVerification } = useVerification();

  const [legalStatus, setLegalStatus] = useState<LegalStatus>('TF');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuedBy, setIssuedBy] = useState('');
  const [issuedDate, setIssuedDate] = useState('');

  const [selectedDocuments, setSelectedDocuments] = useState<PropertyDocumentType[]>(['TF', 'PHOTOS']);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<PropertyDocumentType, string[]>>({
    TF: [],
    ACD: [],
    ADU: [],
    AV: [],
    PHOTOS: [],
    PLANS: [],
    CADASTRE: [],
    NOTAIRE: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDocument = (docType: PropertyDocumentType) => {
    if (selectedDocuments.includes(docType)) {
      setSelectedDocuments(selectedDocuments.filter(d => d !== docType));
    } else {
      setSelectedDocuments([...selectedDocuments, docType]);
    }
  };

  const pickDocument = async (docType: PropertyDocumentType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: docType === 'PHOTOS',
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map(asset => asset.uri);
      setUploadedDocuments(prev => ({
        ...prev,
        [docType]: [...prev[docType], ...uris],
      }));
    }
  };

  const removeDocument = (docType: PropertyDocumentType, index: number) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [docType]: prev[docType].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!propertyId) {
      Alert.alert('Erreur', 'Aucune propriété sélectionnée');
      return;
    }

    if (!documentNumber) {
      Alert.alert('Erreur', 'Veuillez entrer le numéro du document principal');
      return;
    }

    const requiredDocs = Object.entries(PROPERTY_DOCUMENT_REQUIREMENTS)
      .filter(([_, info]) => info.required)
      .map(([type]) => type as PropertyDocumentType);

    for (const docType of requiredDocs) {
      if (!selectedDocuments.includes(docType) || uploadedDocuments[docType].length === 0) {
        Alert.alert(
          'Documents manquants',
          `Le document "${PROPERTY_DOCUMENT_REQUIREMENTS[docType].label}" est obligatoire`
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const documents = selectedDocuments.map((docType, index) => ({
        id: `${Date.now()}-${index}`,
        type: docType,
        frontImageUri: uploadedDocuments[docType][0],
        uploadedAt: new Date().toISOString(),
        status: 'IN_REVIEW' as const,
      }));

      const result = await submitPropertyVerification({
        propertyId: propertyId,
        ownerId: user?.id || '',
        legalStatus,
        documents,
        ownershipProof: {
          documentType: legalStatus,
          documentNumber,
          issuedBy,
          issuedDate,
        },
        status: 'IN_REVIEW',
      });

      if (result.success) {
        Alert.alert(
          'Demande envoyée',
          'Votre demande de vérification de propriété a été envoyée avec succès. Nous vous contacterons sous 72h.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Erreur', result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Erreur', 'Impossible de soumettre la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Vérification de propriété' }} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Vérification de propriété</Text>
            <Text style={styles.subtitle}>
              Prouvez l\\u0027authenticité de votre bien immobilier
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statut juridique</Text>
            <Text style={styles.sectionDescription}>
              Sélectionnez le type de document de propriété que vous possédez
            </Text>

            <View style={styles.legalStatusContainer}>
              {(Object.keys(LEGAL_STATUS_LABELS) as LegalStatus[]).map((status) => (
                <Pressable
                  key={status}
                  style={[
                    styles.legalStatusButton,
                    legalStatus === status && styles.legalStatusButtonActive,
                  ]}
                  onPress={() => setLegalStatus(status)}
                >
                  <View style={styles.radioOuter}>
                    {legalStatus === status && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.legalStatusInfo}>
                    <Text
                      style={[
                        styles.legalStatusText,
                        legalStatus === status && styles.legalStatusTextActive,
                      ]}
                    >
                      {LEGAL_STATUS_LABELS[status]}
                    </Text>
                    <Text style={styles.legalStatusCode}>({status})</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations du document</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Numéro du document *</Text>
              <TextInput
                style={styles.input}
                value={documentNumber}
                onChangeText={setDocumentNumber}
                placeholder="Ex: TF 12345/2023"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Délivré par</Text>
              <TextInput
                style={styles.input}
                value={issuedBy}
                onChangeText={setIssuedBy}
                placeholder="Ex: Conservation foncière d\\u0027Abidjan"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date de délivrance</Text>
              <TextInput
                style={styles.input}
                value={issuedDate}
                onChangeText={setIssuedDate}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents à fournir</Text>
            <Text style={styles.sectionDescription}>
              Sélectionnez et téléchargez tous les documents disponibles
            </Text>

            <View style={styles.documentsGrid}>
              {(Object.keys(PROPERTY_DOCUMENT_REQUIREMENTS) as PropertyDocumentType[]).map((docType) => {
                const info = PROPERTY_DOCUMENT_REQUIREMENTS[docType];
                const isSelected = selectedDocuments.includes(docType);
                const uploadCount = uploadedDocuments[docType].length;

                return (
                  <View key={docType} style={styles.documentCard}>
                    <Pressable
                      style={[
                        styles.documentSelector,
                        isSelected && styles.documentSelectorActive,
                      ]}
                      onPress={() => toggleDocument(docType)}
                    >
                      <View style={styles.documentHeader}>
                        <View style={styles.checkbox}>
                          {isSelected && <CheckCircle size={20} color={Colors.light.primary} />}
                          {!isSelected && <View style={styles.checkboxEmpty} />}
                        </View>
                        <View style={styles.documentTitleContainer}>
                          <Text style={styles.documentTitle}>{info.label}</Text>
                          {info.required && (
                            <View style={styles.requiredBadge}>
                              <Text style={styles.requiredText}>Obligatoire</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Text style={styles.documentDescription}>{info.description}</Text>
                    </Pressable>

                    {isSelected && (
                      <View style={styles.uploadArea}>
                        <Pressable
                          style={styles.uploadButton}
                          onPress={() => pickDocument(docType)}
                        >
                          <Camera size={20} color={Colors.light.primary} />
                          <Text style={styles.uploadButtonText}>
                            {uploadCount > 0 ? `${uploadCount} fichier(s)` : 'Télécharger'}
                          </Text>
                        </Pressable>

                        {uploadCount > 0 && (
                          <View style={styles.uploadedList}>
                            {uploadedDocuments[docType].map((uri, index) => (
                              <View key={index} style={styles.uploadedItem}>
                                <FileText size={16} color={Colors.light.success} />
                                <Text style={styles.uploadedText}>Document {index + 1}</Text>
                                <Pressable
                                  onPress={() => removeDocument(docType, index)}
                                  hitSlop={8}
                                >
                                  <Text style={styles.removeText}>✕</Text>
                                </Pressable>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.infoBox}>
              <FileText size={24} color={Colors.light.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Pourquoi vérifier ?</Text>
                <Text style={styles.infoText}>
                  La vérification de votre propriété renforce la confiance des acheteurs et
                  augmente vos chances de vendre rapidement. Les annonces vérifiées sont mises
                  en avant sur BAKRÔSUR.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la vérification'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  section: {
    backgroundColor: Colors.light.background,
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  legalStatusContainer: {
    gap: 12,
  },
  legalStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    gap: 12,
  },
  legalStatusButtonActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.primary,
  },
  legalStatusInfo: {
    flex: 1,
  },
  legalStatusText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  legalStatusTextActive: {
    color: Colors.light.primary,
  },
  legalStatusCode: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  documentsGrid: {
    gap: 16,
  },
  documentCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  documentSelector: {
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  documentSelectorActive: {
    backgroundColor: Colors.light.primary + '05',
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  documentTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  requiredBadge: {
    backgroundColor: Colors.light.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  requiredText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.error,
  },
  documentDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  uploadArea: {
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.background,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  uploadedList: {
    marginTop: 12,
    gap: 8,
  },
  uploadedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.success + '10',
    borderRadius: 8,
  },
  uploadedText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.text,
  },
  removeText: {
    fontSize: 18,
    color: Colors.light.error,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
});
