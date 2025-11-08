/**
 * Sélecteur de Méthode de Paiement Mobile Money
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Smartphone, ChevronRight } from 'lucide-react-native';
import { mobileMoneyService } from '@/lib/bakrosur-pay/mobile-money.service';

interface PaymentMethodSelectorProps {
  amount: number;
  escrowId: string;
  onPaymentSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

const PROVIDER_LOGOS = {
  ORANGE_MONEY: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg',
  MTN_MONEY: 'https://upload.wikimedia.org/wikipedia/commons/3/31/MTN_Logo.svg',
  MOOV_MONEY: 'https://moov-africa.ci/assets/img/logo.png',
  WAVE: 'https://www.wave.com/assets/img/logo.svg',
};

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  escrowId,
  onPaymentSuccess,
  onCancel,
}) => {
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await mobileMoneyService.getAvailableProviders();
      setProviders(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les méthodes de paiement');
    } finally {
      setLoadingProviders(false);
    }
  };

  const handlePay = async () => {
    if (!selectedProvider || !phoneNumber) {
      Alert.alert('Erreur', 'Veuillez sélectionner une méthode et entrer votre numéro');
      return;
    }

    // Valider le numéro
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (cleanPhone.length < 10) {
      Alert.alert('Erreur', 'Numéro de téléphone invalide');
      return;
    }

    setLoading(true);

    try {
      const response = await mobileMoneyService.initiatePayment({
        escrowId,
        amount,
        phoneNumber: cleanPhone,
        provider: selectedProvider as any,
        description: `Paiement BakroSur - ${formatAmount(amount)} FCFA`,
      });

      // Afficher le message de confirmation
      Alert.alert(
        '📱 Confirmation requise',
        response.message,
        [
          {
            text: 'Annuler',
            style: 'cancel',
            onPress: () => setLoading(false),
          },
          {
            text: 'J\'ai validé',
            onPress: () => checkPaymentStatus(response.transactionId),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors du paiement');
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (transactionId: string) => {
    try {
      // Vérifier le statut toutes les 3 secondes pendant 60 secondes max
      let attempts = 0;
      const maxAttempts = 20;

      const interval = setInterval(async () => {
        attempts++;

        try {
          const status = await mobileMoneyService.checkPaymentStatus(transactionId);

          if (status.status === 'COMPLETED') {
            clearInterval(interval);
            setLoading(false);
            Alert.alert(
              '✅ Paiement réussi',
              `Votre paiement de ${formatAmount(amount)} FCFA a été confirmé`,
              [{ text: 'OK', onPress: () => onPaymentSuccess(transactionId) }]
            );
          } else if (status.status === 'FAILED') {
            clearInterval(interval);
            setLoading(false);
            Alert.alert('❌ Paiement échoué', status.message);
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            setLoading(false);
            Alert.alert(
              '⏱️ Délai dépassé',
              'Le paiement prend plus de temps que prévu. Nous vous notifierons dès confirmation.',
              [{ text: 'OK', onPress: onCancel }]
            );
          }
        } catch (error) {
          console.error('Erreur vérification statut:', error);
        }
      }, 3000);

      // Timeout de sécurité
      setTimeout(() => {
        clearInterval(interval);
        if (loading) {
          setLoading(false);
          Alert.alert(
            'Délai dépassé',
            'Vérifiez votre téléphone et réessayez',
            [{ text: 'OK', onPress: onCancel }]
          );
        }
      }, 60000);
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Erreur', error.message);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return text;
  };

  if (loadingProviders) {
    return (
      <View className="p-6 items-center justify-center">
        <ActivityIndicator size="large" color="#EA580C" />
        <Text className="text-gray-600 mt-4">Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-t-3xl p-6">
      {/* Montant */}
      <View className="items-center mb-6">
        <Text className="text-gray-600 text-sm mb-1">Montant à payer</Text>
        <Text className="text-3xl font-bold text-gray-900">
          {formatAmount(amount)} <Text className="text-xl">FCFA</Text>
        </Text>
      </View>

      {/* Méthodes de paiement */}
      <Text className="text-base font-semibold text-gray-900 mb-3">
        Choisissez votre méthode
      </Text>

      <View className="space-y-2 mb-6">
        {providers.map((provider) => (
          <TouchableOpacity
            key={provider.id}
            onPress={() => setSelectedProvider(provider.provider_name)}
            className={`border-2 rounded-xl p-4 flex-row items-center justify-between ${
              selectedProvider === provider.provider_name
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white'
            }`}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-white rounded-lg items-center justify-center border border-gray-200">
                <Smartphone size={24} color="#EA580C" />
              </View>
              <View className="ml-3">
                <Text className="text-base font-semibold text-gray-900">
                  {provider.display_name}
                </Text>
                <Text className="text-xs text-gray-600">
                  Frais: {provider.fee_percentage}%
                </Text>
              </View>
            </View>
            {selectedProvider === provider.provider_name && (
              <View className="w-6 h-6 bg-orange-500 rounded-full items-center justify-center">
                <Text className="text-white font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Numéro de téléphone */}
      {selectedProvider && (
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
            <Text className="text-gray-600 mr-2">+225</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
              placeholder="XX XX XX XX XX"
              keyboardType="phone-pad"
              maxLength={14}
              className="flex-1 text-base text-gray-900"
            />
          </View>
          <Text className="text-xs text-gray-500 mt-1">
            Le code de confirmation sera envoyé à ce numéro
          </Text>
        </View>
      )}

      {/* Boutons */}
      <View className="space-y-3">
        <TouchableOpacity
          onPress={handlePay}
          disabled={!selectedProvider || !phoneNumber || loading}
          className={`rounded-lg py-4 items-center ${
            !selectedProvider || !phoneNumber || loading
              ? 'bg-gray-300'
              : 'bg-orange-600'
          }`}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Confirmer le paiement
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
          className="py-3 items-center"
          activeOpacity={0.7}
        >
          <Text className="text-gray-600 font-medium">Annuler</Text>
        </TouchableOpacity>
      </View>

      {/* Sécurité */}
      <View className="mt-6 p-4 bg-gray-50 rounded-lg">
        <Text className="text-xs text-gray-600 text-center">
          🔒 Transaction sécurisée par BakroSur Pay
        </Text>
      </View>
    </View>
  );
};