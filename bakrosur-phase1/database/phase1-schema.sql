-- ================================================================
-- BAKRÔSUR - PHASE 1: SÉCURISATION DES TRANSACTIONS
-- Date: 2025-11-03
-- Auteur: Équipe Bakrosur
-- ================================================================
-- Cette migration ajoute:
-- 1. Intégration SIGFU (Système Intégré de Gestion du Foncier Urbain)
-- 2. Système BakroScore (Score de confiance)
-- 3. Réseau de Notaires Partenaires
-- ================================================================

-- ================================================
-- 1. INTÉGRATION SIGFU
-- ================================================

-- Table: sigfu_verifications
-- Stocke les vérifications de titres fonciers via l'API SIGFU
CREATE TABLE IF NOT EXISTS sigfu_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Données du titre foncier
  titre_foncier_number VARCHAR(100) NOT NULL,
  type_titre VARCHAR(50) CHECK (type_titre IN ('TF', 'ACD', 'ADU', 'AV', 'AUTRE')),
  
  -- Résultat de la vérification SIGFU
  sigfu_status VARCHAR(50) CHECK (sigfu_status IN (
    'PENDING',           -- En attente de vérification
    'VERIFIED',          -- Vérifié et valide
    'INVALID',           -- Titre invalide
    'NOT_FOUND',         -- Titre non trouvé dans SIGFU
    'CONFLICT',          -- Conflit détecté
    'EXPIRED',           -- Titre expiré
    'ERROR'              -- Erreur lors de la vérification
  )) DEFAULT 'PENDING',
  
  -- Données retournées par SIGFU
  sigfu_response JSONB,
  sigfu_api_call_date TIMESTAMP WITH TIME ZONE,
  
  -- Informations du propriétaire selon SIGFU
  proprietaire_nom VARCHAR(255),
  proprietaire_prenom VARCHAR(255),
  proprietaire_cni VARCHAR(50),
  
  -- Informations cadastrales
  superficie_cadastrale DECIMAL(10, 2),
  localisation JSONB, -- {commune, quartier, ilot, parcelle}
  coordonnees_gps JSONB, -- {latitude, longitude}
  
  -- Statut juridique
  hypotheques JSONB, -- Array des hypothèques
  servitudes JSONB, -- Array des servitudes
  litiges JSONB, -- Array des litiges
  date_derniere_mutation DATE,
  
  -- Alertes et warnings
  has_conflict BOOLEAN DEFAULT FALSE,
  has_hypotheque BOOLEAN DEFAULT FALSE,
  has_litige BOOLEAN DEFAULT FALSE,
  conflict_details TEXT,
  warning_messages TEXT[],
  
  -- Score de fiabilité (0-100)
  reliability_score NUMERIC(5,2),
  
  -- Audit trail
  verified_by UUID REFERENCES users(id),
  verification_method VARCHAR(50) DEFAULT 'API', -- API, MANUAL, BATCH
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Cache expiration
  
  -- Contraintes
  CONSTRAINT valid_reliability_score CHECK (reliability_score >= 0 AND reliability_score <= 100)
);

-- Index pour performance
CREATE INDEX idx_sigfu_verif_property ON sigfu_verifications(property_id);
CREATE INDEX idx_sigfu_verif_status ON sigfu_verifications(sigfu_status);
CREATE INDEX idx_sigfu_verif_titre ON sigfu_verifications(titre_foncier_number);
CREATE INDEX idx_sigfu_verif_conflicts ON sigfu_verifications(has_conflict) WHERE has_conflict = TRUE;

-- ================================================
-- 2. SYSTÈME BAKROSCORE (Score de Confiance)
-- ================================================

