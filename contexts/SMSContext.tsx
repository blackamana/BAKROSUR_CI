import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo, useCallback } from 'react';

import {
  SMSNotification,
  SMSNotificationType,
  SMSPreferences,
  DEFAULT_SMS_PREFERENCES,
  formatSMSMessage,
  normalizePhoneNumber,
} from '@/constants/sms';

const SMS_STORAGE_KEY = '@bakrosur_sms';
const SMS_PREFERENCES_KEY = '@bakrosur_sms_preferences';

export const [SMSProvider, useSMS] = createContextHook(() => {
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [preferences, setPreferences] = useState<SMSPreferences>(DEFAULT_SMS_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedNotifications, storedPreferences] = await Promise.all([
        AsyncStorage.getItem(SMS_STORAGE_KEY),
        AsyncStorage.getItem(SMS_PREFERENCES_KEY),
      ]);

      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }

      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error('Error loading SMS data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotifications = async (newNotifications: SMSNotification[]) => {
    try {
      await AsyncStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error saving SMS notifications:', error);
    }
  };

  const savePreferences = async (newPreferences: SMSPreferences) => {
    try {
      await AsyncStorage.setItem(SMS_PREFERENCES_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving SMS preferences:', error);
    }
  };

  const sendSMS = useCallback(async (
    phoneNumber: string,
    type: SMSNotificationType,
    data: Record<string, string>,
    propertyId?: string,
    userId?: string
  ): Promise<SMSNotification> => {
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const message = formatSMSMessage(type, data);

    const notification: SMSNotification = {
      id: Date.now().toString(),
      phoneNumber: normalizedPhone,
      message,
      type,
      status: 'PENDING',
      propertyId,
      userId,
      createdAt: new Date().toISOString(),
    };

    const updatedNotifications = [notification, ...notifications];
    await saveNotifications(updatedNotifications);

    setTimeout(async () => {
      const simulatedStatus = Math.random() > 0.1 ? 'SENT' : 'FAILED';
      await updateSMSStatus(notification.id, simulatedStatus);
      
      if (simulatedStatus === 'SENT') {
        setTimeout(async () => {
          await updateSMSStatus(notification.id, 'DELIVERED');
        }, 2000);
      }
    }, 1500);

    return notification;
  }, [notifications]);

  const updateSMSStatus = useCallback(async (
    notificationId: string,
    status: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED'
  ) => {
    const updatedNotifications = notifications.map((n) => {
      if (n.id === notificationId) {
        const updated = { ...n, status };
        if (status === 'SENT' && !n.sentAt) {
          updated.sentAt = new Date().toISOString();
        }
        if (status === 'DELIVERED' && !n.deliveredAt) {
          updated.deliveredAt = new Date().toISOString();
        }
        return updated;
      }
      return n;
    });
    await saveNotifications(updatedNotifications);
  }, [notifications]);

  const updatePreferences = useCallback(async (newPreferences: Partial<SMSPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    await savePreferences(updated);
  }, [preferences]);

  const getSMSById = useCallback((notificationId: string): SMSNotification | undefined => {
    return notifications.find((n) => n.id === notificationId);
  }, [notifications]);

  const getSMSByProperty = useCallback((propertyId: string): SMSNotification[] => {
    return notifications.filter((n) => n.propertyId === propertyId);
  }, [notifications]);

  const getSMSByType = useCallback((type: SMSNotificationType): SMSNotification[] => {
    return notifications.filter((n) => n.type === type);
  }, [notifications]);

  const isNotificationEnabled = useCallback((type: SMSNotificationType): boolean => {
    const mapping: Record<SMSNotificationType, keyof SMSPreferences> = {
      PROPERTY_ALERT: 'propertyAlerts',
      APPOINTMENT_CONFIRMATION: 'appointmentReminders',
      APPOINTMENT_REMINDER: 'appointmentReminders',
      PAYMENT_SUCCESS: 'paymentNotifications',
      PAYMENT_FAILED: 'paymentNotifications',
      VERIFICATION_STATUS: 'verificationUpdates',
      NEW_MESSAGE: 'messageNotifications',
      PRICE_DROP: 'priceDropAlerts',
    };

    const preferenceKey = mapping[type];
    return preferences[preferenceKey];
  }, [preferences]);

  return useMemo(() => ({
    notifications,
    preferences,
    isLoading,
    sendSMS,
    updateSMSStatus,
    updatePreferences,
    getSMSById,
    getSMSByProperty,
    getSMSByType,
    isNotificationEnabled,
  }), [
    notifications,
    preferences,
    isLoading,
    sendSMS,
    updateSMSStatus,
    updatePreferences,
    getSMSById,
    getSMSByProperty,
    getSMSByType,
    isNotificationEnabled,
  ]);
});
