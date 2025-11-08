/**
 * MultiSelect - Composant de sélection multiple
 * Utilisé pour équipements, documents, etc.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';

export interface MultiSelectOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  variant?: 'checkbox' | 'button';
  columns?: 1 | 2 | 3;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedIds,
  onChange,
  variant = 'button',
  columns = 2,
}) => {
  const toggleOption = (id: string) => {
    const isSelected = selectedIds.includes(id);
    if (isSelected) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  if (variant === 'checkbox') {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.checkboxList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.checkboxItem}
              onPress={() => toggleOption(option.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  isSelected(option.id) && styles.checkboxSelected,
                ]}
              >
                {isSelected(option.id) && <Check size={16} color="#FFFFFF" />}
              </View>
              <Text
                style={[
                  styles.checkboxLabel,
                  isSelected(option.id) && styles.checkboxLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // Variant: button
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.buttonGrid, { gap: 8 }]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.button,
              { width: `${100 / columns - 1}%` },
              isSelected(option.id) && styles.buttonSelected,
            ]}
            onPress={() => toggleOption(option.id)}
          >
            {option.icon && (
              <View style={styles.buttonIcon}>{option.icon}</View>
            )}
            <Text
              style={[
                styles.buttonLabel,
                isSelected(option.id) && styles.buttonLabelSelected,
              ]}
            >
              {option.label}
            </Text>
            {isSelected(option.id) && (
              <View style={styles.buttonCheck}>
                <Check size={14} color="#EA580C" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  // Checkbox variant
  checkboxList: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  checkboxLabelSelected: {
    color: '#111827',
    fontWeight: '600',
  },
  // Button variant
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  buttonSelected: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
    textAlign: 'center',
  },
  buttonLabelSelected: {
    color: '#EA580C',
    fontWeight: '600',
  },
  buttonCheck: {
    marginLeft: 8,
  },
});
