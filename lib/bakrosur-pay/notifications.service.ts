/**
 * Service Notifications - Push & In-app
 */

import { supabase } from '@/lib/supabase';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export interface Notification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  body: string;
  action_url?: string;
  action_label?: string;
  data: any;
  is_read: boolean;
  read_at?: string;
  push_sent: boolean;
  created_at: string;
}

export class NotificationService {
  /**
   * Configurer les notifications push
   */
  async setupPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn('Les notifications push ne fonctionnent que sur un appareil réel');
      return null;
    }

    // Demander la permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission notifications refusée');
      return null;
    }

    // Obtenir le token Expo Push
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Enregistrer le token dans la base de données
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      await supabase
        .from('users')
        .update({ push_token: token })
        .eq('id', user.user.id);
    }

    // Configurer le comportement des notifications
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B00',
    });

    return token;
  }

  /**
   * Récupérer les notifications de l'utilisateur
   */
  async getUserNotifications(
    userId: string,
    limit: number = 50,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId);
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(userId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_read', false);
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await supabase.from('notifications').delete().eq('id', notificationId);
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) return 0;
    return count || 0;
  }

  /**
   * S'abonner aux nouvelles notifications (temps réel)
   */
  subscribeToNotifications(
    userId: string,
    onNotification: (notification: Notification) => void
  ): () => void {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onNotification(payload.new as Notification);
          
          // Afficher une notification locale
          this.showLocalNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Afficher une notification locale
   */
  private async showLocalNotification(notification: Notification): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Immédiatement
    });
  }

  /**
   * Créer une notification
   */
  async createNotification(
    userId: string,
    type: string,
    title: string,
    body: string,
    data?: any,
    actionUrl?: string,
    actionLabel?: string
  ): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        notification_type: type,
        title,
        body,
        data: data || {},
        action_url: actionUrl,
        action_label: actionLabel,
      })
      .select()
      .single();

    if (error) throw error;

    // Envoyer push notification si l'utilisateur a un token
    const { data: user } = await supabase
      .from('users')
      .select('push_token')
      .eq('id', userId)
      .single();

    if (user?.push_token) {
      await this.sendPushNotification(user.push_token, title, body, data);
    }

    return notification;
  }

  /**
   * Envoyer une push notification via Expo
   */
  private async sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    const message = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
      channelId: 'default',
    };

    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Erreur envoi push notification:', error);
    }
  }

  /**
   * Grouper les notifications par type
   */
  async getNotificationsByType(userId: string): Promise<Record<string, Notification[]>> {
    const notifications = await this.getUserNotifications(userId);

    return notifications.reduce((acc, notif) => {
      if (!acc[notif.notification_type]) {
        acc[notif.notification_type] = [];
      }
      acc[notif.notification_type].push(notif);
      return acc;
    }, {} as Record<string, Notification[]>);
  }

  /**
   * Configurer le gestionnaire de notifications en avant-plan
   */
  setupForegroundHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }
}

// Export singleton
export const notificationService = new NotificationService();