import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Building, MapPin, School, ShoppingCart, Star, Utensils } from 'lucide-react-native';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useState } from 'react';

import Colors from '@/constants/colors';
import { NEIGHBORHOODS } from '@/constants/neighborhoods';
import {
  NEIGHBORHOOD_REVIEWS,
  NEIGHBORHOOD_STATS,
  type NeighborhoodReview,
} from '@/constants/neighborhood-reviews';
import { useAuth } from '@/contexts/AuthContext';

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <View style={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          color={star <= rating ? '#FFD700' : Colors.light.border}
          fill={star <= rating ? '#FFD700' : 'transparent'}
        />
      ))}
    </View>
  );
}

function AspectRating({ label, rating }: { label: string; rating: number }) {
  return (
    <View style={styles.aspectRow}>
      <Text style={styles.aspectLabel}>{label}</Text>
      <View style={styles.aspectRatingContainer}>
        <View style={styles.ratingBar}>
          <View
            style={[styles.ratingBarFill, { width: `${(rating / 5) * 100}%` }]}
          />
        </View>
        <Text style={styles.aspectRatingValue}>{rating.toFixed(1)}</Text>
      </View>
    </View>
  );
}

export default function NeighborhoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  const neighborhood = NEIGHBORHOODS.find((n) => n.id === id);
  const stats = NEIGHBORHOOD_STATS.find((s) => s.neighborhoodId === id);
  const reviews = NEIGHBORHOOD_REVIEWS.filter((r) => r.neighborhoodId === id);

  const handleAddReview = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour laisser un avis',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/auth/login' as any) },
        ]
      );
      return;
    }

    if (!newReview.trim()) {
      Alert.alert('Erreur', 'Veuillez écrire un commentaire');
      return;
    }

    Alert.alert('Merci !', 'Votre avis a été ajouté avec succès', [
      {
        text: 'OK',
        onPress: () => {
          setShowReviewForm(false);
          setNewReview('');
          setNewRating(5);
        },
      },
    ]);
  };

  if (!neighborhood || !stats) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Quartier introuvable</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: neighborhood.name,
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
            <View style={styles.headerTop}>
              <View>
                <View style={styles.headerTitleRow}>
                  <MapPin size={24} color={Colors.light.primary} />
                  <Text style={styles.headerTitle}>{neighborhood.name}</Text>
                </View>
                <Text style={styles.headerSubtitle}>{neighborhood.cityName}</Text>
              </View>

              <View style={styles.ratingBadge}>
                <Star size={20} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingValue}>
                  {stats.averageRating.toFixed(1)}
                </Text>
              </View>
            </View>

            <Text style={styles.reviewCount}>
              Basé sur {stats.totalReviews} avis
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes moyennes</Text>
            <View style={styles.aspectsList}>
              <AspectRating label="Sécurité" rating={stats.aspectsAverage.safety} />
              <AspectRating
                label="Transports"
                rating={stats.aspectsAverage.transport}
              />
              <AspectRating
                label="Commodités"
                rating={stats.aspectsAverage.amenities}
              />
              <AspectRating label="Calme" rating={stats.aspectsAverage.noise} />
              <AspectRating
                label="Propreté"
                rating={stats.aspectsAverage.cleanliness}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À proximité</Text>
            <View style={styles.nearbyGrid}>
              <View style={styles.nearbyCard}>
                <School size={24} color={Colors.light.primary} />
                <Text style={styles.nearbyValue}>{stats.nearbyPlaces.schools}</Text>
                <Text style={styles.nearbyLabel}>Écoles</Text>
              </View>
              <View style={styles.nearbyCard}>
                <Building size={24} color={Colors.light.primary} />
                <Text style={styles.nearbyValue}>
                  {stats.nearbyPlaces.hospitals}
                </Text>
                <Text style={styles.nearbyLabel}>Hôpitaux</Text>
              </View>
              <View style={styles.nearbyCard}>
                <ShoppingCart size={24} color={Colors.light.primary} />
                <Text style={styles.nearbyValue}>
                  {stats.nearbyPlaces.supermarkets}
                </Text>
                <Text style={styles.nearbyLabel}>Supermarchés</Text>
              </View>
              <View style={styles.nearbyCard}>
                <Utensils size={24} color={Colors.light.primary} />
                <Text style={styles.nearbyValue}>
                  {stats.nearbyPlaces.restaurants}
                </Text>
                <Text style={styles.nearbyLabel}>Restaurants</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caractéristiques populaires</Text>
            <View style={styles.featuresList}>
              {stats.popularFeatures.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Avis des résidents ({reviews.length})
              </Text>
              <Pressable
                style={styles.addReviewButton}
                onPress={() => setShowReviewForm(!showReviewForm)}
              >
                <Text style={styles.addReviewButtonText}>
                  {showReviewForm ? 'Annuler' : '+ Ajouter un avis'}
                </Text>
              </Pressable>
            </View>

            {showReviewForm && (
              <View style={styles.reviewForm}>
                <Text style={styles.reviewFormTitle}>Votre avis</Text>

                <View style={styles.ratingSelector}>
                  <Text style={styles.ratingSelectorLabel}>Note:</Text>
                  <View style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable
                        key={star}
                        onPress={() => setNewRating(star)}
                        style={styles.ratingStar}
                      >
                        <Star
                          size={32}
                          color={star <= newRating ? '#FFD700' : Colors.light.border}
                          fill={star <= newRating ? '#FFD700' : 'transparent'}
                        />
                      </Pressable>
                    ))}
                  </View>
                </View>

                <TextInput
                  style={styles.reviewInput}
                  value={newReview}
                  onChangeText={setNewReview}
                  placeholder="Partagez votre expérience dans ce quartier..."
                  placeholderTextColor={Colors.light.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Pressable style={styles.submitReviewButton} onPress={handleAddReview}>
                  <Text style={styles.submitReviewButtonText}>
                    Publier l&apos;avis
                  </Text>
                </Pressable>
              </View>
            )}

            <View style={styles.reviewsList}>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={styles.reviewerAvatar}>
                        <Text style={styles.reviewerAvatarText}>
                          {review.userName[0]}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.reviewerName}>{review.userName}</Text>
                        <Text style={styles.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                    </View>
                    <StarRating rating={review.rating} size={14} />
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  header: {
    backgroundColor: Colors.light.background,
    padding: 24,
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginLeft: 36,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 36,
  },
  section: {
    backgroundColor: Colors.light.background,
    padding: 20,
    marginBottom: 12,
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
    marginBottom: 16,
  },
  aspectsList: {
    gap: 16,
  },
  aspectRow: {
    gap: 8,
  },
  aspectLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  aspectRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  aspectRatingValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.text,
    width: 32,
    textAlign: 'right',
  },
  nearbyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nearbyCard: {
    width: '47%',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  nearbyValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  nearbyLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
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
  addReviewButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReviewButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  reviewForm: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  reviewFormTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  ratingSelector: {
    marginBottom: 16,
  },
  ratingSelectorLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingStar: {
    padding: 4,
  },
  reviewInput: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.light.text,
    minHeight: 100,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  submitReviewButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitReviewButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerAvatarText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  starRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
  },
});
