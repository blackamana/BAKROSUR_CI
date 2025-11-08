import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '@/constants/colors';

export default function TricolorBanner() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          Colors.light.ivorianOrange,
          'rgba(255, 136, 0, 0.5)',
          Colors.light.ivorianWhite,
          'rgba(255, 255, 255, 0.5)',
          Colors.light.ivorianGreen,
        ]}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    width: '100%',
  },
  gradient: {
    flex: 1,
  },
});
