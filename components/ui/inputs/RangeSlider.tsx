/**
 * RangeSlider - Slider double pour sélectionner une fourchette de valeurs
 * Utilisé pour prix, surface, etc.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

export interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  formatValue?: (value: number) => string;
  unit?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min,
  max,
  step,
  values,
  onChange,
  formatValue,
  unit = '',
}) => {
  const [minValue, maxValue] = values;

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, maxValue - step);
    onChange([newMin, maxValue]);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, minValue + step);
    onChange([minValue, newMax]);
  };

  const displayValue = (value: number): string => {
    if (formatValue) {
      return formatValue(value);
    }
    return `${value.toLocaleString()}${unit}`;
  };

  return (
    <View style={styles.container}>
      {/* Label et valeurs */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          {displayValue(minValue)} - {displayValue(maxValue)}
        </Text>
      </View>

      {/* Slider minimum */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Min</Text>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={minValue}
          onValueChange={handleMinChange}
          minimumTrackTintColor="#EA580C"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#EA580C"
        />
      </View>

      {/* Slider maximum */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Max</Text>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={maxValue}
          onValueChange={handleMaxChange}
          minimumTrackTintColor="#EA580C"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#EA580C"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  values: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EA580C',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sliderLabel: {
    width: 40,
    fontSize: 14,
    color: '#6B7280',
  },
  slider: {
    flex: 1,
    height: 40,
  },
});
