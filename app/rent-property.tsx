import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Home, Building2, DollarSign, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useVerification } from '@/contexts/VerificationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const propertyTypes = [
  { id: 'appartement', name: 'Appartement', icon: Home },
  { id: 'studio', name: 'Studio', icon: Building2 },
  { id: 'maison', name: 'Maison', icon: Home },
  { id: 'villa', name: 'Villa', icon: Home },
  { id: 'chambre', name: 'Chambre', icon: Building2 },
  { id: 'bureau', name: 'Bureau', icon: Building2 },
];

export default function RentPropertyScreen() {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const { kycData } = useVerification();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [maxRent, setMaxRent] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [errors, setErrors] = useState<{
    type?: string;
    city?: string;
  }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour déposer une annonce de location.',
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

  const handleSearch = () => {
    const newErrors: typeof errors = {};

    if (!selectedType) {
      newErrors.type = 'Type de bien requis';
    }

    if (!selectedCity.trim()) {
      newErrors.city = 'Ville requise';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const params: Record<string, string> = {
      transactionType: 'louer',
    };

    if (selectedType) params.type = selectedType;
    if (selectedCity) params.city = selectedCity;
    if (selectedNeighborhood) params.neighborhood = selectedNeighborhood;
    if (maxRent) params.maxPrice = maxRent;
    if (bedrooms) params.bedrooms = bedrooms;

    const queryString = new URLSearchParams(params).toString();
    router.push(`/(tabs)/search?${queryString}` as any);
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated || kycData?.status !== 'APPROVED' ? (
        <>
        <Stack.Screen
          options={{
            title: 'Louer un bien',
            headerStyle: {
              backgroundColor: '#FCFCF9',
            },
            headerTintColor: '#13343B',
          }}
        />
        <View style={styles.restrictedContainer}>
          <AlertCircle size={64} color="#EF4444" />
          <Text style={styles.restrictedTitle}>
            {!isAuthenticated ? 'Connexion requise' : 'Vérification requise'}
          </Text>
          <Text style={styles.restrictedMessage}>
            {!isAuthenticated
              ? 'Vous devez être connecté pour déposer une annonce de location.'
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
        </>
      ) : (
        <>
        <Stack.Screen
          options={{
            title: 'Louer un bien',
            headerStyle: {
              backgroundColor: '#FCFCF9',
            },
            headerTintColor: '#13343B',
          }}
        />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Trouvez votre location idéale</Text>
          <Text style={styles.subtitle}>
            Recherchez parmi nos biens disponibles en location
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type de bien *</Text>
          <View style={styles.typeGrid}>
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    isSelected && styles.typeCardSelected,
                  ]}
                  onPress={() => {
                    setSelectedType(type.id);
                    if (errors.type) setErrors({ ...errors, type: undefined });
                  }}
                >
                  <Icon
                    size={32}
                    color={isSelected ? '#21808D' : '#626C71'}
                  />
                  <Text
                    style={[
                      styles.typeName,
                      isSelected && styles.typeNameSelected,
                    ]}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.type && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.type}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localisation</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ville / Commune *</Text>
            <TextInput
              style={[styles.simpleInput, errors.city && styles.inputError]}
              placeholder="Ex: Cocody, Plateau, Marcory..."
              value={selectedCity}
              onChangeText={(text) => {
                setSelectedCity(text);
                setSelectedNeighborhood('');
                if (errors.city) setErrors({ ...errors, city: undefined });
              }}
              placeholderTextColor="#A0A0A0"
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quartier</Text>
            <TextInput
              style={styles.simpleInput}
              placeholder="Ex: Riviera, Zone 4..."
              value={selectedNeighborhood}
              onChangeText={setSelectedNeighborhood}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Critères</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loyer maximum (FCFA)</Text>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color="#626C71" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: 500000"
                value={maxRent}
                onChangeText={setMaxRent}
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de chambres minimum</Text>
            <View style={styles.inputContainer}>
              <Home size={20} color="#626C71" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: 2"
                value={bedrooms}
                onChangeText={setBedrooms}
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Conseils pour votre recherche</Text>
          <Text style={styles.infoText}>
            • Vérifiez le titre foncier du bien{'\n'}
            • Visitez le bien avant de signer{'\n'}
            • Lisez attentivement le contrat de bail{'\n'}
            • Demandez les charges et modalités de paiement
          </Text>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍 Rechercher</Text>
        </TouchableOpacity>
      </ScrollView>
      </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCF9',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#13343B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#626C71',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#13343B',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(94, 82, 64, 0.2)',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeCardSelected: {
    borderColor: '#21808D',
    backgroundColor: 'rgba(33, 128, 141, 0.05)',
  },
  typeName: {
    fontSize: 12,
    color: '#626C71',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  typeNameSelected: {
    color: '#21808D',
    fontWeight: '600' as const,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#13343B',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(94, 82, 64, 0.2)',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#13343B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  infoBox: {
    backgroundColor: 'rgba(33, 128, 141, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#21808D',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#626C71',
    lineHeight: 20,
  },
  searchButton: {
    backgroundColor: '#21808D',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  simpleInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(94, 82, 64, 0.2)',
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    color: '#13343B',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 4,
  },
  restrictedContainer: {
    flex: 1,
    backgroundColor: '#FCFCF9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  restrictedTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#13343B',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  restrictedMessage: {
    fontSize: 16,
    color: '#626C71',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  restrictedButton: {
    backgroundColor: '#21808D',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  restrictedButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
