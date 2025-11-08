import { ChevronDown, MapPin, X } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Colors from '@/constants/colors';
import { NEIGHBORHOODS, Neighborhood } from '@/constants/neighborhoods';

interface NeighborhoodAutocompleteProps {
  value: string | null;
  onChange: (neighborhoodId: string | null) => void;
  cityId: string | null;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

function normalizeString(str: string | null | undefined): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function fuzzyMatch(search: string, target: string | null | undefined): boolean {
  if (!target || typeof target !== 'string') return false;
  const normalizedSearch = normalizeString(search);
  const normalizedTarget = normalizeString(target);
  
  if (normalizedTarget.includes(normalizedSearch)) return true;
  
  let searchIndex = 0;
  for (let i = 0; i < normalizedTarget.length && searchIndex < normalizedSearch.length; i++) {
    if (normalizedTarget[i] === normalizedSearch[searchIndex]) {
      searchIndex++;
    }
  }
  return searchIndex === normalizedSearch.length;
}

const TYPE_LABELS: Record<Neighborhood['type'], string> = {
  Quartier: 'Quartier',
  Village: 'Village',
};

export default function NeighborhoodAutocomplete({
  value,
  onChange,
  cityId,
  placeholder = 'Sélectionner un quartier',
  label,
  disabled = false,
}: NeighborhoodAutocompleteProps) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const selectedNeighborhood = NEIGHBORHOODS.find((n) => n.id === value);

  const availableNeighborhoods = useMemo(() => {
    if (!cityId) return [];
    return NEIGHBORHOODS.filter((n) => n.cityId === cityId);
  }, [cityId]);

  const filteredNeighborhoods = useMemo(() => {
    if (!search.trim()) return availableNeighborhoods;
    
    return availableNeighborhoods.filter((neighborhood) => 
      fuzzyMatch(search, neighborhood.name) ||
      fuzzyMatch(search, neighborhood.commune) ||
      fuzzyMatch(search, TYPE_LABELS[neighborhood.type])
    );
  }, [search, availableNeighborhoods]);

  const handleSelect = (neighborhood: Neighborhood) => {
    onChange(neighborhood.id);
    setShowModal(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange(null);
    setSearch('');
  };

  const handlePress = () => {
    if (disabled) return;
    if (!cityId) return;
    setShowModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        <Pressable
          style={[
            styles.selectButton,
            disabled && styles.selectButtonDisabled,
          ]}
          onPress={handlePress}
          disabled={disabled}
        >
          <View style={styles.selectContent}>
            {selectedNeighborhood ? (
              <>
                <MapPin size={18} color={Colors.light.primary} />
                <View style={styles.selectedInfo}>
                  <Text style={styles.selectedText}>{selectedNeighborhood.name}</Text>
                  <Text style={styles.selectedSubtext}>
                    {selectedNeighborhood.commune} • {TYPE_LABELS[selectedNeighborhood.type]}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <MapPin size={18} color={disabled ? Colors.light.border : Colors.light.textSecondary} />
                <Text style={[
                  styles.placeholderText,
                  disabled && styles.placeholderTextDisabled,
                ]}>
                  {!cityId ? 'Sélectionnez d&apos;abord une ville' : placeholder}
                </Text>
              </>
            )}
          </View>
          
          <View style={styles.selectActions}>
            {selectedNeighborhood && !disabled && (
              <Pressable onPress={handleClear} hitSlop={8}>
                <X size={18} color={Colors.light.textSecondary} />
              </Pressable>
            )}
            <ChevronDown 
              size={18} 
              color={disabled ? Colors.light.border : Colors.light.textSecondary} 
            />
          </View>
        </Pressable>

        {!cityId && (
          <Text style={styles.helperText}>
            Veuillez d&apos;abord sélectionner une ville
          </Text>
        )}
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sélectionner un quartier</Text>
            <Pressable onPress={() => setShowModal(false)}>
              <X size={24} color={Colors.light.text} />
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <MapPin size={20} color={Colors.light.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher par nom, commune..."
              placeholderTextColor={Colors.light.textSecondary}
              value={search}
              onChangeText={setSearch}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <X size={18} color={Colors.light.textSecondary} />
              </Pressable>
            )}
          </View>

          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              {filteredNeighborhoods.length} quartier{filteredNeighborhoods.length !== 1 ? 's' : ''} trouvé{filteredNeighborhoods.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <FlatList
            data={filteredNeighborhoods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.neighborhoodItem,
                  selectedNeighborhood?.id === item.id && styles.neighborhoodItemSelected,
                ]}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.neighborhoodIconContainer}>
                  <MapPin
                    size={20}
                    color={
                      selectedNeighborhood?.id === item.id
                        ? Colors.light.primary
                        : Colors.light.textSecondary
                    }
                  />
                </View>
                <View style={styles.neighborhoodInfo}>
                  <Text
                    style={[
                      styles.neighborhoodName,
                      selectedNeighborhood?.id === item.id && styles.neighborhoodNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.neighborhoodDetails}>
                    {item.commune}
                  </Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>
                      {TYPE_LABELS[item.type]}
                    </Text>
                  </View>
                </View>
                {selectedNeighborhood?.id === item.id && (
                  <View style={styles.checkmark}>
                    <View style={styles.checkmarkInner} />
                  </View>
                )}
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MapPin size={48} color={Colors.light.border} />
                <Text style={styles.emptyText}>Aucun quartier trouvé</Text>
                <Text style={styles.emptySubtext}>
                  {search ? 'Essayez une autre recherche' : 'Aucun quartier disponible pour cette ville'}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  selectButtonDisabled: {
    opacity: 0.5,
  },
  selectContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedInfo: {
    flex: 1,
    gap: 2,
  },
  selectedText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  selectedSubtext: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  placeholderText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  placeholderTextDisabled: {
    color: Colors.light.border,
  },
  selectActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helperText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.backgroundSecondary,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
  },
  resultsInfo: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  neighborhoodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  neighborhoodItemSelected: {
    backgroundColor: `${Colors.light.primary}10`,
  },
  neighborhoodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neighborhoodInfo: {
    flex: 1,
    gap: 4,
  },
  neighborhoodName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  neighborhoodNameSelected: {
    color: Colors.light.primary,
  },
  neighborhoodDetails: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.background,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
