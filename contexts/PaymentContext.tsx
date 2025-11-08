import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo, useCallback } from 'react';

import { MobileMoneyPayment, MobileMoneyProvider, PaymentGateway } from '@/constants/mobile-money';

const PAYMENTS_STORAGE_KEY = '@bakrosur_payments';

export const [PaymentProvider, usePayment] = createContextHook(() => {
  const [payments, setPayments] = useState<MobileMoneyPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const stored = await AsyncStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (stored) {
        setPayments(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePayments = async (newPayments: MobileMoneyPayment[]) => {
    try {
      await AsyncStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(newPayments));
      setPayments(newPayments);
    } catch (error) {
      console.error('Error saving payments:', error);
    }
  };

  const initiatePayment = useCallback(async (
    provider: MobileMoneyProvider,
    phoneNumber: string,
    amount: number,
    propertyId?: string,
    gateway: PaymentGateway = 'CINETPAY'
  ): Promise<MobileMoneyPayment> => {
    const payment: MobileMoneyPayment = {
      id: Date.now().toString(),
      provider,
      phoneNumber,
      amount,
      currency: 'XOF',
      status: 'PENDING',
      propertyId,
      gateway,
      createdAt: new Date().toISOString(),
    };

    const updatedPayments = [payment, ...payments];
    await savePayments(updatedPayments);

    setTimeout(async () => {
      const simulatedStatus = Math.random() > 0.2 ? 'SUCCESS' : 'FAILED';
      await updatePaymentStatus(payment.id, simulatedStatus);
    }, 3000);

    return payment;
  }, [payments]);

  const updatePaymentStatus = useCallback(async (
    paymentId: string,
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  ) => {
    const updatedPayments = payments.map((p) =>
      p.id === paymentId ? { ...p, status } : p
    );
    await savePayments(updatedPayments);
  }, [payments]);

  const getPaymentById = useCallback((paymentId: string): MobileMoneyPayment | undefined => {
    return payments.find((p) => p.id === paymentId);
  }, [payments]);

  const getPaymentsByProperty = useCallback((propertyId: string): MobileMoneyPayment[] => {
    return payments.filter((p) => p.propertyId === propertyId);
  }, [payments]);

  return useMemo(() => ({
    payments,
    isLoading,
    initiatePayment,
    updatePaymentStatus,
    getPaymentById,
    getPaymentsByProperty,
  }), [payments, isLoading, initiatePayment, updatePaymentStatus, getPaymentById, getPaymentsByProperty]);
});
