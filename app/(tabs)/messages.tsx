import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function MessagesScreen() {
  const { isAuthenticated } = useAuth();
  const { conversations, totalUnreadCount } = useChat();

  if (!isAuthenticated) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Messages',
            headerStyle: { backgroundColor: Colors.light.background },
            headerTitleStyle: { fontWeight: '700' as const },
          }}
        />
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.guestContainer}
          >
            <View style={styles.guestIcon}>
              <MessageCircle size={48} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.guestTitle}>Connectez-vous</Text>
            <Text style={styles.guestSubtitle}>
              Accédez à vos conversations avec les vendeurs et agents
            </Text>

            <View style={styles.guestButtons}>
              <Pressable
                style={styles.loginButton}
                onPress={() => router.push('/auth/login' as any)}
              >
                <Text style={styles.loginButtonText}>Se connecter</Text>
              </Pressable>

              <Pressable
                style={styles.signupButton}
                onPress={() => router.push('/auth/signup' as any)}
              >
                <Text style={styles.signupButtonText}>S'inscrire</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Messages',
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />
      <View style={styles.container}>
        {conversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <MessageCircle size={64} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>Aucun message</Text>
            <Text style={styles.emptySubtitle}>
              Contactez un vendeur ou agent depuis une page de propriété pour
              démarrer une conversation
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.conversationsList}>
              {conversations.map((conversation) => (
                <Pressable
                  key={conversation.id}
                  style={({ pressed }) => [
                    styles.conversationCard,
                    pressed && styles.conversationCardPressed,
                  ]}
                  onPress={() =>
                    router.push(`/chat/${conversation.id}` as any)
                  }
                >
                  <Image
                    source={{ uri: conversation.propertyImage }}
                    style={styles.propertyImage}
                    contentFit="cover"
                  />

                  <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                      <Text style={styles.otherUserName} numberOfLines={1}>
                        {conversation.otherUserName}
                      </Text>
                      <Text style={styles.userType}>
                        {conversation.otherUserType === 'vendeur'
                          ? 'Vendeur'
                          : 'Agent'}
                      </Text>
                    </View>

                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {conversation.propertyTitle}
                    </Text>

                    {conversation.lastMessage && (
                      <Text style={styles.lastMessage} numberOfLines={1}>
                        {conversation.lastMessage.text}
                      </Text>
                    )}

                    <Text style={styles.timestamp}>
                      {conversation.lastMessage
                        ? formatTimestamp(conversation.lastMessage.timestamp)
                        : formatTimestamp(conversation.createdAt)}
                    </Text>
                  </View>

                  {conversation.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>
                        {conversation.unreadCount}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
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
  scrollView: {
    flex: 1,
  },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  guestIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  guestSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  guestButtons: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
  signupButton: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
    lineHeight: 24,
  },
  conversationsList: {
    padding: 16,
    gap: 12,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  conversationCardPressed: {
    opacity: 0.7,
  },
  propertyImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  conversationContent: {
    flex: 1,
    gap: 4,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  otherUserName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.light.text,
    flex: 1,
  },
  userType: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  propertyTitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  lastMessage: {
    fontSize: 15,
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.light.background,
  },
});
