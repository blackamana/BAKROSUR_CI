import { Stack } from 'expo-router';
import {
  Shield,
  Home,
  Flame,
  Droplet,
  Zap,
  CheckCircle,
  ExternalLink,
  Phone,
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';

type InsuranceType = {
  id: string;
  icon: any;
  title: string;
  description: string;
  coverage: string[];
  recommended: boolean;
};

type InsurancePartner = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  minPrice: number;
  phone: string;
  website: string;
};

export default function InsuranceScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const insuranceTypes: InsuranceType[] = [
    {
      id: 'multirisque',
      icon: Home,
      title: 'Multirisque Habitation',
      description: 'Protection complète pour votre logement',
      coverage: [
        'Incendie et explosion',
        'Dégâts des eaux',
        'Vol et vandalisme',
        'Catastrophes naturelles',
        'Responsabilité civile',
      ],
      recommended: true,
    },
    {
      id: 'fire',
      icon: Flame,
      title: 'Assurance Incendie',
      description: 'Protection contre les risques d\'incendie',
      coverage: [
        'Incendie',
        'Explosion',
        'Foudre',
        'Fumée',
      ],
      recommended: false,
    },
    {
      id: 'water',
      icon: Droplet,
      title: 'Dégâts des Eaux',
      description: 'Protection contre les inondations et fuites',
      coverage: [
        'Fuites d\'eau',
        'Rupture de canalisation',
        'Débordement',
        'Infiltration',
      ],
      recommended: false,
    },
    {
      id: 'content',
      icon: Shield,
      title: 'Assurance Contenu',
      description: 'Protection de vos biens personnels',
      coverage: [
        'Meubles et électroménager',
        'Équipements électroniques',
        'Vêtements et objets personnels',
        'Vol avec effraction',
      ],
      recommended: false,
    },
  ];

  const partners: InsurancePartner[] = [
    {
      id: '1',
      name: 'NSIA Assurances',
      logo: '🏢',
      rating: 4.5,
      minPrice: 35000,
      phone: '+22520212345',
      website: 'https://www.nsia.ci',
    },
    {
      id: '2',
      name: 'SUNU Assurances',
      logo: '🏢',
      rating: 4.3,
      minPrice: 32000,
      phone: '+22520223456',
      website: 'https://www.sunu.ci',
    },
    {
      id: '3',
      name: 'Atlantique Assurances',
      logo: '🏢',
      rating: 4.4,
      minPrice: 38000,
      phone: '+22520234567',
      website: 'https://www.atlantique-assurances.ci',
    },
  ];

  const handleCallPartner = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleVisitWebsite = (website: string) => {
    Linking.openURL(website);
  };

  const handleRequestQuote = (partner: InsurancePartner) => {
    Alert.alert(
      'Demande de devis',
      `Voulez-vous demander un devis à ${partner.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Demander',
          onPress: () => {
            Alert.alert('Succès', 'Votre demande a été envoyée! Vous serez contacté sous 24h.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Assurances',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTintColor: Colors.light.text,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Assurances habitation</Text>
          <Text style={styles.headerSubtitle}>
            Protégez votre bien immobilier avec nos partenaires de confiance
          </Text>
        </View>

        <View style={styles.typesSection}>
          <Text style={styles.sectionTitle}>Types d'assurance</Text>
          <View style={styles.typesContainer}>
            {insuranceTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Pressable
                  key={type.id}
                  style={({ pressed }) => [
                    styles.typeCard,
                    pressed && styles.typeCardPressed,
                  ]}
                  onPress={() => setSelectedType(type.id === selectedType ? null : type.id)}
                >
                  <View style={styles.typeHeader}>
                    <View style={styles.typeIconContainer}>
                      <Icon size={24} color={Colors.light.primary} />
                    </View>
                    <View style={styles.typeInfo}>
                      <View style={styles.typeTitleRow}>
                        <Text style={styles.typeTitle}>{type.title}</Text>
                        {type.recommended && (
                          <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedText}>Recommandé</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.typeDescription}>{type.description}</Text>
                    </View>
                  </View>

                  {selectedType === type.id && (
                    <View style={styles.coverageSection}>
                      <Text style={styles.coverageTitle}>Garanties incluses:</Text>
                      {type.coverage.map((item, index) => (
                        <View key={index} style={styles.coverageItem}>
                          <CheckCircle size={16} color={Colors.light.success} />
                          <Text style={styles.coverageText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.partnersSection}>
          <Text style={styles.sectionTitle}>Nos partenaires</Text>
          <View style={styles.partnersContainer}>
            {partners.map((partner) => (
              <View key={partner.id} style={styles.partnerCard}>
                <View style={styles.partnerHeader}>
                  <View style={styles.partnerLogo}>
                    <Text style={styles.partnerLogoText}>{partner.logo}</Text>
                  </View>
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <View style={styles.partnerRating}>
                      <Text style={styles.ratingText}>⭐ {partner.rating}/5</Text>
                    </View>
                    <Text style={styles.partnerPrice}>
                      À partir de {partner.minPrice.toLocaleString()} FCFA/an
                    </Text>
                  </View>
                </View>

                <View style={styles.partnerActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.partnerButton,
                      pressed && styles.partnerButtonPressed,
                    ]}
                    onPress={() => handleCallPartner(partner.phone)}
                  >
                    <Phone size={16} color={Colors.light.primary} />
                    <Text style={styles.partnerButtonText}>Appeler</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.partnerButton,
                      pressed && styles.partnerButtonPressed,
                    ]}
                    onPress={() => handleVisitWebsite(partner.website)}
                  >
                    <ExternalLink size={16} color={Colors.light.primary} />
                    <Text style={styles.partnerButtonText}>Site web</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.quoteButton,
                      pressed && styles.partnerButtonPressed,
                    ]}
                    onPress={() => handleRequestQuote(partner)}
                  >
                    <Text style={styles.quoteButtonText}>Devis gratuit</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Shield size={32} color={Colors.light.success} />
            <Text style={styles.infoTitle}>Pourquoi s'assurer ?</Text>
            <Text style={styles.infoText}>
              L'assurance habitation protège votre investissement contre les risques imprévus.
              {'\n\n'}
              En Côte d'Ivoire, elle est obligatoire pour les locataires et fortement recommandée pour les propriétaires.
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  typesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  typesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  typeCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  typeCardPressed: {
    opacity: 0.7,
  },
  typeHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeInfo: {
    flex: 1,
    gap: 6,
  },
  typeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  recommendedBadge: {
    backgroundColor: Colors.light.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.success,
  },
  typeDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  coverageSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: 10,
  },
  coverageTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  coverageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coverageText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  partnersSection: {
    marginBottom: 24,
  },
  partnersContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  partnerCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  partnerHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  partnerLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerLogoText: {
    fontSize: 28,
  },
  partnerInfo: {
    flex: 1,
    gap: 4,
  },
  partnerName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  partnerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  partnerPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  partnerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  partnerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  partnerButtonPressed: {
    opacity: 0.7,
  },
  partnerButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  quoteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },
  quoteButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  infoSection: {
    paddingHorizontal: 16,
  },
  infoCard: {
    backgroundColor: Colors.light.success + '15',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.success + '30',
  },
  infoTitle: {
    fontSize: 16,
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
