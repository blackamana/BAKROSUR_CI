-- ================================================
-- BAKRÔSUR - Extensions spécifiques
-- À exécuter APRÈS supabase-schema.sql
-- ================================================

-- ================================================
-- 1. AJOUTS À LA TABLE PROPERTIES
-- ================================================

-- Champs spécifiques BakroSur
ALTER TABLE properties ADD COLUMN IF NOT EXISTS bakro_score INTEGER CHECK (bakro_score >= 0 AND bakro_score <= 100);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_verification_date TIMESTAMPTZ;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sigfu_verification_id VARCHAR(255);

-- Note: Les images sont gérées dans la table property_images (relation séparée)

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_properties_bakro_score ON properties(bakro_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_properties_title_verified ON properties(title_verified);
CREATE INDEX IF NOT EXISTS idx_properties_sigfu ON properties(sigfu_verification_id);

-- ================================================
-- 2. TABLE BAKRO_SCORE_HISTORY
-- Historique des scores pour tracking et audit
-- ================================================

CREATE TABLE IF NOT EXISTS bakro_score_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),

  -- Facteurs de calcul
  factors JSONB, -- Ex: {"title_verified": 30, "documents_complete": 20, "owner_kyc": 25, "location_verified": 15, "photos_quality": 10}

  -- Méta
  calculated_by VARCHAR(50), -- 'SYSTEM', 'MANUAL', 'SIGFU_UPDATE'
  calculation_method VARCHAR(100), -- Version de l'algorithme utilisé
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX idx_bakro_score_history_property ON bakro_score_history(property_id);
CREATE INDEX idx_bakro_score_history_date ON bakro_score_history(calculated_at DESC);

-- ================================================
-- 3. TABLE TITLE_VERIFICATIONS
-- Vérifications de titres via l'API SIGFU
-- ================================================

CREATE TABLE IF NOT EXISTS title_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Identifiants SIGFU
  sigfu_request_id VARCHAR(255) UNIQUE, -- ID de la demande dans le système SIGFU
  verification_type VARCHAR(50) CHECK (verification_type IN ('TF', 'ACD', 'ADU', 'AV', 'AUTRE')),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
    'PENDING',      -- En attente d'envoi
    'SUBMITTED',    -- Envoyé à SIGFU
    'IN_PROGRESS',  -- En cours de traitement par SIGFU
    'VERIFIED',     -- Vérifié et authentique
    'FAILED',       -- Échec de la vérification
    'EXPIRED'       -- Vérification expirée
  )),

  -- Données du titre fournies par le propriétaire
  title_number VARCHAR(255),
  title_owner_name VARCHAR(255),
  title_issue_date DATE,
  title_surface_area DECIMAL(10, 2),
  cadastral_reference VARCHAR(255),
  title_location TEXT,

  -- Résultats de vérification
  is_authentic BOOLEAN, -- Titre existe et est valide
  is_owner_match BOOLEAN, -- Le nom du propriétaire correspond
  is_surface_match BOOLEAN, -- La surface correspond
  is_location_match BOOLEAN, -- La localisation correspond
  discrepancies JSONB, -- Liste des incohérences détectées: {"owner": "Different name", "surface": "+10m² difference"}
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),

  -- Données SIGFU
  sigfu_response JSONB, -- Réponse complète de l'API SIGFU
  sigfu_webhook_data JSONB, -- Données reçues via webhook
  verification_certificate_url TEXT, -- URL du certificat de vérification (PDF)
  verification_certificate_number VARCHAR(255), -- Numéro du certificat

  -- Dates
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_to_sigfu_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Validité de la vérification (ex: 1 an)

  -- Méta
  requested_by UUID REFERENCES users(id),
  verified_by_agent UUID REFERENCES users(id), -- Agent BakroSur qui a validé manuellement si nécessaire
  cost_amount DECIMAL(10, 2), -- Coût de la vérification
  cost_currency VARCHAR(3) DEFAULT 'XOF',
  notes TEXT,
  internal_notes TEXT -- Notes internes BakroSur
);

