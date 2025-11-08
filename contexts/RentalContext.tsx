import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from './AuthContext';

import {
  MOCK_CONTRACTS,
  MOCK_MAINTENANCE,
  MOCK_PAYMENTS,
  MaintenanceRequest,
  RentalContract,
  RentPayment,
  type ContractStatus,
  type MaintenanceStatus,
  type PaymentMethod,
  type PaymentStatus,
} from '@/constants/rentals';

const RENTALS_STORAGE_KEY = '@bakrôsur_rentals';
const PAYMENTS_STORAGE_KEY = '@bakrôsur_payments';
const MAINTENANCE_STORAGE_KEY = '@bakrôsur_maintenance';

export const [RentalProvider, useRentals] = createContextHook(() => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedContracts, storedPayments, storedMaintenance] = await Promise.all([
        AsyncStorage.getItem(RENTALS_STORAGE_KEY),
        AsyncStorage.getItem(PAYMENTS_STORAGE_KEY),
        AsyncStorage.getItem(MAINTENANCE_STORAGE_KEY),
      ]);

      setContracts(storedContracts ? JSON.parse(storedContracts) : MOCK_CONTRACTS);
      setPayments(storedPayments ? JSON.parse(storedPayments) : MOCK_PAYMENTS);
      setMaintenanceRequests(storedMaintenance ? JSON.parse(storedMaintenance) : MOCK_MAINTENANCE);
    } catch (error) {
      console.error('Error loading rental data:', error);
      setContracts(MOCK_CONTRACTS);
      setPayments(MOCK_PAYMENTS);
      setMaintenanceRequests(MOCK_MAINTENANCE);
    } finally {
      setIsLoading(false);
    }
  };

  const landlordContracts = useMemo(() => {
    if (!user) return [];
    return contracts.filter((c) => c.landlordId === user.id || c.landlordId === 'landlord1');
  }, [contracts, user]);

  const tenantContracts = useMemo(() => {
    if (!user) return [];
    return contracts.filter((c) => c.tenantId === user.id || c.tenantId === 'tenant1');
  }, [contracts, user]);

  const landlordPayments = useMemo(() => {
    const contractIds = landlordContracts.map((c) => c.id);
    return payments.filter((p) => contractIds.includes(p.contractId));
  }, [payments, landlordContracts]);

  const tenantPayments = useMemo(() => {
    if (!user) return [];
    return payments.filter((p) => p.tenantId === user.id || p.tenantId === 'tenant1');
  }, [payments, user]);

  const landlordMaintenance = useMemo(() => {
    const propertyIds = landlordContracts.map((c) => c.propertyId);
    return maintenanceRequests.filter((m) => propertyIds.includes(m.propertyId));
  }, [maintenanceRequests, landlordContracts]);

  const tenantMaintenance = useMemo(() => {
    if (!user) return [];
    return maintenanceRequests.filter((m) => m.tenantId === user.id || m.tenantId === 'tenant1');
  }, [maintenanceRequests, user]);

  const addContract = useCallback(
    async (contract: Omit<RentalContract, 'id'>) => {
      const newContract: RentalContract = {
        ...contract,
        id: Date.now().toString(),
      };
      const updated = [...contracts, newContract];
      setContracts(updated);
      await AsyncStorage.setItem(RENTALS_STORAGE_KEY, JSON.stringify(updated));
      return newContract;
    },
    [contracts]
  );

  const updateContractStatus = useCallback(
    async (contractId: string, status: ContractStatus) => {
      const updated = contracts.map((c) => (c.id === contractId ? { ...c, status } : c));
      setContracts(updated);
      await AsyncStorage.setItem(RENTALS_STORAGE_KEY, JSON.stringify(updated));
    },
    [contracts]
  );

  const recordPayment = useCallback(
    async (
      contractId: string,
      paymentId: string,
      method: PaymentMethod,
      reference: string
    ) => {
      const updated = payments.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'PAYÉ' as PaymentStatus,
              paidDate: new Date().toISOString(),
              method,
              reference,
            }
          : p
      );
      setPayments(updated);
      await AsyncStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(updated));
    },
    [payments]
  );

  const addMaintenanceRequest = useCallback(
    async (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'status'>) => {
      const newRequest: MaintenanceRequest = {
        ...request,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'NOUVEAU',
      };
      const updated = [...maintenanceRequests, newRequest];
      setMaintenanceRequests(updated);
      await AsyncStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(updated));
      return newRequest;
    },
    [maintenanceRequests]
  );

  const updateMaintenanceStatus = useCallback(
    async (requestId: string, status: MaintenanceStatus, notes?: string) => {
      const updated = maintenanceRequests.map((m) =>
        m.id === requestId
          ? {
              ...m,
              status,
              notes: notes || m.notes,
              resolvedAt: status === 'RÉSOLU' ? new Date().toISOString() : m.resolvedAt,
            }
          : m
      );
      setMaintenanceRequests(updated);
      await AsyncStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(updated));
    },
    [maintenanceRequests]
  );

  const getLandlordStats = useCallback(() => {
    const totalProperties = landlordContracts.length;
    const activeContracts = landlordContracts.filter((c) => c.status === 'ACTIF').length;
    const totalMonthlyRevenue = landlordContracts
      .filter((c) => c.status === 'ACTIF')
      .reduce((sum, c) => sum + c.monthlyRent, 0);

    const paidPayments = landlordPayments.filter((p) => p.status === 'PAYÉ').length;
    const pendingPayments = landlordPayments.filter((p) => p.status === 'EN_ATTENTE').length;
    const latePayments = landlordPayments.filter((p) => p.status === 'EN_RETARD').length;

    const openMaintenance = landlordMaintenance.filter(
      (m) => m.status === 'NOUVEAU' || m.status === 'EN_COURS'
    ).length;

    return {
      totalProperties,
      activeContracts,
      totalMonthlyRevenue,
      paidPayments,
      pendingPayments,
      latePayments,
      openMaintenance,
    };
  }, [landlordContracts, landlordPayments, landlordMaintenance]);

  const getTenantStats = useCallback(() => {
    const activeContract = tenantContracts.find((c) => c.status === 'ACTIF');
    const nextPayment = tenantPayments
      .filter((p) => p.status === 'EN_ATTENTE' || p.status === 'EN_RETARD')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    const paidCount = tenantPayments.filter((p) => p.status === 'PAYÉ').length;
    const totalPaid = tenantPayments
      .filter((p) => p.status === 'PAYÉ')
      .reduce((sum, p) => sum + p.amount, 0);

    const openMaintenanceCount = tenantMaintenance.filter(
      (m) => m.status === 'NOUVEAU' || m.status === 'EN_COURS'
    ).length;

    return {
      activeContract,
      nextPayment,
      paidCount,
      totalPaid,
      openMaintenanceCount,
    };
  }, [tenantContracts, tenantPayments, tenantMaintenance]);

  return useMemo(
    () => ({
      contracts,
      payments,
      maintenanceRequests,
      landlordContracts,
      tenantContracts,
      landlordPayments,
      tenantPayments,
      landlordMaintenance,
      tenantMaintenance,
      isLoading,
      addContract,
      updateContractStatus,
      recordPayment,
      addMaintenanceRequest,
      updateMaintenanceStatus,
      getLandlordStats,
      getTenantStats,
    }),
    [
      contracts,
      payments,
      maintenanceRequests,
      landlordContracts,
      tenantContracts,
      landlordPayments,
      tenantPayments,
      landlordMaintenance,
      tenantMaintenance,
      isLoading,
      addContract,
      updateContractStatus,
      recordPayment,
      addMaintenanceRequest,
      updateMaintenanceStatus,
      getLandlordStats,
      getTenantStats,
    ]
  );
});
