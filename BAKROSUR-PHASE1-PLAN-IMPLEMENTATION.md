# 🚀 BAKRÔSUR - PHASE 1 : IMPLÉMENTATION DÉTAILLÉE
## Intégration SIGFU, BakroScore & Réseau de Notaires

**Date :** 3 novembre 2025  
**Version :** 1.0  
**Durée estimée :** 2 mois  
**Stack :** React Native (Expo) + Supabase + TypeScript

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Module 1 : Intégration SIGFU](#module-1--intégration-sigfu)
4. [Module 2 : Système BakroScore](#module-2--système-bakroscore)
5. [Module 3 : Réseau de Notaires](#module-3--réseau-de-notaires)
6. [Base de données](#base-de-données)
7. [Backend (API)](#backend-api)
8. [Frontend (React Native)](#frontend-react-native)
9. [Tests et validation](#tests-et-validation)
10. [Déploiement](#déploiement)
11. [Planning détaillé](#planning-détaillé)

---

## 🎯 VUE D'ENSEMBLE

### Objectifs Phase 1

Cette phase transforme Bakrosur en la **première plateforme immobilière certifiée par le gouvernement ivoirien**.

#### ✅ 3 Modules principaux

1. **Intégration SIGFU** (4 semaines)
   - Connexion à l'API gouvernementale
   - Vérification automatique des titres fonciers
   - Badge de certification sur les annonces
   - Cache intelligent pour performance

2. **Système BakroScore** (2 semaines)
   - Algorithme de notation (0-100)
   - Affichage visuel avec jauges
   - Détail des critères
   - Historique des scores

3. **Réseau de Notaires Partenaires** (2 semaines)
   - Annuaire de notaires certifiés
   - Système de prise de RDV
   - Messagerie sécurisée
   - Suivi des transactions

### Technologies utilisées

```typescript
// Stack technique
{
  frontend: "React Native (Expo) + TypeScript",
  backend: "Supabase (PostgreSQL) + Edge Functions",
  api: "SIGFU API (REST) + tRPC",
  cache: "Redis (Upstash)",
  monitoring: "Sentry + Mixpanel",
  maps: "expo-maps + react-native-maps",
  ui: "NativeWind (TailwindCSS)"
}
```

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                   BAKRÔSUR MOBILE APP                        │
│                  (React Native + Expo)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─── tRPC Client
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐         ┌──────────────┐
│   Supabase   │         │ Redis Cache  │
│  (Database)  │         │   (Upstash)  │
└──────────────┘         └──────────────┘
        │                         │
        └────────────┬────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Edge Functions (API)  │
        │    - SIGFU Proxy       │
        │    - BakroScore Calc   │
        │    - Notary Matching   │
        └────────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐         ┌──────────────┐
│  SIGFU API   │         │  Notary CRM  │
│ (Gouv. CI)   │         │   (Future)   │
└──────────────┘         └──────────────┘
```

### Flux de données

```typescript
// Exemple : Vérification d'un titre foncier

1. Utilisateur publie une annonce avec numéro ACD
   ↓
2. Frontend envoie requête tRPC
   ↓
3. Backend vérifie cache Redis
   ├─ HIT → Retourne résultat immédiat
   └─ MISS → Continue
   ↓
4. Appel API SIGFU (avec rate limiting)
   ↓
5. Stockage résultat dans cache + DB
   ↓
6. Calcul BakroScore automatique
   ↓
7. Mise à jour UI avec badge
```

---

## 📡 MODULE 1 : INTÉGRATION SIGFU

### Qu'est-ce que SIGFU ?

Le **Système Intégré de Gestion du Foncier Urbain** est la plateforme gouvernementale ivoirienne permettant de vérifier l'authenticité des titres fonciers.

### Architecture du module

```
┌─────────────────────────────────────────┐
│         SIGFU Integration Module        │
├─────────────────────────────────────────┤
│  1. API Client                          │
│  2. Cache Layer (Redis)                 │
│  3. Verification Service                │
│  4. Webhook Handler                     │
│  5. Rate Limiter                        │
└─────────────────────────────────────────┘
```

### 1.1 Configuration API SIGFU

#### Obtenir l'accès à l'API

**Démarches administratives :**

1. **Contacter le Ministère de la Construction**
   ```
   Ministère de la Construction, du Logement et de l'Urbanisme (MCLU)
   Adresse : Cité Administrative, Plateau, Abidjan
   Contact : contact@mclu.gouv.ci
   Téléphone : +225 20 21 XX XX
   ```

2. **Documents requis**
   - Statuts de l'entreprise Bakrosur
   - RCCM
   - Plan d'utilisation de l'API
   - Engagement de confidentialité
   - Assurance responsabilité civile

3. **Processus d'agrément** (3-6 semaines)
   - Dépôt du dossier
   - Étude de la demande
   - Validation par le MCLU
   - Signature convention
   - Obtention des credentials

#### Configuration technique

```typescript
// lib/sigfu/config.ts

export const SIGFU_CONFIG = {
  // Endpoints
  baseUrl: process.env.SIGFU_API_URL || 'https://api.sigfu.gouv.ci/v1',
  
  // Authentification
  apiKey: process.env.SIGFU_API_KEY,
  apiSecret: process.env.SIGFU_API_SECRET,
  
  // Rate limiting (imposé par SIGFU)
  maxRequestsPerMinute: 60,
  maxRequestsPerDay: 5000,
  
  // Timeouts
  timeout: 30000, // 30 secondes
  retryAttempts: 3,
  retryDelay: 2000, // 2 secondes
  
  // Cache
  cacheTTL: 24 * 60 * 60, // 24 heures
  cachePrefix: 'sigfu:',
  
  // Webhooks
  webhookSecret: process.env.SIGFU_WEBHOOK_SECRET,
  webhookUrl: `${process.env.APP_URL}/api/webhooks/sigfu`,
};

// Environnement variables à ajouter dans .env
/*
SIGFU_API_URL=https://api.sigfu.gouv.ci/v1
SIGFU_API_KEY=your_api_key
SIGFU_API_SECRET=your_api_secret
SIGFU_WEBHOOK_SECRET=your_webhook_secret
REDIS_URL=your_redis_url
*/
```

### 1.2 Client API SIGFU

```typescript
// lib/sigfu/client.ts

import axios, { AxiosInstance } from 'axios';
import { SIGFU_CONFIG } from './config';
import { createHash } from 'crypto';

export interface SIGFUTitleVerification {
  numero_acd: string;
  status: 'VALID' | 'INVALID' | 'PENDING' | 'LITIGE';
  proprietaire: {
    nom: string;
    type: 'PHYSIQUE' | 'MORALE';
    id_national?: string;
  };
  parcelle: {
    numero_ilot: string;
    numero_lot: string;
    superficie: number;
    localisation: {
      commune: string;
      quartier: string;
      ville: string;
    };
  };
  dates: {
    date_approbation: string;
    date_delivrance: string;
    date_derniere_mutation?: string;
  };
  charges?: {
    hypotheques: Array<{
      montant: number;
      creancier: string;
      date_inscription: string;
    }>;
    servitudes: string[];
  };
  litiges?: Array<{
    type: string;
    status: string;
    date_depot: string;
  }>;
  documents?: {
    plan_cadastral_url?: string;
    acd_pdf_url?: string;
  };
  score_fiabilite: number; // 0-100
  dernier_controle: string;
}

export class SIGFUClient {
  private client: AxiosInstance;
  private requestCount = 0;
  private requestResetTime = Date.now();

  constructor() {
    this.client = axios.create({
      baseURL: SIGFU_CONFIG.baseUrl,
      timeout: SIGFU_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SIGFU_CONFIG.apiKey,
      },
    });

    // Interceptor pour authentification
    this.client.interceptors.request.use(async (config) => {
      const timestamp = Date.now();
      const signature = this.generateSignature(config.url || '', timestamp);
      
      config.headers['X-Timestamp'] = timestamp.toString();
      config.headers['X-Signature'] = signature;
      
      return config;
    });

    // Interceptor pour rate limiting
    this.client.interceptors.request.use(async (config) => {
      await this.checkRateLimit();
      return config;
    });
  }

  /**
   * Génère une signature HMAC pour l'authentification
   */
  private generateSignature(url: string, timestamp: number): string {
    const message = `${url}${timestamp}${SIGFU_CONFIG.apiSecret}`;
    return createHash('sha256').update(message).digest('hex');
  }

  /**
   * Vérifie et applique le rate limiting
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset counter toutes les minutes
    if (now - this.requestResetTime > 60000) {
      this.requestCount = 0;
      this.requestResetTime = now;
    }

    // Vérifie la limite
    if (this.requestCount >= SIGFU_CONFIG.maxRequestsPerMinute) {
      const waitTime = 60000 - (now - this.requestResetTime);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
      this.requestResetTime = Date.now();
    }

    this.requestCount++;
  }

  /**
   * Vérifie un Arrêté de Concession Définitive (ACD)
   */
  async verifyACD(numeroACD: string): Promise<SIGFUTitleVerification> {
    try {
      const response = await this.client.get(`/titles/acd/${numeroACD}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new SIGFUError(
          error.response?.data?.message || 'Erreur API SIGFU',
          error.response?.status || 500
        );
      }
      throw error;
    }
  }

  /**
   * Vérifie un Titre Foncier (TF)
   */
  async verifyTF(numeroTF: string): Promise<SIGFUTitleVerification> {
    try {
      const response = await this.client.get(`/titles/tf/${numeroTF}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new SIGFUError(
          error.response?.data?.message || 'Erreur API SIGFU',
          error.response?.status || 500
        );
      }
      throw error;
    }
  }

  /**
   * Recherche par coordonnées géographiques
   */
  async searchByCoordinates(
    latitude: number,
    longitude: number,
    radius: number = 100
  ): Promise<SIGFUTitleVerification[]> {
    try {
      const response = await this.client.post('/search/coordinates', {
        latitude,
        longitude,
        radius,
      });
      return response.data.results;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new SIGFUError(
          error.response?.data?.message || 'Erreur API SIGFU',
          error.response?.status || 500
        );
      }
      throw error;
    }
  }

  /**
   * Vérifie si une parcelle a des litiges en cours
   */
  async checkLitiges(numeroACD: string): Promise<boolean> {
    const verification = await this.verifyACD(numeroACD);
    return (verification.litiges?.length || 0) > 0;
  }

  /**
   * Obtient l'historique des mutations d'une parcelle
   */
  async getMutationHistory(numeroACD: string): Promise<any[]> {
    try {
      const response = await this.client.get(`/titles/acd/${numeroACD}/history`);
      return response.data.mutations;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new SIGFUError(
          error.response?.data?.message || 'Erreur API SIGFU',
          error.response?.status || 500
        );
      }
      throw error;
    }
  }
}

export class SIGFUError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'SIGFUError';
  }
}

// Export singleton
export const sigfuClient = new SIGFUClient();
```

### 1.3 Service de vérification avec cache

```typescript
// lib/sigfu/verification-service.ts

import { sigfuClient, SIGFUTitleVerification } from './client';
import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';
import { SIGFU_CONFIG } from './config';

const redis = new Redis(process.env.REDIS_URL!);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export interface VerificationResult {
  property_id: string;
  title_number: string;
  title_type: 'ACD' | 'TF' | 'ADU' | 'AV';
  status: 'VERIFIED' | 'INVALID' | 'PENDING' | 'ERROR';
  sigfu_data?: SIGFUTitleVerification;
  verification_date: string;
  score: number;
  issues: string[];
  cache_hit: boolean;
}

export class SIGFUVerificationService {
  /**
   * Vérifie un titre foncier avec cache intelligent
   */
  async verifyTitle(
    propertyId: string,
    titleNumber: string,
    titleType: 'ACD' | 'TF' | 'ADU' | 'AV'
  ): Promise<VerificationResult> {
    // 1. Vérifier le cache
    const cached = await this.getFromCache(titleNumber);
    if (cached) {
      return {
        ...cached,
        property_id: propertyId,
        cache_hit: true,
      };
    }

    // 2. Vérifier via SIGFU API
    let sigfuData: SIGFUTitleVerification | undefined;
    let status: VerificationResult['status'] = 'PENDING';
    const issues: string[] = [];

    try {
      if (titleType === 'ACD') {
        sigfuData = await sigfuClient.verifyACD(titleNumber);
      } else if (titleType === 'TF') {
        sigfuData = await sigfuClient.verifyTF(titleNumber);
      } else {
        // ADU et AV ne sont pas vérifiables via SIGFU (système local)
        issues.push('Type de titre non vérifiable via SIGFU');
        status = 'INVALID';
      }

      if (sigfuData) {
        status = this.determineStatus(sigfuData);
        this.analyzeIssues(sigfuData, issues);
      }
    } catch (error) {
      console.error('Erreur vérification SIGFU:', error);
      status = 'ERROR';
      issues.push('Erreur lors de la vérification SIGFU');
    }

    // 3. Calculer le score
    const score = this.calculateScore(sigfuData, status, issues);

    // 4. Créer le résultat
    const result: VerificationResult = {
      property_id: propertyId,
      title_number: titleNumber,
      title_type: titleType,
      status,
      sigfu_data: sigfuData,
      verification_date: new Date().toISOString(),
      score,
      issues,
      cache_hit: false,
    };

    // 5. Enregistrer dans la DB et le cache
    await this.saveVerification(result);
    await this.saveToCache(titleNumber, result);

    return result;
  }

  /**
   * Détermine le statut basé sur les données SIGFU
   */
  private determineStatus(data: SIGFUTitleVerification): VerificationResult['status'] {
    if (data.status === 'LITIGE') return 'INVALID';
    if (data.status === 'PENDING') return 'PENDING';
    if (data.status === 'VALID' && data.score_fiabilite >= 80) return 'VERIFIED';
    return 'INVALID';
  }

  /**
   * Analyse les problèmes potentiels
   */
  private analyzeIssues(data: SIGFUTitleVerification, issues: string[]): void {
    if (data.litiges && data.litiges.length > 0) {
      issues.push(`${data.litiges.length} litige(s) en cours`);
    }

    if (data.charges?.hypotheques && data.charges.hypotheques.length > 0) {
      issues.push(`${data.charges.hypotheques.length} hypothèque(s) active(s)`);
    }

    if (data.score_fiabilite < 50) {
      issues.push('Score de fiabilité SIGFU faible');
    }

    const dernierControle = new Date(data.dernier_controle);
    const moisDepuisControle = 
      (Date.now() - dernierControle.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (moisDepuisControle > 12) {
      issues.push('Dernier contrôle SIGFU > 12 mois');
    }
  }

  /**
   * Calcule le score de vérification (0-100)
   */
  private calculateScore(
    data: SIGFUTitleVerification | undefined,
    status: VerificationResult['status'],
    issues: string[]
  ): number {
    if (!data || status === 'ERROR') return 0;
    if (status === 'INVALID') return 20;

    let score = data.score_fiabilite || 50;

    // Pénalités
    if (data.litiges && data.litiges.length > 0) score -= 30;
    if (data.charges?.hypotheques && data.charges.hypotheques.length > 0) score -= 15;

    // Bonus
    const dernierControle = new Date(data.dernier_controle);
    const moisDepuisControle = 
      (Date.now() - dernierControle.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (moisDepuisControle < 3) score += 10;
    if (data.documents?.plan_cadastral_url) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Récupère depuis le cache Redis
   */
  private async getFromCache(titleNumber: string): Promise<VerificationResult | null> {
    try {
      const key = `${SIGFU_CONFIG.cachePrefix}${titleNumber}`;
      const cached = await redis.get(key);
      
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Erreur cache Redis:', error);
    }
    
    return null;
  }

  /**
   * Sauvegarde dans le cache Redis
   */
  private async saveToCache(titleNumber: string, result: VerificationResult): Promise<void> {
    try {
      const key = `${SIGFU_CONFIG.cachePrefix}${titleNumber}`;
      await redis.setex(
        key,
        SIGFU_CONFIG.cacheTTL,
        JSON.stringify(result)
      );
    } catch (error) {
      console.error('Erreur sauvegarde cache:', error);
    }
  }

  /**
   * Enregistre la vérification dans Supabase
   */
  private async saveVerification(result: VerificationResult): Promise<void> {
    await supabase.from('sigfu_verifications').insert({
      property_id: result.property_id,
      title_number: result.title_number,
      title_type: result.title_type,
      status: result.status,
      sigfu_data: result.sigfu_data,
      verification_date: result.verification_date,
      score: result.score,
      issues: result.issues,
    });

    // Mettre à jour la propriété
    await supabase
      .from('properties')
      .update({
        title_verified: result.status === 'VERIFIED',
        title_verification_score: result.score,
        title_verification_date: result.verification_date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', result.property_id);
  }

  /**
   * Vérifie toutes les propriétés non vérifiées (tâche de fond)
   */
  async verifyPendingProperties(): Promise<void> {
    const { data: properties } = await supabase
      .from('properties')
      .select('id, title_number, title_type')
      .is('title_verified', null)
      .not('title_number', 'is', null)
      .limit(100);

    if (!properties) return;

    for (const property of properties) {
      try {
        await this.verifyTitle(
          property.id,
          property.title_number,
          property.title_type
        );
        
        // Pause pour respecter rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Erreur vérification ${property.id}:`, error);
      }
    }
  }
}

// Export singleton
export const verificationService = new SIGFUVerificationService();
```

### 1.4 Webhook Handler

```typescript
// api/webhooks/sigfu.ts

import { Request, Response } from 'express';
import { createHmac } from 'crypto';
import { SIGFU_CONFIG } from '../../lib/sigfu/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function handleSIGFUWebhook(req: Request, res: Response) {
  // 1. Vérifier la signature
  const signature = req.headers['x-sigfu-signature'] as string;
  const expectedSignature = createHmac('sha256', SIGFU_CONFIG.webhookSecret!)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. Traiter l'événement
  const event = req.body;

  try {
    switch (event.type) {
      case 'title.updated':
        await handleTitleUpdate(event.data);
        break;
      
      case 'title.litige_opened':
        await handleLitigeOpened(event.data);
        break;
      
      case 'title.litige_resolved':
        await handleLitigeResolved(event.data);
        break;
      
      default:
        console.log('Événement SIGFU non géré:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur traitement webhook SIGFU:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleTitleUpdate(data: any) {
  // Invalider le cache
  const redis = new Redis(process.env.REDIS_URL!);
  await redis.del(`${SIGFU_CONFIG.cachePrefix}${data.numero_titre}`);

  // Notifier les propriétaires concernés
  const { data: properties } = await supabase
    .from('properties')
    .select('id, owner_id')
    .eq('title_number', data.numero_titre);

  if (properties) {
    for (const property of properties) {
      await sendNotification(property.owner_id, {
        title: 'Mise à jour de votre titre foncier',
        body: 'Des modifications ont été détectées sur votre titre foncier.',
        data: { property_id: property.id },
      });
    }
  }
}

async function handleLitigeOpened(data: any) {
  // Marquer les propriétés concernées
  await supabase
    .from('properties')
    .update({
      title_verified: false,
      title_verification_score: 20,
      has_litige: true,
    })
    .eq('title_number', data.numero_titre);

  // Notifier immédiatement
  const { data: properties } = await supabase
    .from('properties')
    .select('id, owner_id')
    .eq('title_number', data.numero_titre);

  if (properties) {
    for (const property of properties) {
      await sendNotification(property.owner_id, {
        title: '⚠️ Alerte importante',
        body: 'Un litige a été ouvert concernant votre titre foncier.',
        data: { 
          property_id: property.id,
          priority: 'high',
        },
      });
    }
  }
}

async function handleLitigeResolved(data: any) {
  // Re-vérifier le titre
  const redis = new Redis(process.env.REDIS_URL!);
  await redis.del(`${SIGFU_CONFIG.cachePrefix}${data.numero_titre}`);

  await supabase
    .from('properties')
    .update({ has_litige: false })
    .eq('title_number', data.numero_titre);

  // Notifier la résolution
  const { data: properties } = await supabase
    .from('properties')
    .select('id, owner_id')
    .eq('title_number', data.numero_titre);

  if (properties) {
    for (const property of properties) {
      await sendNotification(property.owner_id, {
        title: '✅ Litige résolu',
        body: 'Le litige concernant votre titre foncier a été résolu.',
        data: { property_id: property.id },
      });
    }
  }
}

async function sendNotification(userId: string, notification: any) {
  // Implémentation via expo-notifications
  // À compléter selon votre système de notifications
}
```

---

## 🏆 MODULE 2 : SYSTÈME BAKROSCORE

### Qu'est-ce que le BakroScore ?

Le **BakroScore** est un score de confiance (0-100) qui évalue la fiabilité et la sécurité juridique d'une propriété.

### Architecture du module

```
┌─────────────────────────────────────────┐
│         BakroScore Calculator           │
├─────────────────────────────────────────┤
│  1. Scoring Engine                      │
│  2. Criteria Evaluator                  │
│  3. History Tracker                     │
│  4. Visual Components                   │
│  5. Real-time Updates                   │
└─────────────────────────────────────────┘
```

### 2.1 Algorithme de calcul

```typescript
// lib/bakroscore/calculator.ts

export interface BakroScoreCriteria {
  // Vérification juridique (40 points max)
  titleVerified: boolean;          // 20 pts
  titleType: 'TF' | 'ACD' | 'ADU' | 'AV'; // 10 pts
  noLitige: boolean;               // 10 pts

  // Documents (20 points max)
  hasDocuments: boolean;           // 5 pts
  documentsVerified: boolean;      // 10 pts
  documentsComplete: boolean;      // 5 pts

  // Propriétaire (20 points max)
  ownerKycVerified: boolean;       // 10 pts
  ownerHistory: number;            // 5 pts (années sur plateforme)
  ownerRating: number;             // 5 pts

  // Propriété (10 points max)
  hasPhotos: boolean;              // 2 pts
  hasVirtualTour: boolean;         // 3 pts
  propertyAge: number;             // 5 pts

  // Agent/Notaire (10 points max)
  agentVerified: boolean;          // 5 pts
  notaryInvolved: boolean;         // 5 pts
}

export interface BakroScoreResult {
  score: number;
  level: 'EXCELLENT' | 'BON' | 'MOYEN' | 'FAIBLE';
  color: string;
  details: {
    category: string;
    score: number;
    maxScore: number;
    items: Array<{
      criterion: string;
      achieved: boolean;
      points: number;
    }>;
  }[];
  recommendations: string[];
  lastCalculated: string;
}

export class BakroScoreCalculator {
  /**
   * Calcule le BakroScore complet
   */
  calculate(criteria: BakroScoreCriteria): BakroScoreResult {
    const details: BakroScoreResult['details'] = [
      this.calculateJuridique(criteria),
      this.calculateDocuments(criteria),
      this.calculateProprietaire(criteria),
      this.calculatePropriete(criteria),
      this.calculateProfessionnels(criteria),
    ];

    const totalScore = details.reduce((sum, cat) => sum + cat.score, 0);
    const level = this.determineLevel(totalScore);
    const recommendations = this.generateRecommendations(criteria, details);

    return {
      score: totalScore,
      level,
      color: this.getLevelColor(level),
      details,
      recommendations,
      lastCalculated: new Date().toISOString(),
    };
  }

  /**
   * Catégorie : Vérification Juridique (40 pts max)
   */
  private calculateJuridique(criteria: BakroScoreCriteria) {
    const items = [
      {
        criterion: 'Titre vérifié SIGFU',
        achieved: criteria.titleVerified,
        points: criteria.titleVerified ? 20 : 0,
      },
      {
        criterion: 'Type de titre sécurisé',
        achieved: ['TF', 'ACD'].includes(criteria.titleType),
        points: ['TF', 'ACD'].includes(criteria.titleType) ? 10 : 
                criteria.titleType === 'ADU' ? 5 : 0,
      },
      {
        criterion: 'Aucun litige en cours',
        achieved: criteria.noLitige,
        points: criteria.noLitige ? 10 : 0,
      },
    ];

    return {
      category: 'Vérification Juridique',
      score: items.reduce((sum, item) => sum + item.points, 0),
      maxScore: 40,
      items,
    };
  }

  /**
   * Catégorie : Documents (20 pts max)
   */
  private calculateDocuments(criteria: BakroScoreCriteria) {
    const items = [
      {
        criterion: 'Documents fournis',
        achieved: criteria.hasDocuments,
        points: criteria.hasDocuments ? 5 : 0,
      },
      {
        criterion: 'Documents vérifiés',
        achieved: criteria.documentsVerified,
        points: criteria.documentsVerified ? 10 : 0,
      },
      {
        criterion: 'Dossier complet',
        achieved: criteria.documentsComplete,
        points: criteria.documentsComplete ? 5 : 0,
      },
    ];

    return {
      category: 'Documents',
      score: items.reduce((sum, item) => sum + item.points, 0),
      maxScore: 20,
      items,
    };
  }

  /**
   * Catégorie : Propriétaire (20 pts max)
   */
  private calculateProprietaire(criteria: BakroScoreCriteria) {
    const historyPoints = Math.min(5, criteria.ownerHistory);
    const ratingPoints = Math.round((criteria.ownerRating / 5) * 5);

    const items = [
      {
        criterion: 'KYC vérifié',
        achieved: criteria.ownerKycVerified,
        points: criteria.ownerKycVerified ? 10 : 0,
      },
      {
        criterion: 'Ancienneté sur la plateforme',
        achieved: criteria.ownerHistory >= 1,
        points: historyPoints,
      },
      {
        criterion: 'Réputation propriétaire',
        achieved: criteria.ownerRating >= 4,
        points: ratingPoints,
      },
    ];

    return {
      category: 'Propriétaire',
      score: items.reduce((sum, item) => sum + item.points, 0),
      maxScore: 20,
      items,
    };
  }

  /**
   * Catégorie : Propriété (10 pts max)
   */
  private calculatePropriete(criteria: BakroScoreCriteria) {
    const agePoints = criteria.propertyAge <= 5 ? 5 : 
                     criteria.propertyAge <= 15 ? 3 : 1;

    const items = [
      {
        criterion: 'Photos disponibles',
        achieved: criteria.hasPhotos,
        points: criteria.hasPhotos ? 2 : 0,
      },
      {
        criterion: 'Visite virtuelle',
        achieved: criteria.hasVirtualTour,
        points: criteria.hasVirtualTour ? 3 : 0,
      },
      {
        criterion: 'Âge de la propriété',
        achieved: criteria.propertyAge <= 15,
        points: agePoints,
      },
    ];

    return {
      category: 'Propriété',
      score: items.reduce((sum, item) => sum + item.points, 0),
      maxScore: 10,
      items,
    };
  }

  /**
   * Catégorie : Professionnels (10 pts max)
   */
  private calculateProfessionnels(criteria: BakroScoreCriteria) {
    const items = [
      {
        criterion: 'Agent immobilier vérifié',
        achieved: criteria.agentVerified,
        points: criteria.agentVerified ? 5 : 0,
      },
      {
        criterion: 'Notaire impliqué',
        achieved: criteria.notaryInvolved,
        points: criteria.notaryInvolved ? 5 : 0,
      },
    ];

    return {
      category: 'Professionnels',
      score: items.reduce((sum, item) => sum + item.points, 0),
      maxScore: 10,
      items,
    };
  }

  /**
   * Détermine le niveau selon le score
   */
  private determineLevel(score: number): BakroScoreResult['level'] {
    if (score >= 80) return 'EXCELLENT';
    if (score >= 60) return 'BON';
    if (score >= 40) return 'MOYEN';
    return 'FAIBLE';
  }

  /**
   * Couleur selon le niveau
   */
  private getLevelColor(level: BakroScoreResult['level']): string {
    const colors = {
      EXCELLENT: '#10B981', // green-500
      BON: '#3B82F6',       // blue-500
      MOYEN: '#F59E0B',     // amber-500
      FAIBLE: '#EF4444',    // red-500
    };
    return colors[level];
  }

  /**
   * Génère des recommandations personnalisées
   */
  private generateRecommandations(
    criteria: BakroScoreCriteria,
    details: BakroScoreResult['details']
  ): string[] {
    const recommendations: string[] = [];

    // Juridique
    if (!criteria.titleVerified) {
      recommendations.push('🔒 Faites vérifier votre titre via SIGFU pour +20 pts');
    }
    if (!criteria.noLitige) {
      recommendations.push('⚠️ Résolvez les litiges en cours pour améliorer votre score');
    }

    // Documents
    if (!criteria.documentsComplete) {
      recommendations.push('📄 Complétez votre dossier documentaire pour +5 pts');
    }

    // Propriétaire
    if (!criteria.ownerKycVerified) {
      recommendations.push('✅ Validez votre KYC pour +10 pts');
    }

    // Propriété
    if (!criteria.hasVirtualTour) {
      recommendations.push('🏠 Ajoutez une visite virtuelle 360° pour +3 pts');
    }

    // Professionnels
    if (!criteria.notaryInvolved) {
      recommendations.push('⚖️ Impliquez un notaire certifié pour +5 pts');
    }

    return recommendations;
  }

  /**
   * Compare deux scores (pour l'historique)
   */
  compare(oldScore: BakroScoreResult, newScore: BakroScoreResult) {
    const difference = newScore.score - oldScore.score;
    return {
      difference,
      improved: difference > 0,
      message: difference > 0 
        ? `Score amélioré de ${difference} points 📈`
        : difference < 0
        ? `Score réduit de ${Math.abs(difference)} points 📉`
        : 'Score inchangé ➡️',
    };
  }
}

// Export singleton
export const scoreCalculator = new BakroScoreCalculator();
```

### 2.2 Composant React Native - BakroScore Display

```typescript
// components/BakroScore.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { ChevronRight, Info, TrendingUp } from 'lucide-react-native';
import { BakroScoreResult } from '../lib/bakroscore/calculator';

interface BakroScoreProps {
  score: BakroScoreResult;
  onDetailsPress?: () => void;
  showDetails?: boolean;
}

export const BakroScore: React.FC<BakroScoreProps> = ({
  score,
  onDetailsPress,
  showDetails = false,
}) => {
  return (
    <View className="bg-white rounded-xl p-6 shadow-md">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl font-bold text-gray-900">BakroScore</Text>
          <TouchableOpacity>
            <Info size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        {onDetailsPress && (
          <TouchableOpacity 
            onPress={onDetailsPress}
            className="flex-row items-center gap-1"
          >
            <Text className="text-blue-600 font-medium">Détails</Text>
            <ChevronRight size={20} color="#2563EB" />
          </TouchableOpacity>
        )}
      </View>

      {/* Score Circle */}
      <View className="items-center mb-6">
        <CircularProgress
          size={160}
          width={16}
          fill={score.score}
          tintColor={score.color}
          backgroundColor="#E5E7EB"
          rotation={0}
        >
          {() => (
            <View className="items-center">
              <Text className="text-5xl font-bold" style={{ color: score.color }}>
                {score.score}
              </Text>
              <Text className="text-base text-gray-600 mt-1">/ 100</Text>
              <Text 
                className="text-sm font-semibold mt-2"
                style={{ color: score.color }}
              >
                {score.level}
              </Text>
            </View>
          )}
        </CircularProgress>
      </View>

      {/* Categories Summary */}
      {showDetails && (
        <View className="space-y-3">
          {score.details.map((category, index) => (
            <View key={index} className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-700 flex-1">
                {category.category}
              </Text>
              <View className="flex-row items-center gap-2">
                <View className="bg-gray-100 rounded-full px-3 py-1">
                  <Text className="text-xs font-semibold text-gray-700">
                    {category.score}/{category.maxScore}
                  </Text>
                </View>
                <View 
                  className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden"
                >
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${(category.score / category.maxScore) * 100}%`,
                      backgroundColor: score.color,
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Top Recommendation */}
      {score.recommendations.length > 0 && (
        <View className="mt-6 p-4 bg-blue-50 rounded-lg">
          <View className="flex-row items-start gap-3">
            <TrendingUp size={20} color="#2563EB" />
            <View className="flex-1">
              <Text className="text-sm font-medium text-blue-900 mb-1">
                💡 Conseil principal
              </Text>
              <Text className="text-sm text-blue-700">
                {score.recommendations[0]}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Last Updated */}
      <Text className="text-xs text-gray-500 text-center mt-4">
        Dernière mise à jour : {new Date(score.lastCalculated).toLocaleDateString('fr-FR')}
      </Text>
    </View>
  );
};
```

Continuons avec le Module 3 et la suite. Voulez-vous que je continue ?

