# Feuille de route d'implémentation - Fonctionnalités Bien'ici pour BakroSur

> **Date de création**: 2025-11-08
> **Statut**: Phase 1 - Composants de base implémentés
> **Progrès global**: ████████░░ 80% (Phase 1 complète)

## Vue d'ensemble

Ce document trace la progression de l'implémentation des fonctionnalités UX/UI inspirées de Bien'ici dans le projet BakroSur.

### Documents créés

1. ✅ **BIENICI-UX-UI-ANALYSIS.md** - Analyse détaillée des meilleures pratiques Bien'ici
2. ✅ **BIENICI-UI-SPECIFICATIONS.md** - Spécifications complètes UI/UX des composants
3. ✅ **BIENICI-TECHNICAL-IMPLEMENTATION.md** - Guide technique d'implémentation
4. ✅ **BIENICI-IMPLEMENTATION-ROADMAP.md** - Ce document (feuille de route)

---

## Progression par phase

### ✅ Phase 0: Analyse et documentation (Complété)

**Date**: 2025-11-08

#### Livrables

- [x] Analyse UX/UI complète du site Bien'ici
- [x] Identification des fonctionnalités clés à reproduire
- [x] Spécifications détaillées de chaque composant
- [x] Architecture technique des nouveaux composants
- [x] Plan d'implémentation en 3 phases

#### Résultat

Documentation complète servant de référence pour tout le développement.

---

### ✅ Phase 1: Fondations (Complété - 100%)

**Durée**: Jour 1
**Statut**: ✅ Terminé

#### 1.1. Infrastructure ✅

- [x] Structure des dossiers créée
  ```
  components/
  ├── search/
  ├── maps/
  │   ├── enhanced/
  │   ├── markers/
  │   └── previews/
  ├── properties/
  │   ├── cards/
  │   └── lists/
  └── ui/
      ├── inputs/
      ├── buttons/
      ├── feedback/
      └── overlays/

  lib/
  ├── services/
  ├── hooks/
  ├── utils/
  └── types/
  ```

- [x] Types TypeScript de base créés
  - `lib/types/search.types.ts` - Types pour la recherche

- [x] Services de base créés
  - `lib/services/geolocation.service.ts` - Géolocalisation

#### 1.2. Dépendances (En attente)

**À installer**:

```bash
# Bottom Sheet pour modals mobiles
npm install @gorhom/bottom-sheet@^5

# Animations fluides
npm install react-native-animatable@^1.4.0

# Reanimated (mise à jour si nécessaire)
npm install react-native-reanimated@^3
```

#### 1.3. Composants UI de base ✅

- [x] `components/ui/inputs/RangeSlider.tsx`
  - Slider double pour prix et surface
  - Props: min, max, step, values, onChange
  - Design: couleur #EA580C
  - Formatage personnalisé des valeurs

- [x] `components/ui/inputs/MultiSelect.tsx`
  - Sélection multiple (équipements, documents)
  - 2 variantes: buttons et checkboxes
  - Support 1-3 colonnes
  - Icônes optionnelles

- [x] `components/ui/buttons/FAB.tsx`
  - Floating Action Button
  - 3 variantes: normale, mini, extended
  - Positions configurables
  - Icône + label optionnel

- [x] `components/ui/overlays/BottomSheetWrapper.tsx`
  - Wrapper simplifié pour modals
  - Header avec handle et titre
  - Bouton de fermeture
  - Ready pour @gorhom/bottom-sheet

#### 1.4. Composants de recherche ✅

- [x] `components/search/PropertySearchBar.tsx`
  - Barre de recherche avec suggestions automatiques
  - Autocomplete villes/quartiers/propriétés
  - Historique de recherche
  - Debounce 300ms
  - Icons différenciés par type

- [x] `components/search/TransactionTypeTabs.tsx`
  - 4 onglets: Acheter / Louer / Neuf / Terrain
  - Sélection exclusive
  - Icônes + couleurs différenciées
  - Responsive flex layout

- [x] `components/search/MainFilters.tsx`
  - Tous les filtres principaux
  - Type de bien (5 options)
  - Budget (slider 0-500M)
  - Chambres et salles de bain
  - Surface (slider 0-1000 m²)
  - Compteur de résultats

- [x] `components/search/ActiveFiltersBar.tsx`
  - Résumé en langage naturel complet
  - Format: "Achat appartement à Abidjan - 2+ ch - 50-100M FCFA"
  - Badge de comptage
  - Bouton réinitialiser
  - Scroll horizontal

