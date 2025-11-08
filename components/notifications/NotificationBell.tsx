/**
 * Cloche de Notifications avec Badge
 */

import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import { notificationService } from '@/lib/bakrosur-pay/notifications.service';

interface NotificationBellProps {
  userId: string;
  onPress: () => void;
  size?: number;
  color?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  userId,
  onPress,
  size = 24,
  color = '#000',
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();

    // S'abonner aux nouvelles notifications
    const unsubscribe = notificationService.subscribeToNotifications(
      userId,
      () => {
        loadUnreadCount();
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur comptage notifications:', error);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} className="relative">
      <Bell size={size} color={color} />

      {unreadCount > 0 && (
        <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
          <Text className="text-white text-xs font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};