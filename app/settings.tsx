import { router, Stack } from 'expo-router';
import { ChevronRight, Globe, Lock, Moon, Shield, Bell, DollarSign } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCurrencySymbol } from '@/constants/currencies';

export default function SettingsScreen() {
  const { user } = useAuth();
  const { selectedCurrency } = useCurrency();
  const { getCurrentLanguageInfo } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const currentLanguage = getCurrentLanguageInfo();

  return (
    <>
      <Stack.Screen options={{ title: 'Paramètres' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AFFICHAGE</Text>

          <View style={styles.settingsList}>
            <Pressable
              style={styles.settingItem}
              onPress={() => router.push('/notifications-settings' as any)}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Bell size={20} color={Colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <View style={styles.settingRight}>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{
                    false: Colors.light.border,
                    true: Colors.light.primary,
                  }}
                  thumbColor={Colors.light.background}
                />
              </View>
            </Pressable>

            <Pressable style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Moon size={20} color={Colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>Mode sombre</Text>
              </View>
              <View style={styles.settingRight}>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{
                    false: Colors.light.border,
                    true: Colors.light.primary,
                  }}
                  thumbColor={Colors.light.background}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRÉFÉRENCES</Text>

          <View style={styles.settingsList}>
            <Pressable
              style={styles.settingItem}
              onPress={() => console.log('Language settings')}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Globe size={20} color={Colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>Langue</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{currentLanguage.flag} {currentLanguage.name}</Text>
                <ChevronRight size={20} color={Colors.light.textSecondary} />
              </View>
            </Pressable>

            <Pressable
              style={styles.settingItem}
              onPress={() => console.log('Currency settings')}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <DollarSign size={20} color={Colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>Devise</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{getCurrencySymbol(selectedCurrency)}</Text>
                <ChevronRight size={20} color={Colors.light.textSecondary} />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SÉCURITÉ</Text>

          <View style={styles.settingsList}>
            <Pressable style={styles.settingItem} onPress={() => console.log('Change password')}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Lock size={20} color={Colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>Changer le mot de passe</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </Pressable>

            <Pressable style={styles.settingItem} onPress={() => router.push('/verification/kyc' as any)}>
              <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                  <Shield size={20} color={Colors.light.primary} />
                </View>
                <Text style={styles.settingLabel}>Vérification de compte</Text>
              </View>
              <View style={styles.settingRight}>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        user?.kycStatus === 'APPROVED'
                          ? Colors.light.success
                          : Colors.light.warning,
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {user?.kycStatus === 'APPROVED' ? 'Vérifié' : 'En attente'}
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.light.textSecondary} />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ASSISTANCE</Text>

          <View style={styles.settingsList}>
            <Pressable style={styles.settingItem} onPress={() => console.log('Help center')}>
              <Text style={styles.settingLabel}>Centre d&apos;aide</Text>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </Pressable>

            <Pressable style={styles.settingItem} onPress={() => console.log('Privacy policy')}>
              <Text style={styles.settingLabel}>Politique de confidentialité</Text>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </Pressable>

            <Pressable style={styles.settingItem} onPress={() => console.log('Terms')}>
              <Text style={styles.settingLabel}>Conditions d&apos;utilisation</Text>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>BAKRÔSUR v1.0.0</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  content: {
    paddingBottom: 32,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  settingsList: {
    backgroundColor: Colors.light.background,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  version: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
