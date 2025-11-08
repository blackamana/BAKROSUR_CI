# Spécifications UI/UX pour BakroSur - Inspiré de Bien'ici

> **Date**: 2025-11-08
> **Version**: 1.0
> **Statut**: En implémentation

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Spécifications de la page de recherche](#spécifications-de-la-page-de-recherche)
3. [Spécifications de la carte interactive](#spécifications-de-la-carte-interactive)
4. [Spécifications des fiches de résultats](#spécifications-des-fiches-de-résultats)
5. [Composants React Native requis](#composants-react-native-requis)
6. [Guide d'implémentation](#guide-dimplémentation)

---

## Vue d'ensemble

### Objectifs

- Créer une interface de recherche immobilière intuitive et moderne
- Intégrer une carte interactive 3D avec géolocalisation
- Fournir des filtres avancés (tracé de zone, temps de trajet)
- Afficher un système de confiance BakroScore
- Optimiser l'expérience mobile et desktop

### Principes de design

1. **Simplicité** : Interface épurée, informations essentielles visibles immédiatement
2. **Feedback immédiat** : Mise à jour en temps réel du nombre de résultats
3. **Transparence** : Affichage clair des critères de recherche actifs
4. **Immersion** : Carte interactive centrale avec contextualisation géographique
5. **Sécurité** : Mise en avant du BakroScore et des badges de vérification

---

## Spécifications de la page de recherche

### 1. Barre de recherche principale

#### Composant: `PropertySearchBar`

**Position**: En haut de la page, toujours visible

**Éléments**:
```typescript
interface SearchBarProps {
  placeholder: string; // "J'envisage d'acheter en..."
  onSearch: (query: string) => void;
  showSuggestions: boolean;
  suggestions: SearchSuggestion[];
}

interface SearchSuggestion {
  type: 'city' | 'neighborhood' | 'property';
  label: string;
  id: string;
  metadata?: {
    city?: string;
    count?: number;
  };
}
```

**Comportement**:
- Suggestions automatiques dès 2 caractères
- Affichage de l'icône de localisation pour les suggestions géographiques
- Historique de recherche (5 dernières recherches)
- Bouton de recherche vocale (mobile)

**Design**:
```css
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border-radius: 12px
Padding: 14px 16px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
```

---

### 2. Onglets de type de transaction

#### Composant: `TransactionTypeTabs`

**Options**:
- Acheter
- Louer
- Neuf
- Terrain

**Design**:
```typescript
interface TabConfig {
  id: TransactionType;
  label: string;
  icon: IconName;
  color: string;
}

const TABS: TabConfig[] = [
  { id: 'BUY', label: 'Acheter', icon: 'Home', color: '#EA580C' },
  { id: 'RENT', label: 'Louer', icon: 'Key', color: '#2563EB' },
  { id: 'NEW', label: 'Neuf', icon: 'Building', color: '#10B981' },
  { id: 'LAND', label: 'Terrain', icon: 'MapPin', color: '#8B5CF6' },
];
```

**Comportement**:
- Sélection exclusive (un seul onglet actif)
- Ajuste automatiquement les filtres disponibles
- Animation de transition fluide

---

### 3. Filtres principaux

#### Composant: `MainFilters`

**Filtres visibles par défaut**:

1. **Budget** (Slider double)
   ```typescript
   interface PriceFilter {
     min: number | null;
     max: number | null;
     step: 10000; // FCFA
   }
   ```

2. **Type de bien** (Boutons)
   - Appartement
   - Maison
   - Terrain
   - Commerce
   - Bureau

3. **Nombre de pièces** (Sélecteur)
   ```typescript
   interface RoomFilter {
     bedrooms: number | null; // 1+, 2+, 3+, 4+, 5+
     bathrooms: number | null; // 1+, 2+, 3+
   }
   ```

4. **Surface** (Slider double)
   ```typescript
   interface SurfaceFilter {
     min: number | null;
     max: number | null;
     unit: 'm²';
   }
   ```

**Design des contrôles**:
- **Sliders**: Couleur principale #EA580C
- **Boutons**: Outline par défaut, filled quand actif
- **Badge de comptage**: Affiche le nombre de résultats en temps réel

---

### 4. Filtres avancés

#### Composant: `AdvancedFilters` (Modal/Drawer)

**Bouton d'accès**:
```typescript
<Button
  label="Plus de filtres"
  icon={<Filter />}
  badge={activeAdvancedFiltersCount}
  variant="outline"
/>
```

**Sections**:

##### 4.1. Équipements
```typescript
interface AmenitiesFilter {
  parking: boolean;
  garden: boolean;
  pool: boolean;
  elevator: boolean;
  balcony: boolean;
  terrace: boolean;
  basement: boolean;
  security: boolean;
}
```

##### 4.2. État et documents (Spécifique BakroSur)
```typescript
interface LegalFilter {
  titleVerified: boolean;
  bakroScoreMin: number; // 0-100
  availableDocuments: DocumentType[];
  legalStatus: LegalStatus[];
}
```

##### 4.3. Proximité
```typescript
interface ProximityFilter {
  nearSchool: boolean;
  nearTransport: boolean;
  nearShops: boolean;
  nearHealthcare: boolean;
  maxDistance: number; // en km
}
```

---

### 5. Outils de recherche avancés

#### 5.1. Composant: `MapDrawingTool`

**Fonctionnalité**: Dessiner une zone de recherche sur la carte

**Implémentation**:
```typescript
interface DrawingToolProps {
  onZoneDrawn: (coordinates: LatLng[]) => void;
  onZoneCleared: () => void;
  isActive: boolean;
}

// Utilisation de react-native-maps avec Polygon
<Polygon
  coordinates={drawnZone}
  fillColor="rgba(234, 88, 12, 0.2)"
  strokeColor="#EA580C"
  strokeWidth={2}
/>
```

**UX**:
- Bouton flottant sur la carte avec icône crayon
- Instructions contextuelles : "Dessinez votre zone de recherche"
- Possibilité d'éditer les points après tracé
- Bouton "Effacer" pour recommencer

#### 5.2. Composant: `TravelTimeFilter`

**Fonctionnalité**: Recherche par temps de trajet

**Interface**:
```typescript
interface TravelTimeConfig {
  address: string;
  coordinates: LatLng;
  duration: number; // minutes
  mode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
}
```

**Implémentation**:
```typescript
// Utiliser react-native-maps-directions
import MapViewDirections from 'react-native-maps-directions';

const calculateIsochrone = async (config: TravelTimeConfig) => {
  // API pour calculer l'isochrone (zone accessible en X minutes)
  const isochrone = await mapService.getIsochrone(
    config.coordinates,
    config.duration,
    config.mode
  );
  return isochrone;
};
```

**UX**:
- Modal de configuration:
  ```
  ┌─────────────────────────────────────┐
  │ Recherche par temps de trajet       │
  ├─────────────────────────────────────┤
  │ Adresse de référence:               │
  │ [Autocomplete Input]                │
  │                                     │
  │ Temps de trajet max:                │
  │ [15 min] ────●──── [60 min]        │
  │                                     │
  │ Mode de transport:                  │
  │ [🚗] [🚶] [🚴] [🚇]                  │
  │                                     │
  │         [Annuler]  [Rechercher]     │
  └─────────────────────────────────────┘
  ```

- Affichage sur la carte:
  - Zone colorée (polygone) représentant la zone accessible
  - Légende: "Biens à 15 min en voiture de [adresse]"

#### 5.3. Composant: `GeolocationSearch`

**Fonctionnalité**: Recherche "Autour de moi"

**Implémentation**:
```typescript
import * as Location from 'expo-location';

const searchNearMe = async (radius: number = 5000) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    radius,
  };
};
```

**UX**:
- Bouton FAB (Floating Action Button) sur la carte
- Icône de localisation avec animation
- Sélection du rayon : 1 km, 3 km, 5 km, 10 km

---

### 6. Résumé des critères actifs

#### Composant: `ActiveFiltersBar`

**Position**: Juste au-dessus de la liste des résultats

**Format**: Phrase en langage naturel
```
Exemple: "Achat appartement à Abidjan - 2+ chambres - 50-100M FCFA - Titre vérifié"
```

**Implémentation**:
```typescript
interface ActiveFiltersBarProps {
  filters: Filters;
  resultCount: number;
  onReset: () => void;
}

const buildFilterSummary = (filters: Filters): string => {
  const parts: string[] = [];

  if (filters.transactionType) {
    parts.push(filters.transactionType === 'BUY' ? 'Achat' : 'Location');
  }

  if (filters.type) {
    parts.push(getPropertyTypeLabel(filters.type));
  }

  if (filters.cityId) {
    parts.push(`à ${getCityName(filters.cityId)}`);
  }

  if (filters.bedrooms) {
    parts.push(`${filters.bedrooms}+ chambres`);
  }

  if (filters.minPrice || filters.maxPrice) {
    const priceRange = formatPriceRange(filters.minPrice, filters.maxPrice);
    parts.push(priceRange);
  }

  return parts.join(' - ');
};
```

**Design**:
```css
Background: #F9FAFB
Border-bottom: 1px solid #E5E7EB
Padding: 12px 16px
Font-size: 14px
Color: #374151
```

---

## Spécifications de la carte interactive

### 1. Composant principal: `EnhancedPropertyMap`

**Amélioration de l'existant**: Basé sur `InteractiveMap` avec nouvelles fonctionnalités

**Props**:
```typescript
interface EnhancedPropertyMapProps {
  properties: MapProperty[];
  filters: Filters;
  viewMode: 'split' | 'fullscreen'; // Split = carte + liste, Fullscreen = carte seule
  onPropertySelect: (property: MapProperty) => void;

  // Nouveaux props inspirés de Bien'ici
  showPointsOfInterest: boolean;
  show3DBuildings: boolean; // Si supporté
  enableDrawingMode: boolean;
  enableTravelTimeMode: boolean;
  autoRefreshOnMove: boolean;
}
```

---

### 2. Couches de carte

#### 2.1. Couche Bâtiments 3D (si supporté)

```typescript
// Pour les programmes neufs, afficher des modèles 3D
interface Building3DLayer {
  enabled: boolean;
  buildingHeight?: number;
  buildingColor?: string;
}
```

#### 2.2. Couche Points d'intérêt

```typescript
interface PointOfInterest {
  type: 'SCHOOL' | 'TRANSPORT' | 'SHOP' | 'PARK' | 'HOSPITAL';
  name: string;
  coordinates: LatLng;
  icon: IconName;
}

const POI_ICONS = {
  SCHOOL: '🏫',
  TRANSPORT: '🚇',
  SHOP: '🛒',
  PARK: '🌳',
  HOSPITAL: '🏥',
};
```

**Affichage**:
- Marqueurs plus petits que les propriétés
- Couleur différenciée (#6B7280)
- Visibles uniquement au zoom > niveau 12

---

### 3. Marqueurs de propriétés améliorés

#### Composant: `EnhancedPropertyMarker`

**Amélioration par rapport à l'existant**:

```typescript
interface EnhancedPropertyMarkerProps {
  property: MapProperty;
  onPress: () => void;

  // Nouveaux éléments
  showPrice: boolean;
  showBakroScore: boolean;
  isHighlighted: boolean; // Quand survolé depuis la liste
}
```

**Nouveau design**:
```
┌─────────────┐
│  [Badge ✓]  │  ← Badge "Vérifié" (si title_verified)
│  ┌───────┐  │
│  │ 🏠    │  │  ← Icône du type de bien
│  │ Score │  │  ← BakroScore (70/100)
│  └───────┘  │
│  [Prix]     │  ← Prix formaté
└──────┴──────┘
       │
       ▼         ← Pointe du marker
```

**Code**:
```typescript
<View style={styles.markerContainer}>
  {/* Badge de vérification */}
  {property.title_verified && (
    <View style={styles.verifiedBadge}>
      <Text style={styles.verifiedIcon}>✓</Text>
    </View>
  )}

  {/* Corps du marker */}
  <View style={[styles.markerBody, { backgroundColor: getMarkerColor() }]}>
    {getPropertyIcon()}

    {/* BakroScore */}
    {showBakroScore && property.bakro_score && (
      <Text style={styles.scoreText}>{property.bakro_score}</Text>
    )}
  </View>

  {/* Prix */}
  {showPrice && (
    <View style={styles.priceTag}>
      <Text style={styles.priceText}>{formatPrice(property.price)}</Text>
    </View>
  )}

  {/* Pointe */}
  <View style={styles.markerTip} />
</View>
```

---

### 4. Clustering intelligent

**Amélioration**: Clustering basé sur le zoom et la densité

```typescript
interface ClusterConfig {
  radius: number; // Distance pour regrouper (en pixels)
  minZoom: number; // Niveau de zoom minimum pour clustering
  maxZoom: number; // Niveau de zoom maximum pour clustering
}

const CLUSTER_CONFIG: ClusterConfig = {
  radius: 60,
  minZoom: 5,
  maxZoom: 15,
};

// Affichage du cluster
interface ClusterMarkerDisplay {
  count: number;
  avgPrice: number;
  avgBakroScore: number;
  hasVerifiedProperties: boolean;
}
```

**Design du cluster**:
```
┌──────────┐
│   [✓]    │  ← Indicateur si contient des biens vérifiés
│  ┌────┐  │
│  │ 12 │  │  ← Nombre de biens
│  └────┘  │
│  50-80M  │  ← Fourchette de prix
└──────────┘
```

---

### 5. Carte de prévisualisation

#### Composant: `PropertyPreviewCard` (amélioré)

**Position**: En bas de la carte, au-dessus du bouton de basculement

**Contenu**:
```typescript
interface PropertyPreviewCardProps {
  property: MapProperty;
  onPress: () => void;
  onClose: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
}
```

**Layout**:
```
┌─────────────────────────────────────────┐
│ [Photo]     Titre de la propriété  [X] │
│             2 ch • 85 m² • 45M FCFA     │
│             Abidjan - Cocody            │
│             ⭐ BakroScore: 85/100       │
│ [❤️ Favoris]  [👁️ Voir]  [📍 Y aller] │
└─────────────────────────────────────────┘
```

**Animation**:
- Slide up depuis le bas
- Swipe vers le bas pour fermer
- Transition fluide (300ms)

---

### 6. Contrôles de carte

#### Composant: `MapControls`

**Boutons**:

1. **Ma position** (existant)
   ```typescript
   <TouchableOpacity onPress={handleMyLocation}>
     <MapPin size={24} color="#000" />
   </TouchableOpacity>
   ```

2. **Type de carte** (existant)
   - Standard
   - Satellite
   - Hybride

3. **Dessin de zone** (nouveau)
   ```typescript
   <TouchableOpacity
     onPress={() => setDrawingMode(true)}
     style={[styles.controlBtn, drawingMode && styles.active]}
   >
     <Edit size={24} color={drawingMode ? "#EA580C" : "#000"} />
   </TouchableOpacity>
   ```

4. **Temps de trajet** (nouveau)
   ```typescript
   <TouchableOpacity onPress={() => setShowTravelTimeModal(true)}>
     <Clock size={24} color="#000" />
   </TouchableOpacity>
   ```

5. **Points d'intérêt** (nouveau)
   ```typescript
   <TouchableOpacity onPress={() => setShowPOI(!showPOI)}>
     <Landmark size={24} color={showPOI ? "#EA580C" : "#000"} />
   </TouchableOpacity>
   ```

6. **Auto-refresh** (nouveau)
   ```typescript
   <View style={styles.switchContainer}>
     <Text style={styles.switchLabel}>
       Rechercher quand je déplace la carte
     </Text>
     <Switch
       value={autoRefresh}
       onValueChange={setAutoRefresh}
       trackColor={{ false: "#E5E7EB", true: "#FED7AA" }}
       thumbColor={autoRefresh ? "#EA580C" : "#F3F4F6"}
     />
   </View>
   ```

---

## Spécifications des fiches de résultats

### 1. Composant: `PropertyCard` (amélioré)

**Nouveau design**:

```
┌─────────────────────────────────────────────┐
│ [Photo carousel] [❤️] [Badge Vérifié]      │
│                                             │
│ 45 000 000 FCFA              ⭐ Score: 85  │
│ Appartement • 2 ch • 85 m²                  │
│ Abidjan, Cocody - Boulevard Latrille       │
│                                             │
│ 🛡️ Titre vérifié • 📄 Docs complets        │
│                                             │
│ [📍 Voir sur carte] [👁️ Voir détails]      │
└─────────────────────────────────────────────┘
```

**Props**:
```typescript
interface PropertyCardProps {
  property: Property;
  viewMode: 'list' | 'grid';
  onPress: () => void;
  onFavorite: () => void;
  onViewOnMap: () => void;
  isFavorite: boolean;
  isHighlighted: boolean; // Quand survolé depuis la carte
}
```

**Éléments nouveaux**:

1. **Carrousel de photos**
   ```typescript
   import { FlatList } from 'react-native';

   <FlatList
     data={property.images}
     horizontal
     pagingEnabled
     showsHorizontalScrollIndicator={false}
     renderItem={({ item }) => (
       <Image source={{ uri: item }} style={styles.image} />
     )}
   />
   ```

2. **Badge BakroScore**
   ```typescript
   const getScoreColor = (score: number): string => {
     if (score >= 80) return '#10B981'; // Vert
     if (score >= 60) return '#F59E0B'; // Orange
     return '#EF4444'; // Rouge
   };

   <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(score) }]}>
     <Text style={styles.scoreText}>⭐ {score}/100</Text>
   </View>
   ```

3. **Indicateurs de documents**
   ```typescript
   interface DocumentIndicator {
     type: DocumentType;
     label: string;
     icon: IconName;
   }

   const DOCUMENT_INDICATORS: DocumentIndicator[] = [
     { type: 'TITLE_DEED', label: 'Titre vérifié', icon: 'Shield' },
     { type: 'FULL_DOCS', label: 'Docs complets', icon: 'FileCheck' },
     { type: 'LEGAL_VERIFIED', label: 'Légal OK', icon: 'Scale' },
   ];
   ```

4. **Bouton "Voir sur carte"**
   ```typescript
   <TouchableOpacity
     style={styles.mapButton}
     onPress={() => {
       onViewOnMap();
       // Centrer la carte sur cette propriété
       router.push(`/(tabs)/map?propertyId=${property.id}`);
     }}
   >
     <MapPin size={16} color="#EA580C" />
     <Text style={styles.mapButtonText}>Voir sur carte</Text>
   </TouchableOpacity>
   ```

---

### 2. Mode d'affichage

#### Composant: `ViewModeToggle`

```typescript
<View style={styles.viewToggle}>
  <TouchableOpacity
    onPress={() => setViewMode('list')}
    style={[styles.toggleBtn, viewMode === 'list' && styles.active]}
  >
    <List size={20} color={viewMode === 'list' ? "#EA580C" : "#6B7280"} />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setViewMode('grid')}
    style={[styles.toggleBtn, viewMode === 'grid' && styles.active]}
  >
    <Grid3x3 size={20} color={viewMode === 'grid' ? "#EA580C" : "#6B7280"} />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setViewMode('map')}
    style={[styles.toggleBtn, viewMode === 'map' && styles.active]}
  >
    <MapIcon size={20} color={viewMode === 'map' ? "#EA580C" : "#6B7280"} />
  </TouchableOpacity>
</View>
```

**Modes**:
1. **Liste**: Cartes verticales avec toutes les infos
2. **Grille**: 2 colonnes, infos condensées
3. **Carte**: Vue carte plein écran avec liste flottante

---

### 3. Layout Split (Carte + Liste)

#### Composant: `SplitView`

**Desktop/Tablet**:
```
┌─────────────────────────────────────────────┐
│ [Recherche]        [Filtres]      [Vue]     │
├──────────────────┬──────────────────────────┤
│                  │                          │
│                  │  Liste des résultats     │
│                  │  ┌────────────────────┐  │
│     Carte        │  │ Propriété 1        │  │
│   Interactive    │  └────────────────────┘  │
│                  │  ┌────────────────────┐  │
│                  │  │ Propriété 2        │  │
│                  │  └────────────────────┘  │
│                  │  ...                     │
└──────────────────┴──────────────────────────┘
```

**Mobile**:
- Par défaut: Liste avec bouton FAB "Voir sur carte"
- Au tap: Carte plein écran avec liste flottante en bas

```typescript
const SplitView: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');

  if (Platform.OS === 'web' && windowWidth > 768) {
    return (
      <View style={styles.splitContainer}>
        <View style={styles.mapSection}>
          <EnhancedPropertyMap {...mapProps} />
        </View>
        <View style={styles.listSection}>
          <PropertyList {...listProps} />
        </View>
      </View>
    );
  }

  // Mobile
  return (
    <View style={styles.mobileContainer}>
      {activeView === 'list' ? (
        <>
          <PropertyList {...listProps} />
          <FAB
            icon={<MapIcon />}
            onPress={() => setActiveView('map')}
            label="Voir sur carte"
          />
        </>
      ) : (
        <>
          <EnhancedPropertyMap {...mapProps} />
          <BottomSheet>
            <PropertyList {...listProps} compact />
          </BottomSheet>
        </>
      )}
    </View>
  );
};
```

---

## Composants React Native requis

### Bibliothèques existantes

✅ **Déjà installées**:
- `react-native-maps` - Cartes interactives
- `react-native-maps-directions` - Calcul d'itinéraires
- `expo-location` - Géolocalisation
- `lucide-react-native` - Icônes
- `@react-native-community/slider` - Sliders pour filtres

### Nouvelles bibliothèques à ajouter

❌ **À installer**:

1. **react-native-gesture-handler** (déjà installé ✅)
   - Pour les gestures de dessin sur carte

2. **@gorhom/bottom-sheet**
   ```bash
   npm install @gorhom/bottom-sheet
   ```
   - Pour les bottom sheets sur mobile

3. **react-native-reanimated** (si pas déjà installé)
   ```bash
   npm install react-native-reanimated
   ```
   - Pour les animations fluides

4. **react-native-svg** (déjà installé ✅)
   - Pour les polygones de zone dessinée

### Nouveaux composants à créer

```
components/
├── search/
│   ├── PropertySearchBar.tsx           ✨ Nouveau
│   ├── TransactionTypeTabs.tsx         ✨ Nouveau
│   ├── MainFilters.tsx                 ✨ Nouveau
│   ├── AdvancedFilters.tsx             ✨ Nouveau
│   ├── ActiveFiltersBar.tsx            ✨ Nouveau
│   └── SavedSearches.tsx               ✨ Nouveau
│
├── maps/ (améliorations)
│   ├── EnhancedPropertyMap.tsx         ✨ Nouveau
│   ├── MapDrawingTool.tsx              ✨ Nouveau
│   ├── TravelTimeFilter.tsx            ✨ Nouveau
│   ├── PointOfInterestLayer.tsx        ✨ Nouveau
│   ├── EnhancedPropertyMarker.tsx      ⚡ Amélioration
│   ├── PropertyPreviewCard.tsx         ⚡ Amélioration
│   └── MapControls.tsx                 ✨ Nouveau
│
├── properties/
│   ├── PropertyCard.tsx                ⚡ Amélioration
│   ├── PropertyList.tsx                ⚡ Amélioration
│   ├── PropertyGrid.tsx                ✨ Nouveau
│   ├── ViewModeToggle.tsx              ✨ Nouveau
│   └── SplitView.tsx                   ✨ Nouveau
│
└── ui/
    ├── RangeSlider.tsx                 ✨ Nouveau
    ├── MultiSelect.tsx                 ✨ Nouveau
    ├── FAB.tsx                         ✨ Nouveau
    └── BottomSheet.tsx                 ✨ Nouveau (wrapper)
```

---

## Guide d'implémentation

### Phase 1: Fondations (Semaine 1)

**Jour 1-2: Composants de base UI**
- [ ] `RangeSlider.tsx` - Slider double pour prix et surface
- [ ] `MultiSelect.tsx` - Sélection multiple pour filtres
- [ ] `FAB.tsx` - Floating Action Button
- [ ] `BottomSheet.tsx` - Wrapper pour @gorhom/bottom-sheet

**Jour 3-4: Composants de recherche**
- [ ] `PropertySearchBar.tsx` - Barre de recherche avec suggestions
- [ ] `TransactionTypeTabs.tsx` - Onglets Acheter/Louer/Neuf/Terrain
- [ ] `MainFilters.tsx` - Filtres principaux (prix, type, pièces, surface)
- [ ] `ActiveFiltersBar.tsx` - Résumé des filtres actifs

**Jour 5-7: Tests et ajustements**
- [ ] Tests d'intégration
- [ ] Responsive design mobile/tablet
- [ ] Optimisation des performances

---

### Phase 2: Carte interactive (Semaine 2)

**Jour 1-2: Amélioration des marqueurs**
- [ ] `EnhancedPropertyMarker.tsx` - Marqueur avec BakroScore
- [ ] Amélioration du clustering
- [ ] Tests de performance avec 1000+ propriétés

**Jour 3-4: Outils de carte avancés**
- [ ] `MapDrawingTool.tsx` - Dessin de zone sur carte
- [ ] `TravelTimeFilter.tsx` - Recherche par temps de trajet
- [ ] `PointOfInterestLayer.tsx` - Couche POI (écoles, transports, etc.)

**Jour 5-7: Intégration et tests**
- [ ] `EnhancedPropertyMap.tsx` - Carte principale avec tous les outils
- [ ] `MapControls.tsx` - Contrôles de carte
- [ ] Tests d'intégration
- [ ] Optimisation mémoire

---

### Phase 3: Affichage des résultats (Semaine 3)

**Jour 1-3: Fiches de propriétés**
- [ ] Amélioration de `PropertyCard.tsx`
- [ ] `PropertyGrid.tsx` - Affichage en grille
- [ ] Amélioration de `PropertyList.tsx`
- [ ] `PropertyPreviewCard.tsx` - Carte de prévisualisation

**Jour 4-5: Vue Split et modes d'affichage**
- [ ] `SplitView.tsx` - Vue carte + liste
- [ ] `ViewModeToggle.tsx` - Bascule entre modes
- [ ] Responsive design

**Jour 6-7: Filtres avancés et finalisation**
- [ ] `AdvancedFilters.tsx` - Modal de filtres avancés
- [ ] `SavedSearches.tsx` - Recherches sauvegardées
- [ ] Tests finaux
- [ ] Documentation

---

## Design System

### Couleurs

```typescript
const COLORS = {
  primary: {
    DEFAULT: '#EA580C', // Orange principal
    light: '#FED7AA',
    dark: '#C2410C',
  },
  success: {
    DEFAULT: '#10B981', // Vert (BakroScore élevé, vérifié)
    light: '#D1FAE5',
    dark: '#059669',
  },
  warning: {
    DEFAULT: '#F59E0B', // Orange (BakroScore moyen)
    light: '#FEF3C7',
    dark: '#D97706',
  },
  danger: {
    DEFAULT: '#EF4444', // Rouge (BakroScore bas)
    light: '#FEE2E2',
    dark: '#DC2626',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};
```

### Typographie

```typescript
const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyBold: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  smallBold: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  tiny: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};
```

### Espacements

```typescript
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
```

### Bordures

```typescript
const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
```

### Ombres

```typescript
const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
```

---

## Checklist de validation

### Recherche
- [ ] La barre de recherche affiche des suggestions dès 2 caractères
- [ ] Les onglets de transaction ajustent les filtres disponibles
- [ ] Les filtres mettent à jour le nombre de résultats en temps réel
- [ ] Le résumé des filtres actifs est clair et en langage naturel
- [ ] Les filtres avancés sont accessibles via un bouton dédié
- [ ] L'historique de recherche est sauvegardé

### Carte
- [ ] La carte charge les propriétés dans la zone visible
- [ ] Le clustering fonctionne correctement
- [ ] Les marqueurs affichent le prix et le BakroScore
- [ ] Le badge de vérification est visible sur les biens vérifiés
- [ ] L'outil de dessin de zone fonctionne
- [ ] La recherche par temps de trajet calcule correctement les zones
- [ ] La géolocalisation "Autour de moi" fonctionne
- [ ] Les points d'intérêt sont affichés au bon niveau de zoom
- [ ] L'auto-refresh fonctionne quand activé
- [ ] La carte de prévisualisation s'affiche au clic sur un marqueur

### Résultats
- [ ] Les fiches de propriétés affichent toutes les infos clés
- [ ] Le carrousel de photos fonctionne
- [ ] Le BakroScore est visible et coloré correctement
- [ ] Les badges de documents sont affichés
- [ ] Le bouton "Voir sur carte" fonctionne
- [ ] Le mode liste est lisible
- [ ] Le mode grille est compact et efficace
- [ ] Le mode split (carte + liste) fonctionne sur desktop
- [ ] Sur mobile, le basculement liste/carte est fluide
- [ ] La synchronisation carte-liste fonctionne (highlight)

### Performance
- [ ] La recherche répond en < 500ms
- [ ] La carte charge les marqueurs en < 1s
- [ ] Le scroll de la liste est fluide (60 fps)
- [ ] Les images sont optimisées et chargent rapidement
- [ ] Le clustering n'impacte pas les performances avec 1000+ propriétés

### Accessibilité
- [ ] Tous les boutons ont un label accessible
- [ ] Le contraste des textes est suffisant
- [ ] La taille des zones de tap est >= 44px
- [ ] Le clavier est géré correctement
- [ ] Les erreurs sont communiquées clairement

---

**Fin du document**

Cette spécification servira de guide pour l'implémentation des fonctionnalités inspirées de Bien'ici dans le projet BakroSur.
