export type SMSNotificationType = 
  | 'PROPERTY_ALERT' 
  | 'APPOINTMENT_CONFIRMATION' 
  | 'APPOINTMENT_REMINDER' 
  | 'PAYMENT_SUCCESS' 
  | 'PAYMENT_FAILED'
  | 'VERIFICATION_STATUS'
  | 'NEW_MESSAGE'
  | 'PRICE_DROP';

export interface SMSNotification {
  id: string;
  phoneNumber: string;
  message: string;
  type: SMSNotificationType;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED';
  sentAt?: string;
  deliveredAt?: string;
  propertyId?: string;
  userId?: string;
  createdAt: string;
}

export interface SMSPreferences {
  propertyAlerts: boolean;
  appointmentReminders: boolean;
  paymentNotifications: boolean;
  verificationUpdates: boolean;
  messageNotifications: boolean;
  priceDropAlerts: boolean;
}

export const DEFAULT_SMS_PREFERENCES: SMSPreferences = {
  propertyAlerts: true,
  appointmentReminders: true,
  paymentNotifications: true,
  verificationUpdates: true,
  messageNotifications: false,
  priceDropAlerts: true,
};

export const SMS_PROVIDER_INFO = {
  name: 'Orange SMS CI',
  apiUrl: 'https://api.orange.com/smsmessaging/v1',
  maxLength: 160,
  costPerSMS: 10,
  currency: 'FCFA',
};

export function formatSMSMessage(type: SMSNotificationType, data: Record<string, string>): string {
  const templates: Record<SMSNotificationType, string> = {
    PROPERTY_ALERT: `BAKRÔSUR: Nouvelle propriété à ${data.location}! ${data.title} - ${data.price} FCFA. Voir: ${data.url}`,
    APPOINTMENT_CONFIRMATION: `BAKRÔSUR: Rendez-vous confirmé le ${data.date} à ${data.time} pour ${data.propertyTitle}. Contact: ${data.phone}`,
    APPOINTMENT_REMINDER: `BAKRÔSUR: Rappel - Rendez-vous demain à ${data.time} pour ${data.propertyTitle}. Prêt?`,
    PAYMENT_SUCCESS: `BAKRÔSUR: Paiement de ${data.amount} FCFA réussi via ${data.provider}. Réf: ${data.ref}`,
    PAYMENT_FAILED: `BAKRÔSUR: Échec du paiement ${data.amount} FCFA. Veuillez réessayer ou contacter le support.`,
    VERIFICATION_STATUS: `BAKRÔSUR: ${data.status} - ${data.message}. Voir détails dans l'app.`,
    NEW_MESSAGE: `BAKRÔSUR: Nouveau message de ${data.sender}. Ouvrez l'app pour répondre.`,
    PRICE_DROP: `BAKRÔSUR: Baisse de prix! ${data.propertyTitle} maintenant ${data.newPrice} FCFA (était ${data.oldPrice} FCFA)`,
  };

  return templates[type];
}

export function validatePhoneNumber(phoneNumber: string): boolean {
  const ivorianPattern = /^(\+225|00225|0)?[0-9]{10}$/;
  return ivorianPattern.test(phoneNumber.replace(/\s/g, ''));
}

export function normalizePhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\s/g, '');
  
  if (cleaned.startsWith('+225')) {
    return cleaned;
  } else if (cleaned.startsWith('00225')) {
    return '+' + cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    return '+225' + cleaned;
  } else if (cleaned.length === 10) {
    return '+225' + cleaned;
  }
  
  return cleaned;
}
