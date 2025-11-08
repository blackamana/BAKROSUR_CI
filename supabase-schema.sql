-- ================================================
-- BAKRÔSUR - Schéma de base de données Supabase
-- Application immobilière pour la Côte d'Ivoire
-- Version: 2.0 (Mise à jour complète)
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Pour les fonctionnalités géospatiales avancées

-- ================================================
-- TABLES PRINCIPALES
-- ================================================

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar TEXT,
  kyc_status VARCHAR(20) DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED')),
  profile_type VARCHAR(20) CHECK (profile_type IN ('particulier', 'professionnel', 'intervenant')),
  first_name VARCHAR(255),
  company_name VARCHAR(255),
  activity_type VARCHAR(255),
  rccm VARCHAR(255),
  profession VARCHAR(255),
  agrement_number VARCHAR(255),
  cabinet VARCHAR(255),
  city_id VARCHAR(50),
  neighborhood_id VARCHAR(50),
  address TEXT,
  preferred_currency VARCHAR(3) DEFAULT 'XOF',
  language VARCHAR(10) DEFAULT 'fr',
  notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Table: cities
CREATE TABLE IF NOT EXISTS cities (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  population INTEGER,
  region VARCHAR(255),
  district VARCHAR(255),
  description TEXT,
  image_url TEXT,
  properties_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: neighborhoods
CREATE TABLE IF NOT EXISTS neighborhoods (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
  city_name VARCHAR(255),
  commune VARCHAR(255),
  region VARCHAR(255),
  department VARCHAR(255),
  type VARCHAR(20) CHECK (type IN ('Quartier', 'Village')),
  description TEXT,
  safety_rating DECIMAL(3, 2) DEFAULT 0,
  cleanliness_rating DECIMAL(3, 2) DEFAULT 0,
  accessibility_rating DECIMAL(3, 2) DEFAULT 0,
  amenities_rating DECIMAL(3, 2) DEFAULT 0,
  overall_rating DECIMAL(3, 2) DEFAULT 0,
  properties_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: properties
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('MAISON', 'APPARTEMENT', 'TERRAIN', 'COMMERCE', 'BUREAU')),
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('VENTE', 'LOCATION')),
  price DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XOF',
  surface_area DECIMAL(10, 2) NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spots INTEGER DEFAULT 0,
  floor_number INTEGER,
  total_floors INTEGER,
  year_built INTEGER,
  city_id VARCHAR(50) REFERENCES cities(id) ON DELETE SET NULL,
  city_name VARCHAR(255),
  neighborhood_id VARCHAR(50) REFERENCES neighborhoods(id) ON DELETE SET NULL,
  neighborhood_name VARCHAR(255),
  address TEXT,
  address_hidden BOOLEAN DEFAULT TRUE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_type VARCHAR(20) DEFAULT 'MANUAL' CHECK (location_type IN ('GPS', 'MANUAL')),
  status VARCHAR(20) DEFAULT 'BROUILLON' CHECK (status IN ('PUBLIE', 'BROUILLON', 'EN_TRANSACTION', 'VENDU', 'LOUE', 'ARCHIVE')),
  price_per_sqm DECIMAL(15, 2),
  featured BOOLEAN DEFAULT FALSE,
  legal_status VARCHAR(10) CHECK (legal_status IN ('TF', 'ACD', 'ADU', 'AV')),
  video_url TEXT,
  virtual_360_url TEXT,
  has_generator BOOLEAN DEFAULT FALSE,
  has_water_borehole BOOLEAN DEFAULT FALSE,
  is_land_to_build BOOLEAN DEFAULT FALSE,
  near_main_road BOOLEAN DEFAULT FALSE,
  has_pool BOOLEAN DEFAULT FALSE,
  has_garden BOOLEAN DEFAULT FALSE,
  is_furnished BOOLEAN DEFAULT FALSE,
  has_security BOOLEAN DEFAULT FALSE,
  has_elevator BOOLEAN DEFAULT FALSE,
  has_air_conditioning BOOLEAN DEFAULT FALSE,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Table: property_images
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  position INTEGER DEFAULT 0,
  caption TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: property_documents
