
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Users,
  Wrench,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRentals } from '@/contexts/RentalContext';
import Colors from '@/constants/colors';

export default function LandlordDashboard() {
  const {
    landlordContracts,
    landlordPayments,
    landlordMaintenance,
    getLandlordStats,
    isLoading,
  } = useRentals();

  const stats = useMemo(() => getLandlordStats(), [getLandlordStats]);

  const recentPayments = useMemo(() => {
    return landlordPayments
      .filter((p) => p.status === 'PAYÉ')
      .sort((a, b) => {
        const dateA = a.paidDate ? new Date(a.paidDate).getTime() : 0;
        const dateB = b.paidDate ? new Date(b.paidDate).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [landlordPayments]);

  const urgentMaintenance = useMemo(() => {
    return landlordMaintenance
      .filter((m) => m.status === 'NOUVEAU' && m.priority === 'URGENTE')
      .slice(0, 3);
  }, [landlordMaintenance]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
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
        <Text style={styles.title}>Tableau de bord Bailleur</Text>
        <Text style={styles.subtitle}>Gérez vos propriétés et locataires</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.statCardPrimary]}>
          <View style={styles.statIconContainer}>
            <Building2 color="#fff" size={24} />
          </View>
          <Text style={styles.statValue}>{stats.activeContracts}</Text>
          <Text style={styles.statLabel}>Contrats actifs</Text>
        </View>

        <View style={[styles.statCard, styles.statCardSuccess]}>
          <View style={styles.statIconContainer}>
            <DollarSign color="#fff" size={24} />
          </View>
          <Text style={styles.statValue}>
            {(stats.totalMonthlyRevenue / 1000000).toFixed(1)}M
          </Text>
          <Text style={styles.statLabel}>Revenu mensuel</Text>
        </View>

        <View style={[styles.statCard, styles.statCardWarning]}>
          <View style={styles.statIconContainer}>
            <Clock color="#fff" size={24} />
          </View>
          <Text style={styles.statValue}>{stats.pendingPayments}</Text>
          <Text style={styles.statLabel}>Paiements en attente</Text>
        </View>

        <View style={[styles.statCard, styles.statCardDanger]}>
          <View style={styles.statIconContainer}>
            <AlertCircle color="#fff" size={24} />
          </View>
          <Text style={styles.statValue}>{stats.latePayments}</Text>
          <Text style={styles.statLabel}>Retards</Text>
        </View>
      </View>

      {urgentMaintenance.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Wrench color={Colors.light.error} size={20} />
            <Text style={styles.sectionTitle}>Maintenance urgente</Text>
          </View>
          {urgentMaintenance.map((item) => (
            <View key={item.id} style={styles.maintenanceCard}>
              <View style={styles.maintenanceHeader}>
                <Text style={styles.maintenanceTitle}>{item.title}</Text>
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>URGENT</Text>
                </View>
              </View>
              <Text style={styles.maintenanceProperty}>{item.propertyTitle}</Text>
              <Text style={styles.maintenanceDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.maintenanceFooter}>
                <Text style={styles.maintenanceTenant}>{item.tenantName}</Text>
                <Text style={styles.maintenanceDate}>
                  {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <CheckCircle2 color={Colors.light.success} size={20} />
          <Text style={styles.sectionTitle}>Paiements récents</Text>
        </View>
        {recentPayments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aucun paiement récent</Text>
          </View>
        ) : (
          recentPayments.map((payment) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTenant}>{payment.tenantName}</Text>
                  <Text style={styles.paymentProperty}>{payment.propertyTitle}</Text>
                </View>
                <View style={styles.paymentAmount}>
                  <Text style={styles.paymentAmountText}>
                    {(payment.amount / 1000).toFixed(0)}K
                  </Text>
                  <View style={styles.paidBadge}>
                    <CheckCircle2 color={Colors.light.success} size={14} />
                    <Text style={styles.paidBadgeText}>Payé</Text>
                  </View>
                </View>
              </View>
              <View style={styles.paymentFooter}>
                <Text style={styles.paymentMethod}>{payment.method}</Text>
                <Text style={styles.paymentDate}>
                  {payment.paidDate
                    ? new Date(payment.paidDate).toLocaleDateString('fr-FR')
                    : '-'}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users color={Colors.light.primary} size={20} />
          <Text style={styles.sectionTitle}>Mes propriétés</Text>
        </View>
        {landlordContracts.map((contract) => (
          <TouchableOpacity
            key={contract.id}
            style={styles.propertyCard}
            onPress={() => console.log('View contract', contract.id)}
          >
            <View style={styles.propertyHeader}>
              <Building2 color={Colors.light.primary} size={20} />
              <Text style={styles.propertyTitle}>{contract.propertyTitle}</Text>
            </View>
            <View style={styles.propertyBody}>
              <View style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>Locataire:</Text>
                <Text style={styles.propertyValue}>{contract.tenantName}</Text>
              </View>
              <View style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>Loyer mensuel:</Text>
                <Text style={styles.propertyValue}>
                  {(contract.monthlyRent / 1000).toFixed(0)}K FCFA
                </Text>
              </View>
              <View style={styles.propertyRow}>
                <Text style={styles.propertyLabel}>Échéance:</Text>
                <Text style={styles.propertyValue}>
                  {new Date(contract.endDate).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                contract.status === 'ACTIF' && styles.statusBadgeActive,
                contract.status === 'EXPIRE' && styles.statusBadgeExpired,
              ]}
            >
              <Text style={styles.statusBadgeText}>{contract.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('Add contract')}
        >
          <FileText color="#fff" size={20} />
          <Text style={styles.actionButtonText}>Nouveau contrat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log('View all payments')}
        >
          <Calendar color="#fff" size={20} />
          <Text style={styles.actionButtonText}>Tous les paiements</Text>
        </TouchableOpacity>
      </View>
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
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center' as const,
  },
  statCardPrimary: {
    backgroundColor: Colors.light.primary,
  },
  statCardSuccess: {
    backgroundColor: Colors.light.success,
  },
  statCardWarning: {
    backgroundColor: Colors.light.warning,
  },
  statCardDanger: {
    backgroundColor: Colors.light.error,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
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
  },
  maintenanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.error,
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
  urgentBadge: {
    backgroundColor: Colors.light.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700' as const,
  },
  maintenanceProperty: {
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  maintenanceDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  maintenanceFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  maintenanceTenant: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  maintenanceDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center' as const,
  },
  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTenant: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  paymentProperty: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  paymentAmount: {
    alignItems: 'flex-end' as const,
  },
  paymentAmountText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  paidBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  paidBadgeText: {
    fontSize: 12,
    color: Colors.light.success,
    fontWeight: '600' as const,
  },
  paymentFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  paymentMethod: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '600' as const,
  },
  paymentDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative' as const,
  },
  propertyHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 12,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    flex: 1,
  },
  propertyBody: {
    gap: 8,
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
  statusBadge: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeActive: {
    backgroundColor: Colors.light.success,
  },
  statusBadgeExpired: {
    backgroundColor: Colors.light.textSecondary,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700' as const,
  },
  quickActions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