CREATE INDEX idx_title_verifications_property ON title_verifications(property_id);
CREATE INDEX idx_title_verifications_status ON title_verifications(status);
CREATE INDEX idx_title_verifications_sigfu ON title_verifications(sigfu_request_id);
CREATE INDEX idx_title_verifications_requested_at ON title_verifications(requested_at DESC);

-- ================================================
-- 4. TABLE SEARCH_HISTORY
-- Historique des recherches pour suggestions et analytics
-- ================================================

CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Recherche
  query TEXT, -- Texte de recherche libre
  filters JSONB, -- Filtres appliqués (type, prix, localisation, etc.)

  -- Résultats
  results_count INTEGER,
  clicked_property_id UUID REFERENCES properties(id) ON DELETE SET NULL, -- Quelle propriété a été cliquée

  -- Méta
  session_id VARCHAR(255), -- Pour grouper les recherches d'une même session
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_history_user ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX idx_search_history_session ON search_history(session_id);

-- ================================================
-- 5. TABLE ESCROW_ACCOUNTS
-- Comptes de séquestre pour transactions sécurisées
-- ================================================

CREATE TABLE IF NOT EXISTS escrow_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Références
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),

  -- Montants
  total_amount DECIMAL(15, 2) NOT NULL CHECK (total_amount > 0),
  deposited_amount DECIMAL(15, 2) DEFAULT 0 CHECK (deposited_amount >= 0),
  released_amount DECIMAL(15, 2) DEFAULT 0 CHECK (released_amount >= 0),
  currency VARCHAR(3) DEFAULT 'XOF',

  -- Commission BakroSur
  commission_rate DECIMAL(5, 2), -- Ex: 2.5 pour 2.5%
  commission_amount DECIMAL(15, 2),

  -- Statut
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
    'PENDING',    -- En attente de financement
    'FUNDED',     -- Fonds déposés
    'RELEASED',   -- Fonds libérés au vendeur
    'REFUNDED',   -- Fonds retournés à l'acheteur
    'DISPUTED',   -- Litige en cours
    'CANCELLED'   -- Annulé
  )),

  -- Conditions de release
  release_conditions JSONB, -- Ex: {"notary_signature": true, "inspection_done": true, "title_transfer": true}
  conditions_met JSONB, -- Track des conditions remplies

  -- Parties tierces
  escrow_agent_id UUID REFERENCES users(id), -- Agent de séquestre BakroSur
  notary_id UUID REFERENCES users(id), -- Notaire assigné

  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  funded_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Date d'expiration du séquestre

  -- Notes
  notes TEXT,
  dispute_reason TEXT,
  resolution_notes TEXT
);

CREATE INDEX idx_escrow_accounts_transaction ON escrow_accounts(transaction_id);
CREATE INDEX idx_escrow_accounts_property ON escrow_accounts(property_id);
CREATE INDEX idx_escrow_accounts_buyer ON escrow_accounts(buyer_id);
CREATE INDEX idx_escrow_accounts_seller ON escrow_accounts(seller_id);
CREATE INDEX idx_escrow_accounts_status ON escrow_accounts(status);

-- ================================================
-- 6. TABLE ESCROW_TRANSACTIONS
-- Mouvements de fonds dans le séquestre
-- ================================================

