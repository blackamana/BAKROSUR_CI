import { router } from 'expo-router';
import {
  Building2,
  ChevronRight,
  DollarSign,
  FileText,
  Globe,
  Heart,
  Home as HomeIcon,
  LogOut,
  Scale,
  Settings,
  Shield,
  User,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/colors';
import { getCurrencySymbol } from '@/constants/currencies';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import CurrencySelector from '@/components/CurrencySelector';
import LanguageSelector from '@/components/LanguageSelector';
import MessagingSection from '@/components/MessagingSection';

type MenuItem = {
  icon: any;
  label: string;
  onPress: () => void;
  badge?: string;
  badgeColor?: string;
};

export default function AccountScreen() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, refreshKey } = useAuth();
  const { selectedCurrency } = useCurrency();
  const { getCurrentLanguageInfo } = useLanguage();
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isAuthenticated);

  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, hasUser: !!user, refreshKey });
    setIsUserLoggedIn(isAuthenticated && !!user);
  }, [isAuthenticated, user, refreshKey]);

  if (!isUserLoggedIn) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.guestContainer}>
            <View style={styles.guestIcon}>
              <User size={48} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.guestTitle}>{t('account.guestTitle')}</Text>
            <Text style={styles.guestSubtitle}>
              {t('account.guestSubtitle')}
            </Text>

            <View style={styles.guestButtons}>
              <Pressable
                style={styles.loginButton}
                onPress={() => router.push('/auth/login' as any)}
              >
                <Text style={styles.loginButtonText}>{t('auth.login')}</Text>
              </Pressable>

              <Pressable
                style={styles.signupButton}
                onPress={() => router.push('/auth/signup' as any)}
              >
                <Text style={styles.signupButtonText}>{t('auth.signup')}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const getKYCBadge = () => {
    switch (user.kycStatus) {
      case 'APPROVED':
        return { text: t('account.kycStatus.approved'), color: Colors.light.success };
      case 'IN_REVIEW':
        return { text: t('account.kycStatus.inReview'), color: Colors.light.warning };
      case 'REJECTED':
        return { text: t('account.kycStatus.rejected'), color: Colors.light.error };
      default:
        return { text: t('account.kycStatus.notVerified'), color: Colors.light.textSecondary };
    }
  };

  const kycBadge = getKYCBadge();

  const handleLogout = () => {
    console.log('Logout button pressed');
    Alert.alert(t('auth.logout'), t('auth.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: async () => {
          console.log('Confirming logout');
          try {
            const result = await logout();
            console.log('Logout result:', result);
            if (result?.success) {
              console.log('User successfully logged out');
            } else {
              console.error('Logout failed:', result?.error);
              Alert.alert('Erreur', 'La déconnexion a échoué. Veuillez réessayer.');
            }
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
          }
        },
      },
    ]);
  };

  const currentLanguageInfo = getCurrentLanguageInfo();

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: t('account.managementRental'),
      items: [
        {
          icon: Building2,
          label: t('account.landlordDashboard'),
          onPress: () => router.push('/landlord' as any),
        },
        {
          icon: HomeIcon,
          label: t('account.tenantDashboard'),
          onPress: () => router.push('/tenant' as any),
        },
      ],
    },
    {
      title: t('account.myActivities'),
      items: [
        {
          icon: HomeIcon,
          label: t('account.myListings'),
          onPress: () => router.push('/my-properties' as any),
        },
        {
          icon: Heart,
          label: t('account.favorites'),
          onPress: () => router.push('/favorites' as any),
          badge: '3',
        },
        {
          icon: FileText,
          label: t('account.myRequests'),
          onPress: () => router.push('/appointments' as any),
        },
      ],
    },
    {
      title: t('account.services'),
      items: [
        {
          icon: Scale,
          label: t('account.legalServices'),
          onPress: () => router.push('/legal-services' as any),
        },
      ],
    },
    {
      title: t('account.accountSettings'),
      items: [
        {
          icon: Shield,
          label: t('account.kycVerification'),
          onPress: () => router.push('/verification/kyc' as any),
          badge: kycBadge.text,
          badgeColor: kycBadge.color,
        },
        {
          icon: Settings,
          label: t('account.settings'),
          onPress: () => router.push('/settings' as any),
        },
        {
          icon: DollarSign,
          label: t('account.currency'),
          onPress: () => setShowCurrencySelector(true),
          badge: getCurrencySymbol(selectedCurrency),
          badgeColor: Colors.light.secondary,
        },
        {
          icon: Globe,
          label: t('account.language'),
          onPress: () => setShowLanguageSelector(true),
          badge: currentLanguageInfo.flag,
          badgeColor: Colors.light.secondary,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* En-tête utilisateur */}
        <View style={styles.header}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {(user.name || 'U')
                .split(' ')
                .filter((n) => n.length > 0)
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U'}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.phone && (
              <Text style={styles.userPhone}>{user.phone}</Text>
            )}
          </View>
        </View>

        {/* 🆕 SECTION MESSAGERIE - Affichée en premier */}
        <MessagingSection user={user} />

        {/* Sections de menu existantes */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuList}>
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <Pressable
                    key={itemIndex}
                    style={({ pressed }) => [
                      styles.menuItem,
                      itemIndex === section.items.length - 1 &&
                        styles.menuItemLast,
                      pressed && styles.menuItemPressed,
                    ]}
                    onPress={() => {
                      console.log(`Menu item pressed: ${item.label}`);
                      item.onPress();
                    }}
                  >
                    <View style={styles.menuItemIcon}>
                      <Icon size={22} color={Colors.light.primary} />
                    </View>

                    <Text style={styles.menuItemLabel}>{item.label}</Text>

                    {item.badge && (
                      <View
                        style={[
                          styles.menuItemBadge,
                          item.badgeColor && { backgroundColor: item.badgeColor },
                        ]}
                      >
                        <Text style={styles.menuItemBadgeText}>{item.badge}</Text>
                      </View>
                    )}

                    <ChevronRight size={20} color={Colors.light.textSecondary} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {/* Bouton de déconnexion */}
        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.light.error} />
          <Text style={styles.logoutButtonText}>{t('auth.logout')}</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>

      {showCurrencySelector && (
        <CurrencySelector onClose={() => setShowCurrencySelector(false)} />
      )}

      {showLanguageSelector && (
        <LanguageSelector onClose={() => setShowLanguageSelector(false)} />
      )}
    </View>
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
  header: {
    backgroundColor: Colors.light.background,
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  userAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.background,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  menuList: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemPressed: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.light.text,
  },
  menuItemBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
  },
  menuItemBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.background,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 8,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  logoutButtonPressed: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.error,
  },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingTop: 120,
  },
  guestIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  guestButtons: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.background,
  },
  signupButton: {
    backgroundColor: Colors.light.background,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  signupButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.primary,
  },
});
