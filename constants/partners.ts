export type PartnerCategory = 'BANQUE' | 'ASSURANCE' | 'NOTAIRE' | 'EXPERT' | 'ARCHITECTE' | 'AVOCAT';

export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  logo?: string;
  active: boolean;
  featured: boolean;
}

export const PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'SGBCI',
    category: 'BANQUE',
    description: 'Société Générale de Banques en Côte d\'Ivoire - Financement immobilier',
    website: 'https://www.sgbci.ci',
    phone: '+225 27 20 22 20 00',
    email: 'contact@sgbci.ci',
    active: true,
    featured: true,
  },
  {
    id: '2',
    name: 'BICICI',
    category: 'BANQUE',
    description: 'Banque Internationale pour le Commerce et l\'Industrie de Côte d\'Ivoire',
    website: 'https://www.bicici.com',
    phone: '+225 27 20 20 00 00',
    email: 'contact@bicici.com',
    active: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Ecobank CI',
    category: 'BANQUE',
    description: 'Prêts immobiliers et crédits habitation',
    website: 'https://www.ecobank.com/ci',
    phone: '+225 27 20 31 20 00',
    email: 'contact@ecobank.com',
    active: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Loyale Assurances',
    category: 'ASSURANCE',
    description: 'Assurance habitation et garantie décennale',
    website: 'https://www.loyale-assurances.ci',
    phone: '+225 27 20 22 50 00',
    email: 'contact@loyale-assurances.ci',
    active: true,
    featured: true,
  },
  {
    id: '5',
    name: 'NSIA Assurances',
    category: 'ASSURANCE',
    description: 'Protection complète de vos biens immobiliers',
    website: 'https://www.nsia.com',
    phone: '+225 27 20 25 00 00',
    email: 'contact@nsia.com',
    active: true,
    featured: true,
  },
  {
    id: '6',
    name: 'Maître Kouassi Jean',
    category: 'NOTAIRE',
    description: 'Notaire spécialisé en transactions immobilières',
    phone: '+225 07 87 65 43 21',
    email: 'kouassi.notaire@ci.com',
    active: true,
    featured: true,
  },
  {
    id: '7',
    name: 'Étude Notariale Yao',
    category: 'NOTAIRE',
    description: 'Rédaction d\'actes et conseil juridique immobilier',
    phone: '+225 07 88 77 66 55',
    email: 'etude.yao@notaire.ci',
    active: true,
    featured: true,
  },
  {
    id: '8',
    name: 'Cabinet D\'Expertise Koné',
    category: 'EXPERT',
    description: 'Évaluation et expertise immobilière certifiée',
    phone: '+225 07 89 99 88 77',
    email: 'expert.kone@ci.com',
    active: true,
    featured: true,
  },
  {
    id: '9',
    name: 'Bureau d\'Études ARCH-CI',
    category: 'ARCHITECTE',
    description: 'Architecture et maîtrise d\'œuvre',
    website: 'https://www.arch-ci.com',
    phone: '+225 07 90 11 22 33',
    email: 'contact@arch-ci.com',
    active: true,
    featured: true,
  },
  {
    id: '10',
    name: 'Cabinet Traoré & Associés',
    category: 'AVOCAT',
    description: 'Droit immobilier et contentieux foncier',
    phone: '+225 07 91 22 33 44',
    email: 'traore.avocat@ci.com',
    active: true,
    featured: true,
  },
  {
    id: '11',
    name: 'BACI',
    category: 'BANQUE',
    description: 'Banque Atlantique Côte d\'Ivoire - Solutions de financement',
    website: 'https://www.baci.ci',
    phone: '+225 27 20 32 00 00',
    email: 'contact@baci.ci',
    active: true,
    featured: false,
  },
  {
    id: '12',
    name: 'AXA Assurances CI',
    category: 'ASSURANCE',
    description: 'Leader de l\'assurance en Côte d\'Ivoire',
    website: 'https://www.axa-ci.com',
    phone: '+225 27 20 33 00 00',
    email: 'contact@axa-ci.com',
    active: true,
    featured: false,
  },
  {
    id: '13',
    name: 'SAHAM Assurances',
    category: 'ASSURANCE',
    description: 'Assurance tous risques habitation',
    website: 'https://www.saham.ci',
    phone: '+225 27 20 34 00 00',
    email: 'contact@saham.ci',
    active: true,
    featured: false,
  },
  {
    id: '14',
    name: 'Maître Diallo Mamadou',
    category: 'NOTAIRE',
    description: 'Spécialiste en droit foncier ivoirien',
    phone: '+225 07 92 33 44 55',
    email: 'diallo.notaire@ci.com',
    active: true,
    featured: false,
  },
  {
    id: '15',
    name: 'Cabinet Expert-Immo CI',
    category: 'EXPERT',
    description: 'Diagnostic et audit immobilier',
    phone: '+225 07 93 44 55 66',
    email: 'expert-immo@ci.com',
    active: true,
    featured: false,
  },
];

export const getPartnersByCategory = (category: PartnerCategory): Partner[] => {
  return PARTNERS.filter((p) => p.category === category && p.active);
};

export const getFeaturedPartners = (): Partner[] => {
  return PARTNERS.filter((p) => p.featured && p.active);
};
