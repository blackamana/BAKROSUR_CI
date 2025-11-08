import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  Plus,
  Wrench,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRentals } from '@/contexts/RentalContext';
import Colors from '@/constants/colors';
import type { MaintenancePriority, MaintenanceRequest, PaymentMethod } from '@/constants/rentals';

export default function TenantDashboard() {
  const {
    tenantPayments,
    tenantMaintenance,
    getTenantStats,
    recordPayment,
    addMaintenanceRequest,
    isLoading,
  } = useRentals();

  const stats = useMemo(() => getTenantStats(), [getTenantStats]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    title: '',
    description: '',
    category: 'AUTRE' as MaintenanceRequest['category'],
    priority: 'MOYENNE' as MaintenancePriority,
  });

  const upcomingPayments = useMemo(() => {
    return tenantPayments
      .filter((p) => p.status === 'EN_ATTENTE' || p.status === 'EN_RETARD')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  }, [tenantPayments]);

  const recentMaintenanceRequests = useMemo(() => {
    return tenantMaintenance.slice(0, 5);
  }, [tenantMaintenance]);

  const handlePayment = async (paymentMethod: PaymentMethod) => {
    if (!selectedPayment || !stats.activeContract) return;

    try {
      const reference = `${paymentMethod}${Date.now()}`;
      await recordPayment(stats.activeContract.id, selectedPayment, paymentMethod, reference);
      Alert.alert('Succès', 'Paiement enregistré avec succès');
      setShowPaymentModal(false);
      setSelectedPayment(null);
    } catch {
      Alert.alert('Erreur', "Impossible d'enregistrer le paiement");
    }
  };

  const handleSubmitMaintenance = async () => {
    if (!stats.activeContract) return;
    if (!maintenanceForm.title.trim()) {
      Alert.alert('Erreur', 'Veuillez renseigner un titre');
      return;
    }

    try {
      await addMaintenanceRequest({
        contractId: stats.activeContract.id,
        propertyId: stats.activeContract.propertyId,
        propertyTitle: stats.activeContract.propertyTitle,
        tenantId: stats.activeContract.tenantId,
        tenantName: stats.activeContract.tenantName,
        title: maintenanceForm.title,
        description: maintenanceForm.description,
        category: maintenanceForm.category,
        priority: maintenanceForm.priority,
      });

      Alert.alert('Succès', 'Demande de maintenance soumise avec succès');
      setShowMaintenanceModal(false);
      setMaintenanceForm({
        title: '',
        description: '',
        category: 'AUTRE',
        priority: 'MOYENNE',
      });
    } catch {
      Alert.alert('Erreur', 'Impossible de soumettre la demande');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!stats.activeContract) {
    return (
      <View style={styles.emptyContainer}>
        <Building2 color={Colors.light.textSecondary} size={64} />
        <Text style={styles.emptyTitle}>Aucun contrat actif</Text>
        <Text style={styles.emptyText}>
          Vous n'avez pas de contrat de location actif pour le moment.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mon logement</Text>
        <Text style={styles.subtitle}>Gérez votre location</Text>
      </View>

      <View style={styles.propertyCard}>
        <View style={styles.propertyHeader}>
          <Building2 color={Colors.light.primary} size={24} />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle}>{stats.activeContract.propertyTitle}</Text>
            <Text style={styles.propertyAddress}>{stats.activeContract.propertyAddress}</Text>
          </View>
        </View>
        <View style={styles.propertyDetails}>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Bailleur:</Text>
            <Text style={styles.propertyValue}>{stats.activeContract.landlordName}</Text>
          </View>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Loyer mensuel:</Text>
            <Text style={styles.propertyValue}>
              {(stats.activeContract.monthlyRent / 1000).toFixed(0)}K FCFA
            </Text>
          </View>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Fin du contrat:</Text>
            <Text style={styles.propertyValue}>
              {new Date(stats.activeContract.endDate).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>
      </View>

      {stats.nextPayment && (
        <View style={styles.nextPaymentCard}>
          <View style={styles.nextPaymentHeader}>
            <AlertCircle
              color={
                stats.nextPayment.status === 'EN_RETARD'
                  ? Colors.light.error
                  : Colors.light.warning
              }
              size={24}
            />
            <Text style={styles.nextPaymentTitle}>
              {stats.nextPayment.status === 'EN_RETARD'
                ? 'Paiement en retard'
                : 'Prochain paiement'}
            </Text>
          </View>
          <Text style={styles.nextPaymentAmount}>
            {(stats.nextPayment.amount / 1000).toFixed(0)}K FCFA
          </Text>
          <Text style={styles.nextPaymentDue}>
            Échéance: {new Date(stats.nextPayment.dueDate).toLocaleDateString('fr-FR')}
          </Text>
          <TouchableOpacity
            style={[
              styles.payButton,
              stats.nextPayment.status === 'EN_RETARD' && styles.payButtonUrgent,
            ]}
            onPress={() => {
              setSelectedPayment(stats.nextPayment!.id);
              setShowPaymentModal(true);
            }}
          >
            <CreditCard color="#fff" size={20} />
            <Text style={styles.payButtonText}>Payer maintenant</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <CheckCircle2 color={Colors.light.success} size={24} />
          <Text style={styles.statValue}>{stats.paidCount}</Text>
          <Text style={styles.statLabel}>Paiements effectués</Text>
        </View>
        <View style={styles.statCard}>
          <Wrench color={Colors.light.warning} size={24} />
          <Text style={styles.statValue}>{stats.openMaintenanceCount}</Text>
          <Text style={styles.statLabel}>Demandes ouvertes</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar color={Colors.light.primary} size={20} />
          <Text style={styles.sectionTitle}>Prochains paiements</Text>
        </View>
        {upcomingPayments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Tous les paiements sont à jour</Text>
          </View>
        ) : (
          upcomingPayments.map((payment) => (
            <View
              key={payment.id}
              style={[
                styles.paymentCard,
                payment.status === 'EN_RETARD' && styles.paymentCardLate,
              ]}
            >
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentMonth}>
                  {new Date(payment.dueDate).toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={styles.paymentAmount}>
                  {(payment.amount / 1000).toFixed(0)}K FCFA
                </Text>
              </View>
              <View style={styles.paymentActions}>
                <View
                  style={[
                    styles.statusBadge,
                    payment.status === 'EN_RETARD' && styles.statusBadgeLate,
                  ]}
                >
                  <Text style={styles.statusBadgeText}>{payment.status}</Text>
                </View>
                <TouchableOpacity
                  style={styles.paySmallButton}
                  onPress={() => {
                    setSelectedPayment(payment.id);
                    setShowPaymentModal(true);
                  }}
                >
                  <Text style={styles.paySmallButtonText}>Payer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Wrench color={Colors.light.warning} size={20} />
          <Text style={styles.sectionTitle}>Maintenance</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowMaintenanceModal(true)}
          >
            <Plus color={Colors.light.primary} size={20} />
          </TouchableOpacity>
        </View>
        {recentMaintenanceRequests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aucune demande de maintenance</Text>
          </View>
        ) : (
          recentMaintenanceRequests.map((request) => (
            <View key={request.id} style={styles.maintenanceCard}>
              <View style={styles.maintenanceHeader}>
                <Text style={styles.maintenanceTitle}>{request.title}</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    request.priority === 'URGENTE' && styles.priorityBadgeUrgent,
                    request.priority === 'HAUTE' && styles.priorityBadgeHigh,
                  ]}
                >
                  <Text style={styles.priorityBadgeText}>{request.priority}</Text>
                </View>
              </View>
              <Text style={styles.maintenanceDescription} numberOfLines={2}>
                {request.description}
              </Text>
              <View style={styles.maintenanceFooter}>
                <View
                  style={[
                    styles.maintenanceStatusBadge,
                    request.status === 'RÉSOLU' && styles.maintenanceStatusBadgeResolved,
                    request.status === 'EN_COURS' && styles.maintenanceStatusBadgeInProgress,
                  ]}
                >
                  <Text style={styles.maintenanceStatusText}>{request.status}</Text>
                </View>
                <Text style={styles.maintenanceDate}>
                  {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => console.log('Contact landlord')}
      >
        <FileText color="#fff" size={20} />
        <Text style={styles.contactButtonText}>Contacter le bailleur</Text>
      </TouchableOpacity>

      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir un mode de paiement</Text>
            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={styles.paymentMethodButton}
                onPress={() => handlePayment('WAVE')}
              >
                <Text style={styles.paymentMethodText}>Wave</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paymentMethodButton}
                onPress={() => handlePayment('ORANGE_MONEY')}
              >
                <Text style={styles.paymentMethodText}>Orange Money</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paymentMethodButton}
                onPress={() => handlePayment('MTN_MONEY')}
              >
                <Text style={styles.paymentMethodText}>MTN Money</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paymentMethodButton}
                onPress={() => handlePayment('MOOV_MONEY')}
              >
                <Text style={styles.paymentMethodText}>Moov Money</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showMaintenanceModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMaintenanceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle demande de maintenance</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre"
              value={maintenanceForm.title}
              onChangeText={(text) => setMaintenanceForm({ ...maintenanceForm, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              numberOfLines={4}
              value={maintenanceForm.description}
              onChangeText={(text) =>
                setMaintenanceForm({ ...maintenanceForm, description: text })
              }
            />
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitMaintenance}
              >
                <Text style={styles.submitButtonText}>Soumettre</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowMaintenanceModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center' as const,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  propertyHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 16,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  propertyDetails: {
    gap: 12,
  },
  propertyRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  propertyLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  propertyValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  nextPaymentCard: {
    backgroundColor: Colors.light.warning,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  nextPaymentHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 12,
  },
  nextPaymentTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  nextPaymentAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  nextPaymentDue: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  },
  payButtonUrgent: {
    backgroundColor: Colors.light.error,
  },
  payButtonText: {
    color: Colors.light.warning,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  statsRow: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    flex: 1,
  },
  addButton: {
    padding: 4,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center' as const,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  paymentCardLate: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.error,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMonth: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
    textTransform: 'capitalize' as const,
  },
  paymentAmount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  paymentActions: {
    alignItems: 'flex-end' as const,
    gap: 8,
  },
  statusBadge: {
    backgroundColor: Colors.light.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeLate: {
    backgroundColor: Colors.light.error,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700' as const,
  },
  paySmallButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  paySmallButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  maintenanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  maintenanceHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  maintenanceTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    flex: 1,
  },
  priorityBadge: {
    backgroundColor: Colors.light.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityBadgeHigh: {
    backgroundColor: Colors.light.warning,
  },
  priorityBadgeUrgent: {
    backgroundColor: Colors.light.error,
  },
  priorityBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700' as const,
  },
  maintenanceDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  maintenanceFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  maintenanceStatusBadge: {
    backgroundColor: Colors.light.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  maintenanceStatusBadgeInProgress: {
    backgroundColor: Colors.light.warning,
  },
  maintenanceStatusBadgeResolved: {
    backgroundColor: Colors.light.success,
  },
  maintenanceStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700' as const,
  },
  maintenanceDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  contactButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginTop: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  paymentMethods: {
    gap: 12,
    marginBottom: 20,
  },
  paymentMethodButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center' as const,
  },
  paymentMethodText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  modalCloseButton: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center' as const,
  },
  modalCloseButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  input: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top' as const,
  },
  formActions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center' as const,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center' as const,
  },
  cancelButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
