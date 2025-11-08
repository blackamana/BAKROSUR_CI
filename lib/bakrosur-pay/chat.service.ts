/**
 * Service Chat Temps Réel - BakroSur
 */

import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  property_id: string;
  sender_id: string;
  recipient_id: string;
  message_type: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'LOCATION' | 'SYSTEM';
  content: string;
  attachments: any[];
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  property_id?: string;
  last_message?: string;
  last_message_at?: string;
  user1_unread_count: number;
  user2_unread_count: number;
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    title: string;
    city_name: string;
    images?: string[];
  };
  other_user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export class ChatService {
  private channel: RealtimeChannel | null = null;

  /**
   * Générer un ID de conversation unique
   */
  private generateConversationId(
    user1Id: string,
    user2Id: string,
    propertyId: string
  ): string {
    const sortedUsers = [user1Id, user2Id].sort();
    return `${sortedUsers[0]}_${sortedUsers[1]}_${propertyId}`;
  }

  /**
   * Créer ou récupérer une conversation
   */
  async getOrCreateConversation(
    userId: string,
    otherUserId: string,
    propertyId: string
  ): Promise<Conversation> {
    const conversationId = this.generateConversationId(userId, otherUserId, propertyId);

    // Vérifier si la conversation existe
    const { data: existing } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        property:properties(id, title, city_name, images)
      `)
      .eq('id', conversationId)
      .single();

    if (existing) {
      return existing;
    }

    // Créer une nouvelle conversation
    const { data: conversation, error } = await supabase
      .from('chat_conversations')
      .insert({
        id: conversationId,
        user1_id: [userId, otherUserId].sort()[0],
        user2_id: [userId, otherUserId].sort()[1],
        property_id: propertyId,
      })
      .select(`
        *,
        property:properties(id, title, city_name, images)
      `)
      .single();

    if (error) throw error;
    return conversation;
  }

  /**
   * Récupérer toutes les conversations d'un utilisateur
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        property:properties(id, title, city_name, images),
        user1:users!user1_id(id, name, avatar),
        user2:users!user2_id(id, name, avatar)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error) throw error;

    // Ajouter l'autre utilisateur dans chaque conversation
    return (data || []).map((conv: any) => ({
      ...conv,
      other_user: conv.user1_id === userId ? conv.user2 : conv.user1,
    }));
  }

  /**
   * Récupérer les messages d'une conversation
   */
  async getMessages(
    conversationId: string,
    limit: number = 50,
    before?: string
  ): Promise<ChatMessage[]> {
    let query = supabase
      .from('chat_messages')
      .select(`
        *,
        sender:users!sender_id(id, name, avatar)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).reverse(); // Plus ancien → plus récent
  }

  /**
   * Envoyer un message
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    recipientId: string,
    propertyId: string,
    content: string,
    messageType: ChatMessage['message_type'] = 'TEXT',
    attachments: any[] = []
  ): Promise<ChatMessage> {
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        property_id: propertyId,
        sender_id: senderId,
        recipient_id: recipientId,
        message_type: messageType,
        content,
        attachments,
      })
      .select(`
        *,
        sender:users!sender_id(id, name, avatar)
      `)
      .single();

    if (error) throw error;

    // Créer une notification pour le destinataire
    await supabase.from('notifications').insert({
      user_id: recipientId,
      notification_type: 'NEW_MESSAGE',
      title: '💬 Nouveau message',
      body: content.substring(0, 100),
      data: {
        conversation_id: conversationId,
        message_id: message.id,
        sender_id: senderId,
      },
    });

    return message;
  }

  /**
   * Marquer les messages comme lus
   */
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    // Marquer les messages non lus
    await supabase
      .from('chat_messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('conversation_id', conversationId)
      .eq('recipient_id', userId)
      .eq('is_read', false);

    // Réinitialiser le compteur de non-lus dans la conversation
    const { data: conversation } = await supabase
      .from('chat_conversations')
      .select('user1_id, user2_id')
      .eq('id', conversationId)
      .single();

    if (conversation) {
      const isUser1 = conversation.user1_id === userId;
      await supabase
        .from('chat_conversations')
        .update({
          [isUser1 ? 'user1_unread_count' : 'user2_unread_count']: 0,
        })
        .eq('id', conversationId);
    }
  }

  /**
   * S'abonner aux nouveaux messages (temps réel)
   */
  subscribeToMessages(
    conversationId: string,
    onMessage: (message: ChatMessage) => void,
    onError?: (error: any) => void
  ): () => void {
    this.channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Récupérer les infos complètes du message avec le sender
          const { data: message } = await supabase
            .from('chat_messages')
            .select(`
              *,
              sender:users!sender_id(id, name, avatar)
            `)
            .eq('id', payload.new.id)
            .single();

          if (message) {
            onMessage(message);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Abonné au chat:', conversationId);
        } else if (status === 'CHANNEL_ERROR' && onError) {
          onError(new Error('Erreur connexion chat'));
        }
      });

    // Retourner la fonction de désabonnement
    return () => {
      if (this.channel) {
        supabase.removeChannel(this.channel);
        this.channel = null;
      }
    };
  }

  /**
   * Rechercher dans les messages
   */
  async searchMessages(
    userId: string,
    query: string,
    limit: number = 20
  ): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:users!sender_id(id, name, avatar)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Supprimer un message
   */
  async deleteMessage(messageId: string): Promise<void> {
    await supabase
      .from('chat_messages')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        content: 'Message supprimé',
      })
      .eq('id', messageId);
  }

  /**
   * Archiver une conversation
   */
  async archiveConversation(conversationId: string, userId: string): Promise<void> {
    const { data: conversation } = await supabase
      .from('chat_conversations')
      .select('user1_id, user2_id')
      .eq('id', conversationId)
      .single();

    if (conversation) {
      const isUser1 = conversation.user1_id === userId;
      await supabase
        .from('chat_conversations')
        .update({
          [isUser1 ? 'is_archived_user1' : 'is_archived_user2']: true,
        })
        .eq('id', conversationId);
    }
  }

  /**
   * Bloquer une conversation
   */
  async blockConversation(conversationId: string, userId: string): Promise<void> {
    await supabase
      .from('chat_conversations')
      .update({
        is_blocked: true,
        blocked_by_user_id: userId,
      })
      .eq('id', conversationId);
  }

  /**
   * Obtenir le nombre total de messages non lus
   */
  async getTotalUnreadCount(userId: string): Promise<number> {
    const { data } = await supabase
      .from('chat_conversations')
      .select('user1_id, user2_id, user1_unread_count, user2_unread_count')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (!data) return 0;

    return data.reduce((total, conv) => {
      const isUser1 = conv.user1_id === userId;
      return total + (isUser1 ? conv.user1_unread_count : conv.user2_unread_count);
    }, 0);
  }
}

// Export singleton
export const chatService = new ChatService();