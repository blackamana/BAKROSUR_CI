# Guide de configuration de la base de données Supabase

> **Important**: Claude Code s'exécute dans un environnement sandbox et n'a pas d'accès direct à Internet.
> Ce guide vous montre comment accéder et configurer votre base de données Supabase manuellement.

## ✅ Statut de votre configuration

- ✅ **URL Supabase configurée** : `https://ogczokdoufahfrhvkyig.supabase.co`
- ✅ **Clé API configurée** : Dans `.env`
- ✅ **Client Supabase** : `lib/supabase.ts` prêt
- ✅ **Services** : `property-search.service.ts`, `search-suggestions.service.ts`
- ✅ **Hooks** : `usePropertySearch`, `useSearchSuggestions`

---

## 🌐 Accès à votre tableau de bord Supabase

### Option 1 : URL directe

Ouvrez cette URL dans votre navigateur :
```
https://supabase.com/dashboard/project/ogczokdoufahfrhvkyig
```

### Option 2 : Via le site Supabase

1. Allez sur https://supabase.com
2. Cliquez sur "Sign In"
3. Connectez-vous avec votre compte
4. Sélectionnez votre projet : **ogczokdoufahfrhvkyig**

---

## 📊 Création du schéma de base de données

### Étape 1 : Accéder au SQL Editor

1. Dans votre tableau de bord Supabase
2. Cliquez sur **"SQL Editor"** dans le menu de gauche
3. Cliquez sur **"New query"**

### Étape 2 : Créer les tables

Copiez et exécutez ce SQL (Ctrl+Entrée pour exécuter) :

```sql
-- ============================================
-- BAKROSUR - Schéma de base de données
-- ============================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: cities (Villes)
-- ============================================
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  country TEXT DEFAULT 'Côte d''Ivoire',
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: neighborhoods (Quartiers)
-- ============================================
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT,
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, city_id)
);

-- ============================================
-- Table: properties (Propriétés)
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Informations de base
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('APPARTEMENT', 'MAISON', 'TERRAIN', 'COMMERCE', 'BUREAU')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'RENT', 'NEW', 'LAND')),

  -- Prix et dimensions
  price BIGINT NOT NULL,
  surface NUMERIC(10,2),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  floor_number INTEGER,
  total_floors INTEGER,

  -- Localisation
  city_id UUID REFERENCES cities(id),
  city_name TEXT,
  neighborhood_id UUID REFERENCES neighborhoods(id),
  neighborhood_name TEXT,
  address TEXT,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),

  -- Médias
  images TEXT[],
  videos TEXT[],
  virtual_tour_url TEXT,

  -- Spécifique BakroSur
  title_verified BOOLEAN DEFAULT FALSE,
  bakro_score INTEGER CHECK (bakro_score >= 0 AND bakro_score <= 100),
  available_documents TEXT[],
  legal_status TEXT,
  verification_date TIMESTAMPTZ,

  -- Équipements
  has_parking BOOLEAN DEFAULT FALSE,
  has_garden BOOLEAN DEFAULT FALSE,
  has_pool BOOLEAN DEFAULT FALSE,
  has_elevator BOOLEAN DEFAULT FALSE,
  has_balcony BOOLEAN DEFAULT FALSE,
  has_terrace BOOLEAN DEFAULT FALSE,
  has_basement BOOLEAN DEFAULT FALSE,
  has_security BOOLEAN DEFAULT FALSE,
  has_air_conditioning BOOLEAN DEFAULT FALSE,
  has_heating BOOLEAN DEFAULT FALSE,
  has_furnished BOOLEAN DEFAULT FALSE,

  -- Métadonnées
  owner_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SOLD', 'RENTED', 'INACTIVE')),
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Contraintes
  CHECK (price > 0),
  CHECK (surface IS NULL OR surface > 0)
);

-- ============================================
-- Table: search_history (Historique de recherche)
-- ============================================
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB,
  results_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Index pour les performances
-- ============================================

-- Properties
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_city_id ON properties(city_id);
CREATE INDEX IF NOT EXISTS idx_properties_neighborhood_id ON properties(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_surface ON properties(surface);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_title_verified ON properties(title_verified);
CREATE INDEX IF NOT EXISTS idx_properties_bakro_score ON properties(bakro_score);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Index spatial pour les recherches géographiques
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(latitude, longitude);

-- Neighborhoods
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_id ON neighborhoods(city_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_name ON neighborhoods(name);

-- Search history
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);

-- ============================================
-- Fonction pour mettre à jour updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cities_updated_at ON cities;
CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_neighborhoods_updated_at ON neighborhoods;
CREATE TRIGGER update_neighborhoods_updated_at
  BEFORE UPDATE ON neighborhoods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Activer RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Policies pour properties (lecture publique, écriture propriétaire)
CREATE POLICY "Properties are viewable by everyone"
  ON properties FOR SELECT
  USING (status = 'ACTIVE' OR auth.uid() = owner_id);

CREATE POLICY "Users can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = owner_id);

-- Policies pour cities et neighborhoods (lecture publique)
CREATE POLICY "Cities are viewable by everyone"
  ON cities FOR SELECT
  USING (true);

CREATE POLICY "Neighborhoods are viewable by everyone"
  ON neighborhoods FOR SELECT
  USING (true);

-- Policies pour search_history (privé)
CREATE POLICY "Users can view their own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history"
  ON search_history FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Message de confirmation
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Schéma de base de données BakroSur créé avec succès !';
  RAISE NOTICE '📊 Tables créées: cities, neighborhoods, properties, search_history';
  RAISE NOTICE '🔒 Row Level Security activé';
  RAISE NOTICE '⚡ Index optimisés créés';
END $$;
```

