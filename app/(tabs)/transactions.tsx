/**
 * app/(tabs)/transactions.tsx
 * Écran de gestion des transactions BakroSur Pay (Escrow + Mobile Money)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router, Stack } from 'expo-router';
import {
  Lock,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Filter,
  AlertCircle,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
// import { escrowService } from '@/lib/bakrosur-pay/escrow.service'; // À décommenter après création

type TabType = 'all' | 'buyer' | 'seller';
type EscrowStatus = 'PENDING' | 'DEPOSIT_PAID' | 'FULL_PAYMENT' | 'RELEASED' | 'CANCELLED';

interface MockEscrow {
  id: string;
  property_id: string;
  seller_id: string;
  buyer_id: string;
  total_amount: number;
  deposit_amount: number;
  remaining_amount: number;
  escrow_fee: number;
  status: EscrowStatus;
  created_at: string;
  property?: {
    title: string;
    city_name: string;
    images?: string[];
  };
  buyer?: {
    name: string;
  };
  seller?: {
    name: string;
  };
}

export default function TransactionsScreen() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  const [escrows, setEscrows] = useState<MockEscrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [stats, setStats] = useState({
    total: 0,
    asBuyer: 0,
    asSeller: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadEscrows();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadEscrows = async () => {
    try {
      setLoading(true);
      
      // SIMULATION - À remplacer par votre API
      // const data = await escrowService.getUserEscrows(user!.id);
      
      // Données mockées pour démo
      const mockData: MockEscrow[] = [
        {
          id: '1',
          property_id: 'prop1',
          seller_id: 'seller1',
          buyer_id: user!.id,
          total_amount: 50000000,
          deposit_amount: 5000000,
          remaining_amount: 45000000,
          escrow_fee: 750000,
          status: 'DEPOSIT_PAID',
          created_at: new Date().toISOString(),
          property: {
            title: 'Villa Cocody 4 chambres',
            city_name: 'Abidjan',
            images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811'],
          },
          seller: {
            name: 'Jean Kouassi',
          },
        },
        {
          id: '2',
          property_id: 'prop2',
          seller_id: user!.id,
          buyer_id: 'buyer1',
          total_amount: 35000000,
          deposit_amount: 3500000,
          remaining_amount: 31500000,
          escrow_fee: 525000,
          status: 'FULL_PAYMENT',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          property: {
            title: 'Appartement Marcory',
            city_name: 'Abidjan',
          },
          buyer: {
            name: 'Marie Diallo',
          },
        },
      ];

      setEscrows(mockData);
      calculateStats(mockData);
    } catch (error) {
      console.error('Erreur chargement escrows:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (data: MockEscrow[]) => {
    const stats = {
      total: data.length,
      asBuyer: data.filter((e) => e.buyer_id === user!.id).length,
      asSeller: data.filter((e) => e.seller_id === user!.id).length,
      totalAmount: data.reduce((sum, e) => sum + e.total_amount, 0),
    };
    setStats(stats);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEscrows();
  };

  const getFilteredEscrows = () => {
    switch (activeTab) {
      case 'buyer':
        return escrows.filter((e) => e.buyer_id === user!.id);
      case 'seller':
        return escrows.filter((e) => e.seller_id === user!.id);
      default:
        return escrows;
    }
  };

  const handleEscrowPress = (escrow: MockEscrow) => {
    router.push(`/payment/${escrow.id}` as any);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: EscrowStatus) => {
    const configs = {
      PENDING: { color: '#F59E0B', icon: AlertCircle, label: 'En attente' },
      DEPOSIT_PAID: { color: '#3B82F6', icon: CheckCircle, label: 'Acompte payé' },
      FULL_PAYMENT: { color: '#10B981', icon: CheckCircle, label: 'Paiement complet' },
      RELEASED: { color: '#10B981', icon: CheckCircle, label: 'Fonds libérés' },
      CANCELLED: { color: '#EF4444', icon: AlertCircle, label: 'Annulé' },
    };
    return configs[status];
  };

  // État non connecté
  if (!isAuthenticated) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Paiements',
            headerStyle: { backgroundColor: Colors.light.background },
            headerTitleStyle: { fontWeight: '700' as const },
          }}
        />
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.guestContainer}
          >
            <View style={styles.guestIcon}>
              <Lock size={48} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.guestTitle}>Connectez-vous</Text>
            <Text style={styles.guestSubtitle}>
              Accédez à vos transactions sécurisées BakroSur Pay
            </Text>

            <View style={styles.guestButtons}>
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
                <Text style={styles.signupButtonText}>S'inscrire</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Paiements',
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

  const filteredEscrows = getFilteredEscrows();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Paiements',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />
      <View style={styles.container}>
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.light.primary + '20' }]}>
              <DollarSign size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.statValue}>{formatAmount(stats.totalAmount)}</Text>
            <Text style={styles.statLabel}>Volume (FCFA)</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#3B82F620' }]}>
              <TrendingUp size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{stats.asBuyer}</Text>
            <Text style={styles.statLabel}>Achats</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
              <CheckCircle size={20} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{stats.asSeller}</Text>
            <Text style={styles.statLabel}>Ventes</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              Toutes ({stats.total})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'buyer' && styles.tabActive]}
            onPress={() => setActiveTab('buyer')}
          >
            <Text style={[styles.tabText, activeTab === 'buyer' && styles.tabTextActive]}>
              Achats ({stats.asBuyer})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'seller' && styles.tabActive]}
            onPress={() => setActiveTab('seller')}
          >
            <Text style={[styles.tabText, activeTab === 'seller' && styles.tabTextActive]}>
              Ventes ({stats.asSeller})
            </Text>
          </Pressable>
        </View>

        {/* Liste des transactions */}
        {filteredEscrows.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Lock size={64} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>Aucune transaction</Text>
            <Text style={styles.emptySubtitle}>
              Vos paiements sécurisés apparaîtront ici
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.light.primary]}
                tintColor={Colors.light.primary}
              />
            }
          >
            <View style={styles.escrowsList}>
              {filteredEscrows.map((escrow) => {
                const statusConfig = getStatusConfig(escrow.status);
                const StatusIcon = statusConfig.icon;
                const isBuyer = escrow.buyer_id === user!.id;

                return (
                  <Pressable
                    key={escrow.id}
                    style={({ pressed }) => [
                      styles.escrowCard,
                      pressed && styles.escrowCardPressed,
                    ]}
                    onPress={() => handleEscrowPress(escrow)}
                  >
                    {/* Statut */}
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
                      <StatusIcon size={16} color="white" />
                      <Text style={styles.statusText}>{statusConfig.label}</Text>
                    </View>

                    {/* Propriété */}
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {escrow.property?.title || 'Propriété'}
                    </Text>
                    <Text style={styles.propertyLocation}>
                      📍 {escrow.property?.city_name}
                    </Text>

                    {/* Montants */}
                    <View style={styles.amountRow}>
                      <Text style={styles.amountLabel}>Montant total</Text>
                      <Text style={styles.amountValue}>
                        {formatAmount(escrow.total_amount)} FCFA
                      </Text>
                    </View>

                    {escrow.status !== 'RELEASED' && escrow.status !== 'CANCELLED' && (
                      <>
                        <View style={styles.amountRow}>
                          <Text style={styles.amountLabel}>Acompte</Text>
                          <Text style={[styles.amountValue, { color: '#3B82F6' }]}>
                            {formatAmount(escrow.deposit_amount)} FCFA
                          </Text>
                        </View>
                        <View style={styles.amountRow}>
                          <Text style={styles.amountLabel}>Reste</Text>
                          <Text style={[styles.amountValue, { color: '#F59E0B' }]}>
                            {formatAmount(escrow.remaining_amount)} FCFA
                          </Text>
                        </View>
                      </>
                    )}

                    {/* Rôle */}
                    <Text style={styles.roleText}>
                      {isBuyer ? '👤 Vous (Acheteur)' : '💼 Vous (Vendeur)'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </>
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
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  guestIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  guestSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  guestButtons: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  signupButton: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: Colors.light.background,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.primary,
    fontWeight: '700' as const,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  escrowsList: {
    padding: 16,
    gap: 12,
  },
  escrowCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  escrowCardPressed: {
    opacity: 0.7,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: 'white',
  },
  propertyTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 8,
  },
  propertyLocation: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  amountValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  roleText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 8,
  },
});
