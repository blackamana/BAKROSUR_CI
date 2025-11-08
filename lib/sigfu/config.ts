/**
 * BAKRÔSUR - Configuration SIGFU
 */

export const SIGFU_CONFIG = {
  baseUrl: process.env.SIGFU_API_URL || 'https://api.sigfu.gouv.ci/v1',
  apiKey: process.env.SIGFU_API_KEY || '',
  apiSecret: process.env.SIGFU_API_SECRET || '',
  maxRequestsPerMinute: 60,
  maxRequestsPerDay: 5000,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 2000,
  cacheTTL: 24 * 60 * 60,
  cachePrefix: 'sigfu:',
  webhookSecret: process.env.SIGFU_WEBHOOK_SECRET || '',
  webhookUrl: `${process.env.APP_URL}/api/webhooks/sigfu`,
} as const;

export const TitleTypes = {
  TF: 'Titre Foncier',
  ACD: 'Arrêté de Concession Définitive',
  ADU: 'Autorisation de Domaine Urbain',
  AV: 'Attestation Villageoise',
} as const;

export type TitleType = keyof typeof TitleTypes;