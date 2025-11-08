import { Stack } from 'expo-router';
import {
  FileSignature,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';

type Contract = {
  id: string;
  title: string;
  type: string;
  date: string;
  parties: string[];
  signed: boolean;
  signedBy: string[];
};

export default function ContractsScreen() {
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'Contrat de vente - Villa Cocody',
      type: 'Vente',
      date: '10 Jan 2025',
      parties: ['Jean Kouassi', 'Marie Touré'],
      signed: true,
      signedBy: ['Jean Kouassi', 'Marie Touré'],
    },
    {
      id: '2',
      title: 'Bail locatif - Appartement Marcory',
      type: 'Location',
      date: '15 Jan 2025',
      parties: ['Pierre Bamba', 'Sarah Koné'],
      signed: false,
      signedBy: ['Pierre Bamba'],
    },
  ]);

  const handleViewContract = (contract: Contract) => {
    Alert.alert('Contrat', `Affichage de: ${contract.title}`);
  };

  const handleSignContract = (contract: Contract) => {
    Alert.alert(
      'Signer le contrat',
      `Voulez-vous signer électroniquement le contrat "${contract.title}" ?\n\nCette signature est juridiquement valide selon la loi ivoirienne.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Signer',
          onPress: () => {
            Alert.alert('Succès', 'Contrat signé avec succès!');
          },
        },
      ]
    );
  };

  const handleDownloadContract = (contract: Contract) => {
    Alert.alert('Téléchargement', `Téléchargement de: ${contract.title}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Contrats numériques',
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
          <Text style={styles.headerTitle}>Vos contrats</Text>
          <Text style={styles.headerSubtitle}>
            Signez vos contrats électroniquement en toute sécurité
          </Text>
        </View>

        <View style={styles.betaNotice}>
          <AlertTriangle size={20} color={Colors.light.warning} />
          <View style={styles.betaNoticeContent}>
            <Text style={styles.betaNoticeTitle}>Version Beta</Text>
            <Text style={styles.betaNoticeText}>
              La signature électronique est en cours de validation juridique en Côte d'Ivoire
            </Text>
          </View>
        </View>

        <View style={styles.contractsContainer}>
          {contracts.map((contract) => (
            <View key={contract.id} style={styles.contractCard}>
              <View style={styles.contractHeader}>
                <View style={styles.contractIcon}>
                  <FileSignature size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.contractInfo}>
                  <Text style={styles.contractTitle}>{contract.title}</Text>
                  <Text style={styles.contractType}>{contract.type}</Text>
                  <Text style={styles.contractDate}>Créé le {contract.date}</Text>
                </View>
                {contract.signed ? (
                  <View style={styles.signedBadge}>
                    <CheckCircle size={16} color={Colors.light.success} />
                    <Text style={styles.signedText}>Signé</Text>
                  </View>
                ) : (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>En attente</Text>
                  </View>
                )}
              </View>

              <View style={styles.partiesSection}>
                <Text style={styles.partiesLabel}>Parties:</Text>
                {contract.parties.map((party, index) => (
                  <View key={index} style={styles.partyRow}>
                    <Text style={styles.partyName}>{party}</Text>
                    {contract.signedBy.includes(party) ? (
                      <CheckCircle size={14} color={Colors.light.success} />
                    ) : (
                      <View style={styles.unsignedDot} />
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.contractActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.actionButtonPressed,
                  ]}
                  onPress={() => handleViewContract(contract)}
                >
                  <Eye size={18} color={Colors.light.primary} />
                  <Text style={styles.actionButtonText}>Voir</Text>
                </Pressable>

                {!contract.signed && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.signButton,
                      pressed && styles.actionButtonPressed,
                    ]}
                    onPress={() => handleSignContract(contract)}
                  >
                    <FileSignature size={18} color={Colors.light.background} />
                    <Text style={styles.signButtonText}>Signer</Text>
                  </Pressable>
                )}

                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.actionButtonPressed,
                  ]}
                  onPress={() => handleDownloadContract(contract)}
                >
                  <Download size={18} color={Colors.light.primary} />
                  <Text style={styles.actionButtonText}>Télécharger</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <FileSignature size={32} color={Colors.light.info} />
            <Text style={styles.infoTitle}>Signature électronique</Text>
            <Text style={styles.infoText}>
              La signature électronique utilise un système de cryptographie avancée pour garantir l'authenticité et l'intégrité des contrats.
              {'\n\n'}
              Conforme aux standards internationaux et en cours de reconnaissance juridique en Côte d'Ivoire.
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
  betaNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.light.warning + '15',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.warning + '30',
  },
  betaNoticeContent: {
    flex: 1,
    gap: 4,
  },
  betaNoticeTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  betaNoticeText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  contractsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  contractCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  contractHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  contractIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contractInfo: {
    flex: 1,
    gap: 4,
  },
  contractTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  contractType: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  contractDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  signedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  signedText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.success,
  },
  pendingBadge: {
    backgroundColor: Colors.light.warning + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.warning,
  },
  partiesSection: {
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    gap: 8,
  },
  partiesLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partyName: {
    fontSize: 14,
    color: Colors.light.text,
  },
  unsignedDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.light.textSecondary,
  },
  contractActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.light.backgroundSecondary,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  signButton: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  signButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.background,
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
