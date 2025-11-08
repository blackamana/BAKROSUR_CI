
## 📋 MODULE 3 : RÉSEAU DE NOTAIRES PARTENAIRES

### Architecture du module

```
┌─────────────────────────────────────────┐
│       Notary Network Module             │
├─────────────────────────────────────────┤
│  1. Notary Directory                    │
│  2. Booking System                      │
│  3. Messaging Platform                  │
│  4. Transaction Tracker                 │
│  5. Rating & Review System              │
└─────────────────────────────────────────┘
```

### 3.1 Modèle de données - Notaires

```sql
-- Migration Supabase : Notaires et transactions

-- Table: notaries
CREATE TABLE IF NOT EXISTS notaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Informations professionnelles
  order_number VARCHAR(50) UNIQUE NOT NULL, -- Numéro d'inscription à la Chambre
  chamber_name VARCHAR(255) DEFAULT 'Chambre des Notaires de Côte d''Ivoire',
  office_name VARCHAR(255) NOT NULL,
  
  -- Spécialisations
  specialties TEXT[] DEFAULT ARRAY['Droit immobilier'],
  languages TEXT[] DEFAULT ARRAY['Français'],
  
  -- Contact
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  
  -- Adresse du cabinet
  address TEXT NOT NULL,
  city_id VARCHAR(50) REFERENCES cities(id),
  city_name VARCHAR(255),
  neighborhood_id VARCHAR(50) REFERENCES neighborhoods(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Zones d'intervention
  service_areas TEXT[] DEFAULT ARRAY['Abidjan'],
  
  -- Tarifs (en XOF)
  pricing JSONB DEFAULT '{
    "consultation": 50000,
    "acte_vente_simple": 500000,
    "acte_vente_complexe": 1000000,
    "donation": 750000,
    "succession": 1500000,
    "hypotheque": 600000
  }'::jsonb,
  
  -- Horaires
  business_hours JSONB DEFAULT '{
    "monday": {"open": "08:00", "close": "17:00"},
    "tuesday": {"open": "08:00", "close": "17:00"},
    "wednesday": {"open": "08:00", "close": "17:00"},
    "thursday": {"open": "08:00", "close": "17:00"},
    "friday": {"open": "08:00", "close": "17:00"},
    "saturday": null,
    "sunday": null
  }'::jsonb,
  
  -- Statistiques
  total_transactions INTEGER DEFAULT 0,
  completed_transactions INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  response_rate DECIMAL(5, 2) DEFAULT 100.00,
  average_response_time INTEGER DEFAULT 24, -- en heures
  
  -- Vérification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_documents JSONB,
  
  -- Assurance RC Pro
  insurance_company VARCHAR(255),
  insurance_policy_number VARCHAR(100),
  insurance_expiry_date DATE,
  insurance_amount DECIMAL(15, 2), -- Montant de garantie
  
  -- Statut
  is_active BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_notaries_city ON notaries(city_id);
CREATE INDEX idx_notaries_verified ON notaries(is_verified, is_active);
CREATE INDEX idx_notaries_rating ON notaries(average_rating DESC);

-- Table: notary_appointments
CREATE TABLE IF NOT EXISTS notary_appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Parties
  notary_id UUID REFERENCES notaries(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  
  -- Type de rendez-vous
  appointment_type VARCHAR(50) NOT NULL CHECK (appointment_type IN (
    'CONSULTATION',
    'SIGNATURE_ACTE',
    'VERIFICATION_DOCUMENTS',
    'CONSEIL_JURIDIQUE',
    'REDACTION_ACTE',
    'OTHER'
  )),
  
  -- Détails
  subject VARCHAR(500) NOT NULL,
  description TEXT,
  service_type VARCHAR(100),
  
  -- Planification
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60, -- en minutes
  location VARCHAR(20) DEFAULT 'OFFICE' CHECK (location IN ('OFFICE', 'ONLINE', 'ON_SITE')),
  meeting_link VARCHAR(500), -- Pour visio
  
  -- Statut
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'NO_SHOW'
  )),
  
  -- Tarification
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'XOF',
  
  -- Documents
  documents JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  
  -- Notifications
  reminder_sent BOOLEAN DEFAULT FALSE,
  confirmation_sent BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Index
CREATE INDEX idx_appointments_notary ON notary_appointments(notary_id);
CREATE INDEX idx_appointments_client ON notary_appointments(client_id);
CREATE INDEX idx_appointments_date ON notary_appointments(appointment_date);
CREATE INDEX idx_appointments_status ON notary_appointments(status);

-- Table: notary_transactions
CREATE TABLE IF NOT EXISTS notary_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Parties
  notary_id UUID REFERENCES notaries(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Type de transaction
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN (
    'VENTE',
    'DONATION',
    'SUCCESSION',
    'HYPOTHEQUE',
    'ECHANGE',
    'PARTAGE'
  )),
  
  -- Montant
  property_value DECIMAL(15, 2) NOT NULL,
  notary_fees DECIMAL(15, 2) NOT NULL,
  registration_fees DECIMAL(15, 2),
  taxes DECIMAL(15, 2),
  total_amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XOF',
  
  -- Statut
  status VARCHAR(20) DEFAULT 'INITIATED' CHECK (status IN (
    'INITIATED',
    'DOCUMENT_REVIEW',
    'AWAITING_SIGNATURE',
    'SIGNED',
    'REGISTERED',
    'COMPLETED',
    'CANCELLED'
  )),
  
  -- Dates clés
  initiated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  signature_date TIMESTAMP WITH TIME ZONE,
  registration_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  
  -- Documents
  documents JSONB DEFAULT '[]'::jsonb,
  
  -- Acte notarié
  acte_reference VARCHAR(100) UNIQUE,
  acte_date DATE,
  acte_signed_url TEXT,
  
  -- Notes et conditions
  notes TEXT,
  conditions TEXT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_transactions_notary ON notary_transactions(notary_id);
CREATE INDEX idx_transactions_property ON notary_transactions(property_id);
CREATE INDEX idx_transactions_status ON notary_transactions(status);

-- Table: notary_reviews
CREATE TABLE IF NOT EXISTS notary_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  notary_id UUID REFERENCES notaries(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES notary_appointments(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES notary_transactions(id) ON DELETE SET NULL,
  
  -- Note
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Détails
  title VARCHAR(255),
  comment TEXT,
  
  -- Critères détaillés
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  expertise_rating INTEGER CHECK (expertise_rating >= 1 AND expertise_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  
  -- Recommandation
  would_recommend BOOLEAN DEFAULT TRUE,
  
  -- Modération
  is_verified BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  
  -- Réponse du notaire
  notary_response TEXT,
  notary_responded_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_reviews_notary ON notary_reviews(notary_id);
CREATE INDEX idx_reviews_visible ON notary_reviews(is_visible);

-- Table: notary_messages
CREATE TABLE IF NOT EXISTS notary_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  notary_id UUID REFERENCES notaries(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES notary_appointments(id) ON DELETE SET NULL,
  
  -- Message
  sender_id UUID NOT NULL, -- user_id du notaire ou du client
  content TEXT NOT NULL,
  
  -- Pièces jointes
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Statut
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_messages_notary ON notary_messages(notary_id);
CREATE INDEX idx_messages_client ON notary_messages(client_id);
CREATE INDEX idx_messages_unread ON notary_messages(is_read) WHERE NOT is_read;

-- Fonction : Calculer la note moyenne d'un notaire
CREATE OR REPLACE FUNCTION update_notary_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE notaries
  SET 
    average_rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM notary_reviews
      WHERE notary_id = NEW.notary_id AND is_visible = TRUE
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM notary_reviews
      WHERE notary_id = NEW.notary_id AND is_visible = TRUE
    ),
    updated_at = NOW()
  WHERE id = NEW.notary_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_update_notary_rating
AFTER INSERT OR UPDATE ON notary_reviews
FOR EACH ROW
EXECUTE FUNCTION update_notary_rating();

-- Fonction : Mettre à jour le nombre de transactions
CREATE OR REPLACE FUNCTION update_notary_transaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'COMPLETED' THEN
    UPDATE notaries
    SET 
      total_transactions = total_transactions + 1,
      completed_transactions = completed_transactions + 1,
      updated_at = NOW()
    WHERE id = NEW.notary_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_update_transaction_count
AFTER UPDATE ON notary_transactions
FOR EACH ROW
WHEN (OLD.status <> NEW.status AND NEW.status = 'COMPLETED')
EXECUTE FUNCTION update_notary_transaction_count();
```