### Étape 3 : Insérer des données de test

```sql
-- ============================================
-- Données de test pour BakroSur
-- ============================================

-- Villes
INSERT INTO cities (name, slug, latitude, longitude) VALUES
  ('Abidjan', 'abidjan', 5.3599517, -4.0082563),
  ('Yamoussoukro', 'yamoussoukro', 6.8276228, -5.2893433),
  ('Bouaké', 'bouake', 7.6938355, -5.0303821),
  ('Daloa', 'daloa', 6.8770358, -6.4502044)
ON CONFLICT (name) DO NOTHING;

-- Quartiers d'Abidjan
INSERT INTO neighborhoods (name, slug, city_id)
SELECT
  name,
  lower(regexp_replace(name, '[^a-zA-Z0-9]', '-', 'g')),
  (SELECT id FROM cities WHERE name = 'Abidjan')
FROM (VALUES
  ('Cocody'),
  ('Plateau'),
  ('Marcory'),
  ('Yopougon'),
  ('Treichville'),
  ('Koumassi'),
  ('Adjamé'),
  ('Abobo'),
  ('Riviera'),
  ('Deux-Plateaux')
) AS t(name)
ON CONFLICT (name, city_id) DO NOTHING;

-- Propriétés de test
INSERT INTO properties (
  title,
  description,
  type,
  transaction_type,
  price,
  surface,
  bedrooms,
  bathrooms,
  city_id,
  city_name,
  neighborhood_id,
  neighborhood_name,
  latitude,
  longitude,
  images,
  title_verified,
  bakro_score,
  has_parking,
  has_security,
  status
)
SELECT
  'Villa moderne ' || n.name,
  'Magnifique villa avec vue dégagée dans le quartier de ' || n.name,
  'MAISON',
  'BUY',
  FLOOR(RANDOM() * 100000000 + 50000000)::BIGINT,
  FLOOR(RANDOM() * 200 + 100)::NUMERIC,
  FLOOR(RANDOM() * 4 + 2)::INTEGER,
  FLOOR(RANDOM() * 3 + 1)::INTEGER,
  c.id,
  c.name,
  n.id,
  n.name,
  5.3599517 + (RANDOM() - 0.5) * 0.1,
  -4.0082563 + (RANDOM() - 0.5) * 0.1,
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
  RANDOM() > 0.5,
  FLOOR(RANDOM() * 40 + 60)::INTEGER,
  true,
  true,
  'ACTIVE'
FROM
  neighborhoods n
  CROSS JOIN cities c
WHERE
  c.name = 'Abidjan'
  AND n.city_id = c.id
LIMIT 5;

-- Appartements
INSERT INTO properties (
  title,
  description,
  type,
  transaction_type,
  price,
  surface,
  bedrooms,
  bathrooms,
  city_id,
  city_name,
  neighborhood_id,
  neighborhood_name,
  latitude,
  longitude,
  images,
  title_verified,
  bakro_score,
  has_elevator,
  has_parking,
  status
)
SELECT
  'Appartement ' || (RANDOM() * 3 + 2)::INTEGER || ' pièces ' || n.name,
  'Bel appartement dans résidence sécurisée',
  'APPARTEMENT',
  'RENT',
  FLOOR(RANDOM() * 500000 + 100000)::BIGINT,
  FLOOR(RANDOM() * 100 + 50)::NUMERIC,
  FLOOR(RANDOM() * 3 + 1)::INTEGER,
  FLOOR(RANDOM() * 2 + 1)::INTEGER,
  c.id,
  c.name,
  n.id,
  n.name,
  5.3599517 + (RANDOM() - 0.5) * 0.1,
  -4.0082563 + (RANDOM() - 0.5) * 0.1,
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
  RANDOM() > 0.3,
  FLOOR(RANDOM() * 50 + 50)::INTEGER,
  true,
  true,
  'ACTIVE'
FROM
  neighborhoods n
  CROSS JOIN cities c
WHERE
  c.name = 'Abidjan'
  AND n.city_id = c.id
LIMIT 10;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Données de test insérées avec succès !';
  RAISE NOTICE '📊 Villes: 4, Quartiers: 10, Propriétés: 15';
END $$;
```