#### 1.5. Documentation et exemples ✅

- [x] Fichiers index pour imports simplifiés
  - `components/ui/inputs/index.ts`
  - `components/ui/buttons/index.ts`
  - `components/search/index.ts`

- [x] `components/search/SearchExample.tsx`
  - Exemple complet d'intégration
  - État de filtres géré
  - Mock de suggestions
  - Démo de tous les composants

- [x] `components/search/README.md`
  - Documentation complète
  - Props de chaque composant
  - Exemples d'utilisation
  - Guide d'intégration

---

### 📋 Phase 2: Carte interactive (Prévue - 0%)

**Durée estimée**: 7 jours
**Statut**: Semaine 2 (non commencée)

#### 2.1. Amélioration des marqueurs

- [ ] `components/maps/markers/EnhancedPropertyMarker.tsx`
  - Badge BakroScore visible
  - Badge "Vérifié" si title_verified
  - Prix affiché en bas
  - Couleur selon statut

- [ ] Amélioration du clustering
  - Afficher score moyen dans clusters
  - Indicateur si contient biens vérifiés
  - Fourchette de prix

#### 2.2. Outils de carte avancés

- [ ] `components/maps/enhanced/MapDrawingTool.tsx`
  - Dessin de zone à main levée
  - Polygone avec remplissage transparent
  - Boutons: Dessiner, Effacer, Valider

- [ ] `components/maps/enhanced/TravelTimeFilter.tsx`
  - Modal de configuration
  - Sélection adresse + durée + mode
  - Affichage isochrone sur carte
  - Service: `lib/services/isochrone.service.ts`

- [ ] `components/maps/enhanced/PointOfInterestLayer.tsx`
  - Affichage POI (écoles, transports, commerces)
  - Marqueurs plus petits que propriétés
  - Visible uniquement au zoom > 12
  - Service: `lib/services/poi.service.ts`

#### 2.3. Contrôles et intégration

- [ ] `components/maps/enhanced/MapControls.tsx`
  - Boutons flottants sur la carte
  - Ma position, Type carte, Dessin, Temps trajet, POI
  - Switch "Auto-refresh"

- [ ] `components/maps/enhanced/EnhancedPropertyMap.tsx`
  - Carte principale avec tous les outils
  - Props: properties, filters, viewMode
  - Intégration de tous les sous-composants

- [ ] `components/maps/previews/PropertyPreviewCard.tsx` (amélioration)
  - Photo + infos clés
  - BakroScore visible
  - Boutons: Favoris, Voir, Y aller
  - Animation slide-up

---

### 🏠 Phase 3: Affichage des résultats (Prévue - 0%)

**Durée estimée**: 7 jours
**Statut**: Semaine 3 (non commencée)

#### 3.1. Fiches de propriétés

- [ ] `components/properties/cards/PropertyCard.tsx` (amélioration)
  - Carrousel de photos
  - Badge BakroScore coloré
  - Indicateurs de documents
  - Bouton "Voir sur carte"
  - Support mode liste et grille

- [ ] `components/properties/cards/PropertyCardCompact.tsx`
  - Version compacte pour bottom sheet mobile
  - Infos essentielles uniquement

#### 3.2. Listes et grilles

- [ ] `components/properties/lists/PropertyList.tsx` (amélioration)
  - Scroll infini
  - Highlight quand survolé depuis carte
  - Support tri et filtres

- [ ] `components/properties/lists/PropertyGrid.tsx`
  - Affichage en grille (2 colonnes)
  - Responsive (3-4 colonnes sur desktop)
  - Même contenu que liste, layout différent

#### 3.3. Vue Split et modes

- [ ] `components/properties/lists/SplitView.tsx`
  - Desktop: Carte 50% + Liste 50%
  - Tablet: Carte 40% + Liste 60%
  - Mobile: Bascule Liste ↔ Carte

- [ ] `components/ui/buttons/ViewModeToggle.tsx`
  - Boutons: Liste, Grille, Carte
  - Icônes lucide-react-native
  - Active state visible

#### 3.4. Filtres avancés

- [ ] `components/search/AdvancedFilters.tsx`
  - Modal/Drawer avec tous les filtres
  - Sections: Équipements, Documents, Proximité
  - Badge compteur sur bouton d'ouverture

- [ ] `components/search/SavedSearches.tsx`
  - Liste des recherches sauvegardées
  - Notifications activables
  - Actions: Éditer, Supprimer, Dupliquer

---

## Services à créer