### 3.2 Service - Recherche et matching de notaires

```typescript
// lib/notary/matching-service.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export interface NotarySearchCriteria {
  cityId?: string;
  specialties?: string[];
  maxDistance?: number; // en km
  minRating?: number;
  priceRange?: { min: number; max: number };
  languages?: string[];
  availability?: 'IMMEDIATE' | 'THIS_WEEK' | 'THIS_MONTH';
  userLocation?: { latitude: number; longitude: number };
}

export interface NotaryMatch {
  notary: any;
  matchScore: number;
  distance?: number;
  availableSlots?: Date[];
  estimatedCost: number;
  reasons: string[];
}

export class NotaryMatchingService {
  /**
   * Recherche et classe les notaires par pertinence
   */
  async findMatches(criteria: NotarySearchCriteria): Promise<NotaryMatch[]> {
    let query = supabase
      .from('notaries')
      .select(`
        *,
        user:users(name, avatar, email),
        reviews:notary_reviews(rating, comment)
      `)
      .eq('is_verified', true)
      .eq('is_active', true);

    // Filtrer par ville
    if (criteria.cityId) {
      query = query.eq('city_id', criteria.cityId);
    }

    // Filtrer par note minimale
    if (criteria.minRating) {
      query = query.gte('average_rating', criteria.minRating);
    }

    const { data: notaries, error } = await query;

    if (error || !notaries) {
      throw new Error('Erreur lors de la recherche de notaires');
    }

    // Calculer les scores de correspondance
    const matches: NotaryMatch[] = await Promise.all(
      notaries.map(async (notary) => {
        const matchScore = this.calculateMatchScore(notary, criteria);
        const distance = this.calculateDistance(notary, criteria);
        const availableSlots = await this.getAvailableSlots(notary.id);
        const estimatedCost = this.estimateCost(notary, 'acte_vente_simple');
        const reasons = this.generateMatchReasons(notary, criteria);

        return {
          notary,
          matchScore,
          distance,
          availableSlots,
          estimatedCost,
          reasons,
        };
      })
    );

    // Trier par score de correspondance
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calcule un score de correspondance (0-100)
   */
  private calculateMatchScore(notary: any, criteria: NotarySearchCriteria): number {
    let score = 50; // Score de base

    // Bonus pour la note
    if (notary.average_rating >= 4.5) score += 20;
    else if (notary.average_rating >= 4.0) score += 15;
    else if (notary.average_rating >= 3.5) score += 10;

    // Bonus pour le nombre de transactions
    if (notary.completed_transactions > 100) score += 15;
    else if (notary.completed_transactions > 50) score += 10;
    else if (notary.completed_transactions > 20) score += 5;

    // Bonus pour le taux de réponse
    if (notary.response_rate > 90) score += 10;
    else if (notary.response_rate > 75) score += 5;

    // Bonus pour les spécialités
    if (criteria.specialties) {
      const matchingSpecialties = criteria.specialties.filter(
        (s) => notary.specialties.includes(s)
      );
      score += matchingSpecialties.length * 5;
    }

    // Bonus pour les langues
    if (criteria.languages) {
      const matchingLanguages = criteria.languages.filter(
        (l) => notary.languages.includes(l)
      );
      score += matchingLanguages.length * 3;
    }

    return Math.min(100, score);
  }

  /**
   * Calcule la distance (si location fournie)
   */
  private calculateDistance(
    notary: any,
    criteria: NotarySearchCriteria
  ): number | undefined {
    if (!criteria.userLocation || !notary.latitude || !notary.longitude) {
      return undefined;
    }

    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(criteria.userLocation.latitude - notary.latitude);
    const dLon = this.toRad(criteria.userLocation.longitude - notary.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(notary.latitude)) *
      Math.cos(this.toRad(criteria.userLocation.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Récupère les créneaux disponibles du notaire
   */
  private async getAvailableSlots(notaryId: string): Promise<Date[]> {
    // Logique pour calculer les créneaux disponibles
    // basée sur les horaires et les rendez-vous existants
    const slots: Date[] = [];
    const now = new Date();

    // Pour l'exemple, retourner les 3 prochains jours ouvrables
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      // Ignorer week-ends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        date.setHours(10, 0, 0, 0);
        slots.push(new Date(date));
        
        date.setHours(14, 0, 0, 0);
        slots.push(new Date(date));
      }

      if (slots.length >= 6) break;
    }

    return slots;
  }

  /**
   * Estime le coût d'un service
   */
  private estimateCost(notary: any, serviceType: string): number {
    return notary.pricing[serviceType] || 500000; // Défaut
  }

  /**
   * Génère les raisons du matching
   */
  private generateMatchReasons(
    notary: any,
    criteria: NotarySearchCriteria
  ): string[] {
    const reasons: string[] = [];

    if (notary.average_rating >= 4.5) {
      reasons.push(`Excellente réputation (${notary.average_rating}/5)`);
    }

    if (notary.completed_transactions > 100) {
      reasons.push(`${notary.completed_transactions}+ transactions réalisées`);
    }

    if (notary.response_rate > 90) {
      reasons.push(`Répond en moins de ${notary.average_response_time}h`);
    }

    if (criteria.specialties?.some((s) => notary.specialties.includes(s))) {
      reasons.push('Spécialisé dans votre domaine');
    }

    return reasons;
  }

  /**
   * Réserve un rendez-vous avec un notaire
   */
  async bookAppointment(data: {
    notaryId: string;
    clientId: string;
    propertyId?: string;
    appointmentType: string;
    subject: string;
    description?: string;
    appointmentDate: Date;
    location: 'OFFICE' | 'ONLINE' | 'ON_SITE';
  }) {
    // Vérifier disponibilité
    const { data: conflicts } = await supabase
      .from('notary_appointments')
      .select('id')
      .eq('notary_id', data.notaryId)
      .eq('status', 'CONFIRMED')
      .gte('appointment_date', data.appointmentDate.toISOString())
      .lte(
        'appointment_date',
        new Date(data.appointmentDate.getTime() + 60 * 60 * 1000).toISOString()
      );

    if (conflicts && conflicts.length > 0) {
      throw new Error('Créneau déjà réservé');
    }

    // Créer le rendez-vous
    const { data: appointment, error } = await supabase
      .from('notary_appointments')
      .insert({
        ...data,
        appointment_date: data.appointmentDate.toISOString(),
        status: 'PENDING',
      })
      .select()
      .single();

    if (error) {
      throw new Error('Erreur lors de la création du rendez-vous');
    }

    // Envoyer notifications
    await this.sendAppointmentNotifications(appointment);

    return appointment;
  }

  /**
   * Envoie les notifications de rendez-vous
   */
  private async sendAppointmentNotifications(appointment: any) {
    // Notification au notaire
    // Notification au client
    // Email de confirmation
    // SMS de rappel (si activé)
  }
}

// Export singleton
export const notaryMatchingService = new NotaryMatchingService();
```

