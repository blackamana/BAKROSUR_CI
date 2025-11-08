export type WorkType = 'CONSTRUCTION' | 'RENOVATION' | 'PEINTURE' | 'PLOMBERIE' | 'ELECTRICITE' | 'MACONNERIE' | 'MENUISERIE' | 'CARRELAGE';
export type WorkStatus = 'PUBLIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
export type WorkUrgency = 'URGENTE' | 'NORMALE' | 'PLANIFIEE';

export interface ConstructionWork {
  id: string;
  title: string;
  description: string;
  workType: WorkType;
  budget: number;
  budgetMax?: number;
  cityId: string;
  cityName: string;
  neighborhoodId: string;
  neighborhoodName: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: WorkStatus;
  urgency: WorkUrgency;
  startDate?: string;
  endDate?: string;
  contactName: string;
  contactPhone: string;
  featured: boolean;
  createdAt: string;
  requiredSkills?: string[];
  surface?: number;
}

export const WORK_TYPES: { value: WorkType; label: string; emoji: string }[] = [
  { value: 'CONSTRUCTION', label: 'Construction', emoji: '🏗️' },
  { value: 'RENOVATION', label: 'Rénovation', emoji: '🔨' },
  { value: 'PEINTURE', label: 'Peinture', emoji: '🎨' },
  { value: 'PLOMBERIE', label: 'Plomberie', emoji: '🚰' },
  { value: 'ELECTRICITE', label: 'Électricité', emoji: '⚡' },
  { value: 'MACONNERIE', label: 'Maçonnerie', emoji: '🧱' },
  { value: 'MENUISERIE', label: 'Menuiserie', emoji: '🪚' },
  { value: 'CARRELAGE', label: 'Carrelage', emoji: '🔲' },
];

export const CONSTRUCTION_WORKS: ConstructionWork[] = [
  {
    id: '1',
    title: 'Construction villa 4 pièces',
    description: 'Recherche entrepreneur sérieux pour construction villa moderne 4 chambres à Cocody. Terrain de 400m², plans disponibles. Budget 45M FCFA. Délai souhaité : 8 mois.',
    workType: 'CONSTRUCTION',
    budget: 45000000,
    budgetMax: 50000000,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    latitude: 5.3473,
    longitude: -3.9856,
    images: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
    ],
    status: 'PUBLIE',
    urgency: 'NORMALE',
    startDate: '2025-03-01',
    contactName: 'Kouadio Michel',
    contactPhone: '+225 07 12 34 56 78',
    featured: true,
    createdAt: '2025-01-20T10:00:00Z',
    requiredSkills: ['Maçonnerie', 'Gros œuvre', 'Second œuvre'],
    surface: 200,
  },
  {
    id: '2',
    title: 'Rénovation complète appartement',
    description: 'Appartement 3 pièces à rénover entièrement à Marcory. Peinture, plomberie, électricité, carrelage. Budget 8M FCFA. Travaux à démarrer rapidement.',
    workType: 'RENOVATION',
    budget: 8000000,
    budgetMax: 10000000,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '3',
    neighborhoodName: 'Marcory',
    latitude: 5.3273,
    longitude: -4.0156,
    images: [
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
    ],
    status: 'PUBLIE',
    urgency: 'URGENTE',
    startDate: '2025-02-01',
    endDate: '2025-04-01',
    contactName: 'Adjoua Marie',
    contactPhone: '+225 05 98 76 54 32',
    featured: true,
    createdAt: '2025-01-19T14:30:00Z',
    requiredSkills: ['Peinture', 'Plomberie', 'Électricité', 'Carrelage'],
    surface: 120,
  },
  {
    id: '3',
    title: 'Peinture extérieure villa',
    description: 'Peinture complète extérieure d\'une villa à Riviera. Murs et portail à peindre. Préparation des surfaces nécessaire. Budget 2M FCFA.',
    workType: 'PEINTURE',
    budget: 2000000,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    latitude: 5.3512,
    longitude: -3.9723,
    images: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800',
    ],
    status: 'PUBLIE',
    urgency: 'NORMALE',
    startDate: '2025-02-15',
    contactName: 'Koné Ibrahim',
    contactPhone: '+225 01 23 45 67 89',
    featured: false,
    createdAt: '2025-01-18T09:15:00Z',
    requiredSkills: ['Peinture extérieure'],
    surface: 300,
  },
  {
    id: '4',
    title: 'Réparation plomberie urgente',
    description: 'Fuites importantes dans villa à Yopougon. Besoin d\'un plombier qualifié en urgence pour diagnostic et réparations. Budget flexible.',
    workType: 'PLOMBERIE',
    budget: 500000,
    budgetMax: 1000000,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '4',
    neighborhoodName: 'Yopougon',
    latitude: 5.3393,
    longitude: -4.0858,
    images: [],
    status: 'PUBLIE',
    urgency: 'URGENTE',
    contactName: 'Diabaté Fatou',
    contactPhone: '+225 07 65 43 21 09',
    featured: false,
    createdAt: '2025-01-21T16:45:00Z',
    requiredSkills: ['Plomberie'],
  },
  {
    id: '5',
    title: 'Installation électrique complète',
    description: 'Nouvelle construction nécessitant installation électrique complète à Bingerville. Tableau électrique, câblage, prises, éclairage. Budget 5M FCFA.',
    workType: 'ELECTRICITE',
    budget: 5000000,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '10',
    neighborhoodName: 'Bingerville',
    latitude: 5.3583,
    longitude: -3.8919,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
    ],
    status: 'PUBLIE',
    urgency: 'NORMALE',
    startDate: '2025-03-15',
    contactName: 'Touré Amadou',
    contactPhone: '+225 05 11 22 33 44',
    featured: false,
    createdAt: '2025-01-17T11:20:00Z',
    requiredSkills: ['Électricité', 'Installation électrique'],
    surface: 180,
  },
  {
    id: '6',
    title: 'Carrelage salon et chambres',
    description: 'Pose de carrelage 60x60 dans salon et 3 chambres. Surface totale 100m². Carrelage fourni. Recherche carreleur expérimenté. Budget 1.5M FCFA.',
    workType: 'CARRELAGE',
    budget: 1500000,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '3',
    neighborhoodName: 'Marcory',
    latitude: 5.3273,
    longitude: -4.0156,
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
    ],
    status: 'PUBLIE',
    urgency: 'PLANIFIEE',
    startDate: '2025-04-01',
    endDate: '2025-04-15',
    contactName: 'Bamba Sylvie',
    contactPhone: '+225 07 99 88 77 66',
    featured: false,
    createdAt: '2025-01-16T08:30:00Z',
    requiredSkills: ['Carrelage', 'Pose de carrelage'],
    surface: 100,
  },
];