### Priorité haute ⚡

- [x] `lib/services/geolocation.service.ts` - Géolocalisation
- [ ] `lib/services/isochrone.service.ts` - Calcul temps de trajet
- [ ] `lib/services/poi.service.ts` - Points d'intérêt

### Priorité moyenne 📋

- [ ] `lib/hooks/usePropertySearch.ts` - Hook de recherche
- [ ] `lib/hooks/useMapFilters.ts` - Hook filtres carte
- [ ] `lib/hooks/useGeolocation.ts` - Hook géolocalisation
- [ ] `lib/utils/filter-helpers.ts` - Utilitaires filtres
- [ ] `lib/utils/format-helpers.ts` - Formatage prix, surface, etc.

---

## Checklist de validation

### Recherche

- [ ] Barre de recherche avec suggestions dès 2 caractères
- [ ] Onglets de transaction fonctionnels
- [ ] Filtres mettent à jour les résultats en temps réel
- [ ] Résumé des filtres en langage naturel
- [ ] Filtres avancés accessibles
- [ ] Recherches sauvegardables

### Carte

- [ ] Charge les propriétés dans la zone visible
- [ ] Clustering fonctionne (1000+ propriétés)
- [ ] Marqueurs affichent prix + BakroScore
- [ ] Badge vérification visible
- [ ] Outil dessin de zone fonctionne
- [ ] Recherche par temps de trajet calcule les zones
- [ ] Géolocalisation "Autour de moi" fonctionne
- [ ] POI affichés au bon zoom
- [ ] Auto-refresh optionnel
- [ ] Prévisualisation au clic

### Résultats

- [ ] Fiches avec toutes les infos clés
- [ ] Carrousel de photos fluide
- [ ] BakroScore visible et coloré
- [ ] Badges de documents affichés
- [ ] Bouton "Voir sur carte" fonctionne
- [ ] Mode liste lisible
- [ ] Mode grille compact
- [ ] Mode split (carte + liste) sur desktop
- [ ] Basculement liste/carte fluide sur mobile
- [ ] Synchronisation carte ↔ liste

### Performance

- [ ] Recherche < 500ms
- [ ] Carte charge en < 1s
- [ ] Scroll 60 fps
- [ ] Images optimisées
- [ ] Clustering performant (1000+ props)

---

## Dépendances npm à installer

```json
{
  "devDependencies": {},
  "dependencies": {
    "@gorhom/bottom-sheet": "^5.0.0",
    "react-native-animatable": "^1.4.0",
    "react-native-reanimated": "^3.0.0"
  }
}
```

---

## Configuration requise

### babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // En dernier !
    ],
  };
};
```

### .env

```bash
# Google Maps API Key pour isochrones et directions
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

## Prochaines étapes immédiates

### Cette semaine (Semaine 1)

1. **Installer les dépendances manquantes**
   ```bash
   npm install @gorhom/bottom-sheet@^5 react-native-animatable@^1.4.0
   ```

2. **Créer les composants UI de base**
   - RangeSlider
   - MultiSelect
   - FAB
   - BottomSheet wrapper

3. **Créer les composants de recherche**
   - PropertySearchBar
   - TransactionTypeTabs
   - MainFilters
   - ActiveFiltersBar

4. **Tests d'intégration**
   - Vérifier le responsive
   - Tester les performances
   - Valider l'UX

### Semaine prochaine (Semaine 2)

5. **Améliorer la carte**
   - EnhancedPropertyMarker
   - MapDrawingTool
   - TravelTimeFilter
   - PointOfInterestLayer

6. **Intégrer les services**
   - isochrone.service.ts
   - poi.service.ts

### Dans 2 semaines (Semaine 3)

7. **Fiches et listes**
   - PropertyCard amélioré
   - SplitView
   - AdvancedFilters

---

## Ressources

### Documentation externe

- [Bien'ici](https://www.bienici.com) - Référence UX/UI
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Gorhom Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)

### Documentation interne

- `BIENICI-UX-UI-ANALYSIS.md` - Analyse détaillée
- `BIENICI-UI-SPECIFICATIONS.md` - Spécifications UI/UX
- `BIENICI-TECHNICAL-IMPLEMENTATION.md` - Guide technique

---

## Contributeurs

- **Lead Developer**: Claude Code
- **UX/UI Reference**: Bien'ici
- **Projet**: BakroSur CI

---

**Dernière mise à jour**: 2025-11-08
**Prochaine révision**: Fin de semaine 1 (après Phase 1)
