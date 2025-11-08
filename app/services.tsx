import { router, Stack } from 'expo-router';
import { Building, FileText, Shield, Truck, Hammer } from 'lucide-react-native';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

type Service = {
  id: string;
  icon: any;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
};

const SERVICES: Service[] = [
  {
    id: 'construction-works',
    icon: Hammer,
    title: 'Annonces de travaux',
    description: 'Artisans, trouvez des opportunités de travaux. Particuliers, publiez vos besoins',
    features: [
      'Construction et rénovation',
      'Plomberie et électricité',
      'Peinture et carrelage',
      'Contact direct avec clients',
    ],
    ctaText: 'Voir les annonces',
  },
  {
    id: 'notary',
    icon: FileText,
    title: 'Notaires partenaires',
    description: 'Mise en relation avec des notaires de confiance pour finaliser vos transactions',
    features: [
      'Notaires vérifiés et expérimentés',
      'Accompagnement complet',
      'Tarifs transparents',
      'Rendez-vous rapides',
    ],
    ctaText: 'Contacter un notaire',
  },
  {
    id: 'property-manager',
    icon: Building,
    title: 'Gestionnaires de propriété',
    description: 'Confiez la gestion de votre bien à des professionnels',
    features: [
      'Gestion locative complète',
      'Recherche de locataires',
      'Entretien et maintenance',
      'Suivi administratif',
    ],
    ctaText: 'Trouver un gestionnaire',
  },
  {
    id: 'insurance',
    icon: Shield,
    title: 'Assurance habitation',
    description: 'Protégez votre bien avec nos partenaires d\'assurance',
    features: [
      'Couverture complète',
      'Devis en ligne gratuit',
      'Tarifs préférentiels',
      'Assistance 24/7',
    ],
    ctaText: 'Obtenir un devis',
  },
  {
    id: 'moving',
    icon: Truck,
    title: 'Services de déménagement',
    description: 'Déménagez en toute sérénité avec nos partenaires',
    features: [
      'Équipes professionnelles',
      'Emballage et déballage',
      'Matériel fourni',
      'Assurance transport',
    ],
    ctaText: 'Demander un devis',
  },
];

export default function ServicesScreen() {
  const { isAuthenticated } = useAuth();

  const handleServiceRequest = (serviceId: string, serviceName: string) => {
    if (serviceId === 'construction-works') {
      router.push('/construction-works' as any);
      return;
    }

    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour accéder à ce service',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/auth/login' as any) },
        ]
      );
      return;
    }

    Alert.alert(
      'Demande envoyée',
      `Votre demande pour ${serviceName} a été envoyée. Un conseiller vous contactera sous 24h.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Services',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Services additionnels</Text>
            <Text style={styles.headerSubtitle}>
              Facilitez vos démarches immobilières avec nos partenaires de confiance
            </Text>
          </View>

          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <View key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceIconContainer}>
                    <Icon size={32} color={Colors.light.primary} />
                  </View>

                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>

                  <View style={styles.featuresList}>
                    {service.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Text style={styles.featureBullet}>✓</Text>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <Pressable
                    style={styles.ctaButton}
                    onPress={() =>
                      handleServiceRequest(service.id, service.title)
                    }
                  >
                    <Text style={styles.ctaButtonText}>{service.ctaText}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Pourquoi nos services ?</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>🤝</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoItemTitle}>
                    Partenaires vérifiés
                  </Text>
                  <Text style={styles.infoItemText}>
                    Tous nos partenaires sont soigneusement sélectionnés et vérifiés
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>💰</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoItemTitle}>Tarifs préférentiels</Text>
                  <Text style={styles.infoItemText}>
                    Bénéficiez de tarifs négociés pour les utilisateurs BAKRÔSUR
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⚡</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoItemTitle}>Réponse rapide</Text>
                  <Text style={styles.infoItemText}>
                    Nos partenaires s&apos;engagent à vous répondre sous 24h
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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
  header: {
    backgroundColor: Colors.light.background,
    padding: 24,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  servicesGrid: {
    padding: 16,
    gap: 16,
  },
  serviceCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureBullet: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.success,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  infoSection: {
    backgroundColor: Colors.light.background,
    padding: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 20,
  },
  infoList: {
    gap: 20,
  },
  infoItem: {
    flexDirection: 'row',
    gap: 16,
  },
  infoIcon: {
    fontSize: 32,
  },
  infoContent: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  infoItemText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
});