### 3.3 Composant React Native - Recherche de notaires

```typescript
// app/notaries/search.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Search, MapPin, Star, Award, Clock, ChevronRight } from 'lucide-react-native';
import { notaryMatchingService, NotaryMatch } from '../../lib/notary/matching-service';
import { useLocation } from '../../hooks/useLocation';

export default function NotarySearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<NotaryMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    searchNotaries();
  }, []);

  const searchNotaries = async () => {
    setLoading(true);
    try {
      const results = await notaryMatchingService.findMatches({
        cityId: 'abidjan',
        minRating: 4.0,
        userLocation: location
          ? { latitude: location.latitude, longitude: location.longitude }
          : undefined,
      });
      setMatches(results);
    } catch (error) {
      console.error('Erreur recherche notaires:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with Search */}
      <View className="bg-white px-4 pt-6 pb-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Trouvez votre notaire
        </Text>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Search size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Rechercher un notaire..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 -mx-4 px-4"
        >
          <TouchableOpacity className="bg-orange-100 px-4 py-2 rounded-full mr-2">
            <Text className="text-orange-700 font-medium">Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white border border-gray-200 px-4 py-2 rounded-full mr-2">
            <Text className="text-gray-700">⭐ 4.5+</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white border border-gray-200 px-4 py-2 rounded-full mr-2">
            <Text className="text-gray-700">Dispo aujourd'hui</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white border border-gray-200 px-4 py-2 rounded-full">
            <Text className="text-gray-700">À proximité</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results */}
      <View className="px-4 py-6 space-y-4">
        <Text className="text-sm font-medium text-gray-600">
          {matches.length} notaires disponibles
        </Text>

        {matches.map((match, index) => (
          <NotaryCard key={match.notary.id} match={match} rank={index + 1} />
        ))}
      </View>
    </ScrollView>
  );
}

// Composant Carte Notaire
function NotaryCard({ match, rank }: { match: NotaryMatch; rank: number }) {
  const { notary, matchScore, distance, estimatedCost, reasons } = match;

  return (
    <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm">
      {/* Header */}
      <View className="flex-row items-start mb-3">
        {/* Avatar */}
        <View className="relative">
          <Image
            source={{ uri: notary.user.avatar || 'https://via.placeholder.com/60' }}
            className="w-16 h-16 rounded-full"
          />
          {rank <= 3 && (
            <View className="absolute -top-1 -right-1 bg-orange-500 w-6 h-6 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">#{rank}</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View className="flex-1 ml-3">
          <Text className="text-lg font-bold text-gray-900">
            {notary.user.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-1">{notary.office_name}</Text>
          
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center">
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text className="text-sm font-semibold text-gray-700 ml-1">
                {notary.average_rating}
              </Text>
              <Text className="text-xs text-gray-500 ml-1">
                ({notary.total_reviews})
              </Text>
            </View>

            {distance && (
              <View className="flex-row items-center">
                <MapPin size={14} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-1">
                  {distance.toFixed(1)} km
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Match Score */}
        <View className="items-center">
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{
              backgroundColor:
                matchScore >= 80 ? '#10B981' : matchScore >= 60 ? '#3B82F6' : '#F59E0B',
            }}
          >
            <Text className="text-white font-bold">{matchScore}</Text>
          </View>
          <Text className="text-xs text-gray-500 mt-1">Match</Text>
        </View>
      </View>

      {/* Tags */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
      >
        {notary.specialties.map((specialty: string, index: number) => (
          <View
            key={index}
            className="bg-blue-50 px-3 py-1 rounded-full mr-2"
          >
            <Text className="text-xs text-blue-700">{specialty}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Reasons */}
      <View className="space-y-1 mb-4">
        {reasons.slice(0, 2).map((reason, index) => (
          <View key={index} className="flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
            <Text className="text-sm text-gray-700">{reason}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            <Clock size={14} color="#6B7280" />
            <Text className="text-xs text-gray-600 ml-1">
              Répond en {notary.average_response_time}h
            </Text>
          </View>
          <View className="flex-row items-center">
            <Award size={14} color="#6B7280" />
            <Text className="text-xs text-gray-600 ml-1">
              {notary.completed_transactions} transactions
            </Text>
          </View>
        </View>

        <TouchableOpacity className="flex-row items-center">
          <Text className="text-sm font-medium text-orange-600 mr-1">
            Contacter
          </Text>
          <ChevronRight size={16} color="#EA580C" />
        </TouchableOpacity>
      </View>

      {/* Estimated Cost */}
      <View className="mt-3 p-3 bg-amber-50 rounded-lg">
        <Text className="text-xs text-amber-900">
          À partir de{' '}
          <Text className="font-bold">
            {(estimatedCost / 1000).toFixed(0)}k FCFA
          </Text>{' '}
          pour un acte de vente
        </Text>
      </View>
    </TouchableOpacity>
  );
}
```

