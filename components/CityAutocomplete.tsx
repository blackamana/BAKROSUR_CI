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
import { CITIES, City } from '@/constants/cities';

interface CityAutocompleteProps {
  value: string | null;
  onChange: (cityId: string | null) => void;
  placeholder?: string;
  label?: string;
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function fuzzyMatch(search: string, target: string): boolean {
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

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = 'Sélectionner une ville',
  label,
}: CityAutocompleteProps) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCity = CITIES.find((c) => c.id === value);

  const filteredCities = useMemo(() => {
    if (!search.trim()) return CITIES;
    
    return CITIES.filter((city) => 
      fuzzyMatch(search, city.name) ||
      fuzzyMatch(search, city.region) ||
      fuzzyMatch(search, city.district)
    ).slice(0, 50);
  }, [search]);

  const handleSelect = (city: City) => {
    onChange(city.id);
    setShowModal(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange(null);
    setSearch('');
  };

  return (
    <>
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        
        <Pressable
          style={styles.selectButton}
          onPress={() => setShowModal(true)}
        >
          <View style={styles.selectContent}>
            {selectedCity ? (
              <>
                <MapPin size={18} color={Colors.light.primary} />
                <View style={styles.selectedInfo}>
                  <Text style={styles.selectedText}>{selectedCity.name}</Text>
                  <Text style={styles.selectedSubtext}>
                    {selectedCity.region} • {selectedCity.population.toLocaleString()} hab.
                  </Text>
                </View>
              </>
            ) : (
              <>
                <MapPin size={18} color={Colors.light.textSecondary} />
                <Text style={styles.placeholderText}>{placeholder}</Text>
              </>
            )}
          </View>
          
          <View style={styles.selectActions}>
            {selectedCity && (
              <Pressable onPress={handleClear} hitSlop={8}>
                <X size={18} color={Colors.light.textSecondary} />
              </Pressable>
            )}
            <ChevronDown size={18} color={Colors.light.textSecondary} />
          </View>
        </Pressable>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sélectionner une ville</Text>
            <Pressable onPress={() => setShowModal(false)}>
              <X size={24} color={Colors.light.text} />
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <MapPin size={20} color={Colors.light.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher par nom, région..."
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
              {filteredCities.length} ville{filteredCities.length !== 1 ? 's' : ''} trouvée{filteredCities.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.cityItem,
                  selectedCity?.id === item.id && styles.cityItemSelected,
                ]}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.cityIconContainer}>
                  <MapPin
                    size={20}
                    color={
                      selectedCity?.id === item.id
                        ? Colors.light.primary
                        : Colors.light.textSecondary
                    }
                  />
                </View>
                <View style={styles.cityInfo}>
                  <Text
                    style={[
                      styles.cityName,
                      selectedCity?.id === item.id && styles.cityNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.cityDetails}>
                    {item.region} • {item.district}
                  </Text>
                  <Text style={styles.cityPopulation}>
                    {item.population.toLocaleString()} habitants
                  </Text>
                </View>
                {selectedCity?.id === item.id && (
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
                <Text style={styles.emptyText}>Aucune ville trouvée</Text>
                <Text style={styles.emptySubtext}>
                  Essayez une autre recherche
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
  selectActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  cityItemSelected: {
    backgroundColor: `${Colors.light.primary}10`,
  },
  cityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityInfo: {
    flex: 1,
    gap: 2,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  cityNameSelected: {
    color: Colors.light.primary,
  },
  cityDetails: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  cityPopulation: {
    fontSize: 12,
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
  },
});