-- Table: bakro_scores
-- Calcule et stocke le score de confiance pour chaque propriété
CREATE TABLE IF NOT EXISTS bakro_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Score global (0-100)
  total_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  
  -- Composantes du score
  titre_score NUMERIC(5,2) DEFAULT 0,        -- 40 points max
  documents_score NUMERIC(5,2) DEFAULT 0,    -- 20 points max
  proprietaire_score NUMERIC(5,2) DEFAULT 0, -- 15 points max
  localisation_score NUMERIC(5,2) DEFAULT 0, -- 10 points max
  historique_score NUMERIC(5,2) DEFAULT 0,   -- 10 points max
  transparence_score NUMERIC(5,2) DEFAULT 0, -- 5 points max
  
  -- Détails du calcul
  calculation_details JSONB, -- Détails de comment le score a été calculé
  
  -- Critères vérifiés
  has_sigfu_verification BOOLEAN DEFAULT FALSE,
  has_notary_validation BOOLEAN DEFAULT FALSE,
  has_complete_documents BOOLEAN DEFAULT FALSE,
  has_no_litigation BOOLEAN DEFAULT FALSE,
  has_clear_ownership BOOLEAN DEFAULT FALSE,
  owner_kyc_verified BOOLEAN DEFAULT FALSE,
  
  -- Niveau de confiance
  confidence_level VARCHAR(20) CHECK (confidence_level IN (
    'EXCELLENT',   -- 85-100
    'BON',        -- 70-84
    'MOYEN',      -- 50-69
    'FAIBLE',     -- 30-49
    'TRES_FAIBLE' -- 0-29
  )),
  
  -- Badge à afficher
  badge_color VARCHAR(20), -- green, yellow, orange, red
  badge_text VARCHAR(100),
  
  -- Recommandations
  recommendations TEXT[],
  risk_factors TEXT[],
  
  -- Historique
  previous_score NUMERIC(5,2),
  score_evolution NUMERIC(5,2), -- Différence avec le score précédent
  
  -- Dates
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Le score doit être recalculé après cette date
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Audit
  calculated_by VARCHAR(50) DEFAULT 'SYSTEM',
  
  CONSTRAINT valid_total_score CHECK (total_score >= 0 AND total_score <= 100),
  CONSTRAINT valid_titre_score CHECK (titre_score >= 0 AND titre_score <= 40),
  CONSTRAINT valid_documents_score CHECK (documents_score >= 0 AND documents_score <= 20),
  CONSTRAINT valid_proprietaire_score CHECK (proprietaire_score >= 0 AND proprietaire_score <= 15),
  CONSTRAINT valid_localisation_score CHECK (localisation_score >= 0 AND localisation_score <= 10),
  CONSTRAINT valid_historique_score CHECK (historique_score >= 0 AND historique_score <= 10),
  CONSTRAINT valid_transparence_score CHECK (transparence_score >= 0 AND transparence_score <= 5)
);

-- Index
CREATE INDEX idx_bakro_scores_property ON bakro_scores(property_id);
CREATE INDEX idx_bakro_scores_total ON bakro_scores(total_score DESC);
CREATE INDEX idx_bakro_scores_level ON bakro_scores(confidence_level);
CREATE INDEX idx_bakro_scores_sigfu ON bakro_scores(has_sigfu_verification) WHERE has_sigfu_verification = TRUE;

-- ================================================
-- 3. RÉSEAU DE NOTAIRES PARTENAIRES
-- ================================================

