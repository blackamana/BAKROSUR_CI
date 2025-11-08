/**
 * Liste des Conversations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MessageCircle, ChevronRight } from 'lucide-react-native';
import { chatService, Conversation } from '@/lib/bakrosur-pay/chat.service';

interface ConversationListProps {
  userId: string;
  onConversationPress: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  userId,
  onConversationPress,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await chatService.getUserConversations(userId);
      setConversations(data);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.user1_id === userId
      ? conversation.user1_unread_count
      : conversation.user2_unread_count;
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const unreadCount = getUnreadCount(item);
    const otherUser = item.other_user;

    return (
      <TouchableOpacity
        onPress={() => onConversationPress(item)}
        className="bg-white border-b border-gray-100 px-4 py-3 flex-row items-center"
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View className="relative mr-3">
          {otherUser?.avatar ? (
            <Image
              source={{ uri: otherUser.avatar }}
              className="w-14 h-14 rounded-full"
            />
          ) : (
            <View className="w-14 h-14 rounded-full bg-orange-100 items-center justify-center">
              <Text className="text-orange-600 font-bold text-xl">
                {otherUser?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}

          {/* Badge non lu */}
          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-orange-600 rounded-full min-w-[20px] h-5 items-center justify-center px-1">
              <Text className="text-white text-xs font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        {/* Contenu */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`text-base ${
                unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'
              }`}
              numberOfLines={1}
            >
              {otherUser?.name || 'Utilisateur'}
            </Text>
            <Text className="text-xs text-gray-500">
              {formatTime(item.last_message_at)}
            </Text>
          </View>

          {/* Propriété */}
          {item.property && (
            <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
              📍 {item.property.title}
            </Text>
          )}

          {/* Dernier message */}
          <Text
            className={`text-sm ${
              unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
            }`}
            numberOfLines={2}
          >
            {item.last_message || 'Aucun message'}
          </Text>
        </View>

        <ChevronRight size={20} color="#D1D5DB" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#EA580C" />
        <Text className="text-gray-600 mt-4">Chargement...</Text>
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-8">
        <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
          <MessageCircle size={40} color="#EA580C" />
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Aucune conversation
        </Text>
        <Text className="text-gray-600 text-center">
          Contactez un vendeur ou un acheteur pour démarrer une conversation
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      renderItem={renderConversation}
      keyExtractor={(item) => item.id}
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#EA580C']}
          tintColor="#EA580C"
        />
      }
    />
  );
};