CREATE TABLE IF NOT EXISTS property_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('TF', 'PHOTOS', 'PLANS', 'CADASTRE', 'NOTAIRE', 'AUTRE')),
  url TEXT NOT NULL,
  name VARCHAR(255),
  size_bytes INTEGER,
  mime_type VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, user1_id, user2_id)
);

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  message_type VARCHAR(20) DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'IMAGE', 'DOCUMENT', 'APPOINTMENT', 'OFFER')),
  attachment_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Table: appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW')),
  notes TEXT,
  location TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Table: property_views
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_visit BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Table: neighborhood_reviews
CREATE TABLE IF NOT EXISTS neighborhood_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  neighborhood_id VARCHAR(50) REFERENCES neighborhoods(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  aspect VARCHAR(50) CHECK (aspect IN ('safety', 'cleanliness', 'accessibility', 'amenities', 'overall')),
  is_verified_resident BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: verification_documents
CREATE TABLE IF NOT EXISTS verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('ID_CARD', 'PASSPORT', 'RESIDENCE_PERMIT', 'BUSINESS_LICENSE', 'TAX_ID', 'PROFESSIONAL_LICENSE', 'BANK_STATEMENT', 'UTILITY_BILL')),
  url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  rejection_reason TEXT,
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('mortgage', 'legal', 'moving', 'insurance', 'renovation', 'inspection', 'cleaning', 'security', 'other')),
  icon VARCHAR(100),
  price_range VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: service_providers
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  experience_years INTEGER,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  description TEXT,
  service_areas TEXT[],
  certifications TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service_id)
);

-- Table: service_reviews
CREATE TABLE IF NOT EXISTS service_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_provider_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: neighborhood_prices
CREATE TABLE IF NOT EXISTS neighborhood_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  neighborhood_id VARCHAR(50) REFERENCES neighborhoods(id) ON DELETE CASCADE,
  property_type VARCHAR(20) CHECK (property_type IN ('MAISON', 'APPARTEMENT', 'TERRAIN', 'COMMERCE', 'BUREAU')),
  transaction_type VARCHAR(20) CHECK (transaction_type IN ('VENTE', 'LOCATION')),
  min_price DECIMAL(15, 2),
  max_price DECIMAL(15, 2),
  avg_price DECIMAL(15, 2),
  median_price DECIMAL(15, 2),
  price_per_sqm DECIMAL(15, 2),
  sample_size INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(neighborhood_id, property_type, transaction_type)
);

-- Table: partners
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  category VARCHAR(50) CHECK (category IN ('bank', 'insurance', 'developer', 'agency', 'government', 'other')),
  website TEXT,
  description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(100),
  user_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: saved_searches
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  search_criteria JSONB NOT NULL,
  notification_enabled BOOLEAN DEFAULT TRUE,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: property_alerts
CREATE TABLE IF NOT EXISTS property_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('PRICE_DROP', 'NEW_MATCH', 'STATUS_CHANGE', 'BACK_ON_MARKET')),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  transaction_type VARCHAR(20) CHECK (transaction_type IN ('VENTE', 'LOCATION')),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XOF',
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED')),
  payment_method VARCHAR(50),
  commission_amount DECIMAL(15, 2),
  completion_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('MESSAGE', 'APPOINTMENT', 'PROPERTY', 'SYSTEM', 'PROMOTION', 'ALERT')),
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_settings
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  marketing_emails BOOLEAN DEFAULT TRUE,
  preferred_language VARCHAR(10) DEFAULT 'fr',
  preferred_currency VARCHAR(3) DEFAULT 'XOF',
  timezone VARCHAR(50) DEFAULT 'Africa/Abidjan',
  privacy_settings JSONB DEFAULT '{"show_phone": true, "show_email": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: exchange_rates
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(15, 6) NOT NULL,
  effective_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(from_currency, to_currency, effective_date)
);

-- ================================================
-- INDEXES
-- ================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_profile_type ON users(profile_type);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Properties indexes
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_city ON properties(city_id);
CREATE INDEX idx_properties_neighborhood ON properties(neighborhood_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX idx_properties_published_at ON properties(published_at DESC);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);
CREATE INDEX idx_properties_price_range ON properties(price, transaction_type);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);

-- Property images indexes
CREATE INDEX idx_property_images_property ON property_images(property_id);
CREATE INDEX idx_property_images_position ON property_images(property_id, position);
CREATE INDEX idx_property_images_primary ON property_images(is_primary);