-- Table: notaires
-- Annuaire des notaires partenaires de Bakrosur
CREATE TABLE IF NOT EXISTS notaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  
  -- Informations professionnelles
  nom VARCHAR(255) NOT NULL,
  prenoms VARCHAR(255) NOT NULL,
  titre VARCHAR(100) DEFAULT 'Maître', -- Maître, Me.
  
  -- Cabinet
  cabinet_name VARCHAR(255) NOT NULL,
  cabinet_address TEXT NOT NULL,
  city_id VARCHAR(50) REFERENCES cities(id),
  city_name VARCHAR(255),
  neighborhood_id VARCHAR(50) REFERENCES neighborhoods(id),
  neighborhood_name VARCHAR(255),
  
  -- Contact
  phone VARCHAR(20) NOT NULL,
  phone_secondary VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  
  -- Coordonnées GPS du cabinet
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Informations légales
  numero_chambre VARCHAR(100) NOT NULL UNIQUE, -- Numéro à la Chambre des Notaires
  date_inscription DATE NOT NULL,
  numero_ordre VARCHAR(100),
  
  -- Assurance RC Professionnelle
  assurance_rc_numero VARCHAR(100) NOT NULL,
  assurance_rc_montant DECIMAL(15, 2) NOT NULL, -- Montant de la garantie
  assurance_rc_compagnie VARCHAR(255) NOT NULL,
  assurance_rc_expiration DATE NOT NULL,
  
  -- Spécialités
  specialites TEXT[], -- ['Immobilier', 'Droit des affaires', 'Succession', etc.]
  zones_intervention TEXT[], -- Villes/quartiers où le notaire intervient
  langues_parlees TEXT[] DEFAULT ARRAY['Français'],
  
  -- Tarifs (en XOF)
  tarif_consultation DECIMAL(10, 2),
  tarif_acte_vente JSONB, -- {min: X, max: Y, pourcentage: Z}
  tarif_acte_location JSONB,
  tarif_hypotheque JSONB,
  autres_tarifs JSONB,
  
  -- Disponibilité
  horaires JSONB, -- {lundi: {debut: '08:00', fin: '17:00'}, ...}
  jours_fermeture TEXT[], -- ['Samedi', 'Dimanche']
  accepte_urgences BOOLEAN DEFAULT FALSE,
  delai_rdv_moyen INTEGER, -- En jours
  
  -- Statistiques
  nb_transactions_bakrosur INTEGER DEFAULT 0,
  nb_avis INTEGER DEFAULT 0,
  note_moyenne NUMERIC(3, 2) DEFAULT 0,
  taux_reponse NUMERIC(5, 2), -- Pourcentage de réponse aux demandes
  delai_reponse_moyen INTEGER, -- En heures
  
  -- Certifications Bakrosur
  is_certified BOOLEAN DEFAULT FALSE,
  certification_date DATE,
  certification_level VARCHAR(20) CHECK (certification_level IN ('BRONZE', 'ARGENT', 'OR', 'PLATINE')),
  
  -- Statut
  status VARCHAR(20) CHECK (status IN ('ACTIF', 'INACTIF', 'SUSPENDU', 'EN_ATTENTE')) DEFAULT 'EN_ATTENTE',
  is_featured BOOLEAN DEFAULT FALSE, -- Mise en avant sur la plateforme
  is_available BOOLEAN DEFAULT TRUE,
  
  -- Documents vérifiés
  carte_ordre_verified BOOLEAN DEFAULT FALSE,
  casier_judiciaire_verified BOOLEAN DEFAULT FALSE,
  diplomes_verified BOOLEAN DEFAULT FALSE,
  rc_pro_verified BOOLEAN DEFAULT FALSE,
  
  -- Profil public
  bio TEXT,
  photo_url TEXT,
  cabinet_photos TEXT[], -- Array d'URLs de photos du cabinet
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES users(id),
  
  -- Contraintes
  CONSTRAINT valid_note CHECK (note_moyenne >= 0 AND note_moyenne <= 5),
  CONSTRAINT valid_taux_reponse CHECK (taux_reponse >= 0 AND taux_reponse <= 100),
  CONSTRAINT valid_rc_montant CHECK (assurance_rc_montant >= 100000000) -- Min 100M FCFA
);

-- Index
CREATE INDEX idx_notaires_user ON notaires(user_id);
CREATE INDEX idx_notaires_city ON notaires(city_id);
CREATE INDEX idx_notaires_status ON notaires(status);
CREATE INDEX idx_notaires_certified ON notaires(is_certified) WHERE is_certified = TRUE;
CREATE INDEX idx_notaires_featured ON notaires(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_notaires_note ON notaires(note_moyenne DESC);
CREATE INDEX idx_notaires_chambre ON notaires(numero_chambre);
CREATE INDEX idx_notaires_location ON notaires(latitude, longitude);

-- Table: notaire_disponibilites
-- Gestion du calendrier et des créneaux de RDV
CREATE TABLE IF NOT EXISTS notaire_disponibilites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notaire_id UUID REFERENCES notaires(id) ON DELETE CASCADE,
  
  date DATE NOT NULL,
  heure_debut TIME NOT NULL,
  heure_fin TIME NOT NULL,
  
  is_available BOOLEAN DEFAULT TRUE,
  rdv_type VARCHAR(50)[], -- Types de RDV acceptés: ['CONSULTATION', 'SIGNATURE', 'AUDIT']
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_horaire CHECK (heure_fin > heure_debut)
);

CREATE INDEX idx_notaire_dispo_notaire ON notaire_disponibilites(notaire_id);
CREATE INDEX idx_notaire_dispo_date ON notaire_disponibilites(date);
CREATE INDEX idx_notaire_dispo_available ON notaire_disponibilites(is_available) WHERE is_available = TRUE;

