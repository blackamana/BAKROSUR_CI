/**
 * Écran Détails d'une Transaction
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  Download,
  Share2,
} from 'lucide-react-native';
import { mobileMoneyService } from '@/lib/bakrosur-pay/mobile-money.service';

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams();

  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [transactionId]);

  const loadTransaction = async () => {
    try {
      // Simuler le chargement (remplacer par votre logique)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      setTransaction({
        id: transactionId,
        amount: 5000000,
        status: 'COMPLETED',
        payment_method: 'ORANGE_MONEY',
        phone_number: '+225 07 XX XX XX XX',
        transaction_type: 'DEPOSIT',
        provider_reference: 'OM123456789',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        escrow: {
          property: {
            title: 'Villa Cocody',
            city_name: 'Abidjan',
          },
        },
      });
    } catch (error) {
      console.error('Erreur chargement transaction:', error);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = () => {
    Alert.alert('Partager', 'Fonctionnalité de partage à venir');
  };

  const handleDownloadReceipt = () => {
    Alert.alert('Télécharger', 'Reçu PDF généré avec succès');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EA580C" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Transaction introuvable</Text>
      </View>
    );
  }

  const getStatusConfig = () => {
    switch (transaction.status) {
      case 'COMPLETED':
        return {
          color: '#10B981',
          icon: CheckCircle,
          label: 'Transaction réussie',
        };
      case 'PENDING':
        return {
          color: '#F59E0B',
          icon: Clock,
          label: 'En attente',
        };
      default:
        return {
          color: '#6B7280',
          icon: Clock,
          label: transaction.status,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la transaction</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Statut */}
        <View style={styles.statusCard}>
          <View
            style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}
          >
            <StatusIcon size={48} color="white" />
          </View>
          <Text style={styles.statusLabel}>{statusConfig.label}</Text>
          <Text style={styles.amountLarge}>
            {formatAmount(transaction.amount)} FCFA
          </Text>
        </View>

        {/* Informations principales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <DollarSign size={20} color="#6B7280" />
              <Text style={styles.infoLabel}>Référence</Text>
            </View>
            <Text style={styles.infoValue}>
              {transaction.provider_reference || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <User size={20} color="#6B7280" />
              <Text style={styles.infoLabel}>Méthode</Text>
            </View>
            <Text style={styles.infoValue}>{transaction.payment_method}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.infoLabel}>Date</Text>
            </View>
            <Text style={styles.infoValue}>
              {formatDate(transaction.created_at)}
            </Text>
          </View>

          {transaction.completed_at && (
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <CheckCircle size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Confirmé le</Text>
              </View>
              <Text style={styles.infoValue}>
                {formatDate(transaction.completed_at)}
              </Text>
            </View>
          )}
        </View>

        {/* Propriété associée */}
        {transaction.escrow?.property && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Propriété</Text>
            <View style={styles.propertyCard}>
              <Text style={styles.propertyTitle}>
                {transaction.escrow.property.title}
              </Text>
              <Text style={styles.propertyLocation}>
                📍 {transaction.escrow.property.city_name}
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownloadReceipt}
          >
            <Download size={20} color="#EA580C" />
            <Text style={styles.actionButtonText}>Télécharger le reçu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={20} color="#EA580C" />
            <Text style={styles.actionButtonText}>Partager</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  amountLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  propertyCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionsSection: {
    backgroundColor: 'white',
    marginTop: 8,
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EA580C',
  },
});