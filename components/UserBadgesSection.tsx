import { StyleSheet, Text, View } from 'react-native';

import VerificationBadge from './VerificationBadge';

import Colors from '@/constants/colors';
import type { VerificationBadge as VerificationBadgeType } from '@/constants/verification';

interface UserBadgesSectionProps {
  badges: VerificationBadgeType[];
  title?: string;
}

export default function UserBadgesSection({
  badges,
  title = 'Badges de vérification',
}: UserBadgesSectionProps) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.badgesList}>
        {badges.map((badge, index) => (
          <View key={`${badge.type}-${index}`} style={styles.badgeItem}>
            <VerificationBadge badge={badge} size="medium" showLabel={true} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  badgesList: {
    gap: 12,
  },
  badgeItem: {
    padding: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
});