-- Table: notaire_avis
-- Avis et évaluations des notaires
CREATE TABLE IF NOT EXISTS notaire_avis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notaire_id UUID REFERENCES notaires(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  
  -- Évaluation
  note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
  
  -- Critères détaillés (sur 5)
  professionnalisme INTEGER CHECK (professionnalisme >= 1 AND professionnalisme <= 5),
  reactivite INTEGER CHECK (reactivite >= 1 AND reactivite <= 5),
  clarté_explications INTEGER CHECK (clarté_explications >= 1 AND clarté_explications <= 5),
  rapport_qualite_prix INTEGER CHECK (rapport_qualite_prix >= 1 AND rapport_qualite_prix <= 5),
  
  -- Commentaire
  titre VARCHAR(255),
  commentaire TEXT,
  
  -- Type de prestation
  type_prestation VARCHAR(50), -- VENTE, LOCATION, AUDIT, CONSULTATION
  montant_transaction DECIMAL(15, 2),
  
  -- Statut
  is_verified BOOLEAN DEFAULT FALSE, -- Vérifié = transaction réelle
  is_published BOOLEAN DEFAULT TRUE,
  
  -- Réponse du notaire
  notaire_response TEXT,
  notaire_response_date TIMESTAMP WITH TIME ZONE,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notaire_avis_notaire ON notaire_avis(notaire_id);
CREATE INDEX idx_notaire_avis_user ON notaire_avis(user_id);
CREATE INDEX idx_notaire_avis_note ON notaire_avis(note DESC);
CREATE INDEX idx_notaire_avis_published ON notaire_avis(is_published) WHERE is_published = TRUE;

-- Table: notaire_demandes_rdv
-- Demandes de rendez-vous avec les notaires
CREATE TABLE IF NOT EXISTS notaire_demandes_rdv (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notaire_id UUID REFERENCES notaires(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  
  -- Type et objet du RDV
  type_rdv VARCHAR(50) CHECK (type_rdv IN (
    'CONSULTATION',
    'AUDIT_JURIDIQUE',
    'SIGNATURE_VENTE',
    'SIGNATURE_LOCATION',
    'CONSTITUTION_HYPOTHEQUE',
    'AUTRE'
  )) NOT NULL,
  objet TEXT NOT NULL,
  
  -- Dates souhaitées
  date_souhaitee_1 TIMESTAMP WITH TIME ZONE,
  date_souhaitee_2 TIMESTAMP WITH TIME ZONE,
  date_souhaitee_3 TIMESTAMP WITH TIME ZONE,
  
  -- Date confirmée
  date_confirmee TIMESTAMP WITH TIME ZONE,
  duree_estimee INTEGER, -- En minutes
  
  -- Contact
  nom_complet VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- Documents fournis
  documents_fournis TEXT[],
  notes_complementaires TEXT,
  
  -- Statut
  status VARCHAR(50) CHECK (status IN (
    'PENDING',      -- En attente de réponse du notaire
    'CONFIRMED',    -- RDV confirmé
    'COMPLETED',    -- RDV effectué
    'CANCELLED',    -- Annulé
    'NO_SHOW'       -- Client absent
  )) DEFAULT 'PENDING',
  
  -- Raisons d'annulation
  cancellation_reason TEXT,
  cancelled_by VARCHAR(20), -- USER, NOTAIRE, SYSTEM
  
  -- Feedback post-RDV
  user_attended BOOLEAN,
  user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  user_feedback TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notaire_rdv_notaire ON notaire_demandes_rdv(notaire_id);
CREATE INDEX idx_notaire_rdv_user ON notaire_demandes_rdv(user_id);
CREATE INDEX idx_notaire_rdv_status ON notaire_demandes_rdv(status);
CREATE INDEX idx_notaire_rdv_date ON notaire_demandes_rdv(date_confirmee);

-- ================================================
-- FONCTIONS UTILITAIRES
-- ================================================

-- Fonction: Calculer le BakroScore d'une propriété
CREATE OR REPLACE FUNCTION calculate_bakro_score(p_property_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_titre_score NUMERIC := 0;
  v_documents_score NUMERIC := 0;
  v_proprietaire_score NUMERIC := 0;
  v_localisation_score NUMERIC := 0;
  v_historique_score NUMERIC := 0;
  v_transparence_score NUMERIC := 0;
  v_total_score NUMERIC := 0;
  v_confidence_level VARCHAR(20);
  v_sigfu_verified BOOLEAN := FALSE;
  v_notary_validated BOOLEAN := FALSE;
  v_has_complete_docs BOOLEAN := FALSE;
  v_no_litigation BOOLEAN := FALSE;
  v_clear_ownership BOOLEAN := FALSE;
  v_owner_kyc BOOLEAN := FALSE;
BEGIN
  -- 1. TITRE SCORE (40 points max)
  -- Vérifier si le titre est vérifié par SIGFU
  SELECT 
    CASE 
      WHEN sigfu_status = 'VERIFIED' AND has_conflict = FALSE AND has_hypotheque = FALSE AND has_litige = FALSE THEN 40
      WHEN sigfu_status = 'VERIFIED' AND (has_conflict = TRUE OR has_hypotheque = TRUE) THEN 25
      WHEN sigfu_status = 'VERIFIED' THEN 30
      WHEN sigfu_status = 'PENDING' THEN 15
      ELSE 0
    END INTO v_titre_score
  FROM sigfu_verifications 
  WHERE property_id = p_property_id
  ORDER BY created_at DESC LIMIT 1;
  
  IF v_titre_score >= 30 THEN
    v_sigfu_verified := TRUE;
  END IF;
  
  -- 2. DOCUMENTS SCORE (20 points max)
  -- Vérifier la complétude des documents
  SELECT 
    CASE 
      WHEN COUNT(*) >= 5 THEN 20
      WHEN COUNT(*) >= 3 THEN 15
      WHEN COUNT(*) >= 1 THEN 10
      ELSE 0
    END INTO v_documents_score
  FROM property_documents
  WHERE property_id = p_property_id AND verified = TRUE;
  
  IF v_documents_score >= 15 THEN
    v_has_complete_docs := TRUE;
  END IF;
  
  -- 3. PROPRIÉTAIRE SCORE (15 points max)
  -- Vérifier le KYC du propriétaire
  SELECT 
    CASE 
      WHEN u.kyc_status = 'APPROVED' THEN 15
      WHEN u.kyc_status = 'IN_REVIEW' THEN 8
      WHEN u.kyc_status = 'PENDING' THEN 3
      ELSE 0
    END INTO v_proprietaire_score
  FROM properties p
  JOIN users u ON p.user_id = u.id
  WHERE p.id = p_property_id;
  
  IF v_proprietaire_score >= 12 THEN
    v_owner_kyc := TRUE;
  END IF;
  
  -- 4. LOCALISATION SCORE (10 points max)
  -- Vérifier la précision de la localisation
  SELECT 
    CASE 
      WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 10
      WHEN city_id IS NOT NULL AND neighborhood_id IS NOT NULL THEN 7
      WHEN city_id IS NOT NULL THEN 5
      ELSE 0
    END INTO v_localisation_score
  FROM properties
  WHERE id = p_property_id;
  
  -- 5. HISTORIQUE SCORE (10 points max)
  -- Vérifier l'absence de litiges et l'historique positif
  v_historique_score := 10; -- Par défaut positif
  
  SELECT has_litige INTO v_no_litigation
  FROM sigfu_verifications
  WHERE property_id = p_property_id
  ORDER BY created_at DESC LIMIT 1;
  
  IF v_no_litigation = TRUE THEN
    v_historique_score := v_historique_score - 7;
  END IF;
  
  v_no_litigation := NOT COALESCE(v_no_litigation, FALSE);
  
  -- 6. TRANSPARENCE SCORE (5 points max)
  -- Vérifier les informations publiques et complètes
  SELECT 
    CASE 
      WHEN description IS NOT NULL AND LENGTH(description) > 100 THEN 5
      WHEN description IS NOT NULL THEN 3
      ELSE 0
    END INTO v_transparence_score
  FROM properties
  WHERE id = p_property_id;
  
  -- Calcul du score total
  v_total_score := v_titre_score + v_documents_score + v_proprietaire_score + 
                   v_localisation_score + v_historique_score + v_transparence_score;
  
  -- Déterminer le niveau de confiance
  IF v_total_score >= 85 THEN
    v_confidence_level := 'EXCELLENT';
  ELSIF v_total_score >= 70 THEN
    v_confidence_level := 'BON';
  ELSIF v_total_score >= 50 THEN
    v_confidence_level := 'MOYEN';
  ELSIF v_total_score >= 30 THEN
    v_confidence_level := 'FAIBLE';
  ELSE
    v_confidence_level := 'TRES_FAIBLE';
  END IF;
  
  -- Insérer ou mettre à jour le score
  INSERT INTO bakro_scores (
    property_id, 
    total_score, 
    titre_score, 
    documents_score, 
    proprietaire_score,
    localisation_score, 
    historique_score, 
    transparence_score,
    confidence_level,
    has_sigfu_verification,
    has_complete_documents,
    has_no_litigation,
    owner_kyc_verified,
    calculated_at,
    expires_at
  ) VALUES (
    p_property_id,
    v_total_score,
    v_titre_score,
    v_documents_score,
    v_proprietaire_score,
    v_localisation_score,
    v_historique_score,
    v_transparence_score,
    v_confidence_level,
    v_sigfu_verified,
    v_has_complete_docs,
    v_no_litigation,
    v_owner_kyc,
    NOW(),
    NOW() + INTERVAL '30 days'
  )
  ON CONFLICT (property_id) DO UPDATE SET
    previous_score = bakro_scores.total_score,
    total_score = v_total_score,
    titre_score = v_titre_score,
    documents_score = v_documents_score,
    proprietaire_score = v_proprietaire_score,
    localisation_score = v_localisation_score,
    historique_score = v_historique_score,
    transparence_score = v_transparence_score,
    score_evolution = v_total_score - bakro_scores.total_score,
    confidence_level = v_confidence_level,
    has_sigfu_verification = v_sigfu_verified,
    has_complete_documents = v_has_complete_docs,
    has_no_litigation = v_no_litigation,
    owner_kyc_verified = v_owner_kyc,
    calculated_at = NOW(),
    last_updated = NOW(),
    expires_at = NOW() + INTERVAL '30 days';
  
  RETURN v_total_score;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Mettre à jour la note moyenne d'un notaire
CREATE OR REPLACE FUNCTION update_notaire_note_moyenne()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE notaires SET
    note_moyenne = (
      SELECT AVG(note)::NUMERIC(3,2)
      FROM notaire_avis
      WHERE notaire_id = NEW.notaire_id AND is_published = TRUE
    ),
    nb_avis = (
      SELECT COUNT(*)
      FROM notaire_avis
      WHERE notaire_id = NEW.notaire_id AND is_published = TRUE
    ),
    updated_at = NOW()
  WHERE id = NEW.notaire_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement la note moyenne
CREATE TRIGGER trigger_update_notaire_note
AFTER INSERT OR UPDATE ON notaire_avis
FOR EACH ROW
EXECUTE FUNCTION update_notaire_note_moyenne();

-- ================================================
-- VUES UTILES
-- ================================================

-- Vue: Top Notaires
CREATE OR REPLACE VIEW top_notaires AS
SELECT 
  n.*,
  COALESCE(n.note_moyenne, 0) as note,
  COALESCE(n.nb_avis, 0) as avis_count,
  c.name as city_full_name
FROM notaires n
LEFT JOIN cities c ON n.city_id = c.id
WHERE n.status = 'ACTIF' AND n.is_certified = TRUE
ORDER BY n.note_moyenne DESC NULLS LAST, n.nb_transactions_bakrosur DESC
LIMIT 10;

-- Vue: Propriétés avec meilleur score
CREATE OR REPLACE VIEW top_scored_properties AS
SELECT 
  p.*,
  bs.total_score,
  bs.confidence_level,
  bs.has_sigfu_verification
FROM properties p
INNER JOIN bakro_scores bs ON p.id = bs.property_id
WHERE bs.total_score >= 70
ORDER BY bs.total_score DESC, p.created_at DESC;

-- Vue: Statistiques SIGFU
CREATE OR REPLACE VIEW sigfu_stats AS
SELECT 
  COUNT(*) as total_verifications,
  COUNT(*) FILTER (WHERE sigfu_status = 'VERIFIED') as verified_count,
  COUNT(*) FILTER (WHERE sigfu_status = 'INVALID') as invalid_count,
  COUNT(*) FILTER (WHERE has_conflict = TRUE) as conflicts_count,
  COUNT(*) FILTER (WHERE has_hypotheque = TRUE) as hypotheques_count,
  COUNT(*) FILTER (WHERE has_litige = TRUE) as litiges_count,
  AVG(reliability_score) as avg_reliability_score
FROM sigfu_verifications;

-- ================================================
-- DONNÉES INITIALES (EXEMPLE)
-- ================================================

-- Insérer quelques notaires partenaires (exemple Abidjan)
INSERT INTO notaires (
  nom, prenoms, cabinet_name, cabinet_address,
  city_id, city_name, phone, email,
  numero_chambre, date_inscription,
  assurance_rc_numero, assurance_rc_montant, assurance_rc_compagnie, assurance_rc_expiration,
  specialites, zones_intervention, langues_parlees,
  tarif_consultation, status, is_certified, certification_level
) VALUES
(
  'KOUASSI', 'Jean-Baptiste',
  'Cabinet Kouassi & Associés',
  'Boulevard Lagunaire, Plateau',
  'abidjan', 'Abidjan',
  '+225 27 20 21 22 23', 'contact@cabinetkouas si.ci',
  'CN-2015-0123', '2015-03-15',
  'RC-2024-5678', 150000000, 'AXA Assurances CI', '2025-12-31',
  ARRAY['Immobilier', 'Droit des affaires', 'Succession'],
  ARRAY['Abidjan', 'Bingerville', 'Anyama'],
  ARRAY['Français', 'Anglais'],
  50000, 'ACTIF', TRUE, 'OR'
),
(
  'N''GUESSAN', 'Marie-Claire',
  'Étude N''Guessan',
  'Rue du Commerce, Cocody',
  'abidjan', 'Abidjan',
  '+225 27 20 30 40 50', 'etude.nguessan@notaires.ci',
  'CN-2018-0456', '2018-07-20',
  'RC-2024-9012', 120000000, 'NSIA Assurances', '2025-11-30',
  ARRAY['Immobilier', 'Droit de la famille'],
  ARRAY['Abidjan', 'Grand-Bassam'],
  ARRAY['Français'],
  45000, 'ACTIF', TRUE, 'ARGENT'
);

-- ================================================
-- POLITIQUES RLS (Row Level Security)
-- ================================================

-- Activer RLS sur les nouvelles tables
ALTER TABLE sigfu_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bakro_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE notaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE notaire_avis ENABLE ROW LEVEL SECURITY;
ALTER TABLE notaire_demandes_rdv ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir les vérifications SIGFU des propriétés publiques
CREATE POLICY "Public can view SIGFU verifications"
ON sigfu_verifications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = sigfu_verifications.property_id 
    AND properties.status = 'APPROVED'
  )
);

-- Politique: Les utilisateurs peuvent voir les scores des propriétés publiques
CREATE POLICY "Public can view bakro scores"
ON bakro_scores FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = bakro_scores.property_id 
    AND properties.status = 'APPROVED'
  )
);

