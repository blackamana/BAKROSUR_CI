import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BedDouble, Calendar, CreditCard, FileText, MapPin, MessageCircle, Phone, Ruler, Share2, Shield } from 'lucide-react-native';
import { Linking, Alert, Share } from 'react-native';
import { useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import VerificationBadge from '@/components/VerificationBadge';
import Colors from '@/constants/colors';
import { PROPERTIES } from '@/constants/properties';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useVerification } from '@/contexts/VerificationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR') + ' FCFA';
}

function getDocumentDescription(docType: string): string {
  const descriptions: Record<string, string> = {
    TF: 'Titre foncier',
    PHOTOS: 'Photos haute résolution',
    PLANS: 'Plans architecturaux',
    CADASTRE: 'Plan cadastral',
    NOTAIRE: 'Actes notariés',
  };
  return descriptions[docType] || docType;
}

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const { createConversation } = useChat();
  const { getPropertyVerification } = useVerification();

  const property = PROPERTIES.find((p) => p.id === id);
  const propertyVerification = property ? getPropertyVerification(property.id) : null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cette propriété: ${property?.title}\n\nPrix: ${formatPrice(property?.price || 0)}\n\nVoir sur BAKRÔSUR: https://bakrosur.com/property/${id}`,
        title: property?.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = '+2250748526392';
    const message = `Bonjour, je suis intéressé(e) par la propriété: ${property?.title}`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Erreur', 'WhatsApp n\'est pas installé sur cet appareil');
        }
      })
      .catch((err) => console.error('Error opening WhatsApp:', err));
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour démarrer une conversation',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/auth/login' as any) },
        ]
      );
      return;
    }

    if (!property || !user) return;

    const conversationId = await createConversation(
      property.id,
      property.title,
      property.images[0],
      'vendor-' + property.id,
      'Propriétaire',
      'vendeur'
    );

    router.push(`/chat/${conversationId}` as any);
  };

  const handleRequestVisit = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour demander un rendez-vous',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/auth/login' as any) },
        ]
      );
      return;
    }
    router.push('/appointments' as any);
  };

  if (!property) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Propriété introuvable</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color={Colors.light.text} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleShare}
              style={styles.headerButton}
            >
              <Share2 size={22} color={Colors.light.text} />
            </Pressable>
          ),
        }}
      />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageSection}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                );
                setActiveImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {property.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.propertyImage}
                  contentFit="cover"
                />
              ))}
            </ScrollView>

            <View style={styles.imagePagination}>
              {property.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>

            {property.featured && (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>★ Vedette</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.priceSection}>
              <View>
                <Text style={styles.price}>{formatPrice(property.price)}</Text>
                <Text style={styles.priceType}>
                  {property.transactionType === 'VENTE'
                    ? 'À vendre'
                    : 'À louer / mois'}
                </Text>
              </View>
              <View style={styles.pricePerSqm}>
                <Text style={styles.pricePerSqmValue}>
                  {formatPrice(property.pricePerSqm)}
                </Text>
                <Text style={styles.pricePerSqmLabel}>par m²</Text>
              </View>
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.title}>{property.title}</Text>
              <View style={styles.location}>
                <MapPin size={18} color={Colors.light.textSecondary} />
                <Text style={styles.locationText}>
                  {property.neighborhoodName}, {property.cityName}
                </Text>
              </View>

              {propertyVerification?.badge && (
                <View style={styles.verificationBadgeContainer}>
                  <VerificationBadge
                    badge={propertyVerification.badge}
                    size="small"
                    showLabel={true}
                  />
                </View>
              )}

              {propertyVerification?.status === 'APPROVED' && (
                <View style={styles.verificationCard}>
                  <Shield size={20} color={Colors.light.success} />
                  <View style={styles.verificationInfo}>
                    <Text style={styles.verificationTitle}>Propriété vérifiée</Text>
                    <Text style={styles.verificationText}>
                      Cette propriété a été vérifiée par BAKRÔSUR
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ruler size={24} color={Colors.light.primary} />
                </View>
                <Text style={styles.detailValue}>{property.surfaceArea}m²</Text>
                <Text style={styles.detailLabel}>Surface</Text>
              </View>

              {property.bedrooms && (
                <View style={styles.detailCard}>
                  <View style={styles.detailIconContainer}>
                    <BedDouble size={24} color={Colors.light.primary} />
                  </View>
                  <Text style={styles.detailValue}>{property.bedrooms}</Text>
                  <Text style={styles.detailLabel}>Chambres</Text>
                </View>
              )}

              {property.bathrooms && (
                <View style={styles.detailCard}>
                  <View style={styles.detailIconContainer}>
                    <Text style={styles.bathroomIcon}>🚿</Text>
                  </View>
                  <Text style={styles.detailValue}>{property.bathrooms}</Text>
                  <Text style={styles.detailLabel}>Salles de bain</Text>
                </View>
              )}

              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Text style={styles.typeIcon}>🏠</Text>
                </View>
                <Text style={styles.detailValue}>{property.type}</Text>
                <Text style={styles.detailLabel}>Type</Text>
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{property.description}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Informations</Text>
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Type de transaction</Text>
                  <Text style={styles.infoValue}>
                    {property.transactionType === 'VENTE' ? 'Vente' : 'Location'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Statut</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {property.status === 'PUBLIE' ? 'Disponible' : property.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Ville</Text>
                  <Text style={styles.infoValue}>{property.cityName}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Quartier</Text>
                  <Text style={styles.infoValue}>{property.neighborhoodName}</Text>
                </View>
                {property.legalStatus && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Statut juridique</Text>
                    <View style={styles.legalStatusBadge}>
                      <Text style={styles.legalStatusBadgeText}>{property.legalStatus}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {property.availableDocuments && property.availableDocuments.length > 0 && (
              <View style={styles.documentsSection}>
                <Text style={styles.sectionTitle}>Documents disponibles</Text>
                <Text style={styles.documentsSubtitle}>
                  Cette propriété dispose des documents suivants
                </Text>
                <View style={styles.documentsList}>
                  {property.availableDocuments.map((doc) => (
                    <View key={doc} style={styles.documentCard}>
                      <View style={styles.documentIcon}>
                        <FileText size={20} color={Colors.light.primary} />
                      </View>
                      <View style={styles.documentInfo}>
                        <Text style={styles.documentName}>{doc}</Text>
                        <Text style={styles.documentDescription}>
                          {getDocumentDescription(doc)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.mapSection}>
              <Text style={styles.sectionTitle}>Emplacement</Text>
              <Text style={styles.mapSubtitle}>
                {property.neighborhoodName}, {property.cityName}
              </Text>
              <View style={styles.addressNotice}>
                <MapPin size={16} color={Colors.light.primary} />
                <Text style={styles.addressNoticeText}>
                  L&apos;adresse exacte sera communiquée lors de la confirmation de la visite
                </Text>
              </View>
              <Pressable
                style={styles.mapContainer}
                onPress={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`;
                  WebBrowser.openBrowserAsync(url);
                }}
              >
                <Image
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/staticmap?center=${property.latitude},${property.longitude}&zoom=14&size=600x300&markers=color:red%7C${property.latitude},${property.longitude}&key=AIzaSyDummy`,
                  }}
                  style={styles.map}
                  contentFit="cover"
                />
                <View style={styles.mapOverlay}>
                  <View style={styles.mapBadge}>
                    <MapPin size={16} color={Colors.light.background} />
                    <Text style={styles.mapBadgeText}>Voir sur la carte</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.contactButtons}>
            <Pressable
              style={styles.whatsappButton}
              onPress={handleWhatsAppContact}
            >
              <Phone size={20} color={Colors.light.background} />
              <Text style={styles.whatsappButtonText}>WhatsApp</Text>
            </Pressable>

            <Pressable
              style={styles.chatButton}
              onPress={handleStartChat}
            >
              <MessageCircle size={20} color={Colors.light.primary} />
              <Text style={styles.chatButtonText}>Chat</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.visitButton}
            onPress={handleRequestVisit}
          >
            <Calendar size={20} color={Colors.light.background} />
            <Text style={styles.visitButtonText}>Demander visite</Text>
          </Pressable>

          <Pressable
            style={styles.paymentButton}
            onPress={() => router.push(`/payment?propertyId=${property.id}` as any)}
          >
            <CreditCard size={20} color={Colors.light.primary} />
            <Text style={styles.paymentButtonText}>Payer avec Mobile Money</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageSection: {
    position: 'relative',
    height: HEADER_HEIGHT,
  },
  propertyImage: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT,
  },
  imagePagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: Colors.light.background,
    width: 24,
  },
  featuredBadge: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featuredBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  content: {
    paddingBottom: 100,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  price: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  priceType: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  pricePerSqm: {
    alignItems: 'flex-end',
  },
  pricePerSqmValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  pricePerSqmLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  verificationBadgeContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.light.success + '10',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.success,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  verificationText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  detailsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailCard: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    marginBottom: 8,
  },
  bathroomIcon: {
    fontSize: 24,
  },
  typeIcon: {
    fontSize: 24,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.success,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  legalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
  },
  legalStatusBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.background,
  },
  documentsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  documentsSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  documentsList: {
    gap: 12,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  mapSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  mapSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  mapContainer: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.light.backgroundSecondary,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  mapBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    gap: 12,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#25D366',
  },
  whatsappButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
  },
  visitButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  paymentButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  addressNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 10,
    marginBottom: 16,
  },
  addressNoticeText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
});