---

## 📊 BASE DE DONNÉES - Schéma complet Phase 1

```sql
-- ================================================
-- BAKRÔSUR - Phase 1 Database Schema
-- Modules: SIGFU, BakroScore, Notaires
-- ================================================

-- Table: sigfu_verifications
CREATE TABLE IF NOT EXISTS sigfu_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  title_number VARCHAR(100) NOT NULL,
  title_type VARCHAR(10) CHECK (title_type IN ('TF', 'ACD', 'ADU', 'AV')),
  
  -- Résultat vérification
  status VARCHAR(20) CHECK (status IN ('VERIFIED', 'INVALID', 'PENDING', 'ERROR')),
  verification_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Données SIGFU (JSON complet de l'API)
  sigfu_data JSONB,
  
  -- Score
  score INTEGER CHECK (score >= 0 AND score <= 100),
  
  -- Problèmes détectés
  issues TEXT[],
  
  -- Cache
  cache_hit BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sigfu_property ON sigfu_verifications(property_id);
CREATE INDEX idx_sigfu_title ON sigfu_verifications(title_number);
CREATE INDEX idx_sigfu_status ON sigfu_verifications(status);

-- Table: bakro_scores
CREATE TABLE IF NOT EXISTS bakro_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE UNIQUE,
  
  -- Score global
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  level VARCHAR(20) CHECK (level IN ('EXCELLENT', 'BON', 'MOYEN', 'FAIBLE')),
  color VARCHAR(7),
  
  -- Scores par catégorie
  juridique_score INTEGER DEFAULT 0,
  documents_score INTEGER DEFAULT 0,
  proprietaire_score INTEGER DEFAULT 0,
  propriete_score INTEGER DEFAULT 0,
  professionnels_score INTEGER DEFAULT 0,
  
  -- Détails complets (JSON)
  details JSONB NOT NULL,
  
  -- Recommandations
  recommendations TEXT[],
  
  -- Historique
  previous_score INTEGER,
  score_evolution INTEGER, -- Différence avec le score précédent
  
  -- Métadonnées
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bakroscore_property ON bakro_scores(property_id);
CREATE INDEX idx_bakroscore_level ON bakro_scores(level);
CREATE INDEX idx_bakroscore_score ON bakro_scores(total_score DESC);

-- Table: bakro_score_history
CREATE TABLE IF NOT EXISTS bakro_score_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  score INTEGER NOT NULL,
  level VARCHAR(20),
  details JSONB NOT NULL,
  
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_score_history_property ON bakro_score_history(property_id);
CREATE INDEX idx_score_history_date ON bakro_score_history(recorded_at DESC);

-- Fonction: Calculer automatiquement le BakroScore lors de la création/mise à jour
CREATE OR REPLACE FUNCTION calculate_bakro_score()
RETURNS TRIGGER AS $$
DECLARE
  v_score INTEGER;
  v_level VARCHAR(20);
BEGIN
  -- Logique de calcul (simplifiée ici, utiliser l'algorithme complet en production)
  v_score := 50; -- Base
  
  -- Bonus si titre vérifié
  IF NEW.title_verified = TRUE THEN
    v_score := v_score + 20;
  END IF;
  
  -- Bonus si KYC du propriétaire
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = NEW.owner_id 
    AND kyc_status = 'APPROVED'
  ) THEN
    v_score := v_score + 10;
  END IF;
  
  -- Déterminer le niveau
  IF v_score >= 80 THEN
    v_level := 'EXCELLENT';
  ELSIF v_score >= 60 THEN
    v_level := 'BON';
  ELSIF v_score >= 40 THEN
    v_level := 'MOYEN';
  ELSE
    v_level := 'FAIBLE';
  END IF;
  
  -- Insérer ou mettre à jour le score
  INSERT INTO bakro_scores (property_id, total_score, level, details)
  VALUES (NEW.id, v_score, v_level, '{}'::jsonb)
  ON CONFLICT (property_id) DO UPDATE
  SET 
    previous_score = bakro_scores.total_score,
    total_score = v_score,
    level = v_level,
    score_evolution = v_score - bakro_scores.total_score,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_calculate_bakro_score
AFTER INSERT OR UPDATE OF title_verified, title_verification_score
ON properties
FOR EACH ROW
EXECUTE FUNCTION calculate_bakro_score();

-- Vue: Propriétés avec score complet
CREATE OR REPLACE VIEW properties_with_score AS
SELECT 
  p.*,
  bs.total_score as bakro_score,
  bs.level as bakro_level,
  bs.color as bakro_color,
  bs.details as bakro_details,
  bs.recommendations as bakro_recommendations,
  sv.status as sigfu_status,
  sv.score as sigfu_score,
  sv.verification_date as sigfu_verification_date
FROM properties p
LEFT JOIN bakro_scores bs ON bs.property_id = p.id
LEFT JOIN sigfu_verifications sv ON sv.property_id = p.id;

-- Permissions RLS (Row Level Security)
ALTER TABLE sigfu_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bakro_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE bakro_score_history ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leurs propres vérifications
CREATE POLICY "Users can view their own verifications"
  ON sigfu_verifications FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

-- Policy: Les utilisateurs peuvent voir leurs propres scores
CREATE POLICY "Users can view their own scores"
  ON bakro_scores FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );

-- Policy: Tout le monde peut voir les scores des propriétés publiées
CREATE POLICY "Public can view published property scores"
  ON bakro_scores FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE status = 'PUBLISHED'
    )
  );
```

---

Voulez-vous que je continue avec :
1. Les fichiers backend (Edge Functions Supabase)
2. Les composants React Native restants
3. Le plan de tests et validation
4. Le planning détaillé semaine par semaine ?

Je peux tout créer dans des fichiers séparés prêts à l'emploi !

