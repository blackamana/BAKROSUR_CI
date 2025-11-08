# 🚀 BAKRÔSUR PHASE 1 - DÉMARRAGE RAPIDE

## ⏱️ Installation en 15 minutes

### 1. Base de données (5 min)

```bash
# 1. Ouvrir Supabase Dashboard
https://supabase.com/dashboard

# 2. SQL Editor → New Query

# 3. Copier-coller le contenu de: database/phase1-schema.sql

# 4. Run ▶️

✅ Tables créées !
```

### 2. Fichiers (3 min)

```bash
# Copier dans votre projet Bakrosur:

cp services/*.ts /votre-projet/bakrosur/services/
cp components/*.tsx /votre-projet/bakrosur/components/
```

### 3. Configuration (2 min)

```bash
# Copier .env.example vers .env
cp .env.example .env

# Éditer .env et remplir:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Laisser vide pour dev:
SIGFU_API_KEY=
```

### 4. Test (5 min)

```typescript
// Dans votre code
import BakroScoreService from './services/bakro-score.service';
import SIGFUService from './services/sigfu.service';

// Tester la vérification SIGFU
const verif = await SIGFUService.verifyTitreFoncier(
  'property-id',
  'TF-12345',
  'TF'
);
console.log('✅ SIGFU:', verif.sigfu_status);

// Tester le calcul de score
const score = await BakroScoreService.calculateScore('property-id');
console.log('✅ Score:', score);
```

---

## 📱 Affichage UI (immédiat)

### Badge sur la liste

```tsx
import { BakroScoreBadge } from './components/BakroScoreBadge';

<BakroScoreBadge 
  score={75} 
  level="BON" 
  size="small" 
/>
```

### Détail du score

```tsx
import { BakroScoreDetail } from './components/BakroScoreDetail';

<BakroScoreDetail propertyId={property.id} />
```

---

## 🎯 3 Actions Principales

### 1. Vérifier un titre

```typescript
await SIGFUService.verifyTitreFoncier(propertyId, 'TF-12345', 'TF');
// → Score recalculé automatiquement
```

### 2. Calculer un score

```typescript
await BakroScoreService.calculateScore(propertyId);
// → Résultat: 0-100 + niveau de confiance
```

### 3. Trouver un notaire

```typescript
const notaires = await NotaireService.searchNotaires({
  city_id: 'abidjan',
  specialite: 'Immobilier',
  min_note: 4.0
});
```

---

## ✅ Checklist Post-Installation

- [ ] SQL exécuté sans erreur
- [ ] Services copiés et importables
- [ ] Composants affichés correctement
- [ ] Vérification SIGFU fonctionne (simulation)
- [ ] Score calculé sur une propriété test
- [ ] Badge visible sur PropertyCard
- [ ] Détail du score accessible

---

## 📞 Besoin d'aide ?

**Lire d'abord** : `README.md` (documentation complète)

**Problème courant** : 
- Score ne calcule pas → Vérifier que la fonction SQL est créée
- Badge ne s'affiche pas → `npm install expo-linear-gradient`
- SIGFU erreur → Normal en dev (simulation activée)

---

## 🎉 C'est parti !

Vous avez maintenant :
- ✅ Vérification des titres fonciers
- ✅ Score de confiance sur chaque bien
- ✅ Annuaire de notaires

**Prochaine étape** : Contacter le MCLU pour l'API SIGFU réelle

🏠 Bakrosur est maintenant plus sûr ! 🔒
