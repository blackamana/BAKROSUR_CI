/**
 * BAKRÔSUR - Configuration SIGFU
 * 
 * Configuration pour l'intégration avec l'API SIGFU
 * (Système Intégré de Gestion du Foncier Urbain)
 */

export const SIGFU_CONFIG = {
  // ========================================
  // ENDPOINTS API
  // ========================================
  baseUrl: process.env.SIGFU_API_URL || 'https://api.sigfu.gouv.ci/v1',
  
  // ========================================
  // AUTHENTIFICATION
  // ========================================
  apiKey: process.env.SIGFU_API_KEY!,
  apiSecret: process.env.SIGFU_API_SECRET!,
  
  // ========================================
  // RATE LIMITING (imposé par SIGFU)
  // ========================================
  maxRequestsPerMinute: 60,
  maxRequestsPerDay: 5000,
  
  // ========================================
  // TIMEOUTS & RETRY
  // ========================================
  timeout: 30000, // 30 secondes
  retryAttempts: 3,
  retryDelay: 2000, // 2 secondes entre chaque retry
  backoffMultiplier: 2, // Backoff exponentiel
  
  // ========================================
  // CACHE (Redis)
  // ========================================
  cacheTTL: 24 * 60 * 60, // 24 heures
  cachePrefix: 'sigfu:',
  cacheEnabled: process.env.NODE_ENV === 'production',
  
  // ========================================
  // WEBHOOKS
  // ========================================
  webhookSecret: process.env.SIGFU_WEBHOOK_SECRET!,
  webhookUrl: `${process.env.APP_URL}/api/webhooks/sigfu`,
  
  // ========================================
  // MONITORING
  // ========================================
  enableMetrics: true,
  enableLogging: process.env.NODE_ENV !== 'production',
  
  // ========================================
  // FEATURE FLAGS
  // ========================================
  features: {
    coordinateSearch: true, // Recherche par coordonnées GPS
    mutationHistory: true,  // Historique des mutations
    litigeCheck: true,      // Vérification des litiges
    documentDownload: true, // Téléchargement des documents
  },
} as const;

/**
 * Validation de la configuration
 */
export function validateSIGFUConfig() {
  const required = [
    'SIGFU_API_URL',
    'SIGFU_API_KEY',
    'SIGFU_API_SECRET',
    'SIGFU_WEBHOOK_SECRET',
    'REDIS_URL',
    'APP_URL',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Configuration SIGFU incomplète. Variables manquantes: ${missing.join(', ')}\n\n` +
      `Veuillez les ajouter dans votre fichier .env:\n` +
      missing.map(key => `${key}=`).join('\n')
    );
  }

  console.log('✅ Configuration SIGFU validée');
}

/**
 * Types de titres fonciers supportés
 */
export const TitleTypes = {
  TF: 'Titre Foncier',
  ACD: 'Arrêté de Concession Définitive',
  ADU: 'Autorisation de Domaine Urbain',
  AV: 'Attestation Villageoise',
} as const;

export type TitleType = keyof typeof TitleTypes;

/**
 * Statuts de vérification
 */
export const VerificationStatuses = {
  VALID: 'Valide',
  INVALID: 'Invalide',
  PENDING: 'En attente',
  LITIGE: 'Litige en cours',
  EXPIRED: 'Expiré',
  NOT_FOUND: 'Non trouvé',
} as const;

export type VerificationStatus = keyof typeof VerificationStatuses;

/**
 * Messages d'erreur localisés
 */
export const ErrorMessages = {
  RATE_LIMIT_EXCEEDED: 'Limite de requêtes dépassée. Veuillez réessayer dans quelques instants.',
  INVALID_CREDENTIALS: 'Identifiants API SIGFU invalides',
  NETWORK_ERROR: 'Erreur de connexion à l\'API SIGFU',
  TITLE_NOT_FOUND: 'Numéro de titre introuvable dans la base SIGFU',
  INVALID_TITLE_FORMAT: 'Format de numéro de titre invalide',
  SERVICE_UNAVAILABLE: 'Service SIGFU temporairement indisponible',
  TIMEOUT: 'Délai d\'attente dépassé',
} as const;

export type ErrorMessage = keyof typeof ErrorMessages;