---

## 🔍 Vérification de votre base de données

### Via Table Editor

1. Dans Supabase, cliquez sur **"Table Editor"**
2. Vérifiez les tables :
   - ✅ `cities` (4 villes)
   - ✅ `neighborhoods` (10 quartiers)
   - ✅ `properties` (15 propriétés)
   - ✅ `search_history` (vide pour le moment)

### Via SQL

```sql
-- Compter les entrées
SELECT
  'cities' as table_name,
  COUNT(*) as count
FROM cities
UNION ALL
SELECT
  'neighborhoods' as table_name,
  COUNT(*) as count
FROM neighborhoods
UNION ALL
SELECT
  'properties' as table_name,
  COUNT(*) as count
FROM properties;
```

---

## 🧪 Tester depuis votre application

### 1. Lancer votre application

```bash
# Dans le terminal de votre projet
npm run start
# ou
bun run start
```

### 2. Utiliser les hooks dans un composant de test

Créez un fichier `app/test-supabase.tsx` :

```typescript
import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { usePropertySearch } from '@/lib/hooks/usePropertySearch';
import { DEFAULT_FILTERS } from '@/lib/types/search.types';

export default function TestSupabase() {
  const { properties, isLoading, error, resultCount, search } = usePropertySearch();

  useEffect(() => {
    // Test de recherche au chargement
    search({
      ...DEFAULT_FILTERS,
      transactionType: 'BUY',
    });
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Test Supabase
      </Text>

      {isLoading && <ActivityIndicator />}

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      {!isLoading && !error && (
        <View>
          <Text>✅ Connexion réussie !</Text>
          <Text>📊 {resultCount} propriétés trouvées</Text>

          {properties.slice(0, 3).map((prop) => (
            <View key={prop.id} style={{ marginTop: 10, padding: 10, backgroundColor: '#f0f0f0' }}>
              <Text style={{ fontWeight: 'bold' }}>{prop.title}</Text>
              <Text>{prop.price.toLocaleString()} FCFA</Text>
              <Text>{prop.city_name} - {prop.neighborhood_name}</Text>
              <Text>Score: {prop.bakro_score}/100</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
```

### 3. Naviguer vers la page de test

```
http://localhost:8081/test-supabase
```

---

## 📱 Utilisation dans vos écrans existants

Maintenant que la base de données est configurée, vous pouvez utiliser les hooks dans vos écrans :

```typescript
// Dans app/(tabs)/search.tsx
import { usePropertySearch } from '@/lib/hooks/usePropertySearch';
import { useSearchSuggestions } from '@/lib/hooks/useSearchSuggestions';

export default function SearchScreen() {
  const { search, properties, resultCount, isLoading } = usePropertySearch();
  const { fetchSuggestions } = useSearchSuggestions();

  // ... votre code
}
```

---

## ✅ Checklist finale

- [ ] Accéder au tableau de bord Supabase
- [ ] Créer le schéma (SQL Editor)
- [ ] Insérer les données de test
- [ ] Vérifier les tables (Table Editor)
- [ ] Lancer l'application (`npm run start`)
- [ ] Tester la connexion (page test-supabase)
- [ ] Utiliser les hooks dans vos écrans

---

## 🆘 Besoin d'aide ?

- 📖 **Documentation Supabase** : https://supabase.com/docs
- 📝 **Guide d'intégration** : `SUPABASE-INTEGRATION-GUIDE.md`
- 🔧 **Services** : `lib/services/property-search.service.ts`
- 🎣 **Hooks** : `lib/hooks/usePropertySearch.ts`

---

**Dernière mise à jour** : 2025-11-08
