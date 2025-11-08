import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MessageSquare, Users, Briefcase, Home, Scale, Wrench, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import type { User } from '@/contexts/AuthContext';

interface MessagingSectionProps {
  user: User;
}

type ConversationType = {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  iconColor: string;
  route: string;
  badge?: number;
};

export default function MessagingSection({ user }: MessagingSectionProps) {
  // Déterminer les types de conversations disponibles selon le profil
  const getAvailableConversations = (): ConversationType[] => {
    const conversations: ConversationType[] = [];

    // Conversations communes à tous
    conversations.push({
      id: 'all',
      title: 'Toutes mes conversations',
      subtitle: 'Voir tous les messages',
      icon: MessageSquare,
      iconColor: Colors.light.primary,
      route: '/messages',
      badge: 3, // TODO: Récupérer le vrai nombre de non lus
    });

    // Selon le type de profil
    switch (user.profileType) {
      case 'particulier':
        // Particulier peut parler aux agences, bailleurs et intervenants
        if (user.isBailleur) {
          conversations.push({
            id: 'tenants',
            title: 'Mes locataires',
            subtitle: 'Communications avec vos locataires',
            icon: Users,
            iconColor: '#10b981',
            route: '/messages?filter=tenants',
          });
        }
        conversations.push(
          {
            id: 'landlords',
            title: 'Mes bailleurs',
            subtitle: 'Discussions avec les propriétaires',
            icon: Home,
            iconColor: '#f59e0b',
            route: '/messages?filter=landlords',
          },
          {
            id: 'agencies',
            title: 'Agences immobilières',
            subtitle: 'Agents et promoteurs',
            icon: Briefcase,
            iconColor: '#3b82f6',
            route: '/messages?filter=agencies',
          },
          {
            id: 'legal',
            title: 'Intervenants juridiques',
            subtitle: 'Notaires, avocats, huissiers...',
            icon: Scale,
            iconColor: '#8b5cf6',
            route: '/messages?filter=legal',
          },
          {
            id: 'workers',
            title: 'Artisans',
            subtitle: 'Prestataires de travaux',
            icon: Wrench,
            iconColor: '#f97316',
            route: '/messages?filter=workers',
          }
        );
        break;

      case 'professionnel':
        // Professionnel = Agence immobilière
        conversations.push(
          {
            id: 'clients',
            title: 'Mes clients',
            subtitle: 'Acheteurs et locataires',
            icon: Users,
            iconColor: '#10b981',
            route: '/messages?filter=clients',
          },
          {
            id: 'landlords',
            title: 'Propriétaires mandants',
            subtitle: 'Bailleurs et vendeurs',
            icon: Home,
            iconColor: '#f59e0b',
            route: '/messages?filter=landlords',
          },
          {
            id: 'legal',
            title: 'Intervenants juridiques',
            subtitle: 'Notaires, avocats pour vos dossiers',
            icon: Scale,
            iconColor: '#8b5cf6',
            route: '/messages?filter=legal',
          }
        );
        break;

      case 'intervenant':
        // Intervenant = Notaire, Avocat, Huissier, Géomètre, Expert
        conversations.push(
          {
            id: 'clients',
            title: 'Mes clients',
            subtitle: 'Particuliers et agences',
            icon: Users,
            iconColor: '#10b981',
            route: '/messages?filter=clients',
          },
          {
            id: 'dossiers',
            title: 'Dossiers en cours',
            subtitle: 'Transactions à sécuriser',
            icon: Briefcase,
            iconColor: '#3b82f6',
            route: '/messages?filter=dossiers',
          },
          {
            id: 'confreres',
            title: 'Confrères',
            subtitle: 'Autres intervenants juridiques',
            icon: Scale,
            iconColor: '#8b5cf6',
            route: '/messages?filter=confreres',
          }
        );
        break;
    }

    return conversations;
  };

  const conversations = getAvailableConversations();

  // Définir l'icône et le texte selon le profil
  const getProfileInfo = () => {
    switch (user.profileType) {
      case 'particulier':
        return user.isBailleur 
          ? { icon: '🏠', text: 'Vous êtes propriétaire-bailleur' }
          : { icon: '👤', text: 'Profil particulier' };
      case 'professionnel':
        return { icon: '🏢', text: 'Agence immobilière' };
      case 'intervenant':
        return { icon: '⚖️', text: 'Intervenant juridique' };
      default:
        return { icon: '👤', text: 'Profil utilisateur' };
    }
  };

  const profileInfo = getProfileInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MessageSquare size={24} color={Colors.light.primary} />
        <Text style={styles.headerTitle}>Messagerie</Text>
      </View>

      <Text style={styles.headerSubtitle}>
        Gérez vos conversations selon vos besoins
      </Text>

      <View style={styles.conversationsList}>
        {conversations.map((conv) => (
          <Pressable
            key={conv.id}
            style={styles.conversationCard}
            onPress={() => router.push(conv.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: conv.iconColor + '15' }]}>
              <conv.icon size={24} color={conv.iconColor} />
            </View>

            <View style={styles.conversationInfo}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationTitle}>{conv.title}</Text>
                {conv.badge && conv.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{conv.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.conversationSubtitle}>{conv.subtitle}</Text>
            </View>

            <ChevronRight size={20} color={Colors.light.textSecondary} />
          </Pressable>
        ))}
      </View>

      {/* Info sur le profil */}
      <View style={styles.profileInfo}>
        <Text style={styles.profileInfoText}>
          {profileInfo.icon} {profileInfo.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  conversationsList: {
    gap: 12,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  conversationSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  badge: {
    backgroundColor: Colors.light.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  profileInfoText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