-- Property documents indexes
CREATE INDEX idx_property_documents_property ON property_documents(property_id);
CREATE INDEX idx_property_documents_type ON property_documents(document_type);

-- Cities indexes
CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_region ON cities(region);
CREATE INDEX idx_cities_properties_count ON cities(properties_count DESC);

-- Neighborhoods indexes
CREATE INDEX idx_neighborhoods_city ON neighborhoods(city_id);
CREATE INDEX idx_neighborhoods_type ON neighborhoods(type);
CREATE INDEX idx_neighborhoods_name ON neighborhoods(name);
CREATE INDEX idx_neighborhoods_rating ON neighborhoods(overall_rating DESC);

-- Conversations indexes
CREATE INDEX idx_conversations_property ON conversations(property_id);
CREATE INDEX idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON conversations(user2_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_conversations_archived ON conversations(is_archived);

-- Messages indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_read ON messages(read);

-- Appointments indexes
CREATE INDEX idx_appointments_property ON appointments(property_id);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_owner ON appointments(owner_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_datetime ON appointments(date, time);

-- Favorites indexes
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_property ON favorites(property_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- Property views indexes
CREATE INDEX idx_property_views_property ON property_views(property_id);
CREATE INDEX idx_property_views_user ON property_views(user_id);
CREATE INDEX idx_property_views_created_at ON property_views(created_at DESC);

-- Reviews indexes
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Neighborhood reviews indexes
CREATE INDEX idx_neighborhood_reviews_neighborhood ON neighborhood_reviews(neighborhood_id);
CREATE INDEX idx_neighborhood_reviews_user ON neighborhood_reviews(user_id);
CREATE INDEX idx_neighborhood_reviews_aspect ON neighborhood_reviews(aspect);

-- Verification documents indexes
CREATE INDEX idx_verification_documents_user ON verification_documents(user_id);
CREATE INDEX idx_verification_documents_status ON verification_documents(status);
CREATE INDEX idx_verification_documents_type ON verification_documents(document_type);

-- Service providers indexes
CREATE INDEX idx_service_providers_user ON service_providers(user_id);
CREATE INDEX idx_service_providers_service ON service_providers(service_id);
CREATE INDEX idx_service_providers_rating ON service_providers(rating DESC);
CREATE INDEX idx_service_providers_verified ON service_providers(is_verified);

-- Service reviews indexes
CREATE INDEX idx_service_reviews_provider ON service_reviews(service_provider_id);
CREATE INDEX idx_service_reviews_user ON service_reviews(user_id);

-- Neighborhood prices indexes
CREATE INDEX idx_neighborhood_prices_neighborhood ON neighborhood_prices(neighborhood_id);
CREATE INDEX idx_neighborhood_prices_type ON neighborhood_prices(property_type, transaction_type);

-- Saved searches indexes
CREATE INDEX idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX idx_saved_searches_notification ON saved_searches(notification_enabled);

-- Property alerts indexes
CREATE INDEX idx_property_alerts_user ON property_alerts(user_id);
CREATE INDEX idx_property_alerts_read ON property_alerts(is_read);
CREATE INDEX idx_property_alerts_created_at ON property_alerts(created_at DESC);

-- Transactions indexes
CREATE INDEX idx_transactions_property ON transactions(property_id);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_date ON transactions(completion_date DESC);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Exchange rates indexes
CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX idx_exchange_rates_date ON exchange_rates(effective_date DESC);

-- ================================================
-- FONCTIONS ET TRIGGERS
-- ================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neighborhood_reviews_updated_at BEFORE UPDATE ON neighborhood_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_documents_updated_at BEFORE UPDATE ON verification_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour calculer le prix au m²
CREATE OR REPLACE FUNCTION calculate_price_per_sqm()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.surface_area > 0 THEN
        NEW.price_per_sqm = NEW.price / NEW.surface_area;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_properties_price_per_sqm
    BEFORE INSERT OR UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION calculate_price_per_sqm();

-- Fonction pour mettre à jour le compteur de propriétés dans cities
CREATE OR REPLACE FUNCTION update_city_properties_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'PUBLIE' THEN
        UPDATE cities SET properties_count = properties_count + 1 WHERE id = NEW.city_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'PUBLIE' AND NEW.status = 'PUBLIE' THEN
            UPDATE cities SET properties_count = properties_count + 1 WHERE id = NEW.city_id;
        ELSIF OLD.status = 'PUBLIE' AND NEW.status != 'PUBLIE' THEN
            UPDATE cities SET properties_count = properties_count - 1 WHERE id = OLD.city_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'PUBLIE' THEN
        UPDATE cities SET properties_count = properties_count - 1 WHERE id = OLD.city_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_city_properties_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_city_properties_count();

-- Fonction pour mettre à jour le compteur de propriétés dans neighborhoods
CREATE OR REPLACE FUNCTION update_neighborhood_properties_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'PUBLIE' THEN
        UPDATE neighborhoods SET properties_count = properties_count + 1 WHERE id = NEW.neighborhood_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'PUBLIE' AND NEW.status = 'PUBLIE' THEN
            UPDATE neighborhoods SET properties_count = properties_count + 1 WHERE id = NEW.neighborhood_id;
        ELSIF OLD.status = 'PUBLIE' AND NEW.status != 'PUBLIE' THEN
            UPDATE neighborhoods SET properties_count = properties_count - 1 WHERE id = OLD.neighborhood_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'PUBLIE' THEN
        UPDATE neighborhoods SET properties_count = properties_count - 1 WHERE id = OLD.neighborhood_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_neighborhood_properties_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_neighborhood_properties_count();

-- Fonction pour mettre à jour le compteur de vues
CREATE OR REPLACE FUNCTION update_property_views_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE properties SET views_count = views_count + 1 WHERE id = NEW.property_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_property_views_count_trigger
    AFTER INSERT ON property_views
    FOR EACH ROW EXECUTE FUNCTION update_property_views_count();

-- Fonction pour mettre à jour le compteur de favoris
CREATE OR REPLACE FUNCTION update_property_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE properties SET favorites_count = favorites_count + 1 WHERE id = NEW.property_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE properties SET favorites_count = favorites_count - 1 WHERE id = OLD.property_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_property_favorites_count_trigger
    AFTER INSERT OR DELETE ON favorites
    FOR EACH ROW EXECUTE FUNCTION update_property_favorites_count();

-- Fonction pour mettre à jour last_message_at dans conversations
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Fonction pour mettre à jour les notes des quartiers
CREATE OR REPLACE FUNCTION update_neighborhood_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE neighborhoods n
    SET 
        safety_rating = (SELECT COALESCE(AVG(rating), 0) FROM neighborhood_reviews WHERE neighborhood_id = n.id AND aspect = 'safety'),
        cleanliness_rating = (SELECT COALESCE(AVG(rating), 0) FROM neighborhood_reviews WHERE neighborhood_id = n.id AND aspect = 'cleanliness'),
        accessibility_rating = (SELECT COALESCE(AVG(rating), 0) FROM neighborhood_reviews WHERE neighborhood_id = n.id AND aspect = 'accessibility'),
        amenities_rating = (SELECT COALESCE(AVG(rating), 0) FROM neighborhood_reviews WHERE neighborhood_id = n.id AND aspect = 'amenities'),
        overall_rating = (SELECT COALESCE(AVG(rating), 0) FROM neighborhood_reviews WHERE neighborhood_id = n.id AND aspect = 'overall')
    WHERE id = COALESCE(NEW.neighborhood_id, OLD.neighborhood_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_neighborhood_ratings_trigger
    AFTER INSERT OR UPDATE OR DELETE ON neighborhood_reviews
    FOR EACH ROW EXECUTE FUNCTION update_neighborhood_ratings();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour users
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Politiques RLS pour properties
CREATE POLICY "Anyone can view published properties"
    ON properties FOR SELECT
    USING (status = 'PUBLIE' OR owner_id = auth.uid());

CREATE POLICY "Verified users can insert their own properties"
    ON properties FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.kyc_status = 'APPROVED'
        )
    );

CREATE POLICY "Users can update their own properties"
    ON properties FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own properties"
    ON properties FOR DELETE
    USING (auth.uid() = owner_id);

-- Politiques RLS pour property_images
CREATE POLICY "Anyone can view images of published properties"
    ON property_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = property_images.property_id 
            AND (properties.status = 'PUBLIE' OR properties.owner_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage images of their properties"
    ON property_images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = property_images.property_id 
            AND properties.owner_id = auth.uid()
        )
    );

-- Politiques RLS pour property_documents
CREATE POLICY "Users can view documents of their properties or properties they're interested in"
    ON property_documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = property_documents.property_id 
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage documents of their properties"
    ON property_documents FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM properties 
            WHERE properties.id = property_documents.property_id 
            AND properties.owner_id = auth.uid()
        )
    );

