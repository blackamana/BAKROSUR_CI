/**
 * app/payment/[escrowId].tsx
 * Écran de détail d'un paiement Escrow
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Shield,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentScreen() {
  const router = useRouter();
  const { escrowId } = useLocalSearchParams();
  const { user } = useAuth();

  const [escrow, setEscrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEscrow();
  }, [escrowId]);

  const loadEscrow = async () => {
    try {
      // SIMULATION - Remplacer par votre API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEscrow({
        id: escrowId,
        total_amount: 50000000,
        deposit_amount: 5000000,
        remaining_amount: 45000000,
        escrow_fee: 750000,
        status: 'DEPOSIT_PAID',
        buyer_id: user?.id,
        seller_id: 'seller1',
        created_at: new Date().toISOString(),
        property: {
          title: 'Villa Cocody 4 chambres',
          city_name: 'Abidjan',
        },
        buyer: {
          name: 'Vous',
        },
        seller: {
          name: 'Jean Kouassi',
        },
      });
    } catch (error) {
      console.error('Erreur chargement escrow:', error);
      Alert.alert('Erreur', 'Impossible de charger la transaction');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayment = () => {
    Alert.alert(
      'Paiement',
      'La fonctionnalité de paiement sera disponible prochainement',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Paiement',
            headerStyle: { backgroundColor: Colors.light.background },
            headerTitleStyle: { fontWeight: '700' as const },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </>
    );
  }

  if (!escrow) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Paiement',
            headerStyle: { backgroundColor: Colors.light.background },
            headerTitleStyle: { fontWeight: '700' as const },
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transaction introuvable</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const isBuyer = escrow.buyer_id === user?.id;
  const canPay = isBuyer && escrow.status === 'DEPOSIT_PAID';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Paiement sécurisé',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />
      <ScrollView style={styles.scrollView}>
        {/* Statut */}
        <View style={styles.statusCard}>
          <View style={styles.statusBadge}>
            <CheckCircle size={48} color="white" />
          </View>
          <Text style={styles.statusLabel}>Acompte payé</Text>
          <Text style={styles.amountLarge}>
            {formatAmount(escrow.total_amount)} FCFA
          </Text>
        </View>

        {/* Propriété */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Propriété</Text>
          <View style={styles.propertyCard}>
            <Text style={styles.propertyTitle}>{escrow.property.title}</Text>
            <Text style={styles.propertyLocation}>
              📍 {escrow.property.city_name}
            </Text>
          </View>
        </View>

        {/* Montants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Montants</Text>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Montant total</Text>
            <Text style={styles.amountValue}>
              {formatAmount(escrow.total_amount)} FCFA
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Acompte (payé)</Text>
            <Text style={[styles.amountValue, { color: '#10B981' }]}>
              {formatAmount(escrow.deposit_amount)} FCFA
            </Text>
          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Solde restant</Text>
            <Text style={[styles.amountValue, { color: '#F59E0B' }]}>
              {formatAmount(escrow.remaining_amount)} FCFA
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Frais BakroSur (1.5%)</Text>
            <Text style={styles.amountValue}>
              {formatAmount(escrow.escrow_fee)} FCFA
            </Text>
          </View>
        </View>

        {/* Participants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participants</Text>

          <View style={styles.participantRow}>
            <User size={16} color={Colors.light.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.participantLabel}>
                {isBuyer ? 'Vous (Acheteur)' : 'Acheteur'}
              </Text>
              <Text style={styles.participantName}>{escrow.buyer.name}</Text>
            </View>
          </View>

          <View style={styles.participantRow}>
            <User size={16} color={Colors.light.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.participantLabel}>
                {!isBuyer ? 'Vous (Vendeur)' : 'Vendeur'}
              </Text>
              <Text style={styles.participantName}>{escrow.seller.name}</Text>
            </View>
          </View>
        </View>

        {/* Sécurité */}
        <View style={styles.securityCard}>
          <Shield size={32} color="#10B981" />
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>Transaction sécurisée</Text>
            <Text style={styles.securityText}>
              Vos fonds sont protégés en séquestre jusqu'à validation complète
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bouton de paiement */}
      {canPay && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <DollarSign size={20} color="white" />
            <Text style={styles.payButtonText}>
              Payer le solde ({formatAmount(escrow.remaining_amount)} FCFA)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '700' as const,
  },
  statusCard: {
    backgroundColor: Colors.light.background,
    padding: 32,
    alignItems: 'center',
  },
  statusBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  amountLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  section: {
    backgroundColor: Colors.light.background,
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  propertyCard: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 8,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  participantLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  securityCard: {
    backgroundColor: '#ECFDF5',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#065F46',
    marginBottom: 4,
  },
  securityText: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});