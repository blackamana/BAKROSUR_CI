/**
 * Bulle de Message Chat
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import { ChatMessage } from '@/lib/bakrosur-pay/chat.service';

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  senderAvatar?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  showAvatar = false,
  senderAvatar,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View
      className={`flex-row mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar (pour les messages de l'autre utilisateur) */}
      {showAvatar && !isCurrentUser && (
        <View className="mr-2">
          {senderAvatar ? (
            <Image
              source={{ uri: senderAvatar }}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {message.sender?.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Bulle de message */}
      <View
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isCurrentUser
            ? 'bg-orange-600 rounded-br-none'
            : 'bg-white rounded-bl-none shadow-sm'
        }`}
      >
        {/* Contenu du message */}
        <Text
          className={`text-base ${
            isCurrentUser ? 'text-white' : 'text-gray-900'
          }`}
        >
          {message.content}
        </Text>

        {/* Heure et statut de lecture */}
        <View className="flex-row items-center justify-end mt-1">
          <Text
            className={`text-xs ${
              isCurrentUser ? 'text-orange-100' : 'text-gray-500'
            }`}
          >
            {formatTime(message.created_at)}
          </Text>

          {/* Check marks pour les messages envoyés */}
          {isCurrentUser && (
            <View className="ml-1">
              {message.is_read ? (
                <CheckCheck size={14} color="#FED7AA" />
              ) : (
                <Check size={14} color="#FED7AA" />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};