-- Politiques RLS pour conversations
CREATE POLICY "Users can view their own conversations"
    ON conversations FOR SELECT
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create conversations"
    ON conversations FOR INSERT
    WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their conversations"
    ON conversations FOR UPDATE
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Politiques RLS pour messages
CREATE POLICY "Users can view messages in their conversations"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversations
            WHERE conversations.id = messages.conversation_id
            AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert messages in their conversations"
    ON messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM conversations
            WHERE conversations.id = conversation_id
            AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (auth.uid() = sender_id);

-- Politiques RLS pour appointments
CREATE POLICY "Users can view their own appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create appointments"
    ON appointments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
    ON appointments FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = owner_id);

CREATE POLICY "Users can delete their own appointments"
    ON appointments FOR DELETE
    USING (auth.uid() = user_id);

-- Politiques RLS pour favorites
CREATE POLICY "Users can view their own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
    ON favorites FOR ALL
    USING (auth.uid() = user_id);

-- Politiques RLS pour property_views
CREATE POLICY "Anyone can insert property views"
    ON property_views FOR INSERT
    WITH CHECK (true);

-- Politiques RLS pour reviews
CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Politiques RLS pour neighborhood_reviews
CREATE POLICY "Anyone can view neighborhood reviews"
    ON neighborhood_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create neighborhood reviews"
    ON neighborhood_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own neighborhood reviews"
    ON neighborhood_reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own neighborhood reviews"
    ON neighborhood_reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Politiques RLS pour verification_documents
