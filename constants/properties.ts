export type PropertyType = 'MAISON' | 'APPARTEMENT' | 'TERRAIN' | 'COMMERCE' | 'BUREAU';
export type TransactionType = 'VENTE' | 'LOCATION';
export type PropertyStatus = 'PUBLIE' | 'BROUILLON' | 'EN_TRANSACTION' | 'VENDU' | 'LOUE';
export type LegalStatus = 'TF' | 'ACD' | 'ADU' | 'AV';
export type DocumentType = 'TF' | 'PHOTOS' | 'PLANS' | 'CADASTRE' | 'NOTAIRE';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  surfaceArea: number;
  bedrooms?: number;
  bathrooms?: number;
  cityId: string;
  cityName: string;
  neighborhoodId: string;
  neighborhoodName: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: PropertyStatus;
  pricePerSqm: number;
  featured: boolean;
  createdAt: string;
  legalStatus?: LegalStatus;
  availableDocuments?: DocumentType[];
  videoUrl?: string;
  virtual360Url?: string;
  hasGenerator?: boolean;
  hasWaterBorehole?: boolean;
  isLandToBuild?: boolean;
  nearMainRoad?: boolean;
}

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Villa Moderne à Cocody',
    description: 'Magnifique villa contemporaine avec piscine, jardin tropical et vue panoramique. Située dans un quartier résidentiel prisé de Cocody, cette propriété offre 4 chambres spacieuses avec climatisation, salon lumineux avec baie vitrée, cuisine équipée américaine et garage double.',
    type: 'MAISON',
    transactionType: 'VENTE',
    price: 85000000,
    surfaceArea: 350,
    bedrooms: 4,
    bathrooms: 3,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    latitude: 5.3473,
    longitude: -3.9856,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    status: 'PUBLIE',
    pricePerSqm: 242857,
    featured: true,
    createdAt: '2025-01-15T10:00:00Z',
    legalStatus: 'TF',
    availableDocuments: ['TF', 'PHOTOS', 'PLANS', 'CADASTRE'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    virtual360Url: 'https://example.com/virtual-tour/1',
    hasGenerator: true,
    hasWaterBorehole: true,
    nearMainRoad: true,
  },
  {
    id: '2',
    title: 'Appartement Standing Marcory Zone 4',
    description: 'Appartement haut standing dans résidence sécurisée avec gardiennage 24h/24. 3 chambres climatisées, salon spacieux, cuisine moderne entièrement équipée, balcon avec vue sur la lagune. Parking privé, ascenseur, groupe électrogène.',
    type: 'APPARTEMENT',
    transactionType: 'LOCATION',
    price: 350000,
    surfaceArea: 120,
    bedrooms: 3,
    bathrooms: 2,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '3',
    neighborhoodName: 'Marcory',
    latitude: 5.3273,
    longitude: -4.0156,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    status: 'PUBLIE',
    pricePerSqm: 2917,
    featured: true,
    createdAt: '2025-01-14T14:30:00Z',
    legalStatus: 'ACD',
    availableDocuments: ['PHOTOS', 'PLANS'],
  },
  {
    id: '3',
    title: 'Terrain Viabilisé Bingerville',
    description: 'Terrain plat et viabilisé de 500m² dans zone résidentielle calme de Bingerville. Accès eau, électricité et voirie bitumée. Titre foncier disponible. Idéal construction villa ou immeuble.',
    type: 'TERRAIN',
    transactionType: 'VENTE',
    price: 15000000,
    surfaceArea: 500,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '10',
    neighborhoodName: 'Bingerville',
    latitude: 5.3583,
    longitude: -3.8919,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800',
    ],
    status: 'PUBLIE',
    pricePerSqm: 30000,
    featured: false,
    createdAt: '2025-01-13T09:15:00Z',
    legalStatus: 'TF',
    availableDocuments: ['TF', 'CADASTRE'],
  },
  {
    id: '4',
    title: 'Local Commercial Plateau',
    description: 'Local commercial de 80m² idéalement situé au cœur du Plateau, zone administrative et des affaires. Vitrine sur rue passante, climatisation, sanitaires, parking à proximité. Parfait pour bureau, boutique ou showroom.',
    type: 'COMMERCE',
    transactionType: 'LOCATION',
    price: 800000,
    surfaceArea: 80,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '2',
    neighborhoodName: 'Plateau',
    latitude: 5.3196,
    longitude: -4.0251,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
    ],
    status: 'PUBLIE',
    pricePerSqm: 10000,
    featured: false,
    createdAt: '2025-01-12T16:45:00Z',
    legalStatus: 'ADU',
    availableDocuments: ['PHOTOS', 'NOTAIRE'],
  },
  {
    id: '5',
    title: 'Villa Piscine Riviera Golf',
    description: 'Somptueuse villa de luxe avec piscine chauffée, jardin paysager 1000m², 5 chambres suite avec dressing, home cinema, cuisine gastronomique, garage 3 voitures. Sécurité 24h/24.',
    type: 'MAISON',
    transactionType: 'VENTE',
    price: 150000000,
    surfaceArea: 500,
    bedrooms: 5,
    bathrooms: 5,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    latitude: 5.3512,
    longitude: -3.9723,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    ],
    status: 'PUBLIE',
    pricePerSqm: 300000,
    featured: true,
    createdAt: '2025-01-11T11:20:00Z',
    legalStatus: 'TF',
    availableDocuments: ['TF', 'PHOTOS', 'PLANS', 'CADASTRE', 'NOTAIRE'],
  },
  {
    id: '6',
    title: 'Duplex Moderne Yopougon',
    description: 'Duplex neuf de 150m² dans résidence moderne. 4 chambres, double séjour, 2 cuisines, terrasse spacieuse. Finitions haut de gamme, groupe électrogène, eau courante.',
    type: 'APPARTEMENT',
    transactionType: 'LOCATION',
    price: 280000,
    surfaceArea: 150,
    bedrooms: 4,
    bathrooms: 3,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '4',
    neighborhoodName: 'Yopougon',
    latitude: 5.3393,
    longitude: -4.0858,
    images: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
    ],
    status: 'PUBLIE',
    pricePerSqm: 1867,
    featured: false,
    createdAt: '2025-01-10T08:30:00Z',
    legalStatus: 'ACD',
    availableDocuments: ['PHOTOS', 'PLANS'],
  },
  {
    id: '7',
    title: 'Bureau Open Space Treichville',
    description: 'Espace de bureau open space 200m² dans immeuble moderne. Climatisation centrale, fibre optique, salle de r��union, kitchenette, parking sécurisé. Idéal entreprise 20-30 personnes.',
    type: 'BUREAU',
    transactionType: 'LOCATION',
    price: 1500000,
    surfaceArea: 200,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '6',
    neighborhoodName: 'Treichville',
    latitude: 5.3044,
    longitude: -4.0096,
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
    ],
    status: 'PUBLIE',
    pricePerSqm: 7500,
    featured: false,
    createdAt: '2025-01-09T13:00:00Z',
    legalStatus: 'ADU',
    availableDocuments: ['PHOTOS', 'NOTAIRE'],
  },
  {
    id: '8',
    title: 'Villa Familiale Koumassi',
    description: 'Confortable villa familiale 4 chambres, salon/salle à manger spacieux, grande cour avec espace jeux enfants. Quartier calme et sécurisé, proche écoles et commerces.',
    type: 'MAISON',
    transactionType: 'LOCATION',
    price: 250000,
    surfaceArea: 180,
    bedrooms: 4,
    bathrooms: 2,
    cityId: '1',
    cityName: 'Abidjan',
    neighborhoodId: '7',
    neighborhoodName: 'Koumassi',
    latitude: 5.2903,
    longitude: -3.9503,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    ],
    status: 'PUBLIE',
    pricePerSqm: 1389,
    featured: false,
    createdAt: '2025-01-08T15:45:00Z',
    legalStatus: 'AV',
    availableDocuments: ['PHOTOS'],
  },
];
