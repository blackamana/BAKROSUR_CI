/**
 * BottomSheetWrapper - Wrapper simplifié pour @gorhom/bottom-sheet
 * Utilisé pour les modals sur mobile (filtres avancés, etc.)
 *
 * Note: Nécessite l'installation de @gorhom/bottom-sheet
 * npm install @gorhom/bottom-sheet
 */

import React, { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

// Type pour une implémentation sans la dépendance
export interface BottomSheetWrapperProps {
  children: React.ReactNode;
  title?: string;
  snapPoints?: string[];
  onClose?: () => void;
  enablePanDownToClose?: boolean;
}

export interface BottomSheetWrapperRef {
  expand: () => void;
  collapse: () => void;
  close: () => void;
}

/**
 * Version simplifiée sans @gorhom/bottom-sheet
 * Pour utiliser la vraie version, installez: npm install @gorhom/bottom-sheet
 */
export const BottomSheetWrapper = forwardRef<
  BottomSheetWrapperRef,
  BottomSheetWrapperProps
>(({ children, title, onClose }, ref) => {
  useImperativeHandle(ref, () => ({
    expand: () => console.log('expand'),
    collapse: () => console.log('collapse'),
    close: () => onClose?.(),
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.handle} />
        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
});

BottomSheetWrapper.displayName = 'BottomSheetWrapper';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 12,
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
});
