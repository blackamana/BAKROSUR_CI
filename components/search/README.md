# Composants de recherche - Inspirés de Bien'ici

Documentation des composants de recherche pour BakroSur.

## Vue d'ensemble

Cette collection de composants implémente une interface de recherche immobilière moderne inspirée de Bien'ici, avec :
- Barre de recherche intelligente avec suggestions
- Onglets de type de transaction
- Filtres principaux (prix, type, chambres, surface)
- Résumé des filtres actifs en langage naturel

## Composants

### 1. PropertySearchBar

Barre de recherche avec suggestions automatiques et historique.

#### Props

```typescript
interface PropertySearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  fetchSuggestions?: (query: string) => Promise<SearchSuggestion[]>;
  showHistory?: boolean;
  recentSearches?: string[];
}
```

#### Exemple d'utilisation

```tsx
import { PropertySearchBar } from '@/components/search';

<PropertySearchBar
  placeholder="J'envisage d'acheter en..."
  onSearch={(query) => console.log('Recherche:', query)}
  fetchSuggestions={async (query) => {
    // Appel API pour récupérer les suggestions
    return await api.getSuggestions(query);
  }}
  showHistory
  recentSearches={['Abidjan', 'Cocody']}
/>
```

#### Fonctionnalités

- ✅ Suggestions dès 2 caractères
- ✅ Autocomplete villes/quartiers/propriétés
- ✅ Historique de recherche
- ✅ Debounce (300ms)
- ✅ Icons différenciés par type

---

### 2. TransactionTypeTabs

Onglets pour sélectionner le type de transaction (Acheter/Louer/Neuf/Terrain).

#### Props

```typescript
interface TransactionTypeTabsProps {
  selectedType: TransactionType | null;
  onSelect: (type: TransactionType) => void;
}
```

#### Exemple d'utilisation

```tsx
import { TransactionTypeTabs } from '@/components/search';

<TransactionTypeTabs
  selectedType={filters.transactionType}
  onSelect={(type) => setFilters({ ...filters, transactionType: type })}
/>
```

#### Fonctionnalités

- ✅ 4 types : Acheter, Louer, Neuf, Terrain
- ✅ Icons et couleurs différenciées
- ✅ Sélection exclusive
- ✅ Responsive (flex layout)

---

### 3. MainFilters

Filtres principaux (budget, type de bien, chambres, surface).

#### Props

```typescript
interface MainFiltersProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
  resultCount?: number;
}
```

#### Exemple d'utilisation

```tsx
import { MainFilters } from '@/components/search';

<MainFilters
  filters={filters}
  onChange={(partial) => setFilters({ ...filters, ...partial })}
  resultCount={42}
/>
```

#### Fonctionnalités

- ✅ Type de bien (Appartement, Maison, Terrain, Commerce, Bureau)
- ✅ Budget (slider double 0-500M FCFA)
- ✅ Chambres (0 à 5+)
- ✅ Salles de bain (0 à 3+)
- ✅ Surface (slider double 0-1000 m²)
- ✅ Compteur de résultats en temps réel

---

### 4. ActiveFiltersBar

Résumé des filtres actifs en langage naturel.

#### Props

```typescript
interface ActiveFiltersBarProps {
  filters: SearchFilters;
  resultCount?: number;
  onReset: () => void;
  cityName?: string;
  neighborhoodName?: string;
}
```

#### Exemple d'utilisation

```tsx
import { ActiveFiltersBar } from '@/components/search';

<ActiveFiltersBar
  filters={filters}
  resultCount={42}
  onReset={() => setFilters(DEFAULT_FILTERS)}
  cityName="Abidjan"
  neighborhoodName="Cocody"
/>
```

#### Fonctionnalités

- ✅ Résumé en langage naturel
- ✅ Format : "Achat appartement à Abidjan - 2+ ch - 50-100M FCFA"
- ✅ Badge de comptage des résultats
- ✅ Bouton de réinitialisation
- ✅ Scroll horizontal pour texte long

---

## Composants UI de base

### RangeSlider

Slider double pour sélectionner une fourchette de valeurs.

```tsx
import { RangeSlider } from '@/components/ui/inputs';

<RangeSlider
  label="Budget"
  min={0}
  max={500000000}
  step={5000000}
  values={[10000000, 100000000]}
  onChange={([min, max]) => console.log(min, max)}
  formatValue={(value) => `${value / 1000000}M`}
  unit=" FCFA"
/>
```

---

### MultiSelect

Sélection multiple (équipements, documents, etc.).

```tsx
import { MultiSelect } from '@/components/ui/inputs';

<MultiSelect
  label="Équipements"
  options={[
    { id: 'parking', label: 'Parking' },
    { id: 'garden', label: 'Jardin' },
    { id: 'pool', label: 'Piscine' },
  ]}
  selectedIds={['parking', 'garden']}
  onChange={(ids) => console.log(ids)}
  variant="button"
  columns={2}
/>
```

---

### FAB (Floating Action Button)

Bouton flottant pour actions principales.

```tsx
import { FAB } from '@/components/ui/buttons';
import { Map } from 'lucide-react-native';

<FAB
  onPress={() => navigation.navigate('Map')}
  icon={<Map size={24} color="#FFFFFF" />}
  label="Voir sur carte"
  variant="extended"
  position="bottom-right"
/>
```

---

## Exemple complet

Voir `SearchExample.tsx` pour un exemple d'intégration complète de tous les composants.

```tsx
import { SearchExample } from '@/components/search/SearchExample';

// Dans votre écran
<SearchExample />
```

---

## Types

Les types sont définis dans `lib/types/search.types.ts` :

```typescript
import {
  SearchFilters,
  TransactionType,
  PropertyType,
  SearchSuggestion,
  DEFAULT_FILTERS
} from '@/lib/types/search.types';
```

---

## Installation

Aucune dépendance supplémentaire n'est requise pour ces composants. Ils utilisent :
- `react-native` (composants de base)
- `lucide-react-native` (icônes)
- `@react-native-community/slider` (déjà installé)

---

## Prochaines étapes

Ces composants constituent la **Phase 1** de l'implémentation. Les prochaines phases incluront :

### Phase 2 : Carte interactive
- EnhancedPropertyMarker avec BakroScore
- MapDrawingTool (dessin de zone)
- TravelTimeFilter (recherche par temps de trajet)
- PointOfInterestLayer

### Phase 3 : Affichage des résultats
- PropertyCard amélioré avec carrousel
- PropertyList/Grid
- SplitView (carte + liste)
- AdvancedFilters modal

---

## Support

Pour toute question ou bug, référez-vous à la documentation principale :
- `BIENICI-UI-SPECIFICATIONS.md` - Spécifications complètes
- `BIENICI-TECHNICAL-IMPLEMENTATION.md` - Guide technique
- `BIENICI-IMPLEMENTATION-ROADMAP.md` - Feuille de route

---

**Dernière mise à jour** : 2025-11-08
