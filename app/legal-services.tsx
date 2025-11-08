import { router } from 'expo-router';
import {
  FileCheck,
  FileSignature,
  Shield,
  MessageSquare,
  CheckCircle,
  ChevronRight,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';

type ServiceCard = {
  id: string;
  icon: any;
  title: string;
  description: string;
  route: string;
  badge?: string;
  badgeColor?: string;
};

export default function LegalServicesScreen() {
  const services: ServiceCard[] = [
    {
      id: '1',
      icon: MessageSquare,
      title: 'Consultation juridique',
      description: 'Chat avec des notaires et avocats spécialisés en immobilier',
      route: '/legal/consultation',
    },
    {
      id: '2',
      icon: FileCheck,
      title: 'Vérification de documents',
      description: 'Upload et validation de vos documents par des experts',
      route: '/legal/document-verification',
    },
    {
      id: '3',
      icon: FileSignature,
      title: 'Contrats numériques',
      description: 'Signature électronique sécurisée de vos contrats',
      route: '/legal/contracts',
      badge: 'Beta',
      badgeColor: Colors.light.warning,
    },
    {
      id: '4',
      icon: CheckCircle,
      title: 'Suivi des démarches',
      description: 'Suivez l\'avancement de vos procédures administratives',
      route: '/legal/procedures',
    },
    {
      id: '5',
      icon: Shield,
      title: 'Assurances',
      description: 'Recommandations d\'assurances habitation et partenaires',
      route: '/legal/insurance',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Services Juridiques</Text>
          <Text style={styles.subtitle}>
            Tous les outils pour sécuriser vos transactions immobilières
          </Text>
        </View>

        <View style={styles.servicesContainer}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Pressable
                key={service.id}
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.serviceCardPressed,
                ]}
                onPress={() => router.push(service.route as any)}
                android_ripple={{ color: Colors.light.backgroundSecondary }}
              >
                <View style={styles.serviceIconContainer}>
                  <Icon size={28} color={Colors.light.primary} />
                </View>

                <View style={styles.serviceContent}>
                  <View style={styles.serviceTitleRow}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    {service.badge && (
                      <View
                        style={[
                          styles.badge,
                          service.badgeColor && {
                            backgroundColor: service.badgeColor,
                          },
                        ]}
                      >
                        <Text style={styles.badgeText}>{service.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                </View>

                <ChevronRight size={20} color={Colors.light.textSecondary} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Shield size={32} color={Colors.light.success} />
            <Text style={styles.infoTitle}>Sécurité garantie</Text>
            <Text style={styles.infoText}>
              Tous nos professionnels sont vérifiés et certifiés par l'Ordre des Avocats et la Chambre des Notaires de Côte d'Ivoire
            </Text>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: Colors.light.background,
    padding: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  servicesContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  serviceCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceContent: {
    flex: 1,
    gap: 6,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  badge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  infoSection: {
    paddingHorizontal: 16,
  },
  infoCard: {
    backgroundColor: Colors.light.success + '15',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.success + '30',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
