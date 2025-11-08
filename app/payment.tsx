import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, X, Loader, Phone } from 'lucide-react-native';
import { useEffect, useState } from 'react';
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
import { MOBILE_MONEY_PROVIDERS, MobileMoneyProvider, PaymentGateway } from '@/constants/mobile-money';
import { PROPERTIES } from '@/constants/properties';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';

function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR') + ' FCFA';
}

export default function PaymentScreen() {
  const { propertyId } = useLocalSearchParams<{ propertyId?: string }>();
  const { isAuthenticated } = useAuth();
  const { initiatePayment, getPaymentById } = usePayment();

  const [selectedProvider, setSelectedProvider] = useState<MobileMoneyProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const property = propertyId ? PROPERTIES.find((p) => p.id === propertyId) : null;
  const suggestedAmount = property ? Math.round(property.price * 0.1) : 0;

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour effectuer un paiement',
        [
          { text: 'Annuler', style: 'cancel', onPress: () => router.back() },
          { text: 'Se connecter', onPress: () => router.push('/auth/login' as any) },
        ]
      );
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (paymentId) {
      const interval = setInterval(() => {
        const payment = getPaymentById(paymentId);
        if (payment && payment.status !== 'PENDING') {
          setPaymentStatus(payment.status);
          setIsProcessing(false);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [paymentId]);

  const handlePayment = async () => {
    if (!selectedProvider) {
      Alert.alert('Erreur', 'Veuillez sélectionner un moyen de paiement');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 100) {
      Alert.alert('Erreur', 'Le montant minimum est de 100 FCFA');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      const payment = await initiatePayment(
        selectedProvider,
        phoneNumber,
        amountNum,
        propertyId,
        'CINETPAY'
      );
      setPaymentId(payment.id);
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du paiement');
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedProvider(null);
    setPhoneNumber('');
    setAmount('');
    setPaymentId(null);
    setPaymentStatus(null);
    setIsProcessing(false);
  };

  if (paymentStatus === 'SUCCESS') {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Paiement',
            headerLeft: () => (
              <Pressable onPress={() => router.back()}>
                <ArrowLeft size={24} color={Colors.light.text} />
              </Pressable>
            ),
          }}
        />
        <View style={styles.container}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Check size={64} color={Colors.light.success} />
            </View>
            <Text style={styles.successTitle}>Paiement réussi !</Text>
            <Text style={styles.successMessage}>
              Votre paiement de {formatPrice(parseFloat(amount))} a été effectué avec succès
            </Text>
            {property && (
              <View style={styles.propertyCard}>
                <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
                <Text style={styles.propertyTitle}>{property.title}</Text>
              </View>
            )}
            <Pressable style={styles.doneButton} onPress={() => router.back()}>
              <Text style={styles.doneButtonText}>Terminé</Text>
            </Pressable>
          </View>
        </View>
      </>
    );
  }

  if (paymentStatus === 'FAILED') {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Paiement',
            headerLeft: () => (
              <Pressable onPress={() => router.back()}>
                <ArrowLeft size={24} color={Colors.light.text} />
              </Pressable>
            ),
          }}
        />
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <View style={styles.errorIcon}>
              <X size={64} color={Colors.light.error} />
            </View>
            <Text style={styles.errorTitle}>Paiement échoué</Text>
            <Text style={styles.errorMessage}>
              Le paiement n&apos;a pas pu être effectué. Veuillez réessayer.
            </Text>
            <Pressable style={styles.retryButton} onPress={resetForm}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </Pressable>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Paiement Mobile Money',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.light.text} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {property && (
          <View style={styles.propertySection}>
            <Text style={styles.sectionTitle}>Propriété</Text>
            <View style={styles.propertyCard}>
              <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moyen de paiement</Text>
          <View style={styles.providersGrid}>
            {MOBILE_MONEY_PROVIDERS.map((provider) => (
              <Pressable
                key={provider.id}
                style={[
                  styles.providerCard,
                  selectedProvider === provider.id && styles.providerCardSelected,
                ]}
                onPress={() => setSelectedProvider(provider.id)}
              >
                <Text style={styles.providerIcon}>{provider.icon}</Text>
                <Text style={styles.providerName}>{provider.name}</Text>
                {selectedProvider === provider.id && (
                  <View style={styles.selectedBadge}>
                    <Check size={16} color={Colors.light.background} />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numéro de téléphone</Text>
          <View style={styles.inputContainer}>
            <Phone size={20} color={Colors.light.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 0748526392"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!isProcessing}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Montant</Text>
          {suggestedAmount > 0 && (
            <Pressable
              style={styles.suggestedAmount}
              onPress={() => setAmount(suggestedAmount.toString())}
            >
              <Text style={styles.suggestedAmountText}>
                Acompte suggéré (10%): {formatPrice(suggestedAmount)}
              </Text>
            </Pressable>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Entrez le montant"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              editable={!isProcessing}
            />
            <Text style={styles.currency}>FCFA</Text>
          </View>
          <Text style={styles.helperText}>Montant minimum: 100 FCFA</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>🔒 Paiement sécurisé</Text>
          <Text style={styles.infoText}>
            Votre paiement est traité via CinetPay, une plateforme de paiement certifiée.
            Vous recevrez une notification de confirmation sur votre téléphone.
          </Text>
        </View>

        <Pressable
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <ActivityIndicator color={Colors.light.background} />
              <Text style={styles.payButtonText}>Traitement en cours...</Text>
            </>
          ) : (
            <Text style={styles.payButtonText}>Payer maintenant</Text>
          )}
        </Pressable>

        {isProcessing && (
          <View style={styles.processingInfo}>
            <Loader size={20} color={Colors.light.primary} />
            <Text style={styles.processingText}>
              Veuillez valider le paiement sur votre téléphone
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  propertySection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  propertyImage: {
    width: 100,
    height: 100,
  },
  propertyInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerCard: {
    width: '48%',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  providerCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  providerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  helperText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 8,
  },
  suggestedAmount: {
    backgroundColor: Colors.light.secondary + '20',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  suggestedAmountText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.secondary,
  },
  infoSection: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  processingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
  },
  processingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  doneButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    marginTop: 24,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    marginTop: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
});
