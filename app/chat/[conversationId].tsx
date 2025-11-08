/**
 * Écran de Conversation Individuelle
 */

import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ChatScreen } from '@/components/chat/ChatScreen';
import { useAuth } from '@/hooks/useAuth';

export default function ConversationScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();

  const conversationId = params.conversationId as string;
  const otherUserId = params.otherUserId as string;
  const otherUserName = params.otherUserName as string;
  const otherUserAvatar = params.otherUserAvatar as string;
  const propertyId = params.propertyId as string;
  const propertyTitle = params.propertyTitle as string;

  return (
    <SafeAreaView style={styles.container}>
      <ChatScreen
        conversationId={conversationId}
        otherUserId={otherUserId}
        otherUserName={otherUserName}
        otherUserAvatar={otherUserAvatar}
        currentUserId={user?.id || ''}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        onBack={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});