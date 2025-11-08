import { router, Stack } from 'expo-router';
import { Calendar, Check, Clock, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

type TimeSlot = {
  time: string;
  available: boolean;
};

const TIME_SLOTS: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: false },
];

const VISIT_TYPES = [
  { id: 'physical', label: 'Visite physique', icon: '🏠' },
  { id: 'virtual', label: 'Visite virtuelle', icon: '📱' },
];

export default function AppointmentsScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedVisitType, setSelectedVisitType] = useState<string>('physical');
  const [notes, setNotes] = useState('');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDaysForSelection = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const handleSubmit = () => {
    if (!selectedTime) {
      Alert.alert('Erreur', 'Veuillez sélectionner un créneau horaire');
      return;
    }

    Alert.alert(
      'Demande envoyée',
      `Votre demande de ${selectedVisitType === 'physical' ? 'visite physique' : 'visite virtuelle'} pour le ${formatDate(selectedDate)} à ${selectedTime} a été envoyée avec succès.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Demander un rendez-vous',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={24} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Type de visite</Text>
            </View>

            <View style={styles.visitTypeContainer}>
              {VISIT_TYPES.map((type) => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.visitTypeCard,
                    selectedVisitType === type.id && styles.visitTypeCardActive,
                  ]}
                  onPress={() => setSelectedVisitType(type.id)}
                >
                  <Text style={styles.visitTypeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.visitTypeLabel,
                      selectedVisitType === type.id && styles.visitTypeLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                  {selectedVisitType === type.id && (
                    <View style={styles.checkIcon}>
                      <Check size={16} color={Colors.light.background} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={24} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Sélectionner une date</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesScroll}
            >
              {getDaysForSelection().map((date, index) => {
                const isSelected =
                  date.toDateString() === selectedDate.toDateString();
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.dateCard,
                      isSelected && styles.dateCardActive,
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text
                      style={[
                        styles.dateDayName,
                        isSelected && styles.dateDayNameActive,
                      ]}
                    >
                      {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </Text>
                    <Text
                      style={[
                        styles.dateDay,
                        isSelected && styles.dateDayActive,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                    <Text
                      style={[
                        styles.dateMonth,
                        isSelected && styles.dateMonthActive,
                      ]}
                    >
                      {date.toLocaleDateString('fr-FR', { month: 'short' })}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.selectedDateDisplay}>
              <MapPin size={16} color={Colors.light.primary} />
              <Text style={styles.selectedDateText}>
                {formatDate(selectedDate)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={24} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Créneaux disponibles</Text>
            </View>

            <View style={styles.timeSlotsGrid}>
              {TIME_SLOTS.map((slot) => (
                <Pressable
                  key={slot.time}
                  style={[
                    styles.timeSlot,
                    !slot.available && styles.timeSlotUnavailable,
                    selectedTime === slot.time && styles.timeSlotActive,
                  ]}
                  onPress={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      !slot.available && styles.timeSlotTextUnavailable,
                      selectedTime === slot.time && styles.timeSlotTextActive,
                    ]}
                  >
                    {slot.time}
                  </Text>
                  {selectedTime === slot.time && (
                    <View style={styles.timeSlotCheck}>
                      <Check size={14} color={Colors.light.background} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes additionnelles</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ajoutez des informations complémentaires..."
              placeholderTextColor={Colors.light.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.userInfoSection}>
            <Text style={styles.sectionTitle}>Vos informations</Text>
            <View style={styles.userInfo}>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Nom</Text>
                <Text style={styles.userInfoValue}>{user?.name}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Email</Text>
                <Text style={styles.userInfoValue}>{user?.email}</Text>
              </View>
              {user?.phone && (
                <View style={styles.userInfoRow}>
                  <Text style={styles.userInfoLabel}>Téléphone</Text>
                  <Text style={styles.userInfoValue}>{user.phone}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Confirmer la demande</Text>
          </Pressable>
        </View>
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
  section: {
    padding: 20,
    backgroundColor: Colors.light.background,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  visitTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  visitTypeCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.light.border,
    position: 'relative',
  },
  visitTypeCardActive: {
    backgroundColor: Colors.light.primary + '15',
    borderColor: Colors.light.primary,
  },
  visitTypeIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  visitTypeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textAlign: 'center',
  },
  visitTypeLabelActive: {
    color: Colors.light.primary,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datesScroll: {
    gap: 12,
    paddingBottom: 16,
  },
  dateCard: {
    width: 80,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  dateCardActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  dateDayName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  dateDayNameActive: {
    color: Colors.light.background,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  dateDayActive: {
    color: Colors.light.background,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  dateMonthActive: {
    color: Colors.light.background,
  },
  selectedDateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
  },
  selectedDateText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    width: '30%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    position: 'relative',
  },
  timeSlotActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  timeSlotUnavailable: {
    opacity: 0.4,
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  timeSlotTextActive: {
    color: Colors.light.background,
  },
  timeSlotTextUnavailable: {
    color: Colors.light.textSecondary,
  },
  timeSlotCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesInput: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.light.text,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  userInfoSection: {
    padding: 20,
    backgroundColor: Colors.light.background,
    marginBottom: 12,
  },
  userInfo: {
    gap: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  userInfoValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  bottomPadding: {
    height: 100,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
});
