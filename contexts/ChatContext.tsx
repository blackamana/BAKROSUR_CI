import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useState } from 'react';

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  otherUserId: string;
  otherUserName: string;
  otherUserType: 'vendeur' | 'agent';
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
};

const CHAT_STORAGE_KEY = '@bakrôsur_chat';

export const [ChatProvider, useChat] = createContextHook(() => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setConversations(data.conversations || []);
        setMessages(data.messages || {});
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (convs: Conversation[], msgs: Record<string, Message[]>) => {
    try {
      await AsyncStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify({ conversations: convs, messages: msgs })
      );
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  };

  const createConversation = useCallback(
    async (
      propertyId: string,
      propertyTitle: string,
      propertyImage: string,
      otherUserId: string,
      otherUserName: string,
      otherUserType: 'vendeur' | 'agent'
    ) => {
      const existingConv = conversations.find(
        (c) => c.propertyId === propertyId && c.otherUserId === otherUserId
      );

      if (existingConv) {
        return existingConv.id;
      }

      const newConversation: Conversation = {
        id: Date.now().toString(),
        propertyId,
        propertyTitle,
        propertyImage,
        otherUserId,
        otherUserName,
        otherUserType,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      };

      const updatedConvs = [newConversation, ...conversations];
      setConversations(updatedConvs);
      await saveData(updatedConvs, messages);

      return newConversation.id;
    },
    [conversations, messages]
  );

  const sendMessage = useCallback(
    async (conversationId: string, senderId: string, senderName: string, text: string) => {
      const message: Message = {
        id: Date.now().toString(),
        conversationId,
        senderId,
        senderName,
        text,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const updatedMessages = {
        ...messages,
        [conversationId]: [...(messages[conversationId] || []), message],
      };

      const updatedConvs = conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: message,
          };
        }
        return conv;
      });

      setMessages(updatedMessages);
      setConversations(updatedConvs);
      await saveData(updatedConvs, updatedMessages);
    },
    [conversations, messages]
  );

  const markAsRead = useCallback(
    async (conversationId: string) => {
      const updatedMessages = {
        ...messages,
        [conversationId]: (messages[conversationId] || []).map((m) => ({
          ...m,
          read: true,
        })),
      };

      const updatedConvs = conversations.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });

      setMessages(updatedMessages);
      setConversations(updatedConvs);
      await saveData(updatedConvs, updatedMessages);
    },
    [conversations, messages]
  );

  const getConversationMessages = useCallback(
    (conversationId: string) => {
      return messages[conversationId] || [];
    },
    [messages]
  );

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return {
    conversations,
    getConversationMessages,
    createConversation,
    sendMessage,
    markAsRead,
    totalUnreadCount,
    isLoading,
  };
});