CREATE POLICY "Users can view their own verification documents"
    ON verification_documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create verification documents"
    ON verification_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour saved_searches
CREATE POLICY "Users can manage their own saved searches"
    ON saved_searches FOR ALL
    USING (auth.uid() = user_id);

-- Politiques RLS pour property_alerts
CREATE POLICY "Users can manage their own property alerts"
    ON property_alerts FOR ALL
    USING (auth.uid() = user_id);

-- Politiques RLS pour transactions
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Politiques RLS pour notifications
CREATE POLICY "Users can manage their own notifications"
    ON notifications FOR ALL
    USING (auth.uid() = user_id);

-- Politiques RLS pour user_settings
CREATE POLICY "Users can manage their own settings"
    ON user_settings FOR ALL
    USING (auth.uid() = user_id);

-- ================================================
-- VUES UTILES
-- ================================================

-- Vue pour les propriétés avec toutes les informations
CREATE OR REPLACE VIEW properties_detailed AS
SELECT 
    p.*,
    u.name as owner_name,
    u.email as owner_email,
    u.phone as owner_phone,
    u.avatar as owner_avatar,
    u.kyc_status as owner_kyc_status,
    COALESCE(
        (SELECT json_agg(
            json_build_object(
                'id', id,
                'url', url,
                'thumbnail_url', thumbnail_url,
                'position', position,
                'caption', caption,
                'is_primary', is_primary
            ) ORDER BY position
        ) 
         FROM property_images 
         WHERE property_id = p.id),
        '[]'::json
    ) as images,
    COALESCE(
        (SELECT json_agg(
            json_build_object(
                'id', id,
                'document_type', document_type,
                'name', name,
                'is_verified', is_verified
            )
        ) 
         FROM property_documents 
         WHERE property_id = p.id),
        '[]'::json
    ) as documents,
    COALESCE(
        (SELECT AVG(rating) 
         FROM reviews 
         WHERE property_id = p.id),
        0
    ) as avg_rating,
    COALESCE(
        (SELECT COUNT(*) 
         FROM reviews 
         WHERE property_id = p.id),
        0
    ) as reviews_count
FROM properties p
LEFT JOIN users u ON p.owner_id = u.id;

-- Vue pour les statistiques des quartiers
CREATE OR REPLACE VIEW neighborhood_stats AS
SELECT 
    n.id,
    n.name,
    n.city_name,
    n.properties_count,
    AVG(CASE WHEN p.status = 'PUBLIE' THEN p.price END) as avg_price,
    MIN(CASE WHEN p.status = 'PUBLIE' THEN p.price END) as min_price,
    MAX(CASE WHEN p.status = 'PUBLIE' THEN p.price END) as max_price,
    AVG(CASE WHEN p.status = 'PUBLIE' THEN p.price_per_sqm END) as avg_price_per_sqm,
    n.safety_rating,
    n.cleanliness_rating,
    n.accessibility_rating,
    n.amenities_rating,
    n.overall_rating,
    COUNT(DISTINCT nr.id) as reviews_count