-- Politique: Les notaires actifs sont visibles publiquement
CREATE POLICY "Public can view active notaires"
ON notaires FOR SELECT
USING (status = 'ACTIF');

-- Politique: Les avis publiés sont visibles publiquement
CREATE POLICY "Public can view published reviews"
ON notaire_avis FOR SELECT
USING (is_published = TRUE);

-- Politique: Les utilisateurs peuvent voir leurs propres demandes de RDV
CREATE POLICY "Users can view their own RDV requests"
ON notaire_demandes_rdv FOR SELECT
USING (auth.uid() = user_id);

-- Politique: Les notaires peuvent voir leurs demandes de RDV
CREATE POLICY "Notaires can view their RDV requests"
ON notaire_demandes_rdv FOR SELECT
USING (
  notaire_id IN (
    SELECT id FROM notaires WHERE user_id = auth.uid()
  )
);

COMMENT ON TABLE sigfu_verifications IS 'Vérifications des titres fonciers via l''API SIGFU';
COMMENT ON TABLE bakro_scores IS 'Scores de confiance BakroScore pour les propriétés';
COMMENT ON TABLE notaires IS 'Annuaire des notaires partenaires de Bakrosur';
COMMENT ON TABLE notaire_avis IS 'Avis et évaluations des notaires';
COMMENT ON TABLE notaire_demandes_rdv IS 'Demandes de rendez-vous avec les notaires';

-- Fin du script
-- ================================================================
