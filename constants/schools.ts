export type SchoolType = 'MATERNELLE' | 'PRIMAIRE' | 'COLLEGE' | 'LYCEE' | 'UNIVERSITE' | 'FORMATION';
export type SchoolCategory = 'PUBLIC' | 'PRIVE' | 'INTERNATIONAL';

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  category: SchoolCategory;
  neighborhoodId: string;
  neighborhoodName: string;
  address: string;
  description: string;
  rating: number;
  tuitionFees?: {
    min: number;
    max: number;
    currency: 'FCFA';
  };
  languages: string[];
  hasTransport: boolean;
  hasCantine: boolean;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  website?: string;
}

export const SCHOOLS: School[] = [
  {
    id: 'S1',
    name: 'Lycée Classique d\'Abidjan',
    type: 'LYCEE',
    category: 'PUBLIC',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Boulevard Latrille, Cocody',
    description: 'Établissement d\'excellence, l\'un des meilleurs lycées publics de Côte d\'Ivoire',
    rating: 4.5,
    languages: ['Français'],
    hasTransport: false,
    hasCantine: true,
    latitude: 5.3473,
    longitude: -3.9856,
    phoneNumber: '+2252721234567',
  },
  {
    id: 'S2',
    name: 'Cours Lumière',
    type: 'PRIMAIRE',
    category: 'PRIVE',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Angré 8ème tranche',
    description: 'École primaire privée de renom avec programme français',
    rating: 4.8,
    tuitionFees: {
      min: 1500000,
      max: 2500000,
      currency: 'FCFA',
    },
    languages: ['Français', 'Anglais'],
    hasTransport: true,
    hasCantine: true,
    latitude: 5.3600,
    longitude: -3.9700,
    phoneNumber: '+2252722345678',
    website: 'https://courslumiere.ci',
  },
  {
    id: 'S3',
    name: 'International Community School',
    type: 'LYCEE',
    category: 'INTERNATIONAL',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Riviera Palmeraie',
    description: 'École internationale avec programme américain IB',
    rating: 4.9,
    tuitionFees: {
      min: 5000000,
      max: 8000000,
      currency: 'FCFA',
    },
    languages: ['Anglais', 'Français'],
    hasTransport: true,
    hasCantine: true,
    latitude: 5.3512,
    longitude: -3.9723,
    phoneNumber: '+2252723456789',
    website: 'https://ics.ci',
  },
  {
    id: 'S4',
    name: 'Groupe Scolaire Sainte-Marie',
    type: 'COLLEGE',
    category: 'PRIVE',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Cocody II Plateaux',
    description: 'Collège catholique de très bonne réputation',
    rating: 4.6,
    tuitionFees: {
      min: 800000,
      max: 1200000,
      currency: 'FCFA',
    },
    languages: ['Français', 'Anglais'],
    hasTransport: true,
    hasCantine: true,
    latitude: 5.3550,
    longitude: -3.9800,
    phoneNumber: '+2252724567890',
  },
  {
    id: 'S5',
    name: 'Université Félix Houphouët-Boigny',
    type: 'UNIVERSITE',
    category: 'PUBLIC',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Cocody, Boulevard Latrille',
    description: 'Plus grande université de Côte d\'Ivoire',
    rating: 4.0,
    languages: ['Français'],
    hasTransport: false,
    hasCantine: true,
    latitude: 5.3470,
    longitude: -3.9900,
    phoneNumber: '+2252725678901',
    website: 'https://univ-fhb.edu.ci',
  },
  {
    id: 'S6',
    name: 'École Primaire Publique Marcory Zone 4',
    type: 'PRIMAIRE',
    category: 'PUBLIC',
    neighborhoodId: '3',
    neighborhoodName: 'Marcory',
    address: 'Marcory Zone 4',
    description: 'École primaire publique de quartier',
    rating: 3.5,
    languages: ['Français'],
    hasTransport: false,
    hasCantine: true,
    latitude: 5.3273,
    longitude: -4.0156,
  },
  {
    id: 'S7',
    name: 'Complexe Scolaire Les Perles',
    type: 'PRIMAIRE',
    category: 'PRIVE',
    neighborhoodId: '4',
    neighborhoodName: 'Yopougon',
    address: 'Yopougon Siporex',
    description: 'École primaire privée accessible avec bon programme',
    rating: 4.0,
    tuitionFees: {
      min: 400000,
      max: 800000,
      currency: 'FCFA',
    },
    languages: ['Français'],
    hasTransport: true,
    hasCantine: true,
    latitude: 5.3393,
    longitude: -4.0858,
    phoneNumber: '+2252727890123',
  },
  {
    id: 'S8',
    name: 'Lycée Technique d\'Abidjan',
    type: 'LYCEE',
    category: 'PUBLIC',
    neighborhoodId: '5',
    neighborhoodName: 'Adjamé',
    address: 'Adjamé Liberté',
    description: 'Lycée technique formant aux métiers industriels',
    rating: 3.8,
    languages: ['Français'],
    hasTransport: false,
    hasCantine: true,
    latitude: 5.3540,
    longitude: -4.0210,
  },
  {
    id: 'S9',
    name: 'Centre de Formation Professionnelle',
    type: 'FORMATION',
    category: 'PUBLIC',
    neighborhoodId: '6',
    neighborhoodName: 'Treichville',
    address: 'Treichville Zone 3',
    description: 'Formation professionnelle en électricité, plomberie, mécanique',
    rating: 3.9,
    languages: ['Français'],
    hasTransport: false,
    hasCantine: false,
    latitude: 5.3044,
    longitude: -4.0096,
  },
  {
    id: 'S10',
    name: 'Collège Moderne de Koumassi',
    type: 'COLLEGE',
    category: 'PRIVE',
    neighborhoodId: '7',
    neighborhoodName: 'Koumassi',
    address: 'Koumassi Grand Carrefour',
    description: 'Collège privé avec bon taux de réussite au BEPC',
    rating: 4.1,
    tuitionFees: {
      min: 500000,
      max: 900000,
      currency: 'FCFA',
    },
    languages: ['Français'],
    hasTransport: true,
    hasCantine: true,
    latitude: 5.2903,
    longitude: -3.9503,
    phoneNumber: '+2252729012345',
  },
];

export function getSchoolsByNeighborhood(neighborhoodId: string): School[] {
  return SCHOOLS.filter((s) => s.neighborhoodId === neighborhoodId);
}

export function getSchoolsByType(type: SchoolType): School[] {
  return SCHOOLS.filter((s) => s.type === type);
}

export function getSchoolsByCategory(category: SchoolCategory): School[] {
  return SCHOOLS.filter((s) => s.category === category);
}

export function getAffordableSchools(maxBudget: number): School[] {
  return SCHOOLS.filter((s) => !s.tuitionFees || s.tuitionFees.min <= maxBudget);
}