FROM neighborhoods n
LEFT JOIN properties p ON n.id = p.neighborhood_id
LEFT JOIN neighborhood_reviews nr ON n.id = nr.neighborhood_id
GROUP BY n.id, n.name, n.city_name, n.properties_count, n.safety_rating, n.cleanliness_rating, n.accessibility_rating, n.amenities_rating, n.overall_rating;

-- Vue pour les statistiques des utilisateurs
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.kyc_status,
    u.profile_type,
    COUNT(DISTINCT p.id) as properties_count,
    COUNT(DISTINCT CASE WHEN p.status = 'PUBLIE' THEN p.id END) as published_properties_count,
    COUNT(DISTINCT r.id) as reviews_given_count,
    COUNT(DISTINCT f.id) as favorites_count,
    COUNT(DISTINCT a.id) as appointments_count
FROM users u
LEFT JOIN properties p ON u.id = p.owner_id
LEFT JOIN reviews r ON u.id = r.user_id
LEFT JOIN favorites f ON u.id = f.user_id
LEFT JOIN appointments a ON u.id = a.user_id
GROUP BY u.id, u.name, u.email, u.kyc_status, u.profile_type;

-- Vue pour les conversations avec le dernier message
CREATE OR REPLACE VIEW conversations_with_last_message AS
SELECT 
    c.*,
    m.text as last_message_text,
    m.sender_id as last_message_sender_id,
    m.created_at as last_message_created_at,
    p.title as property_title,
    p.type as property_type,
    u1.name as user1_name,
    u1.avatar as user1_avatar,
    u2.name as user2_name,
    u2.avatar as user2_avatar
FROM conversations c
LEFT JOIN LATERAL (
    SELECT text, sender_id, created_at
    FROM messages
    WHERE conversation_id = c.id
    ORDER BY created_at DESC
    LIMIT 1
) m ON true
LEFT JOIN properties p ON c.property_id = p.id
LEFT JOIN users u1 ON c.user1_id = u1.id
LEFT JOIN users u2 ON c.user2_id = u2.id;

-- ================================================
-- CONTRAINTES SUPPLÉMENTAIRES
-- ================================================

-- Contrainte: Le titre est obligatoire pour toutes les annonces
ALTER TABLE properties ADD CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0);

-- Contrainte: Prix doit être > 0
ALTER TABLE properties ADD CONSTRAINT price_positive CHECK (price > 0);

-- Contrainte: Surface doit être > 0
ALTER TABLE properties ADD CONSTRAINT surface_positive CHECK (surface_area > 0);

-- Contrainte: Nombre de chambres >= 0
ALTER TABLE properties ADD CONSTRAINT bedrooms_positive CHECK (bedrooms IS NULL OR bedrooms >= 0);

-- Contrainte: Nombre de salles de bain >= 0
ALTER TABLE properties ADD CONSTRAINT bathrooms_positive CHECK (bathrooms IS NULL OR bathrooms >= 0);

-- ================================================
-- FONCTIONS UTILES
-- ================================================

