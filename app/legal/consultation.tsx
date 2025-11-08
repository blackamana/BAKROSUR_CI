import { router, Stack } from 'expo-router';
import {
  Scale,
  Briefcase,
  FileText,
  MessageCircle,
  Clock,
  Star,
  ChevronRight,
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';

type Professional = {
  id: string;
  name: string;
  type: 'notaire' | 'avocat';
  specialization: string;
  rating: number;
  reviewCount: number;
  availability: string;
  hourlyRate: number;
  verified: boolean;
};

export default function LegalConsultationScreen() {
  const [selectedType, setSelectedType] = useState<'notaire' | 'avocat' | 'all'>('all');

  const professionals: Professional[] = [
    {
      id: '1',
      name: 'Me Kouassi Jean',
      type: 'notaire',
      specialization: 'Transactions immobilières',
      rating: 4.9,
      reviewCount: 127,
      availability: 'Disponible aujourd\'hui',
      hourlyRate: 25000,
      verified: true,
    },
    {
      id: '2',
      name: 'Me Touré Aminata',
      type: 'avocat',
      specialization: 'Droit immobilier et foncier',
      rating: 4.8,
      reviewCount: 94,
      availability: 'Disponible demain',
      hourlyRate: 30000,
      verified: true,
    },
    {
      id: '3',
      name: 'Me Bamba Pierre',
      type: 'notaire',
      specialization: 'Successions et donations',
      rating: 4.7,
      reviewCount: 156,
      availability: 'Disponible aujourd\'hui',
      hourlyRate: 28000,
      verified: true,
    },
    {
      id: '4',
      name: 'Me Koné Sarah',
      type: 'avocat',
      specialization: 'Contentieux immobiliers',
      rating: 4.9,
      reviewCount: 203,
      availability: 'Prochaine disponibilité: 2 jours',
      hourlyRate: 35000,
      verified: true,
    },
  ];

  const filteredProfessionals = professionals.filter(
    (prof) => selectedType === 'all' || prof.type === selectedType
  );

  const handleStartChat = (professional: Professional) => {
    Alert.alert(
      'Consultation',
      `Voulez-vous démarrer une consultation avec ${professional.name} ?\n\nTarif: ${professional.hourlyRate.toLocaleString()} FCFA/heure`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Démarrer',
          onPress: () => {
            Alert.alert('Succès', 'Consultation démarrée! Vous serez bientôt contacté.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Consultation juridique',
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
          <Text style={styles.headerTitle}>Parlez à un expert</Text>
          <Text style={styles.headerSubtitle}>
            Obtenez des conseils juridiques de professionnels vérifiés
          </Text>
        </View>

        <View style={styles.filterSection}>
          <Pressable
            style={[
              styles.filterButton,
              selectedType === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType('all')}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === 'all' && styles.filterTextActive,
              ]}
            >
              Tous
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              selectedType === 'notaire' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType('notaire')}
          >
            <Scale size={16} color={selectedType === 'notaire' ? Colors.light.background : Colors.light.textSecondary} />
            <Text
              style={[
                styles.filterText,
                selectedType === 'notaire' && styles.filterTextActive,
              ]}
            >
              Notaires
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              selectedType === 'avocat' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType('avocat')}
          >
            <Briefcase size={16} color={selectedType === 'avocat' ? Colors.light.background : Colors.light.textSecondary} />
            <Text
              style={[
                styles.filterText,
                selectedType === 'avocat' && styles.filterTextActive,
              ]}
            >
              Avocats
            </Text>
          </Pressable>
        </View>

        <View style={styles.professionalsContainer}>
          {filteredProfessionals.map((professional) => (
            <View key={professional.id} style={styles.professionalCard}>
              <View style={styles.professionalHeader}>
                <View style={styles.professionalAvatar}>
                  <Text style={styles.professionalAvatarText}>
                    {professional.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Text>
                </View>
                <View style={styles.professionalInfo}>
                  <View style={styles.professionalNameRow}>
                    <Text style={styles.professionalName}>
                      {professional.name}
                    </Text>
                    {professional.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.professionalType}>
                    {professional.type === 'notaire' ? 'Notaire' : 'Avocat'}
                  </Text>
                  <Text style={styles.professionalSpecialization}>
                    {professional.specialization}
                  </Text>
                </View>
              </View>

              <View style={styles.professionalStats}>
                <View style={styles.statItem}>
                  <Star size={16} color={Colors.light.warning} fill={Colors.light.warning} />
                  <Text style={styles.statText}>
                    {professional.rating} ({professional.reviewCount})
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Clock size={16} color={Colors.light.success} />
                  <Text style={styles.statText}>{professional.availability}</Text>
                </View>
              </View>

              <View style={styles.professionalFooter}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Tarif:</Text>
                  <Text style={styles.price}>
                    {professional.hourlyRate.toLocaleString()} FCFA/h
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.chatButton,
                    pressed && styles.chatButtonPressed,
                  ]}
                  onPress={() => handleStartChat(professional)}
                >
                  <MessageCircle size={18} color={Colors.light.background} />
                  <Text style={styles.chatButtonText}>Consulter</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <FileText size={24} color={Colors.light.info} />
          <Text style={styles.infoTitle}>Comment ça marche?</Text>
          <Text style={styles.infoText}>
            1. Sélectionnez un professionnel{'\n'}
            2. Démarrez la consultation{'\n'}
            3. Chattez en direct avec l'expert{'\n'}
            4. Payez uniquement le temps de consultation
          </Text>
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
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  filterTextActive: {
    color: Colors.light.background,
  },
  professionalsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  professionalCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  professionalHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  professionalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  professionalAvatarText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  professionalInfo: {
    flex: 1,
    gap: 4,
  },
  professionalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  professionalName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.light.background,
    fontWeight: '700' as const,
  },
  professionalType: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  professionalSpecialization: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  professionalStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  professionalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  priceContainer: {
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  price: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  chatButtonPressed: {
    opacity: 0.7,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  infoBox: {
    marginHorizontal: 16,
    backgroundColor: Colors.light.info + '15',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.info + '30',
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