CREATE TABLE IF NOT EXISTS escrow_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escrow_account_id UUID NOT NULL REFERENCES escrow_accounts(id) ON DELETE CASCADE,

  -- Type de transaction
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN (
    'DEPOSIT',      -- Dépôt de l'acheteur
    'RELEASE',      -- Libération au vendeur
    'REFUND',       -- Remboursement à l'acheteur
    'FEE',          -- Frais BakroSur
    'ADJUSTMENT'    -- Ajustement
  )),

  -- Montant
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'XOF',

  -- Paiement
  payment_method VARCHAR(50), -- 'MOBILE_MONEY', 'BANK_TRANSFER', 'CARD', 'CASH'
  payment_provider VARCHAR(50), -- 'ORANGE_MONEY', 'MTN', 'MOOV', etc.
  payment_reference VARCHAR(255), -- Référence du paiement externe
  payment_receipt_url TEXT, -- URL du reçu de paiement

  -- Statut
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
  )),

  -- Méta
  description TEXT,
  initiated_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id), -- Agent qui a approuvé
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB, -- Pour intégrations API de paiement
  error_message TEXT
);

CREATE INDEX idx_escrow_transactions_account ON escrow_transactions(escrow_account_id);
CREATE INDEX idx_escrow_transactions_status ON escrow_transactions(status);
CREATE INDEX idx_escrow_transactions_created_at ON escrow_transactions(created_at DESC);

-- ================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ================================================

-- Activer RLS sur les nouvelles tables
ALTER TABLE bakro_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE title_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Policies pour bakro_score_history
CREATE POLICY "Anyone can view bakro score history"
  ON bakro_score_history FOR SELECT
  USING (true);

-- Policies pour title_verifications
CREATE POLICY "Users can view title verifications of their properties"
  ON title_verifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = title_verifications.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create title verifications for their properties"
  ON title_verifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Policies pour search_history
CREATE POLICY "Users can view their own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history"
  ON search_history FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour escrow_accounts
CREATE POLICY "Users can view their escrow accounts"
  ON escrow_accounts FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR auth.uid() = escrow_agent_id);

CREATE POLICY "Buyers can create escrow accounts"
  ON escrow_accounts FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Policies pour escrow_transactions
CREATE POLICY "Users can view their escrow transactions"
  ON escrow_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM escrow_accounts
      WHERE escrow_accounts.id = escrow_transactions.escrow_account_id
      AND (escrow_accounts.buyer_id = auth.uid() OR escrow_accounts.seller_id = auth.uid() OR escrow_accounts.escrow_agent_id = auth.uid())
    )
  );

-- ================================================
-- 8. TRIGGERS
-- ================================================

-- Trigger pour mettre à jour le bakro_score dans properties quand un nouveau score est calculé
CREATE OR REPLACE FUNCTION update_property_bakro_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties
  SET
    bakro_score = NEW.score,
    updated_at = NOW()
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_property_bakro_score_trigger
  AFTER INSERT ON bakro_score_history
  FOR EACH ROW
  EXECUTE FUNCTION update_property_bakro_score();

-- Trigger pour mettre à jour title_verified dans properties
CREATE OR REPLACE FUNCTION update_property_title_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'VERIFIED' AND NEW.is_authentic = true THEN
    UPDATE properties
    SET
      title_verified = true,
      title_verification_date = NEW.verified_at,
      sigfu_verification_id = NEW.sigfu_request_id,
      updated_at = NOW()
    WHERE id = NEW.property_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_property_title_verification_trigger
  AFTER UPDATE ON title_verifications
  FOR EACH ROW
  WHEN (NEW.status = 'VERIFIED')
  EXECUTE FUNCTION update_property_title_verification();

-- ================================================
-- 9. FONCTIONS UTILES
-- ================================================

