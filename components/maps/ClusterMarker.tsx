/**
 * Marker pour les Clusters de Propriétés
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

interface ClusterMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  count: number;
  onPress: () => void;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  coordinate,
  count,
  onPress,
}) => {
  // Taille du cluster selon le nombre de propriétés
  const getSize = () => {
    if (count >= 100) return 60;
    if (count >= 50) return 50;
    if (count >= 10) return 40;
    return 35;
  };

  const size = getSize();

  return (
    <Marker coordinate={coordinate} onPress={onPress} tracksViewChanges={false}>
      <View style={[styles.cluster, { width: size, height: size }]}>
        <View style={styles.clusterInner}>
          <Text style={styles.clusterText}>{count}</Text>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  cluster: {
    backgroundColor: 'rgba(234, 88, 12, 0.3)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  clusterInner: {
    backgroundColor: '#EA580C',
    width: '70%',
    height: '70%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});