/**
 * Écran de Chat Temps Réel
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Send, Paperclip, ArrowLeft } from 'lucide-react-native';
import { chatService, ChatMessage } from '@/lib/bakrosur-pay/chat.service';
import { MessageBubble } from './MessageBubble';

interface ChatScreenProps {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  currentUserId: string;
  propertyId: string;
  propertyTitle?: string;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  conversationId,
  otherUserId,
  otherUserName,
  otherUserAvatar,
  currentUserId,
  propertyId,
  propertyTitle,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    markAsRead();

    // S'abonner aux nouveaux messages en temps réel
    const unsubscribe = chatService.subscribeToMessages(
      conversationId,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();
        
        // Marquer comme lu si message de l'autre personne
        if (newMessage.sender_id !== currentUserId) {
          markAsRead();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await chatService.markAsRead(conversationId, currentUserId);
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    setSending(true);
    setInputText('');

    try {
      await chatService.sendMessage(
        conversationId,
        currentUserId,
        otherUserId,
        propertyId,
        text
      );
      scrollToBottom();
    } catch (error) {
      console.error('Erreur envoi message:', error);
      setInputText(text); // Restaurer le texte en cas d'erreur
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble
      message={item}
      isCurrentUser={item.sender_id === currentUserId}
      showAvatar={item.sender_id !== currentUserId}
      senderAvatar={otherUserAvatar}
    />
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#EA580C" />
        <Text className="text-gray-600 mt-4">Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center">
        <TouchableOpacity onPress={onBack} className="mr-3">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        {otherUserAvatar ? (
          <Image
            source={{ uri: otherUserAvatar }}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
            <Text className="text-orange-600 font-bold text-lg">
              {otherUserName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">
            {otherUserName}
          </Text>
          {propertyTitle && (
            <Text className="text-xs text-gray-600" numberOfLines={1}>
              {propertyTitle}
            </Text>
          )}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={scrollToBottom}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-400 text-center">
              Aucun message pour le moment.{'\n'}
              Commencez la conversation !
            </Text>
          </View>
        }
      />

      {/* Input */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3">
            <Paperclip size={24} color="#6B7280" />
          </TouchableOpacity>

          <View className="flex-1 bg-gray-100 rounded-full px-4 py-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Écrivez un message..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={1000}
              className="text-base text-gray-900"
              style={{ maxHeight: 100 }}
            />
          </View>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
              inputText.trim() && !sending ? 'bg-orange-600' : 'bg-gray-300'
            }`}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};