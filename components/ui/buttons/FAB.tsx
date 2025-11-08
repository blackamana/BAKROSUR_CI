/**
 * FAB - Floating Action Button
 * Bouton flottant pour actions principales (ex: "Voir sur carte")
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';

export interface FABProps {
  onPress: () => void;
  icon: React.ReactNode;
  label?: string;
  variant?: 'normal' | 'mini' | 'extended';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  backgroundColor?: string;
  style?: ViewStyle;
}

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon,
  label,
  variant = 'normal',
  position = 'bottom-right',
  backgroundColor = '#EA580C',
  style,
}) => {
  const getPositionStyles = () => {
    const base = {
      position: 'absolute' as const,
      bottom: 20,
    };

    switch (position) {
      case 'bottom-right':
        return { ...base, right: 20 };
      case 'bottom-center':
        return { ...base, left: '50%', transform: [{ translateX: -28 }] };
      case 'bottom-left':
        return { ...base, left: 20 };
      default:
        return { ...base, right: 20 };
    }
  };

  const getSizeStyles = () => {
    switch (variant) {
      case 'mini':
        return { width: 40, height: 40 };
      case 'extended':
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          minWidth: 120,
        };
      default:
        return { width: 56, height: 56 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        getPositionStyles(),
        getSizeStyles(),
        { backgroundColor },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {variant === 'extended' ? (
        <View style={styles.extendedContent}>
          {icon}
          {label && <Text style={styles.extendedLabel}>{label}</Text>}
        </View>
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  extendedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  extendedLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
