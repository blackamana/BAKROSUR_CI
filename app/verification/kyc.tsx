import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import { AlertCircle, Camera, CheckCircle, Upload } from 'lucide-react-native';
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

import CityAutocomplete from '@/components/CityAutocomplete';
import NeighborhoodAutocomplete from '@/components/NeighborhoodAutocomplete';
import { CITIES } from '@/constants/cities';
import { NEIGHBORHOODS } from '@/constants/neighborhoods';
import Colors from '@/constants/colors';
import { DOCUMENT_REQUIREMENTS, DocumentType } from '@/constants/verification';
import { useAuth } from '@/contexts/AuthContext';
import { useVerification } from '@/contexts/VerificationContext';

type ProfileType = 'particulier' | 'professionnel' | 'intervenant';

export default function KYCVerificationScreen() {
  const { user } = useAuth();
  const { kycData, submitKYC } = useVerification();

  const [profileType, setProfileType] = useState<ProfileType>('particulier');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [companyName, setCompanyName] = useState('');
  const [rccm, setRccm] = useState('');
  const [activityType, setActivityType] = useState('');
  const [profession, setProfession] = useState('');
  const [agrementNumber, setAgrementNumber] = useState('');
  const [cabinet, setCabinet] = useState('');

  const [street, setStreet] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState('');
  const [selectedNeighborhoodName, setSelectedNeighborhoodName] = useState('');

  const [documentType, setDocumentType] = useState<DocumentType>('CNI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [frontImageUri, setFrontImageUri] = useState<string | undefined>(undefined);
  const [backImageUri, setBackImageUri] = useState<string | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async (side: 'front' | 'back') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (side === 'front') {
        setFrontImageUri(result.assets[0].uri);
      } else {
        setBackImageUri(result.assets[0].uri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !phoneNumber) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!selectedCityId || !selectedNeighborhoodId) {
      Alert.alert('Erreur', 'Veuillez sélectionner votre ville et quartier');
      return;
    }

    if (!frontImageUri) {
      Alert.alert('Erreur', 'Veuillez télécharger une photo de votre document d\'identité');
      return;
    }

    const requiresBack = DOCUMENT_REQUIREMENTS[documentType].requiresBack;
    if (requiresBack && !backImageUri) {
      Alert.alert('Erreur', 'Veuillez télécharger le verso de votre document');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitKYC({
        userId: user?.id || '',
        profileType,
        personalInfo: {
          firstName,
          lastName,
          dateOfBirth,
          nationality,
          phoneNumber,
          email,
        },
        professionalInfo: profileType !== 'particulier' ? {
          companyName,
          rccm,
          activityType,
          profession,
          agrementNumber,
          cabinet,
        } : undefined,
        address: {
          street,
          cityId: selectedCityId,
          cityName: selectedCityName,
          neighborhoodId: selectedNeighborhoodId,
          neighborhoodName: selectedNeighborhoodName,
        },
        documents: [
          {
            id: Date.now().toString(),
            type: documentType,
            frontImageUri,
            backImageUri,
            documentNumber,
            expiryDate,
            uploadedAt: new Date().toISOString(),
            status: 'IN_REVIEW',
          },
        ],
        status: 'IN_REVIEW',
      });

      if (result.success) {
        Alert.alert(
          'Demande envoyée',
          'Votre demande de vérification a été envoyée avec succès. Nous vous contacterons sous 48h.',
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

  if (kycData && kycData.status !== 'REJECTED') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Vérification KYC' }} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusIcon,
              kycData.status === 'APPROVED' ? styles.statusIconApproved : styles.statusIconPending,
            ]}>
              {kycData.status === 'APPROVED' ? (
                <CheckCircle size={48} color={Colors.light.success} />
              ) : (
                <AlertCircle size={48} color={Colors.light.warning} />
              )}
            </View>
            
            <Text style={styles.statusTitle}>
              {kycData.status === 'APPROVED' ? 'Compte vérifié' : 'Vérification en cours'}
            </Text>
            
            <Text style={styles.statusDescription}>
              {kycData.status === 'APPROVED'
                ? 'Votre compte a été vérifié avec succès. Vous pouvez maintenant publier des annonces.'
                : 'Votre demande de vérification est en cours de traitement. Nous vous contacterons sous 48h.'}
            </Text>

            {kycData.submittedAt && (
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Date de soumission</Text>
                <Text style={styles.infoValue}>
                  {new Date(kycData.submittedAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            )}

            {kycData.notes && (
              <View style={styles.noteCard}>
                <Text style={styles.noteLabel}>Notes</Text>
                <Text style={styles.noteText}>{kycData.notes}</Text>
              </View>
            )}

            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Retour</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Vérification KYC' }} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Vérification d'identité</Text>
            <Text style={styles.subtitle}>
              Complétez votre profil pour publier des annonces
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type de profil</Text>
            <View style={styles.profileTypeContainer}>
              {(['particulier', 'professionnel', 'intervenant'] as ProfileType[]).map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.profileTypeButton,
                    profileType === type && styles.profileTypeButtonActive,
                  ]}
                  onPress={() => setProfileType(type)}
                >
                  <Text
                    style={[
                      styles.profileTypeText,
                      profileType === type && styles.profileTypeTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Entrez votre prénom"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Entrez votre nom"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date de naissance</Text>
              <TextInput
                style={styles.input}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nationalité</Text>
              <TextInput
                style={styles.input}
                value={nationality}
                onChangeText={setNationality}
                placeholder="Ivoirienne"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Téléphone *</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+225 XX XX XX XX XX"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {profileType !== 'particulier' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {profileType === 'professionnel' ? 'Informations professionnelles' : 'Informations intervenant'}
              </Text>

              {profileType === 'professionnel' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nom de l'entreprise</Text>
                    <TextInput
                      style={styles.input}
                      value={companyName}
                      onChangeText={setCompanyName}
                      placeholder="Nom de votre entreprise"
                      placeholderTextColor={Colors.light.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>RCCM</Text>
                    <TextInput
                      style={styles.input}
                      value={rccm}
                      onChangeText={setRccm}
                      placeholder="Numéro RCCM"
                      placeholderTextColor={Colors.light.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Type d'activité</Text>
                    <TextInput
                      style={styles.input}
                      value={activityType}
                      onChangeText={setActivityType}
                      placeholder="Promoteur immobilier, Agent, etc."
                      placeholderTextColor={Colors.light.textSecondary}
                    />
                  </View>
                </>
              )}

              {profileType === 'intervenant' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Profession</Text>
                    <TextInput
                      style={styles.input}
                      value={profession}
                      onChangeText={setProfession}
                      placeholder="Notaire, Géomètre, Architecte, etc."
                      placeholderTextColor={Colors.light.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Numéro d'agrément</Text>
                    <TextInput
                      style={styles.input}
                      value={agrementNumber}
                      onChangeText={setAgrementNumber}
                      placeholder="Numéro d\u0027agrément"
                      placeholderTextColor={Colors.light.textSecondary}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cabinet</Text>
                    <TextInput
                      style={styles.input}
                      value={cabinet}
                      onChangeText={setCabinet}
                      placeholder="Nom du cabinet"
                      placeholderTextColor={Colors.light.textSecondary}
                    />
                  </View>
                </>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adresse</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rue/Numéro</Text>
              <TextInput
                style={styles.input}
                value={street}
                onChangeText={setStreet}
                placeholder="Ex: Rue des Jardins, Lot 123"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ville *</Text>
              <CityAutocomplete
                value={selectedCityId || null}
                onChange={(cityId) => {
                  if (cityId) {
                    const city = CITIES.find(c => c.id === cityId);
                    if (city) {
                      setSelectedCityId(city.id);
                      setSelectedCityName(city.name);
                      setSelectedNeighborhoodId('');
                      setSelectedNeighborhoodName('');
                    }
                  } else {
                    setSelectedCityId('');
                    setSelectedCityName('');
                    setSelectedNeighborhoodId('');
                    setSelectedNeighborhoodName('');
                  }
                }}
              />
            </View>

            {selectedCityId && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quartier *</Text>
                <NeighborhoodAutocomplete
                  value={selectedNeighborhoodId || null}
                  cityId={selectedCityId || null}
                  onChange={(neighborhoodId) => {
                    if (neighborhoodId) {
                      const neighborhood = NEIGHBORHOODS.find(n => n.id === neighborhoodId);
                      if (neighborhood) {
                        setSelectedNeighborhoodId(neighborhood.id);
                        setSelectedNeighborhoodName(neighborhood.name);
                      }
                    } else {
                      setSelectedNeighborhoodId('');
                      setSelectedNeighborhoodName('');
                    }
                  }}
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document d'identité</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type de document</Text>
              <View style={styles.documentTypeContainer}>
                {(Object.keys(DOCUMENT_REQUIREMENTS) as DocumentType[]).map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.documentTypeButton,
                      documentType === type && styles.documentTypeButtonActive,
                    ]}
                    onPress={() => setDocumentType(type)}
                  >
                    <Text
                      style={[
                        styles.documentTypeText,
                        documentType === type && styles.documentTypeTextActive,
                      ]}
                    >
                      {DOCUMENT_REQUIREMENTS[type].label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Numéro du document</Text>
              <TextInput
                style={styles.input}
                value={documentNumber}
                onChangeText={setDocumentNumber}
                placeholder="Numéro"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>

            {DOCUMENT_REQUIREMENTS[documentType].expiryRequired && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date d\u0027expiration</Text>
                <TextInput
                  style={styles.input}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="JJ/MM/AAAA"
                  placeholderTextColor={Colors.light.textSecondary}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Photo du document (recto) *</Text>
              <Pressable
                style={[styles.uploadButton, frontImageUri && styles.uploadButtonSuccess]}
                onPress={() => pickImage('front')}
              >
                {frontImageUri ? (
                  <>
                    <CheckCircle size={24} color={Colors.light.success} />
                    <Text style={styles.uploadButtonSuccessText}>Image ajoutée</Text>
                  </>
                ) : (
                  <>
                    <Camera size={24} color={Colors.light.primary} />
                    <Text style={styles.uploadButtonText}>Télécharger</Text>
                  </>
                )}
              </Pressable>
            </View>

            {DOCUMENT_REQUIREMENTS[documentType].requiresBack && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Photo du document (verso) *</Text>
                <Pressable
                  style={[styles.uploadButton, backImageUri && styles.uploadButtonSuccess]}
                  onPress={() => pickImage('back')}
                >
                  {backImageUri ? (
                    <>
                      <CheckCircle size={24} color={Colors.light.success} />
                      <Text style={styles.uploadButtonSuccessText}>Image ajoutée</Text>
                    </>
                  ) : (
                    <>
                      <Upload size={24} color={Colors.light.primary} />
                      <Text style={styles.uploadButtonText}>Télécharger</Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
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
    marginBottom: 20,
  },
  profileTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  profileTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
  },
  profileTypeButtonActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  profileTypeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  profileTypeTextActive: {
    color: Colors.light.primary,
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
  documentTypeContainer: {
    gap: 12,
  },
  documentTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  documentTypeButtonActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  documentTypeText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  documentTypeTextActive: {
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
    backgroundColor: Colors.light.background,
  },
  uploadButtonSuccess: {
    borderColor: Colors.light.success,
    borderStyle: 'solid',
    backgroundColor: Colors.light.success + '10',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  uploadButtonSuccessText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.success,
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
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  statusIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statusIconApproved: {
    backgroundColor: Colors.light.success + '20',
  },
  statusIconPending: {
    backgroundColor: Colors.light.warning + '20',
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  noteCard: {
    width: '100%',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
});
