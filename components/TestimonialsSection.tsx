import { MessageSquare, Star } from 'lucide-react-native';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { TESTIMONIALS, Testimonial, TestimonialCategory } from '@/constants/testimonials';

interface TestimonialsSectionProps {
  showAll?: boolean;
}

function StarRating({ rating, onRate }: { rating: number; onRate?: (rating: number) => void }) {
  return (
    <View style={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => onRate?.(star)}
          disabled={!onRate}
        >
          <Star
            size={20}
            color={star <= rating ? Colors.light.secondary : Colors.light.border}
            fill={star <= rating ? Colors.light.secondary : 'transparent'}
          />
        </Pressable>
      ))}
    </View>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <View style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <View style={styles.testimonialUserInfo}>
          <View style={styles.testimonialAvatar}>
            <Text style={styles.testimonialAvatarText}>
              {testimonial.userName.charAt(0)}
            </Text>
          </View>
          <View>
            <Text style={styles.testimonialUserName}>{testimonial.userName}</Text>
            <StarRating rating={testimonial.rating} />
          </View>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{testimonial.category}</Text>
        </View>
      </View>
      <Text style={styles.testimonialComment}>{testimonial.comment}</Text>
      <Text style={styles.testimonialDate}>
        {new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}
      </Text>
    </View>
  );
}

export default function TestimonialsSection({ showAll = false }: TestimonialsSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    rating: 0,
    category: 'GENERAL' as TestimonialCategory,
    comment: '',
  });

  const displayedTestimonials = showAll 
    ? TESTIMONIALS 
    : TESTIMONIALS.filter((t) => t.featured).slice(0, 3);

  const handleSubmit = () => {
    console.log('Submitting testimonial:', formData);
    setShowModal(false);
    setFormData({
      userName: '',
      rating: 0,
      category: 'GENERAL',
      comment: '',
    });
  };

  const isFormValid = formData.userName.trim() && formData.rating > 0 && formData.comment.trim();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Témoignages clients</Text>
          <Text style={styles.subtitle}>
            Ce que nos clients disent de nous
          </Text>
        </View>
        <Pressable style={styles.addButton} onPress={() => setShowModal(true)}>
          <MessageSquare size={20} color={Colors.light.background} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal={!showAll}
        showsHorizontalScrollIndicator={false}
        style={showAll ? undefined : styles.scrollView}
        contentContainerStyle={showAll ? styles.gridContainer : styles.horizontalContainer}
      >
        {displayedTestimonials.map((testimonial) => (
          <View 
            key={testimonial.id} 
            style={showAll ? styles.gridItem : styles.horizontalItem}
          >
            <TestimonialCard testimonial={testimonial} />
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nouveau témoignage</Text>
            <Pressable onPress={() => setShowModal(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Votre nom</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ex: Jean Kouadio"
                placeholderTextColor={Colors.light.textSecondary}
                value={formData.userName}
                onChangeText={(text) => setFormData({ ...formData, userName: text })}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Note</Text>
              <StarRating
                rating={formData.rating}
                onRate={(rating) => setFormData({ ...formData, rating })}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Catégorie</Text>
              <View style={styles.categoryButtons}>
                {(['ACHAT', 'VENTE', 'KYC', 'SERVICE', 'GENERAL'] as TestimonialCategory[]).map(
                  (category) => (
                    <Pressable
                      key={category}
                      style={[
                        styles.categoryButton,
                        formData.category === category && styles.categoryButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, category })}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          formData.category === category && styles.categoryButtonTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  )
                )}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Commentaire</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="Partagez votre expérience..."
                placeholderTextColor={Colors.light.textSecondary}
                value={formData.comment}
                onChangeText={(text) => setFormData({ ...formData, comment: text })}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text style={styles.submitButtonText}>Publier</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  scrollView: {
    marginHorizontal: -20,
  },
  horizontalContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  horizontalItem: {
    width: 300,
  },
  gridContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  gridItem: {
    marginBottom: 16,
  },
  testimonialCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  testimonialUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialAvatarText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  testimonialUserName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  starRating: {
    flexDirection: 'row',
    gap: 4,
  },
  categoryBadge: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  testimonialComment: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.text,
    marginBottom: 8,
  },
  testimonialDate: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  modalCloseText: {
    fontSize: 28,
    color: Colors.light.text,
    lineHeight: 28,
  },
  modalScroll: {
    flex: 1,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  formInput: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  formTextArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  categoryButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  categoryButtonTextActive: {
    color: Colors.light.background,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
});
