import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { 
  Calculator, 
  MapPin, 
  Search, 
  TrendingUp, 
  Upload,
  FileSearch,
  MessageSquare,
  BadgeCheck,
  Hammer,
  Map
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/colors';
import { PROPERTIES, Property, PropertyType } from '@/constants/properties';
import Footer from '@/components/Footer';
import TestimonialsSection from '@/components/TestimonialsSection';
import TricolorBanner from '@/components/TricolorBanner';



function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M FCFA`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K FCFA`;
  }
  return `${price} FCFA`;
}

function PropertyCard({ property, t }: { property: Property; t: any }) {
  return (
    <Pressable
      style={styles.propertyCard}
      onPress={() => router.push(`/property/${property.id}` as any)}
    >
      <View style={styles.propertyImageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.propertyImage}
          contentFit="cover"
        />
        <View style={styles.propertyTypeBadge}>
          <Text style={styles.propertyTypeBadgeText}>{property.type}</Text>
        </View>
        {property.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>★ {t('home.propertyCard.featured')}</Text>
          </View>
        )}
      </View>

      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={2}>
          {property.title}
        </Text>

        <View style={styles.propertyLocation}>
          <MapPin size={14} color={Colors.light.textSecondary} />
          <Text style={styles.propertyLocationText}>
            {property.neighborhoodName}, {property.cityName}
          </Text>
        </View>

        <View style={styles.propertyDetails}>
          {property.bedrooms && (
            <View style={styles.propertyDetailItem}>
              <Text style={styles.propertyDetailText}>
                {property.bedrooms} {t('home.propertyCard.bedrooms')}
              </Text>
            </View>
          )}
          {property.bathrooms && (
            <View style={styles.propertyDetailItem}>
              <Text style={styles.propertyDetailText}>
                {property.bathrooms} {t('home.propertyCard.bathrooms')}
              </Text>
            </View>
          )}
          <View style={styles.propertyDetailItem}>
            <Text style={styles.propertyDetailText}>
              {property.surfaceArea}m²
            </Text>
          </View>
        </View>

        <View style={styles.propertyPriceRow}>
          <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>
          <Text style={styles.propertyPriceType}>
            {property.transactionType === 'VENTE' ? t('home.propertyCard.forSale') : t('home.propertyCard.perMonth')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);

  const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
    { value: 'MAISON', label: t('home.types.houses') },
    { value: 'APPARTEMENT', label: t('home.types.apartments') },
    { value: 'TERRAIN', label: t('home.types.land') },
    { value: 'COMMERCE', label: t('home.types.shops') },
    { value: 'BUREAU', label: t('home.types.offices') },
  ];

  const featuredProperties = PROPERTIES.filter((p) => p.featured);
  const recentProperties = PROPERTIES.filter((p) => !p.featured).slice(0, 4);

  return (
    <View style={styles.container}>
      {!isDesktop && <TricolorBanner />}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isDesktop && styles.desktopContent}
      >
        {!isDesktop && <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerGreeting}>{t('home.welcome')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={[styles.headerTitle, { color: Colors.light.ivorianOrange }]}>BAKRÔ</Text>
                <Text style={[styles.headerTitle, { color: Colors.light.ivorianGreen }]}>SÛR</Text>
              </View>
            </View>
            <View style={styles.ivoryCoastFlag}>
              <View style={styles.flagOrange} />
              <View style={styles.flagWhite} />
              <View style={styles.flagGreen} />
            </View>
          </View>

          <Pressable
            style={styles.searchBar}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Search size={20} color={Colors.light.textSecondary} />
            <Text style={styles.searchPlaceholder}>
              {t('home.searchPlaceholder')}
            </Text>
          </Pressable>
        </View>}

        <View style={isDesktop ? styles.desktopQuickActionsContainer : undefined}>
          <ScrollView
            horizontal={!isDesktop}
            showsHorizontalScrollIndicator={false}
            style={styles.quickActionsScroll}
            contentContainerStyle={isDesktop ? styles.desktopQuickActions : styles.quickActions}
          >
            <Pressable
              style={[styles.quickActionCard, styles.quickActionCard1, isDesktop && styles.desktopQuickActionCard]}
              onPress={() => router.push('/(tabs)/search')}
            >
              <View style={[styles.quickActionIcon, styles.quickActionIcon1]}>
                <Search size={26} color="#1d7480" strokeWidth={2.5} />
              </View>
              <Text style={styles.quickActionTitle}>{t('home.quickActions.buyRent')}</Text>
              <Text style={styles.quickActionSubtitle}>{t('home.quickActions.findProperty')}</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, styles.quickActionCard2, isDesktop && styles.desktopQuickActionCard]}
              onPress={() => router.push('/sell-property' as any)}
            >
              <View style={[styles.quickActionIcon, styles.quickActionIcon2]}>
                <Upload size={26} color="#ff8800" strokeWidth={2.5} />
              </View>
              <Text style={styles.quickActionTitle}>{t('home.quickActions.deposit')}</Text>
              <Text style={styles.quickActionSubtitle}>{t('home.quickActions.depositListing')}</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, styles.quickActionCard3, isDesktop && styles.desktopQuickActionCard]}
              onPress={() => router.push('/estimate-property' as any)}
            >
              <View style={[styles.quickActionIcon, styles.quickActionIcon3]}>
                <TrendingUp size={26} color="#3b82f6" strokeWidth={2.5} />
              </View>
              <Text style={styles.quickActionTitle}>{t('home.quickActions.estimate')}</Text>
              <Text style={styles.quickActionSubtitle}>{t('home.quickActions.estimateProperty')}</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, styles.quickActionCard4, isDesktop && styles.desktopQuickActionCard]}
              onPress={() => router.push('/loan-calculator' as any)}
            >
              <View style={[styles.quickActionIcon, styles.quickActionIcon4]}>
                <Calculator size={26} color="#009e60" strokeWidth={2.5} />
              </View>
              <Text style={styles.quickActionTitle}>{t('home.quickActions.calculate')}</Text>
              <Text style={styles.quickActionSubtitle}>{t('home.quickActions.calculateLoan')}</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, styles.quickActionCard5, isDesktop && styles.desktopQuickActionCard]}
              onPress={() => router.push('/construction-works' as any)}
            >
              <View style={[styles.quickActionIcon, styles.quickActionIcon5]}>
                <Hammer size={26} color="#dc2626" strokeWidth={2.5} />
              </View>
              <Text style={styles.quickActionTitle}>{t('home.quickActions.works')}</Text>
              <Text style={styles.quickActionSubtitle}>{t('home.quickActions.worksListings')}</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, styles.quickActionCard6, isDesktop && styles.desktopQuickActionCard]}
              onPress={() => router.push('/(tabs)/map')}
            >
              <View style={[styles.quickActionIcon, styles.quickActionIcon6]}>
                <Map size={26} color="#8b5cf6" strokeWidth={2.5} />
              </View>
              <Text style={styles.quickActionTitle}>{t('home.quickActions.map')}</Text>
              <Text style={styles.quickActionSubtitle}>{t('home.quickActions.viewOnMap')}</Text>
            </Pressable>
          </ScrollView>
        </View>

        <View style={[styles.section, isDesktop && styles.desktopSection]}>
          <Text style={styles.sectionTitle}>{t('home.propertyTypes')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typesScroll}
            contentContainerStyle={styles.typesScrollContent}
          >
            {PROPERTY_TYPES.map((type) => (
              <Pressable
                key={type.value}
                style={[
                  styles.typeChip,
                  selectedType === type.value && styles.typeChipActive,
                ]}
                onPress={() =>
                  setSelectedType(selectedType === type.value ? null : type.value)
                }
              >
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

        <View style={[styles.section, isDesktop && styles.desktopSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.featured')}</Text>
            <Link href="/(tabs)/search" asChild>
              <Pressable>
                <Text style={styles.seeAllLink}>{t('home.seeAll')}</Text>
              </Pressable>
            </Link>
          </View>

          <ScrollView
            horizontal={!isDesktop}
            showsHorizontalScrollIndicator={false}
            style={!isDesktop && styles.propertiesScroll}
            contentContainerStyle={isDesktop ? styles.desktopGrid : styles.propertiesScrollContent}
          >
            {featuredProperties.map((property) => (
              <View key={property.id} style={isDesktop ? styles.desktopGridItem : styles.featuredPropertyWrapper}>
                <PropertyCard property={property} t={t} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, isDesktop && styles.desktopSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.recent')}</Text>
            <Link href="/(tabs)/search" asChild>
              <Pressable>
                <Text style={styles.seeAllLink}>{t('home.seeAll')}</Text>
              </Pressable>
            </Link>
          </View>

          <View style={isDesktop ? styles.desktopGrid : styles.recentProperties}>
            {recentProperties.map((property) => (
              <View key={property.id} style={isDesktop && styles.desktopGridItem}>
                <PropertyCard property={property} t={t} />
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.howItWorksSection, isDesktop && styles.desktopSection]}>
          <Text style={styles.sectionTitle}>{t('home.howItWorks.title')}</Text>
          <Text style={styles.howItWorksSubtitle}>
            {t('home.howItWorks.subtitle')}
          </Text>
          
          <View style={isDesktop ? styles.desktopStepsGrid : styles.stepsContainer}>
            <View style={[styles.stepCard, styles.stepCard1]}>
              <View style={[styles.stepIconBubble, styles.stepIcon1]}>
                <View style={styles.stepNumber1}>
                  <Text style={styles.stepNumberText1}>1</Text>
                </View>
                <Search size={36} color="#1d7480" strokeWidth={2.5} />
              </View>
              <Text style={styles.stepTitle}>{t('home.howItWorks.step1Title')}</Text>
              <Text style={styles.stepDescription}>
                {t('home.howItWorks.step1Desc')}
              </Text>
            </View>

            <View style={[styles.stepCard, styles.stepCard2]}>
              <View style={[styles.stepIconBubble, styles.stepIcon2]}>
                <View style={styles.stepNumber2}>
                  <Text style={styles.stepNumberText2}>2</Text>
                </View>
                <FileSearch size={36} color="#3b82f6" strokeWidth={2.5} />
              </View>
              <Text style={styles.stepTitle}>{t('home.howItWorks.step2Title')}</Text>
              <Text style={styles.stepDescription}>
                {t('home.howItWorks.step2Desc')}
              </Text>
            </View>

            <View style={[styles.stepCard, styles.stepCard3]}>
              <View style={[styles.stepIconBubble, styles.stepIcon3]}>
                <View style={styles.stepNumber3}>
                  <Text style={styles.stepNumberText3}>3</Text>
                </View>
                <MessageSquare size={36} color="#f59e0b" strokeWidth={2.5} />
              </View>
              <Text style={styles.stepTitle}>{t('home.howItWorks.step3Title')}</Text>
              <Text style={styles.stepDescription}>
                {t('home.howItWorks.step3Desc')}
              </Text>
            </View>

            <View style={[styles.stepCard, styles.stepCard4]}>
              <View style={[styles.stepIconBubble, styles.stepIcon4]}>
                <View style={styles.stepNumber4}>
                  <Text style={styles.stepNumberText4}>4</Text>
                </View>
                <BadgeCheck size={36} color="#10b981" strokeWidth={2.5} />
              </View>
              <Text style={styles.stepTitle}>{t('home.howItWorks.step4Title')}</Text>
              <Text style={styles.stepDescription}>
                {t('home.howItWorks.step4Desc')}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.popularCitiesSection, isDesktop && styles.desktopSection]}>
          <Text style={styles.sectionTitle}>{t('home.popularCities.title')}</Text>
          <Text style={styles.popularCitiesSubtitle}>
            {t('home.popularCities.subtitle')}
          </Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.citiesScroll}
            contentContainerStyle={styles.citiesScrollContent}
          >
            <Pressable 
              style={styles.cityCard}
              onPress={() => router.push('/(tabs)/search')}
            >
              <View style={[styles.cityImagePlaceholder, { backgroundColor: Colors.light.ivorianOrange }]}>
                <Text style={styles.cityEmoji}>🏙️</Text>
              </View>
              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>Abidjan</Text>
                <Text style={styles.cityProperties}>150+ {t('home.popularCities.properties')}</Text>
              </View>
            </Pressable>

            <Pressable 
              style={styles.cityCard}
              onPress={() => router.push('/(tabs)/search')}
            >
              <View style={[styles.cityImagePlaceholder, { backgroundColor: Colors.light.ivorianGreen }]}>
                <Text style={styles.cityEmoji}>🏛️</Text>
              </View>
              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>Yamoussoukro</Text>
                <Text style={styles.cityProperties}>80+ {t('home.popularCities.properties')}</Text>
              </View>
            </Pressable>

            <Pressable 
              style={styles.cityCard}
              onPress={() => router.push('/(tabs)/search')}
            >
              <View style={[styles.cityImagePlaceholder, { backgroundColor: Colors.light.teal }]}>
                <Text style={styles.cityEmoji}>🌆</Text>
              </View>
              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>Bouaké</Text>
                <Text style={styles.cityProperties}>60+ {t('home.popularCities.properties')}</Text>
              </View>
            </Pressable>

            <Pressable 
              style={styles.cityCard}
              onPress={() => router.push('/(tabs)/search')}
            >
              <View style={[styles.cityImagePlaceholder, { backgroundColor: Colors.light.acd }]}>
                <Text style={styles.cityEmoji}>🌊</Text>
              </View>
              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>San-Pédro</Text>
                <Text style={styles.cityProperties}>30+ {t('home.popularCities.properties')}</Text>
              </View>
            </Pressable>

            <Pressable 
              style={styles.cityCard}
              onPress={() => router.push('/(tabs)/search')}
            >
              <View style={[styles.cityImagePlaceholder, { backgroundColor: Colors.light.adu }]}>
                <Text style={styles.cityEmoji}>🌾</Text>
              </View>
              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>Korhogo</Text>
                <Text style={styles.cityProperties}>25+ {t('home.popularCities.properties')}</Text>
              </View>
            </Pressable>
          </ScrollView>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2 500+</Text>
            <Text style={styles.statLabel}>{t('home.stats.verifiedProperties')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>15 000+</Text>
            <Text style={styles.statLabel}>{t('home.stats.users')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>{t('home.stats.satisfaction')}</Text>
          </View>
        </View>

        <TestimonialsSection />

        <Footer />
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
  desktopContent: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  desktopSection: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
  },
  desktopQuickActionsContainer: {
    paddingHorizontal: 0,
    marginTop: 32,
  },
  desktopQuickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  desktopQuickActionCard: {
    width: 180,
  },
  desktopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'flex-start',
  },
  desktopGridItem: {
    width: '48%',
    maxWidth: 450,
  },
  desktopStepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerGreeting: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  ivoryCoastFlag: {
    flexDirection: 'row',
    width: 48,
    height: 32,
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flagOrange: {
    flex: 1,
    backgroundColor: Colors.light.ivorianOrange,
  },
  flagWhite: {
    flex: 1,
    backgroundColor: Colors.light.ivorianWhite,
  },
  flagGreen: {
    flex: 1,
    backgroundColor: Colors.light.ivorianGreen,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.textSecondary,
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
  seeAllLink: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  typesScroll: {
    marginHorizontal: -20,
  },
  typesScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  typeChip: {
    paddingHorizontal: 20,
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
  typeChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  typeChipTextActive: {
    color: Colors.light.background,
  },
  propertiesScroll: {
    marginHorizontal: -20,
  },
  propertiesScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredPropertyWrapper: {
    width: 280,
  },
  recentProperties: {
    gap: 16,
  },
  propertyCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  propertyImageContainer: {
    position: 'relative',
    height: 200,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  propertyTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  propertyTypeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  propertyLocationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  propertyDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  propertyDetailItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 6,
  },
  propertyDetailText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  propertyPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  propertyPriceType: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    marginHorizontal: 20,
    marginVertical: 24,
    marginBottom: 32,
    padding: 24,
    borderRadius: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
  },
  howItWorksSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  howItWorksSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  stepsContainer: {
    gap: 16,
  },
  stepCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    flex: 1,
    minWidth: 250,
  },
  stepCard1: {
    backgroundColor: '#f0fdfa',
  },
  stepCard2: {
    backgroundColor: '#eff6ff',
  },
  stepCard3: {
    backgroundColor: '#fffbeb',
  },
  stepCard4: {
    backgroundColor: '#f0fdf4',
  },
  stepIconBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  stepIcon1: {
    backgroundColor: '#ccf5f1',
  },
  stepIcon2: {
    backgroundColor: '#dbeafe',
  },
  stepIcon3: {
    backgroundColor: '#fef3c7',
  },
  stepIcon4: {
    backgroundColor: '#d1fae5',
  },
  stepNumber1: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1d7480',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#f0fdfa',
  },
  stepNumberText1: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  stepNumber2: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#eff6ff',
  },
  stepNumberText2: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  stepNumber3: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fffbeb',
  },
  stepNumberText3: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  stepNumber4: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#f0fdf4',
  },
  stepNumberText4: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  popularCitiesSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  popularCitiesSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  citiesScroll: {
    marginHorizontal: -20,
  },
  citiesScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cityCard: {
    width: 200,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cityImagePlaceholder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityEmoji: {
    fontSize: 48,
  },
  cityInfo: {
    padding: 16,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  cityProperties: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  quickActionsScroll: {
    marginHorizontal: -20,
    paddingTop: 24,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    width: 120,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  quickActionCard1: {
    backgroundColor: '#f0fdfa',
  },
  quickActionCard2: {
    backgroundColor: '#fff8ed',
  },
  quickActionCard3: {
    backgroundColor: '#eff6ff',
  },
  quickActionCard4: {
    backgroundColor: '#f0fdf7',
  },
  quickActionCard5: {
    backgroundColor: '#fef2f2',
  },
  quickActionCard6: {
    backgroundColor: '#faf5ff',
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionIcon1: {
    backgroundColor: 'rgba(29, 116, 128, 0.12)',
  },
  quickActionIcon2: {
    backgroundColor: 'rgba(255, 136, 0, 0.12)',
  },
  quickActionIcon3: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  quickActionIcon4: {
    backgroundColor: 'rgba(0, 158, 96, 0.12)',
  },
  quickActionIcon5: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
  },
  quickActionIcon6: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
