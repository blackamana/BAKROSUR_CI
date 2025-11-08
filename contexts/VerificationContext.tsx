import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { KYCData, PropertyVerification, VerificationBadge, VerificationBadgeType } from '@/constants/verification';
import { VERIFICATION_BADGES } from '@/constants/verification';

const KYC_STORAGE_KEY = '@bakrôsur_kyc';
const PROPERTY_VERIFICATIONS_KEY = '@bakrôsur_property_verifications';

export const [VerificationProvider, useVerification] = createContextHook(() => {
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [propertyVerifications, setPropertyVerifications] = useState<PropertyVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [kycStored, propertyVerificationsStored] = await Promise.all([
        AsyncStorage.getItem(KYC_STORAGE_KEY),
        AsyncStorage.getItem(PROPERTY_VERIFICATIONS_KEY),
      ]);

      if (kycStored) {
        setKycData(JSON.parse(kycStored));
      }

      if (propertyVerificationsStored) {
        setPropertyVerifications(JSON.parse(propertyVerificationsStored));
      }
    } catch (error) {
      console.error('Error loading verification data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitKYC = useCallback(async (data: KYCData) => {
    try {
      const kycWithStatus: KYCData = {
        ...data,
        status: 'IN_REVIEW',
        submittedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(kycWithStatus));
      setKycData(kycWithStatus);

      return { success: true };
    } catch (error) {
      console.error('Error submitting KYC:', error);
      return { success: false, error: 'Erreur lors de la soumission' };
    }
  }, []);

  const updateKYCStatus = useCallback(async (
    status: KYCData['status'],
    notes?: string
  ) => {
    if (!kycData) return;

    try {
      const updatedKYC: KYCData = {
        ...kycData,
        status,
        reviewedAt: new Date().toISOString(),
        notes,
      };

      await AsyncStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(updatedKYC));
      setKycData(updatedKYC);

      return { success: true };
    } catch (error) {
      console.error('Error updating KYC status:', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  }, [kycData]);

  const submitPropertyVerification = useCallback(async (data: PropertyVerification) => {
    try {
      const verificationWithStatus: PropertyVerification = {
        ...data,
        status: 'IN_REVIEW',
        submittedAt: new Date().toISOString(),
      };

      const updated = [...propertyVerifications, verificationWithStatus];
      await AsyncStorage.setItem(PROPERTY_VERIFICATIONS_KEY, JSON.stringify(updated));
      setPropertyVerifications(updated);

      return { success: true };
    } catch (error) {
      console.error('Error submitting property verification:', error);
      return { success: false, error: 'Erreur lors de la soumission' };
    }
  }, [propertyVerifications]);

  const updatePropertyVerificationStatus = useCallback(async (
    propertyId: string,
    status: PropertyVerification['status'],
    badge?: VerificationBadgeType
  ) => {
    try {
      const updated = propertyVerifications.map(pv => {
        if (pv.propertyId === propertyId) {
          const updatedVerification: PropertyVerification = {
            ...pv,
            status,
            reviewedAt: new Date().toISOString(),
          };

          if (badge && status === 'APPROVED') {
            const badgeTemplate = VERIFICATION_BADGES[badge];
            updatedVerification.badge = {
              ...badgeTemplate,
              earnedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            };
          }

          return updatedVerification;
        }
        return pv;
      });

      await AsyncStorage.setItem(PROPERTY_VERIFICATIONS_KEY, JSON.stringify(updated));
      setPropertyVerifications(updated);

      return { success: true };
    } catch (error) {
      console.error('Error updating property verification status:', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  }, [propertyVerifications]);

  const getPropertyVerification = useCallback((propertyId: string) => {
    return propertyVerifications.find(pv => pv.propertyId === propertyId);
  }, [propertyVerifications]);

  const getUserBadges = useCallback((): VerificationBadge[] => {
    const badges: VerificationBadge[] = [];

    if (kycData?.status === 'APPROVED') {
      const badge = VERIFICATION_BADGES.VERIFIED_OWNER;
      badges.push({
        ...badge,
        earnedAt: kycData.reviewedAt || kycData.submittedAt || new Date().toISOString(),
      });
    }

    const approvedProperties = propertyVerifications.filter(pv => pv.status === 'APPROVED');
    if (approvedProperties.length >= 3) {
      const badge = VERIFICATION_BADGES.TRUSTED_SELLER;
      badges.push({
        ...badge,
        earnedAt: new Date().toISOString(),
      });
    }

    return badges;
  }, [kycData, propertyVerifications]);

  const clearVerificationData = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(KYC_STORAGE_KEY),
        AsyncStorage.removeItem(PROPERTY_VERIFICATIONS_KEY),
      ]);
      setKycData(null);
      setPropertyVerifications([]);
    } catch (error) {
      console.error('Error clearing verification data:', error);
    }
  }, []);

  return useMemo(
    () => ({
      kycData,
      propertyVerifications,
      isLoading,
      submitKYC,
      updateKYCStatus,
      submitPropertyVerification,
      updatePropertyVerificationStatus,
      getPropertyVerification,
      getUserBadges,
      clearVerificationData,
    }),
    [
      kycData,
      propertyVerifications,
      isLoading,
      submitKYC,
      updateKYCStatus,
      submitPropertyVerification,
      updatePropertyVerificationStatus,
      getPropertyVerification,
      getUserBadges,
      clearVerificationData,
    ]
  );
});
