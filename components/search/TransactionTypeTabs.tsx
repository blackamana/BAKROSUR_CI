/**
 * TransactionTypeTabs - Onglets pour sélectionner le type de transaction
 * Acheter / Louer / Neuf / Terrain
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Home, Key, Building, MapPin } from 'lucide-react-native';
import { TransactionType } from '@/lib/types/search.types';

export interface TransactionTypeTabsProps {
  selectedType: TransactionType | null;
  onSelect: (type: TransactionType) => void;
}

interface TabConfig {
  id: TransactionType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const TABS: TabConfig[] = [
  {
    id: 'BUY',
    label: 'Acheter',
    icon: <Home size={20} />,
    color: '#EA580C',
  },
  {
    id: 'RENT',
    label: 'Louer',
    icon: <Key size={20} />,
    color: '#2563EB',
  },
  {
    id: 'NEW',
    label: 'Neuf',
    icon: <Building size={20} />,
    color: '#10B981',
  },
  {
    id: 'LAND',
    label: 'Terrain',
    icon: <MapPin size={20} />,
    color: '#8B5CF6',
  },
];

export const TransactionTypeTabs: React.FC<TransactionTypeTabsProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isSelected = selectedType === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              isSelected && {
                backgroundColor: tab.color,
                borderColor: tab.color,
              },
            ]}
            onPress={() => onSelect(tab.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { color: isSelected ? '#FFFFFF' : tab.color },
              ]}
            >
              {React.cloneElement(tab.icon as React.ReactElement, {
                color: isSelected ? '#FFFFFF' : tab.color,
              })}
            </View>
            <Text
              style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  iconContainer: {
    // Le style de couleur est appliqué dynamiquement
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
});
