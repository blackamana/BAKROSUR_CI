import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { Eye, MapPin, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { PROPERTIES } from '@/constants/properties';
import { useAuth } from '@/contexts/AuthContext';

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M FCFA`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K FCFA`;
  }
  return `${price} FCFA`;
}

export default function MyPropertiesScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');

  const myProperties = PROPERTIES.filter((p) => p.featured);

  const publishedProperties = myProperties.filter((p) => p.status === 'PUBLIE');
  const draftProperties = myProperties.filter((p) => p.status === 'BROUILLON');

  const properties = activeTab === 'published' ? publishedProperties : draftProperties;

  const handleDelete = (propertyId: string) => {
    Alert.alert(
      'Supprimer l\'annonce',
      'Êtes-vous sûr de vouloir supprimer cette annonce ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting property:', propertyId);
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Mes annonces',
          headerRight: () => (
            <Pressable
              style={styles.addButton}
              onPress={() => router.push('/sell-property' as any)}
            >
              <Plus size={24} color={Colors.light.primary} />
            </Pressable>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'published' && styles.tabActive]}
            onPress={() => setActiveTab('published')}
          >
            <Text
              style={[styles.tabText, activeTab === 'published' && styles.tabTextActive]}
            >
              Publiées ({publishedProperties.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'draft' && styles.tabActive]}
            onPress={() => setActiveTab('draft')}
          >
            <Text
              style={[styles.tabText, activeTab === 'draft' && styles.tabTextActive]}
            >
              Brouillons ({draftProperties.length})
            </Text>
          </Pressable>
        </View>

        {properties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucune annonce</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'published'
                ? 'Vous n\'avez pas encore publié d\'annonce'
                : 'Vous n\'avez pas de brouillon'}
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => router.push('/sell-property' as any)}
            >
              <Plus size={20} color={Colors.light.background} />
              <Text style={styles.emptyButtonText}>Créer une annonce</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          >
            {properties.map((property) => (
              <Pressable
                key={property.id}
                style={styles.propertyCard}
                onPress={() => router.push(`/property/${property.id}` as any)}
              >
                <Image
                  source={{ uri: property.images[0] }}
                  style={styles.propertyImage}
                  contentFit="cover"
                />

                <View style={styles.propertyContent}>
                  <View style={styles.propertyHeader}>
                    <Text style={styles.propertyTitle} numberOfLines={2}>
                      {property.title}
                    </Text>
                    <View style={styles.propertyLocation}>
                      <MapPin size={14} color={Colors.light.textSecondary} />
                      <Text style={styles.propertyLocationText}>
                        {property.neighborhoodName}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>

                  <View style={styles.propertyStats}>
                    <View style={styles.statItem}>
                      <Eye size={16} color={Colors.light.textSecondary} />
                      <Text style={styles.statText}>
                        {Math.floor(Math.random() * 1000)} vues
                      </Text>
                    </View>
                  </View>

                  <View style={styles.propertyActions}>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => router.push('/sell-property' as any)}
                    >
                      <Pencil size={18} color={Colors.light.primary} />
                      <Text style={styles.actionButtonText}>Modifier</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(property.id)}
                    >
                      <Trash2 size={18} color={Colors.light.error} />
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                        Supprimer
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  addButton: {
    marginRight: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  propertyImage: {
    width: 120,
    height: 160,
  },
  propertyContent: {
    flex: 1,
    padding: 12,
  },
  propertyHeader: {
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyLocationText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginBottom: 12,
  },
  propertyStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
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
  propertyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  deleteButtonText: {
    color: Colors.light.error,
  },
});
