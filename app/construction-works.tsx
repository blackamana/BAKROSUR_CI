import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import {
  AlertCircle,
  MapPin,
  Calendar,
  Plus,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import {
  WORK_TYPES,
  ConstructionWork,
  WorkType,
} from '@/constants/construction-works';
import { useConstructionWorks } from '@/contexts/ConstructionWorkContext';

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M FCFA`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K FCFA`;
  }
  return `${price} FCFA`;
}

function WorkCard({ work }: { work: ConstructionWork }) {
  const workTypeInfo = WORK_TYPES.find((t) => t.value === work.workType);

  return (
    <Pressable
      style={styles.workCard}
      onPress={() => router.push(`/construction-work/${work.id}` as any)}
    >
      {work.images.length > 0 && (
        <View style={styles.workImageContainer}>
          <Image
            source={{ uri: work.images[0] }}
            style={styles.workImage}
            contentFit="cover"
          />
          {work.urgency === 'URGENTE' && (
            <View style={styles.urgentBadge}>
              <AlertCircle size={14} color="#ffffff" />
              <Text style={styles.urgentBadgeText}>URGENT</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.workInfo}>
        <View style={styles.workTypeRow}>
          <Text style={styles.workTypeEmoji}>{workTypeInfo?.emoji}</Text>
          <Text style={styles.workTypeText}>{workTypeInfo?.label}</Text>
        </View>

        <Text style={styles.workTitle} numberOfLines={2}>
          {work.title}
        </Text>

        <Text style={styles.workDescription} numberOfLines={2}>
          {work.description}
        </Text>

        <View style={styles.workLocation}>
          <MapPin size={14} color={Colors.light.textSecondary} />
          <Text style={styles.workLocationText}>
            {work.neighborhoodName}, {work.cityName}
          </Text>
        </View>

        {work.startDate && (
          <View style={styles.workDate}>
            <Calendar size={14} color={Colors.light.textSecondary} />
            <Text style={styles.workDateText}>
              Début: {new Date(work.startDate).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        )}

        <View style={styles.workPriceRow}>
          <Text style={styles.workBudgetLabel}>Budget:</Text>
          <Text style={styles.workPrice}>{formatPrice(work.budget)}</Text>
          {work.budgetMax && (
            <Text style={styles.workPriceRange}>
              - {formatPrice(work.budgetMax)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function ConstructionWorksScreen() {
  const { filteredWorks, featuredWorks, urgentWorks, filters, updateFilters } =
    useConstructionWorks();
  const [selectedType, setSelectedType] = useState<WorkType | null>(null);

  const handleTypeFilter = (type: WorkType) => {
    const newType = selectedType === type ? null : type;
    setSelectedType(newType);
    updateFilters({ workType: newType });
  };

  const displayWorks =
    selectedType || filters.workType || filters.urgency || filters.cityId
      ? filteredWorks
      : filteredWorks;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Annonces de travaux',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitleStyle: { fontWeight: '700' as const },
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/post-construction-work' as any)}
              style={styles.headerButton}
            >
              <Plus size={24} color={Colors.light.primary} />
            </Pressable>
          ),
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Trouvez des chantiers</Text>
            <Text style={styles.headerSubtitle}>
              Artisans, trouvez des opportunités de travaux dans votre ville
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Types de travaux</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typesScroll}
              contentContainerStyle={styles.typesScrollContent}
            >
              {WORK_TYPES.map((type) => (
                <Pressable
                  key={type.value}
                  style={[
                    styles.typeChip,
                    selectedType === type.value && styles.typeChipActive,
                  ]}
                  onPress={() => handleTypeFilter(type.value)}
                >
                  <Text style={styles.typeChipEmoji}>{type.emoji}</Text>
                  <Text
                    style={[
                      styles.typeChipText,
                      selectedType === type.value && styles.typeChipTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {urgentWorks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.urgentHeader}>
                  <AlertCircle size={20} color="#dc2626" />
                  <Text style={styles.sectionTitle}>Travaux urgents</Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.worksScroll}
                contentContainerStyle={styles.worksScrollContent}
              >
                {urgentWorks.map((work) => (
                  <View key={work.id} style={styles.featuredWorkWrapper}>
                    <WorkCard work={work} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {featuredWorks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Annonces en vedette</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.worksScroll}
                contentContainerStyle={styles.worksScrollContent}
              >
                {featuredWorks.map((work) => (
                  <View key={work.id} style={styles.featuredWorkWrapper}>
                    <WorkCard work={work} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Toutes les annonces</Text>
              <Text style={styles.resultsCount}>
                {displayWorks.length} résultat{displayWorks.length > 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.allWorks}>
              {displayWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </View>

            {displayWorks.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Aucune annonce ne correspond à vos critères
                </Text>
              </View>
            )}
          </View>

          <View style={styles.ctaSection}>
            <Text style={styles.ctaSectionTitle}>Vous cherchez des artisans ?</Text>
            <Text style={styles.ctaSectionText}>
              Déposez une annonce gratuite et recevez des propositions d&apos;artisans qualifiés
            </Text>
            <Pressable
              style={styles.ctaButton}
              onPress={() => router.push('/post-construction-work' as any)}
            >
              <Plus size={20} color="#ffffff" />
              <Text style={styles.ctaButtonText}>Déposer une annonce</Text>
            </Pressable>
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
  headerButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  urgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  typesScroll: {
    marginHorizontal: -20,
  },
  typesScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 2,
    borderColor: 'rgba(33, 128, 141, 0.2)',
  },
  typeChipActive: {
    backgroundColor: '#1d7480',
    borderColor: '#1d7480',
  },
  typeChipEmoji: {
    fontSize: 18,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  typeChipTextActive: {
    color: Colors.light.background,
  },
  worksScroll: {
    marginHorizontal: -20,
  },
  worksScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredWorkWrapper: {
    width: 300,
  },
  allWorks: {
    gap: 16,
  },
  workCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  workImageContainer: {
    position: 'relative',
    height: 160,
  },
  workImage: {
    width: '100%',
    height: '100%',
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  urgentBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  workInfo: {
    padding: 16,
  },
  workTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  workTypeEmoji: {
    fontSize: 20,
  },
  workTypeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  workTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  workDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  workLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  workLocationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  workDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  workDateText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  workPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  workBudgetLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  workPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  workPriceRange: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  ctaSection: {
    backgroundColor: Colors.light.background,
    margin: 20,
    marginTop: 32,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  ctaSectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSectionText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
});