-- Fonction pour rechercher des propriétés
CREATE OR REPLACE FUNCTION search_properties(
    search_text TEXT DEFAULT NULL,
    p_city_id VARCHAR(50) DEFAULT NULL,
    p_neighborhood_id VARCHAR(50) DEFAULT NULL,
    p_type VARCHAR(20) DEFAULT NULL,
    p_transaction_type VARCHAR(20) DEFAULT NULL,
    min_price DECIMAL DEFAULT NULL,
    max_price DECIMAL DEFAULT NULL,
    min_bedrooms INTEGER DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(500),
    description TEXT,
    type VARCHAR(20),
    transaction_type VARCHAR(20),
    price DECIMAL(15, 2),
    surface_area DECIMAL(10, 2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    city_name VARCHAR(255),
    neighborhood_name VARCHAR(255),
    featured BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, p.title, p.description, p.type, p.transaction_type,
        p.price, p.surface_area, p.bedrooms, p.bathrooms,
        p.city_name, p.neighborhood_name, p.featured, p.created_at
    FROM properties p
    WHERE p.status = 'PUBLIE'
        AND (search_text IS NULL OR p.title ILIKE '%' || search_text || '%' OR p.description ILIKE '%' || search_text || '%')
        AND (p_city_id IS NULL OR p.city_id = p_city_id)
        AND (p_neighborhood_id IS NULL OR p.neighborhood_id = p_neighborhood_id)
        AND (p_type IS NULL OR p.type = p_type)
        AND (p_transaction_type IS NULL OR p.transaction_type = p_transaction_type)
        AND (min_price IS NULL OR p.price >= min_price)
        AND (max_price IS NULL OR p.price <= max_price)
        AND (min_bedrooms IS NULL OR p.bedrooms >= min_bedrooms)
    ORDER BY p.featured DESC, p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les propriétés similaires
CREATE OR REPLACE FUNCTION get_similar_properties(
    property_id UUID,
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(500),
    price DECIMAL(15, 2),
    surface_area DECIMAL(10, 2),
    bedrooms INTEGER,
    city_name VARCHAR(255),
    neighborhood_name VARCHAR(255)
)
AS $$
DECLARE
    prop RECORD;
BEGIN
    SELECT * INTO prop FROM properties WHERE properties.id = property_id;
    
    RETURN QUERY
    SELECT 
        p.id, p.title, p.price, p.surface_area, p.bedrooms,
        p.city_name, p.neighborhood_name
    FROM properties p
    WHERE p.status = 'PUBLIE'
        AND p.id != property_id
        AND p.type = prop.type
        AND p.transaction_type = prop.transaction_type
        AND (p.neighborhood_id = prop.neighborhood_id OR p.city_id = prop.city_id)
        AND p.price BETWEEN prop.price * 0.7 AND prop.price * 1.3
    ORDER BY 
        CASE WHEN p.neighborhood_id = prop.neighborhood_id THEN 1 ELSE 2 END,
        ABS(p.price - prop.price)
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- DONNÉES INITIALES
-- ================================================

-- Insérer les taux de change par défaut
INSERT INTO exchange_rates (from_currency, to_currency, rate, effective_date) VALUES
('XOF', 'XOF', 1.0, CURRENT_DATE),
('XOF', 'EUR', 0.0015, CURRENT_DATE),
('XOF', 'USD', 0.0017, CURRENT_DATE),
('EUR', 'XOF', 655.957, CURRENT_DATE),
('EUR', 'EUR', 1.0, CURRENT_DATE),
('EUR', 'USD', 1.10, CURRENT_DATE),
('USD', 'XOF', 596.32, CURRENT_DATE),
('USD', 'EUR', 0.91, CURRENT_DATE),
('USD', 'USD', 1.0, CURRENT_DATE)
ON CONFLICT (from_currency, to_currency, effective_date) DO NOTHING;

-- Insérer les services par défaut
INSERT INTO services (name, description, category, icon, price_range) VALUES
('Prêt immobilier', 'Obtenez un financement pour votre achat immobilier', 'mortgage', 'Banknote', 'Variable'),
('Services juridiques', 'Conseils juridiques et assistance notariale', 'legal', 'Scale', 'Sur devis'),
('Déménagement', 'Services de déménagement professionnel', 'moving', 'Truck', '50,000 - 500,000 XOF'),
('Assurance habitation', 'Protégez votre bien immobilier', 'insurance', 'Shield', '20,000 - 100,000 XOF/an'),
('Rénovation', 'Travaux de rénovation et d''aménagement', 'renovation', 'Hammer', 'Sur devis'),
('Inspection', 'Inspection complète de propriété', 'inspection', 'Search', '50,000 - 200,000 XOF'),
('Nettoyage', 'Services de nettoyage professionnel', 'cleaning', 'Sparkles', '10,000 - 50,000 XOF'),
('Sécurité', 'Installation de systèmes de sécurité', 'security', 'Lock', 'Sur devis')
ON CONFLICT DO NOTHING;

-- ================================================
-- FIN DU SCHÉMA
-- ================================================

-- Note: Pour importer les données des villes et quartiers,
-- utilisez les fichiers constants/cities.ts et constants/neighborhoods.ts
-- et créez des scripts d'importation appropriés.
