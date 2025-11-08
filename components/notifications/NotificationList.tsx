/**
 * Liste des Notifications
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Bell,
  MessageCircle,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  Heart,
  Calendar,
  FileCheck,
  TrendingUp,
} from 'lucide-react-native';
import { notificationService, Notification } from '@/lib/bakrosur-pay/notifications.service';

interface NotificationListProps {
  userId: string;
  onNotificationPress?: (notification: Notification) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  userId,
  onNotificationPress,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Marquer comme lue
    if (!notification.is_read) {
      await notificationService.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
    }

    // Appeler le callback
    if (onNotificationPress) {
      onNotificationPress(notification);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error('Erreur marquage toutes lues:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const iconSize = 20;
    const iconColor = '#EA580C';

    switch (type) {
      case 'NEW_MESSAGE':
        return <MessageCircle size={iconSize} color={iconColor} />;
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_SENT':
        return <DollarSign size={iconSize} color={iconColor} />;
      case 'ESCROW_CREATED':
      case 'ESCROW_RELEASED':
        return <CheckCircle size={iconSize} color={iconColor} />;
      case 'PROPERTY_VIEWED':
        return <Eye size={iconSize} color={iconColor} />;
      case 'PROPERTY_FAVORITED':
        return <Heart size={iconSize} color={iconColor} />;
      case 'APPOINTMENT_BOOKED':
        return <Calendar size={iconSize} color={iconColor} />;
      case 'DOCUMENT_VERIFIED':
        return <FileCheck size={iconSize} color={iconColor} />;
      case 'BAKROSCORE_UPDATED':
        return <TrendingUp size={iconSize} color={iconColor} />;
      default:
        return <Bell size={iconSize} color={iconColor} />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      className={`border-b border-gray-100 px-4 py-4 flex-row ${
        !item.is_read ? 'bg-orange-50' : 'bg-white'
      }`}
      activeOpacity={0.7}
    >
      {/* Icône */}
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          !item.is_read ? 'bg-orange-100' : 'bg-gray-100'
        }`}
      >
        {getNotificationIcon(item.notification_type)}
      </View>

      {/* Contenu */}
      <View className="flex-1">
        <View className="flex-row items-start justify-between mb-1">
          <Text
            className={`text-base flex-1 mr-2 ${
              !item.is_read ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'
            }`}
          >
            {item.title}
          </Text>
          {!item.is_read && (
            <View className="w-2 h-2 bg-orange-600 rounded-full mt-1" />
          )}
        </View>

        <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
          {item.body}
        </Text>

        <Text className="text-xs text-gray-500">
          {formatTime(item.created_at)}
        </Text>
      </View>
    </TouchableOpacity>
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
    <View className="flex-1 bg-gray-50">
      {/* Header avec bouton tout marquer comme lu */}
      {notifications.some((n) => !n.is_read) && (
        <View className="bg-white border-b border-gray-200 px-4 py-3">
          <TouchableOpacity onPress={markAllAsRead}>
            <Text className="text-orange-600 font-semibold text-center">
              Tout marquer comme lu
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
            <Bell size={40} color="#EA580C" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Aucune notification
          </Text>
          <Text className="text-gray-600 text-center">
            Vous serez notifié ici de toutes vos activités
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#EA580C']}
              tintColor="#EA580C"
            />
          }
        />
      )}
    </View>
  );
};