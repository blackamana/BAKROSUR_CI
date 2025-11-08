export const BAKROSUR_WHATSAPP = '+2250748526392';
export const WHATSAPP_BUSINESS_HOURS = {
  start: '08:00',
  end: '20:00',
  timezone: 'Africa/Abidjan',
};

export function generatePropertyWhatsAppMessage(propertyTitle: string, propertyId: string, price: number): string {
  return `Bonjour, je suis intéressé(e) par la propriété suivante:\n\n📍 ${propertyTitle}\n💰 Prix: ${price.toLocaleString('fr-FR')} FCFA\n\nRéf: #${propertyId}\n\nPouvez-vous me donner plus d'informations?`;
}

export function generateAppointmentWhatsAppMessage(propertyTitle: string, date: string, time: string): string {
  return `Bonjour, je souhaite prendre rendez-vous pour visiter:\n\n📍 ${propertyTitle}\n📅 Date souhaitée: ${date}\n🕐 Heure souhaitée: ${time}\n\nMerci de confirmer la disponibilité.`;
}

export function generateGeneralInquiryWhatsAppMessage(): string {
  return `Bonjour, j'ai une question concernant vos services BAKRÔSUR. Pouvez-vous m'aider?`;
}
