import { router, Stack } from 'expo-router';
import { AlertCircle, LogIn } from 'lucide-react-native';
import { useEffect, useState } from 'react';
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
import { WORK_TYPES, WorkType, WorkUrgency } from '@/constants/construction-works';
import { useAuth } from '@/contexts/AuthContext';
import CityAutocomplete from '@/components/CityAutocomplete';
import NeighborhoodAutocomplete from '@/components/NeighborhoodAutocomplete';

const URGENCY_OPTIONS: { value: WorkUrgency; label: string; color: string }[] = [
  { value: 'URGENTE', label: 'Urgent', color: '#dc2626' },
  { value: 'NORMALE', label: 'Normal', color: '#3b82f6' },
  { value: 'PLANIFIEE', label: 'Planifié', color: '#10b981' },
];

export default function PostConstructionWorkScreen() {
  const { isAuthenticated, user } = useAuth();
  const [workType, setWorkType] = useState<WorkType | null>(null);
  const [urgency, setUrgency] = useState<WorkUrgency>('NORMALE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [cityId, setCityId] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔒 PROTECTION: Vérifier la connexion dès l'entrée sur la page
  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log('[PostWork] User not authenticated, redirecting...');
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour déposer une annonce de travaux',
        [
          { 
            text: 'Annuler', 
            onPress: () => router.back(),
            style: 'cancel' 
          },
          { 
            text: 'Se connecter', 
            onPress: () => router.push('/auth/login' as any) 
          },
        ],
        { cancelable: false }
      );
    }
  }, [isAuthenticated, user]);

  // 🔒 PROTECTION: Afficher un écran de blocage si pas connecté
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Déposer une annonce',
            headerShown: true,
          }}
        />
        <View style={styles.blockedContainer}>
          <View style={styles.blockedIcon}>
            <LogIn size={64} color={Colors.light.primary} />
          </View>
          
          <Text style={styles.blockedTitle}>Connexion requise</Text>
          
          <Text style={styles.blockedMessage}>
            Vous devez être connecté pour déposer une annonce de travaux.
          </Text>

          <Text style={styles.blockedSubMessage}>
            Connectez-vous pour accéder à cette fonctionnalité et publier vos demandes de travaux.
          </Text>

          <View style={styles.blockedButtons}>
            <Pressable 
              style={styles.loginButton}
              onPress={() => router.push('/auth/login' as any)}
            >
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </Pressable>

            <Pressable 
              style={styles.signupButton}
              onPress={() => router.push('/auth/signup' as any)}
            >
              <Text style={styles.signupButtonText}>Créer un compte</Text>
            </Pressable>

            <Pressable 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Retour</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const handleSubmit = () => {
    // Double vérification au moment de la soumission
    if (!isAuthenticated || !user) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour déposer une annonce',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/auth/login' as any) },
        ]
      );
      return;
    }

    // Validation
    const newErrors: Record<string, string> = {};

    if (!workType) {
      newErrors.workType = 'Veuillez sélectionner un type de travaux';
    }

    if (!title || title.trim().length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!description || description.trim().length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    }

    if (!budget || parseFloat(budget.replace(/\s/g, '')) <= 0) {
      newErrors.budget = 'Veuillez indiquer un budget minimum';
    }

    if (!cityId) {
      newErrors.cityId = 'Veuillez sélectionner une ville';
    }

    if (!contactPhone || contactPhone.trim().length < 10) {
      newErrors.contactPhone = 'Veuillez indiquer un numéro de téléphone valide';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Formulaire incomplet', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Soumission
    console.log('Submitting work request:', {
      workType,
      urgency,
      title,
      description,
      budget,
      budgetMax,
      cityId,
      neighborhoodId,
      startDate,
      contactName,
      contactPhone,
      userId: user.id,
    });

    Alert.alert(
      'Demande enregistrée',
      'Votre annonce de travaux a été publiée avec succès',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Déposer une annonce',
          headerShown: true,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nouvelle demande de travaux</Text>
          <Text style={styles.headerSubtitle}>
            Décrivez vos besoins et recevez des devis de professionnels qualifiés
          </Text>
        </View>

        {/* Type de travaux */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type de travaux *</Text>
          <View style={styles.typeGrid}>
            {WORK_TYPES.map((type) => (
              <Pressable
                key={type.value}
                style={[
                  styles.typeCard,
                  workType === type.value && styles.typeCardActive,
                  errors.workType && styles.typeCardError,
                ]}
                onPress={() => {
                  console.log('Selected work type:', type.value);
                  setWorkType(type.value);
                  setErrors((prev) => ({ ...prev, workType: '' }));
                }}
              >
                <Text style={styles.typeIcon}>{type.emoji}</Text>
                <Text style={[
                  styles.typeLabel,
                  workType === type.value && styles.typeLabelActive,
                ]}>
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
          {errors.workType && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={Colors.light.error} />
              <Text style={styles.errorText}>{errors.workType}</Text>
            </View>
          )}
        </View>

        {/* Urgence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Urgence</Text>
          <View style={styles.urgencyRow}>
            {URGENCY_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.urgencyChip,
                  urgency === option.value && {
                    backgroundColor: option.color,
                    borderColor: option.color,
                  },
                ]}
                onPress={() => setUrgency(option.value)}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    urgency === option.value && styles.urgencyTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Titre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Titre de l'annonce *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Ex: Rénovation salle de bain complète"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setErrors((prev) => ({ ...prev, title: '' }));
            }}
            placeholderTextColor={Colors.light.textSecondary}
          />
          {errors.title && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={Colors.light.error} />
              <Text style={styles.errorText}>{errors.title}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description détaillée *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Décrivez en détail les travaux à réaliser, l'état actuel, vos attentes..."
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors((prev) => ({ ...prev, description: '' }));
            }}
            multiline
            numberOfLines={6}
            placeholderTextColor={Colors.light.textSecondary}
          />
          <Text style={styles.characterCount}>{description.length} / 500 caractères</Text>
          {errors.description && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={Colors.light.error} />
              <Text style={styles.errorText}>{errors.description}</Text>
            </View>
          )}
        </View>

        {/* Budget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget (FCFA) *</Text>
          <View style={styles.budgetRow}>
            <View style={styles.budgetInput}>
              <Text style={styles.budgetLabel}>Minimum</Text>
              <TextInput
                style={[styles.input, errors.budget && styles.inputError]}
                placeholder="500 000"
                value={budget}
                onChangeText={(text) => {
                  setBudget(text);
                  setErrors((prev) => ({ ...prev, budget: '' }));
                }}
                keyboardType="numeric"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>
            <View style={styles.budgetInput}>
              <Text style={styles.budgetLabel}>Maximum (optionnel)</Text>
              <TextInput
                style={styles.input}
                placeholder="1 000 000"
                value={budgetMax}
                onChangeText={setBudgetMax}
                keyboardType="numeric"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>
          </View>
          {errors.budget && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={Colors.light.error} />
              <Text style={styles.errorText}>{errors.budget}</Text>
            </View>
          )}
        </View>

        {/* Localisation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localisation *</Text>
          <CityAutocomplete
            value={cityId}
            onChange={(id) => {
              setCityId(id);
              setErrors((prev) => ({ ...prev, cityId: '' }));
            }}
            error={errors.cityId}
          />
          {cityId && (
            <View style={styles.neighborhoodContainer}>
              <NeighborhoodAutocomplete
                cityId={cityId}
                value={neighborhoodId}
                onChange={setNeighborhoodId}
              />
            </View>
          )}
        </View>

        {/* Date de début souhaitée */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date de début souhaitée</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dès que possible, Janvier 2025..."
            value={startDate}
            onChangeText={setStartDate}
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom du contact (optionnel)"
            value={contactName}
            onChangeText={setContactName}
            placeholderTextColor={Colors.light.textSecondary}
          />
          <View style={{ height: 12 }} />
          <TextInput
            style={[styles.input, errors.contactPhone && styles.inputError]}
            placeholder="Téléphone *"
            value={contactPhone}
            onChangeText={(text) => {
              setContactPhone(text);
              setErrors((prev) => ({ ...prev, contactPhone: '' }));
            }}
            keyboardType="phone-pad"
            placeholderTextColor={Colors.light.textSecondary}
          />
          {errors.contactPhone && (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={Colors.light.error} />
              <Text style={styles.errorText}>{errors.contactPhone}</Text>
            </View>
          )}
        </View>

        {/* Information utilisateur connecté */}
        <View style={styles.userInfoBox}>
          <Text style={styles.userInfoTitle}>✓ Publié par</Text>
          <Text style={styles.userInfoText}>{user.name}</Text>
          <Text style={styles.userInfoEmail}>{user.email}</Text>
        </View>

        {/* Bouton de soumission */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Publier la demande</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '30%',
    minHeight: 100,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  typeCardActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  typeCardError: {
    borderColor: Colors.light.error + '50',
  },
  typeIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: '#ffffff',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  urgencyTextActive: {
    color: Colors.light.background,
  },
  input: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  textArea: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  characterCount: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetInput: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  neighborhoodContainer: {
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.background,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: Colors.light.error,
  },
  userInfoBox: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  userInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  userInfoEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  // 🔒 Styles pour l'écran de blocage
  blockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  blockedIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  blockedTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  blockedMessage: {
    fontSize: 17,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  blockedSubMessage: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  blockedButtons: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.background,
  },
  signupButton: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  signupButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  backButton: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.text,
  },
});
