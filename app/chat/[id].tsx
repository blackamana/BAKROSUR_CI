import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { conversations, getConversationMessages, sendMessage, markAsRead } = useChat();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const conversation = conversations.find((c) => c.id === id);
  const messages = getConversationMessages(id || '');

  useEffect(() => {
    if (id) {
      markAsRead(id);
    }
  }, [id, markAsRead]);

  const handleSend = async () => {
    if (!inputText.trim() || !id || !user) return;

    await sendMessage(id, user.id, user.name, inputText.trim());
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (!conversation) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Conversation introuvable</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Colors.light.background },
          headerTitle: conversation.otherUserName,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={Colors.light.text} />
            </Pressable>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.propertyHeader}>
          <Text style={styles.propertyHeaderText} numberOfLines={1}>
            À propos de: {conversation.propertyTitle}
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => {
            const isMyMessage = item.senderId === user?.id;
            return (
              <View
                style={[
                  styles.messageContainer,
                  isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
                ]}
              >
                {!isMyMessage && (
                  <Text style={styles.senderName}>{item.senderName}</Text>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMyMessage ? styles.myMessageText : styles.otherMessageText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
                <Text style={styles.messageTime}>
                  {formatMessageTime(item.timestamp)}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Commencez la conversation avec {conversation.otherUserName}
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Écrire un message..."
            placeholderTextColor={Colors.light.textSecondary}
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send
              size={20}
              color={inputText.trim() ? Colors.light.background : Colors.light.textSecondary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyHeader: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  propertyHeaderText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  messagesList: {
    padding: 16,
    gap: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    gap: 4,
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    marginLeft: 12,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: Colors.light.background,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: Colors.light.background,
  },
  otherMessageText: {
    color: Colors.light.text,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginHorizontal: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
});
