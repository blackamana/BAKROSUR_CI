import { router, Stack } from 'expo-router';
import { ArrowLeft, Bell, BellOff } from 'lucide-react-native';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { useSMS } from '@/contexts/SMSContext';

export default function NotificationsSettingsScreen() {
  const { preferences, updatePreferences } = useSMS();

  const settings = [
    {
      key: 'propertyAlerts' as const,
      title: 'Nouvelles propriétés',
      description: 'Recevez des alertes pour les nouvelles propriétés correspondant à vos critères',
      icon: '🏠',
    },
    {
      key: 'appointmentReminders' as const,
      title: 'Rappels de rendez-vous',
      description: 'Recevez des rappels avant vos visites de propriétés',
      icon: '📅',
    },
    {
      key: 'paymentNotifications' as const,
      title: 'Notifications de paiement',
      description: 'Confirmations et statuts de vos transactions Mobile Money',
      icon: '💳',
    },
    {
      key: 'verificationUpdates' as const,
      title: 'Mises à jour de vérification',
      description: 'Statut de vos demandes de vérification KYC et propriété',
      icon: '✅',
    },
    {
      key: 'messageNotifications' as const,
      title: 'Nouveaux messages',
      description: 'Notifications pour les nouveaux messages de chat',
      icon: '💬',
    },
    {
      key: 'priceDropAlerts' as const,
      title: 'Baisses de prix',
      description: 'Alertes quand le prix de vos propriétés favorites baisse',
      icon: '💰',
    },
  ];

  const handleToggle = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  const allEnabled = Object.values(preferences).every(Boolean);
  const toggleAll = () => {
    const newValue = !allEnabled;
    updatePreferences({
      propertyAlerts: newValue,
      appointmentReminders: newValue,
      paymentNotifications: newValue,
      verificationUpdates: newValue,
      messageNotifications: newValue,
      priceDropAlerts: newValue,
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Notifications SMS',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.light.text} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {allEnabled ? (
              <Bell size={48} color={Colors.light.primary} />
            ) : (
              <BellOff size={48} color={Colors.light.textSecondary} />
            )}
          </View>
          <Text style={styles.title}>Notifications SMS</Text>
          <Text style={styles.subtitle}>
            Gérez vos préférences de notifications par SMS. Les notifications vous permettent de rester informé en temps réel.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.masterToggle}>
            <View style={styles.masterToggleContent}>
              <Text style={styles.masterToggleTitle}>Toutes les notifications</Text>
              <Text style={styles.masterToggleSubtitle}>
                {allEnabled ? 'Activer' : 'Désactiver'} toutes les notifications
              </Text>
            </View>
            <Switch
              value={allEnabled}
              onValueChange={toggleAll}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor={Colors.light.background}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Types de notifications</Text>
          {settings.map((setting, index) => (
            <View
              key={setting.key}
              style={[
                styles.settingCard,
                index === settings.length - 1 && styles.settingCardLast,
              ]}
            >
              <View style={styles.settingIconContainer}>
                <Text style={styles.settingIcon}>{setting.icon}</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={preferences[setting.key]}
                onValueChange={() => handleToggle(setting.key)}
                trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                thumbColor={Colors.light.background}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>📱 À propos des SMS</Text>
          <Text style={styles.infoText}>
            Les notifications SMS sont envoyées uniquement pour les événements importants. 
            Coût: 10 FCFA par SMS (facturé par votre opérateur).
          </Text>
          <Text style={styles.infoText}>
            Les SMS sont plus fiables que les notifications push en Côte d&apos;Ivoire, 
            surtout en cas de connexion internet instable.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  masterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.primary + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  masterToggleContent: {
    flex: 1,
    marginRight: 12,
  },
  masterToggleTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  masterToggleSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  settingCardLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    marginRight: 12,
  },
  settingIcon: {
    fontSize: 24,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  infoSection: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.secondary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
});
