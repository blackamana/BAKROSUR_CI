import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/colors';
import type { VerificationBadge as VerificationBadgeType } from '@/constants/verification';

interface VerificationBadgeProps {
  badge: VerificationBadgeType;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export default function VerificationBadge({
  badge,
  size = 'medium',
  showLabel = true,
}: VerificationBadgeProps) {
  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      icon: styles.iconSmall,
      iconText: styles.iconTextSmall,
      label: styles.labelSmall,
    },
    medium: {
      container: styles.containerMedium,
      icon: styles.iconMedium,
      iconText: styles.iconTextMedium,
      label: styles.labelMedium,
    },
    large: {
      container: styles.containerLarge,
      icon: styles.iconLarge,
      iconText: styles.iconTextLarge,
      label: styles.labelLarge,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[styles.container, currentSize.container]}>
      <View style={[styles.icon, currentSize.icon, { backgroundColor: badge.color }]}>
        <Text style={[styles.iconText, currentSize.iconText]}>{badge.icon}</Text>
      </View>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, currentSize.label]}>{badge.displayName}</Text>
          <Text style={styles.description}>{badge.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  containerSmall: {
    gap: 6,
  },
  containerMedium: {
    gap: 10,
  },
  containerLarge: {
    gap: 14,
  },
  icon: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  iconMedium: {
    width: 36,
    height: 36,
  },
  iconLarge: {
    width: 48,
    height: 48,
  },
  iconText: {
    color: Colors.light.background,
  },
  iconTextSmall: {
    fontSize: 10,
  },
  iconTextMedium: {
    fontSize: 16,
  },
  iconTextLarge: {
    fontSize: 22,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  labelSmall: {
    fontSize: 12,
  },
  labelMedium: {
    fontSize: 14,
  },
  labelLarge: {
    fontSize: 16,
  },
  description: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
