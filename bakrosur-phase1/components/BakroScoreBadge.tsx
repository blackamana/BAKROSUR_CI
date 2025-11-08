/**
 * ================================================================
 * BAKRÔSUR - Composant BakroScore Badge
 * ================================================================
 * Affiche le badge de score de confiance sur les annonces
 * ================================================================
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BakroScoreBadgeProps {
  score: number;
  level: 'EXCELLENT' | 'BON' | 'MOYEN' | 'FAIBLE' | 'TRES_FAIBLE';
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: ViewStyle;
}

export const BakroScoreBadge: React.FC<BakroScoreBadgeProps> = ({
  score,
  level,
  size = 'medium',
  onPress,
  style
}) => {
  // Déterminer les couleurs selon le niveau
  const getColors = () => {
    switch (level) {
      case 'EXCELLENT':
        return {
          gradient: ['#10b981', '#059669'],
          text: '#fff',
          icon: '🌟',
          label: 'Excellent'
        };
      case 'BON':
        return {
          gradient: ['#3b82f6', '#2563eb'],
          text: '#fff',
          icon: '✅',
          label: 'Bon'
        };
      case 'MOYEN':
        return {
          gradient: ['#f59e0b', '#d97706'],
          text: '#fff',
          icon: '⚠️',
          label: 'Moyen'
        };
      case 'FAIBLE':
        return {
          gradient: ['#f97316', '#ea580c'],
          text: '#fff',
          icon: '⚠️',
          label: 'Faible'
        };
      case 'TRES_FAIBLE':
        return {
          gradient: ['#ef4444', '#dc2626'],
          text: '#fff',
          icon: '❌',
          label: 'Très faible'
        };
      default:
        return {
          gradient: ['#9ca3af', '#6b7280'],
          text: '#fff',
          icon: '❓',
          label: 'Non évalué'
        };
    }
  };

  const colors = getColors();
  const roundedScore = Math.round(score);

  // Déterminer la taille
  const sizes = {
    small: {
      container: 80,
      score: 24,
      label: 10,
      icon: 16
    },
    medium: {
      container: 100,
      score: 32,
      label: 12,
      icon: 20
    },
    large: {
      container: 120,
      score: 40,
      label: 14,
      icon: 24
    }
  };

  const sizeConfig = sizes[size];

  const BadgeContent = (
    <LinearGradient
      colors={colors.gradient}
      style={[
        styles.badge,
        { 
          width: sizeConfig.container, 
          height: sizeConfig.container 
        },
        style
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={[styles.icon, { fontSize: sizeConfig.icon }]}>
        {colors.icon}
      </Text>
      <Text style={[styles.score, { fontSize: sizeConfig.score, color: colors.text }]}>
        {roundedScore}
      </Text>
      <Text style={[styles.maxScore, { fontSize: sizeConfig.label, color: colors.text }]}>
        / 100
      </Text>
      <Text style={[styles.label, { fontSize: sizeConfig.label, color: colors.text }]}>
        {colors.label}
      </Text>
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {BadgeContent}
      </TouchableOpacity>
    );
  }

  return BadgeContent;
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  icon: {
    marginBottom: 4,
  },
  score: {
    fontWeight: 'bold',
    lineHeight: 32,
  },
  maxScore: {
    opacity: 0.9,
    marginTop: -4,
  },
  label: {
    marginTop: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.95,
  },
});

export default BakroScoreBadge;
