import { Stack } from 'expo-router';
import {
  CheckCircle,
  Clock,
  Circle,
  FileText,
  AlertCircle,
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';

type ProcedureStatus = 'pending' | 'in_progress' | 'completed';

type ProcedureStep = {
  id: string;
  title: string;
  description: string;
  status: ProcedureStatus;
  date?: string;
};

type Procedure = {
  id: string;
  title: string;
  type: string;
  startDate: string;
  progress: number;
  steps: ProcedureStep[];
};

export default function ProceduresScreen() {
  const [procedures] = useState<Procedure[]>([
    {
      id: '1',
      title: 'Acquisition titre foncier - Cocody',
      type: 'Titre foncier',
      startDate: '05 Jan 2025',
      progress: 60,
      steps: [
        {
          id: '1',
          title: 'Dépôt de la demande',
          description: 'Dossier déposé à la Conservation Foncière',
          status: 'completed',
          date: '05 Jan 2025',
        },
        {
          id: '2',
          title: 'Vérification des documents',
          description: 'Validation des documents par les services techniques',
          status: 'completed',
          date: '12 Jan 2025',
        },
        {
          id: '3',
          title: 'Bornage du terrain',
          description: 'Délimitation physique de la parcelle',
          status: 'in_progress',
          date: '20 Jan 2025',
        },
        {
          id: '4',
          title: 'Immatriculation',
          description: 'Enregistrement officiel du titre',
          status: 'pending',
        },
        {
          id: '5',
          title: 'Délivrance du titre',
          description: 'Remise du titre foncier définitif',
          status: 'pending',
        },
      ],
    },
    {
      id: '2',
      title: 'Permis de construire - Villa Marcory',
      type: 'Permis de construire',
      startDate: '10 Jan 2025',
      progress: 25,
      steps: [
        {
          id: '1',
          title: 'Dépôt du dossier',
          description: 'Plans et documents soumis au service d\'urbanisme',
          status: 'completed',
          date: '10 Jan 2025',
        },
        {
          id: '2',
          title: 'Examen du dossier',
          description: 'Vérification de la conformité des plans',
          status: 'in_progress',
          date: '15 Jan 2025',
        },
        {
          id: '3',
          title: 'Enquête publique',
          description: 'Affichage et consultation du public',
          status: 'pending',
        },
        {
          id: '4',
          title: 'Délivrance du permis',
          description: 'Autorisation officielle de construire',
          status: 'pending',
        },
      ],
    },
  ]);

  const getStepIcon = (status: ProcedureStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={Colors.light.success} fill={Colors.light.success} />;
      case 'in_progress':
        return <Clock size={20} color={Colors.light.warning} />;
      default:
        return <Circle size={20} color={Colors.light.textSecondary} />;
    }
  };

  const handleProcedurePress = (procedure: Procedure) => {
    const currentStep = procedure.steps.find(s => s.status === 'in_progress');
    if (currentStep) {
      Alert.alert(
        'Étape en cours',
        `${currentStep.title}\n\n${currentStep.description}\n\nDébut: ${currentStep.date || 'À venir'}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Suivi des démarches',
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
          <Text style={styles.headerTitle}>Vos démarches</Text>
          <Text style={styles.headerSubtitle}>
            Suivez l'avancement de vos procédures administratives
          </Text>
        </View>

        <View style={styles.proceduresContainer}>
          {procedures.map((procedure) => (
            <Pressable
              key={procedure.id}
              style={({ pressed }) => [
                styles.procedureCard,
                pressed && styles.procedureCardPressed,
              ]}
              onPress={() => handleProcedurePress(procedure)}
            >
              <View style={styles.procedureHeader}>
                <View style={styles.procedureIcon}>
                  <FileText size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.procedureInfo}>
                  <Text style={styles.procedureTitle}>{procedure.title}</Text>
                  <Text style={styles.procedureType}>{procedure.type}</Text>
                  <Text style={styles.procedureDate}>
                    Démarré le {procedure.startDate}
                  </Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progression</Text>
                  <Text style={styles.progressPercentage}>
                    {procedure.progress}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${procedure.progress}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.stepsContainer}>
                {procedure.steps.map((step, index) => (
                  <View key={step.id} style={styles.stepRow}>
                    <View style={styles.stepIconContainer}>
                      {getStepIcon(step.status)}
                      {index < procedure.steps.length - 1 && (
                        <View
                          style={[
                            styles.stepLine,
                            step.status === 'completed' && styles.stepLineCompleted,
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.stepContent}>
                      <Text
                        style={[
                          styles.stepTitle,
                          step.status === 'completed' && styles.stepTitleCompleted,
                          step.status === 'in_progress' && styles.stepTitleInProgress,
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text style={styles.stepDescription}>
                        {step.description}
                      </Text>
                      {step.date && (
                        <Text style={styles.stepDate}>{step.date}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <AlertCircle size={24} color={Colors.light.info} />
            <Text style={styles.infoTitle}>Délais moyens</Text>
            <Text style={styles.infoText}>
              • Titre foncier: 3-6 mois{'\n'}
              • Permis de construire: 2-4 mois{'\n'}
              • Certificat d'urbanisme: 1-2 mois{'\n'}
              • Bail notarié: 1-2 semaines
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
  proceduresContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  procedureCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  procedureCardPressed: {
    opacity: 0.7,
  },
  procedureHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  procedureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  procedureInfo: {
    flex: 1,
    gap: 4,
  },
  procedureTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  procedureType: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  procedureDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  progressSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  stepsContainer: {
    gap: 20,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepIconContainer: {
    alignItems: 'center',
    width: 20,
  },
  stepLine: {
    position: 'absolute',
    top: 24,
    width: 2,
    height: 32,
    backgroundColor: Colors.light.border,
  },
  stepLineCompleted: {
    backgroundColor: Colors.light.success,
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  stepTitleCompleted: {
    color: Colors.light.text,
  },
  stepTitleInProgress: {
    color: Colors.light.primary,
  },
  stepDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  stepDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  infoSection: {
    paddingHorizontal: 16,
  },
  infoCard: {
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
