import { router, Stack } from 'expo-router';
import { Building2, Scale, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
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
import { useAuth } from '@/contexts/AuthContext';

type ProfileType = 'particulier' | 'professionnel' | 'intervenant';

const PROFILE_TYPES = [
  {
    type: 'particulier' as ProfileType,
    icon: UserPlus,
    title: 'Particulier',
    description: 'Acheteur, vendeur, locataire ou propriétaire',
    validation: 'Validation 24-48h',
  },
  {
    type: 'professionnel' as ProfileType,
    icon: Building2,
    title: 'Professionnel',
    description: 'Agence, promoteur',
    validation: 'Validation 3-7 jours',
  },
  {
    type: 'intervenant' as ProfileType,
    icon: Scale,
    title: 'Intervenant Juridique',
    description: 'Notaire, avocat, huissier, géomètre, expert immobilier',
    validation: 'Validation 5-10 jours',
  },
];

export default function SignupScreen() {
  const { signup, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [companyName, setCompanyName] = useState('');
  const [activityType, setActivityType] = useState('');
  const [rccm, setRccm] = useState('');
  
  const [profession, setProfession] = useState('');
  const [agrementNumber, setAgrementNumber] = useState('');
  const [cabinet, setCabinet] = useState('');

  // 🆕 États pour intervenants
  const [intervenantType, setIntervenantType] = useState('');
  const [chambreInscription, setChambreInscription] = useState('');
  const [numeroInscription, setNumeroInscription] = useState('');
  const [assuranceRCPro, setAssuranceRCPro] = useState('');
    
  const [cityId, setCityId] = useState<string | null>(null);
  const [neighborhoodId, setNeighborhoodId] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [isBailleur, setIsBailleur] = useState(false);
  
  const [errors, setErrors] = useState<{
    name?: string;
    firstName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    companyName?: string;
    activityType?: string;
    rccm?: string;
    profession?: string;
    agrementNumber?: string;
    cityId?: string;
    neighborhoodId?: string;
    intervenantType?: string;        // 🆕
    chambreInscription?: string;      // 🆕
    numeroInscription?: string;       // 🆕
    assuranceRCPro?: string;          // 🆕
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (profileType === 'particulier') {
      if (!firstName.trim()) {
        newErrors.firstName = 'Prénom requis';
      }
    }
    
    if (profileType === 'professionnel') {
      if (!companyName.trim()) {
        newErrors.companyName = 'Raison sociale requise';
      }
      if (!activityType.trim()) {
        newErrors.activityType = 'Type d&apos;activité requis';
      }
      if (!rccm.trim()) {
        newErrors.rccm = 'Numéro RCCM requis';
      }
    }
    
    if (profileType === 'intervenant') {
      if (!profession.trim()) {
        newErrors.profession = 'Profession requise';
      }
      if (!agrementNumber.trim()) {
        newErrors.agrementNumber = 'Numéro d&apos;agrément requis';
      }
    }
    
    // 🆕 Validation des nouveaux champs intervenants
    if (profileType === 'intervenant') {
      if (!intervenantType) {
        newErrors.intervenantType = "Type d'intervenant requis";
      }
      if (!chambreInscription.trim()) {
        newErrors.chambreInscription = 'Chambre/Ordre requis';
      }
      if (!numeroInscription.trim()) {
        newErrors.numeroInscription = "Numéro d'inscription requis";
      }
      if (!assuranceRCPro.trim()) {
        newErrors.assuranceRCPro = 'Assurance RC Pro requise';
      }
    }

    if (!name.trim()) {
      newErrors.name = 'Nom requis';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Minimum 2 caractères';
    }

    if (!email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (phone && !/^\+?[0-9]{8,15}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro invalide';
    }

    if (!password) {
      newErrors.password = 'Mot de passe requis';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mots de passe différents';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !profileType) {
      Alert.alert('Erreur', 'Veuillez sélectionner un profil');
      return;
    }
    if (step === 2 && !validate()) return;
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSignup = async () => {
    if (!validate()) return;

    // 🆕 Préparer les données selon le profil
    let profileData: any = {
      type_profil: profileType,
      prenom: firstName,
      ville_id: cityId,
      quartier_id: neighborhoodId,
      adresse: address,
      est_bailleur: isBailleur,
    };

    // Données spécifiques professionnel
    if (profileType === 'professionnel') {
      profileData = {
        ...profileData,
        nom_entreprise: companyName,
        type_activite: activityType,
        rccm: rccm,
      };
    }

    // 🆕 Données spécifiques intervenant
    if (profileType === 'intervenant') {
      profileData = {
        ...profileData,
        profession: profession,
        numero_agrement: agrementNumber,
        cabinet: cabinet,
        type_intervenant: intervenantType,
        chambre_inscription: chambreInscription,
        numero_inscription: numeroInscription,
        assurance_rc_pro: assuranceRCPro,
      };
    }

    // 🆕 Appel avec profileData
    const result = await signup(email, password, name, phone || undefined, isBailleur, profileData);
    
    if (result.success) {
      Alert.alert(
        'Inscription réussie',
        `Votre compte ${profileType}${isBailleur && profileType === 'particulier' ? ' (bailleur)' : ''} a été créé avec succès ! Il sera validé sous ${PROFILE_TYPES.find(p => p.type === profileType)?.validation}.`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } else {
      Alert.alert('Erreur', result.error || 'Inscription échouée');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Inscription',
          headerBackTitle: 'Retour',
        }}
      />

      <View style={styles.container}>
        <View style={styles.progressBar}>
          <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
          <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
          <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
          <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {step === 1 && (
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>Choisissez votre profil</Text>
                  <Text style={styles.subtitle}>
                    Sélectionnez le type de compte qui correspond à votre situation
                  </Text>
                </View>

                <View style={styles.profileGrid}>
                  {PROFILE_TYPES.map((profile) => {
                    const Icon = profile.icon;
                    return (
                      <Pressable
                        key={profile.type}
                        style={[
                          styles.profileCard,
                          profileType === profile.type && styles.profileCardActive,
                        ]}
                        onPress={() => setProfileType(profile.type)}
                      >
                        <View style={styles.profileIconContainer}>
                          <Icon size={32} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.profileTitle}>{profile.title}</Text>
                        <Text style={styles.profileDescription}>{profile.description}</Text>
                        <View style={styles.profileBadge}>
                          <Text style={styles.profileBadgeText}>{profile.validation}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>Informations {profileType === 'particulier' ? 'personnelles' : 'professionnelles'}</Text>
                  <Text style={styles.subtitle}>
                    Renseignez vos informations
                  </Text>
                </View>

                <View style={styles.form}>
                  {profileType === 'particulier' && (
                    <>
                      <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.halfWidth]}>
                          <Text style={styles.label}>Nom *</Text>
                          <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            placeholder="Kouassi"
                            placeholderTextColor={Colors.light.textSecondary}
                            value={name}
                            onChangeText={(text) => {
                              setName(text);
                              if (errors.name) setErrors({ ...errors, name: undefined });
                            }}
                            autoCapitalize="words"
                            editable={!isLoading}
                          />
                          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>

                        <View style={[styles.inputGroup, styles.halfWidth]}>
                          <Text style={styles.label}>Prénoms *</Text>
                          <TextInput
                            style={[styles.input, errors.firstName && styles.inputError]}
                            placeholder="Jean"
                            placeholderTextColor={Colors.light.textSecondary}
                            value={firstName}
                            onChangeText={(text) => {
                              setFirstName(text);
                              if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                            }}
                            autoCapitalize="words"
                            editable={!isLoading}
                          />
                          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                        </View>
                      </View>
                    </>
                  )}

                  {profileType === 'professionnel' && (
                    <>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Raison sociale *</Text>
                        <TextInput
                          style={[styles.input, errors.companyName && styles.inputError]}
                          placeholder="Nom de l&apos;entreprise"
                          placeholderTextColor={Colors.light.textSecondary}
                          value={companyName}
                          onChangeText={(text) => {
                            setCompanyName(text);
                            if (errors.companyName) setErrors({ ...errors, companyName: undefined });
                          }}
                          editable={!isLoading}
                        />
                        {errors.companyName && <Text style={styles.errorText}>{errors.companyName}</Text>}
                      </View>

                      <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.halfWidth]}>
                          <Text style={styles.label}>Type d&apos;activité *</Text>
                          <TextInput
                            style={[styles.input, errors.activityType && styles.inputError]}
                            placeholder="Agence, Promoteur..."
                            placeholderTextColor={Colors.light.textSecondary}
                            value={activityType}
                            onChangeText={(text) => {
                              setActivityType(text);
                              if (errors.activityType) setErrors({ ...errors, activityType: undefined });
                            }}
                            editable={!isLoading}
                          />
                          {errors.activityType && <Text style={styles.errorText}>{errors.activityType}</Text>}
                        </View>

                        <View style={[styles.inputGroup, styles.halfWidth]}>
                          <Text style={styles.label}>Numéro RCCM *</Text>
                          <TextInput
                            style={[styles.input, errors.rccm && styles.inputError]}
                            placeholder="RCCM..."
                            placeholderTextColor={Colors.light.textSecondary}
                            value={rccm}
                            onChangeText={(text) => {
                              setRccm(text);
                              if (errors.rccm) setErrors({ ...errors, rccm: undefined });
                            }}
                            editable={!isLoading}
                          />
                          {errors.rccm && <Text style={styles.errorText}>{errors.rccm}</Text>}
                        </View>
                      </View>
                    </>
                  )}

                  {profileType === 'intervenant' && (
                    <>
                      <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.halfWidth]}>
                          <Text style={styles.label}>Profession *</Text>
                          <TextInput
                            style={[styles.input, errors.profession && styles.inputError]}
                            placeholder="Notaire, Expert..."
                            placeholderTextColor={Colors.light.textSecondary}
                            value={profession}
                            onChangeText={(text) => {
                              setProfession(text);
                              if (errors.profession) setErrors({ ...errors, profession: undefined });
                            }}
                            editable={!isLoading}
                          />
                          {errors.profession && <Text style={styles.errorText}>{errors.profession}</Text>}
                        </View>

                        <View style={[styles.inputGroup, styles.halfWidth]}>
                          <Text style={styles.label}>Numéro d&apos;agrément *</Text>
                          <TextInput
                            style={[styles.input, errors.agrementNumber && styles.inputError]}
                            placeholder="N° agrément"
                            placeholderTextColor={Colors.light.textSecondary}
                            value={agrementNumber}
                            onChangeText={(text) => {
                              setAgrementNumber(text);
                              if (errors.agrementNumber) setErrors({ ...errors, agrementNumber: undefined });
                            }}
                            editable={!isLoading}
                          />
                          {errors.agrementNumber && <Text style={styles.errorText}>{errors.agrementNumber}</Text>}
                        </View>
                      </View>

                      <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.halfWidth]}>
                          <Text style={styles.label}>Nom complet *</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Votre nom"
                            placeholderTextColor={Colors.light.textSecondary}
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            editable={!isLoading}
                          />
                        </View>

                        <View style={[styles.inputGroup, styles.halfWidth]}>
                          <Text style={styles.label}>Cabinet / Structure</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Optionnel"
                            placeholderTextColor={Colors.light.textSecondary}
                            value={cabinet}
                            onChangeText={setCabinet}
                            editable={!isLoading}
                          />
                        </View>
                      </View>

                      {/* 🆕 Type d'intervenant */}
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Type d'intervenant *</Text>
                        <View style={styles.intervenantTypeGrid}>
                          {[
                            { value: 'NOTAIRE', label: 'Notaire', icon: '⚖️' },
                            { value: 'AVOCAT', label: 'Avocat', icon: '👨‍⚖️' },
                            { value: 'HUISSIER', label: 'Huissier', icon: '📋' },
                            { value: 'GEOMETRE', label: 'Géomètre', icon: '📐' },
                            { value: 'EXPERT', label: 'Expert', icon: '💎' },
                          ].map((type) => (
                            <Pressable
                              key={type.value}
                              style={[
                                styles.intervenantTypeCard,
                                intervenantType === type.value && styles.intervenantTypeCardActive,
                              ]}
                              onPress={() => {
                                setIntervenantType(type.value);
                                setErrors({ ...errors, intervenantType: undefined });
                              }}
                            >
                              <Text style={styles.intervenantTypeIcon}>{type.icon}</Text>
                              <Text style={[
                                styles.intervenantTypeLabel,
                                intervenantType === type.value && styles.intervenantTypeLabelActive
                              ]}>
                                {type.label}
                              </Text>
                            </Pressable>
                          ))}
                        </View>
                        {errors.intervenantType && (
                          <Text style={styles.errorText}>{errors.intervenantType}</Text>
                        )}
                      </View>

                      {/* 🆕 Chambre d'inscription */}
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Chambre/Ordre d'inscription *</Text>
                        <TextInput
                          style={[styles.input, errors.chambreInscription && styles.inputError]}
                          placeholder="Ex: Chambre des Notaires de Côte d'Ivoire"
                          placeholderTextColor={Colors.light.textSecondary}
                          value={chambreInscription}
                          onChangeText={(text) => {
                            setChambreInscription(text);
                            setErrors({ ...errors, chambreInscription: undefined });
                          }}
                        />
                        {errors.chambreInscription && (
                          <Text style={styles.errorText}>{errors.chambreInscription}</Text>
                        )}
                      </View>

                      {/* 🆕 Numéro d'inscription */}
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Numéro d'inscription *</Text>
                        <TextInput
                          style={[styles.input, errors.numeroInscription && styles.inputError]}
                          placeholder="Ex: Barreau d'Abidjan - N°12345"
                          placeholderTextColor={Colors.light.textSecondary}
                          value={numeroInscription}
                          onChangeText={(text) => {
                            setNumeroInscription(text);
                            setErrors({ ...errors, numeroInscription: undefined });
                          }}
                        />
                        {errors.numeroInscription && (
                          <Text style={styles.errorText}>{errors.numeroInscription}</Text>
                        )}
                      </View>

                      {/* 🆕 Assurance RC Pro */}
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Assurance RC Professionnelle *</Text>
                        <TextInput
                          style={[styles.input, errors.assuranceRCPro && styles.inputError]}
                          placeholder="Numéro de police d'assurance"
                          placeholderTextColor={Colors.light.textSecondary}
                          value={assuranceRCPro}
                          onChangeText={(text) => {
                            setAssuranceRCPro(text);
                            setErrors({ ...errors, assuranceRCPro: undefined });
                          }}
                        />
                        {errors.assuranceRCPro && (
                          <Text style={styles.errorText}>{errors.assuranceRCPro}</Text>
                        )}
                      </View>
                    </>
                  )}

                  {profileType === 'professionnel' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Nom complet *</Text>
                      <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        placeholder="Votre nom"
                        placeholderTextColor={Colors.light.textSecondary}
                        value={name}
                        onChangeText={(text) => {
                          setName(text);
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        autoCapitalize="words"
                        editable={!isLoading}
                      />
                      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>
                  )}

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.label}>Email *</Text>
                      <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder="exemple@email.com"
                        placeholderTextColor={Colors.light.textSecondary}
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        editable={!isLoading}
                      />
                      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.label}>Téléphone *</Text>
                      <TextInput
                        style={[styles.input, errors.phone && styles.inputError]}
                        placeholder="+225 07 00 00 00 00"
                        placeholderTextColor={Colors.light.textSecondary}
                        value={phone}
                        onChangeText={(text) => {
                          setPhone(text);
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        editable={!isLoading}
                      />
                      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.label}>Mot de passe *</Text>
                      <TextInput
                        style={[styles.input, errors.password && styles.inputError]}
                        placeholder="••••••••"
                        placeholderTextColor={Colors.light.textSecondary}
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="password-new"
                        editable={!isLoading}
                      />
                      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <View style={[styles.inputGroup, styles.halfWidth]}>
                      <Text style={styles.label}>Confirmer *</Text>
                      <TextInput
                        style={[styles.input, errors.confirmPassword && styles.inputError]}
                        placeholder="••••••••"
                        placeholderTextColor={Colors.light.textSecondary}
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          if (errors.confirmPassword)
                            setErrors({ ...errors, confirmPassword: undefined });
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="password-new"
                        editable={!isLoading}
                      />
                      {errors.confirmPassword && (
                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                      )}
                    </View>
                  </View>

                  {profileType === 'particulier' && (
                    <View style={styles.bailleurSection}>
                      <Pressable 
                        style={styles.checkboxContainer}
                        onPress={() => setIsBailleur(!isBailleur)}
                      >
                        <View style={[styles.checkbox, isBailleur && styles.checkboxChecked]}>
                          {isBailleur && <View style={styles.checkboxInner} />}
                        </View>
                        <View style={styles.checkboxTextContainer}>
                          <Text style={styles.checkboxLabel}>Je suis propriétaire/bailleur</Text>
                          <Text style={styles.checkboxDescription}>
                            Je souhaite mettre en location ou vendre mes biens
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )}
                </View>
              </>
            )}

            {step === 3 && (
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>Adresse</Text>
                  <Text style={styles.subtitle}>
                    Où êtes-vous situé ?
                  </Text>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <CityAutocomplete
                      label="Ville / Commune *"
                      value={cityId}
                      onChange={(id) => {
                        setCityId(id);
                        setNeighborhoodId(null);
                        if (errors.cityId) setErrors({ ...errors, cityId: undefined });
                      }}
                      placeholder="Sélectionner une ville"
                    />
                    {errors.cityId && <Text style={styles.errorText}>{errors.cityId}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <NeighborhoodAutocomplete
                      label="Quartier *"
                      value={neighborhoodId}
                      onChange={(id) => {
                        setNeighborhoodId(id);
                        if (errors.neighborhoodId) setErrors({ ...errors, neighborhoodId: undefined });
                      }}
                      cityId={cityId}
                      placeholder="Sélectionner un quartier"
                      disabled={!cityId}
                    />
                    {errors.neighborhoodId && <Text style={styles.errorText}>{errors.neighborhoodId}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Adresse complète</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Numéro, rue, immeuble..."
                      placeholderTextColor={Colors.light.textSecondary}
                      value={address}
                      onChangeText={setAddress}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      editable={!isLoading}
                    />
                  </View>
                </View>
              </>
            )}

          </View>
        </ScrollView>

        <View style={styles.footer}>
          {step > 1 && (
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Retour</Text>
            </Pressable>
          )}
          <Pressable
            style={[
              styles.nextButton,
              step === 1 && styles.nextButtonFull,
              isLoading && styles.nextButtonDisabled,
            ]}
            onPress={step === 3 ? handleSignup : handleNext}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.light.background} />
            ) : (
              <Text style={styles.nextButtonText}>
                {step === 3 ? 'Créer mon compte' : 'Suivant'}
              </Text>
            )}
          </Pressable>
        </View>

      </View>
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
    paddingHorizontal: 60,
    paddingVertical: 16,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.border,
  },
  progressDotActive: {
    backgroundColor: Colors.light.primary,
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  profileGrid: {
    gap: 16,
  },
  profileCard: {
    padding: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.background,
  },
  profileIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  profileDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  profileBadge: {
    backgroundColor: `${Colors.light.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  profileBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  optional: {
    fontWeight: '400',
    color: Colors.light.textSecondary,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginTop: 4,
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
    fontWeight: '700',
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
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.background,
  },
  bailleurSection: {
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: Colors.light.background,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  // 🆕 STYLES POUR INTERVENANTS
  formGroup: {
    gap: 8,
  },
  intervenantTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  intervenantTypeCard: {
    width: '30%',
    minHeight: 100,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  intervenantTypeCardActive: {
    backgroundColor: Colors.light.primary + '15',
    borderColor: Colors.light.primary,
  },
  intervenantTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  intervenantTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  intervenantTypeLabelActive: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
});