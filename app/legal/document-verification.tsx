import { Stack } from 'expo-router';
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';

type DocumentStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

type Document = {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: DocumentStatus;
  reviewNote?: string;
};

export default function DocumentVerificationScreen() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Titre foncier - Parcelle 2345',
      type: 'Titre foncier',
      uploadDate: '15 Jan 2025',
      status: 'approved',
    },
    {
      id: '2',
      name: 'Certificat de propriété',
      type: 'Certificat',
      uploadDate: '18 Jan 2025',
      status: 'in_review',
    },
    {
      id: '3',
      name: 'Attestation villageoise',
      type: 'Attestation',
      uploadDate: '20 Jan 2025',
      status: 'rejected',
      reviewNote: 'Document incomplet - signature manquante',
    },
  ]);

  const documentTypes = [
    'Titre foncier',
    'Certificat de propriété',
    'Attestation villageoise',
    'Bail',
    'Contrat de vente',
    'Acte notarié',
    'Permis de construire',
    'Certificat d\'urbanisme',
  ];

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} color={Colors.light.success} />;
      case 'in_review':
        return <Clock size={20} color={Colors.light.warning} />;
      case 'rejected':
        return <XCircle size={20} color={Colors.light.error} />;
      default:
        return <AlertCircle size={20} color={Colors.light.textSecondary} />;
    }
  };

  const getStatusText = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return 'Vérifié';
      case 'in_review':
        return 'En cours';
      case 'rejected':
        return 'Rejeté';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return Colors.light.success;
      case 'in_review':
        return Colors.light.warning;
      case 'rejected':
        return Colors.light.error;
      default:
        return Colors.light.textSecondary;
    }
  };

  const handleUploadDocument = () => {
    Alert.alert(
      'Uploader un document',
      'Sélectionnez le type de document à vérifier',
      [
        ...documentTypes.map((type) => ({
          text: type,
          onPress: () => {
            Alert.alert('Succès', `Document "${type}" uploadé avec succès! Il sera vérifié sous 24-48h.`);
          },
        })),
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Vérification de documents',
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
          <Text style={styles.headerTitle}>Vos documents</Text>
          <Text style={styles.headerSubtitle}>
            Faites vérifier vos documents par des experts juridiques
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.uploadButton,
            pressed && styles.uploadButtonPressed,
          ]}
          onPress={handleUploadDocument}
        >
          <Plus size={24} color={Colors.light.primary} />
          <Text style={styles.uploadButtonText}>Uploader un document</Text>
        </Pressable>

        <View style={styles.documentsContainer}>
          {documents.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={64} color={Colors.light.textSecondary} />
              <Text style={styles.emptyTitle}>Aucun document</Text>
              <Text style={styles.emptyText}>
                Commencez par uploader vos documents pour les faire vérifier
              </Text>
            </View>
          ) : (
            documents.map((doc) => (
              <Pressable
                key={doc.id}
                style={({ pressed }) => [
                  styles.documentCard,
                  pressed && styles.documentCardPressed,
                ]}
                onPress={() => {
                  Alert.alert(
                    doc.name,
                    doc.reviewNote
                      ? `Status: ${getStatusText(doc.status)}\n\nNote: ${doc.reviewNote}`
                      : `Status: ${getStatusText(doc.status)}`
                  );
                }}
              >
                <View style={styles.documentIcon}>
                  <FileText size={24} color={Colors.light.primary} />
                </View>

                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentType}>{doc.type}</Text>
                  <Text style={styles.documentDate}>Uploadé le {doc.uploadDate}</Text>
                  {doc.reviewNote && (
                    <Text style={styles.reviewNote} numberOfLines={2}>
                      {doc.reviewNote}
                    </Text>
                  )}
                </View>

                <View style={styles.documentStatus}>
                  {getStatusIcon(doc.status)}
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(doc.status) },
                    ]}
                  >
                    {getStatusText(doc.status)}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <AlertCircle size={24} color={Colors.light.info} />
            <Text style={styles.infoTitle}>Documents acceptés</Text>
            <Text style={styles.infoText}>
              • PDF, JPG, PNG (max 10 MB){'\n'}
              • Documents lisibles et complets{'\n'}
              • Délai de vérification: 24-48h{'\n'}
              • Tarif: 5,000 FCFA par document
            </Text>
          </View>

          <View style={styles.securityCard}>
            <CheckCircle size={24} color={Colors.light.success} />
            <Text style={styles.securityTitle}>Sécurité garantie</Text>
            <Text style={styles.securityText}>
              Tous vos documents sont cryptés et vérifiés par des experts juridiques certifiés
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.light.background,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
  },
  uploadButtonPressed: {
    opacity: 0.7,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  documentsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  documentCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  documentCardPressed: {
    opacity: 0.7,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
    gap: 4,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  documentType: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  documentDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  reviewNote: {
    fontSize: 13,
    color: Colors.light.error,
    fontStyle: 'italic',
    marginTop: 4,
  },
  documentStatus: {
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  infoSection: {
    paddingHorizontal: 16,
    gap: 12,
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
  securityCard: {
    backgroundColor: Colors.light.success + '15',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.success + '30',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