-- Fonction pour calculer le BakroScore
CREATE OR REPLACE FUNCTION calculate_bakro_score(p_property_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
  v_factors JSONB := '{}'::jsonb;
  v_property RECORD;
  v_owner RECORD;
BEGIN
  -- Récupérer la propriété
  SELECT * INTO v_property FROM properties WHERE id = p_property_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Récupérer le propriétaire
  SELECT * INTO v_owner FROM users WHERE id = v_property.owner_id;

  -- 1. Titre vérifié (30 points)
  IF v_property.title_verified = true THEN
    v_score := v_score + 30;
    v_factors := v_factors || '{"title_verified": 30}';
  END IF;

  -- 2. KYC du propriétaire (25 points)
  IF v_owner.kyc_status = 'APPROVED' THEN
    v_score := v_score + 25;
    v_factors := v_factors || '{"owner_kyc": 25}';
  END IF;

  -- 3. Documents complets (20 points)
  IF array_length(COALESCE((SELECT array_agg(document_type) FROM property_documents WHERE property_id = p_property_id), '{}'), 1) >= 3 THEN
    v_score := v_score + 20;
    v_factors := v_factors || '{"documents_complete": 20}';
  END IF;

  -- 4. Localisation vérifiée GPS (15 points)
  IF v_property.location_type = 'GPS' THEN
    v_score := v_score + 15;
    v_factors := v_factors || '{"location_verified": 15}';
  END IF;

  -- 5. Photos de qualité (10 points)
  IF (SELECT COUNT(*) FROM property_images WHERE property_id = p_property_id) >= 5 THEN
    v_score := v_score + 10;
    v_factors := v_factors || '{"photos_quality": 10}';
  END IF;

  -- Insérer dans l'historique
  INSERT INTO bakro_score_history (property_id, score, factors, calculated_by, calculation_method)
  VALUES (p_property_id, v_score, v_factors, 'SYSTEM', 'v1.0');

  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le statut de vérification d'une propriété
CREATE OR REPLACE FUNCTION get_property_verification_status(p_property_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'bakro_score', p.bakro_score,
    'title_verified', p.title_verified,
    'title_verification_date', p.title_verification_date,
    'owner_kyc_status', u.kyc_status,
    'documents_count', (SELECT COUNT(*) FROM property_documents WHERE property_id = p.id),
    'images_count', (SELECT COUNT(*) FROM property_images WHERE property_id = p.id),
    'location_verified', p.location_type = 'GPS',
    'last_verification', (
      SELECT json_build_object(
        'status', status,
        'verified_at', verified_at,
        'is_authentic', is_authentic
      )
      FROM title_verifications
      WHERE property_id = p.id
      ORDER BY verified_at DESC
      LIMIT 1
    )
  ) INTO v_result
  FROM properties p
  LEFT JOIN users u ON p.owner_id = u.id
  WHERE p.id = p_property_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 10. MESSAGE DE CONFIRMATION
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '✅ Extensions BakroSur installées avec succès !';
  RAISE NOTICE '════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Nouvelles tables créées:';
  RAISE NOTICE '   • bakro_score_history - Historique des scores';
  RAISE NOTICE '   • title_verifications - Vérifications SIGFU';
  RAISE NOTICE '   • search_history - Historique de recherche';
  RAISE NOTICE '   • escrow_accounts - Comptes de séquestre';
  RAISE NOTICE '   • escrow_transactions - Transactions escrow';
  RAISE NOTICE '';
  RAISE NOTICE '🛡️  Champs BakroSur ajoutés à properties:';
  RAISE NOTICE '   • bakro_score (INTEGER 0-100)';
  RAISE NOTICE '   • title_verified (BOOLEAN)';
  RAISE NOTICE '   • title_verification_date (TIMESTAMPTZ)';
  RAISE NOTICE '   • sigfu_verification_id (VARCHAR)';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Row Level Security (RLS) activé sur toutes les tables';
  RAISE NOTICE '';
  RAISE NOTICE '⚡ Fonctions utiles créées:';
  RAISE NOTICE '   • calculate_bakro_score(property_id)';
  RAISE NOTICE '   • get_property_verification_status(property_id)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Prochaines étapes:';
  RAISE NOTICE '   1. Tester: SELECT calculate_bakro_score(<property_id>);';
  RAISE NOTICE '   2. Importer les données de villes et quartiers';
  RAISE NOTICE '   3. Créer des propriétés de test';
  RAISE NOTICE '   4. Tester depuis l''application mobile';
  RAISE NOTICE '';
  RAISE NOTICE '════════════════════════════════════════════════════════';
END $$;
