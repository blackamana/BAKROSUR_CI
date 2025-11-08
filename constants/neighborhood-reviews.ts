export type NeighborhoodReview = {
  id: string;
  neighborhoodId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  aspects: {
    safety: number;
    transport: number;
    amenities: number;
    noise: number;
    cleanliness: number;
  };
  createdAt: string;
};

export type NeighborhoodStats = {
  neighborhoodId: string;
  averageRating: number;
  totalReviews: number;
  aspectsAverage: {
    safety: number;
    transport: number;
    amenities: number;
    noise: number;
    cleanliness: number;
  };
  popularFeatures: string[];
  nearbyPlaces: {
    schools: number;
    hospitals: number;
    supermarkets: number;
    restaurants: number;
  };
};

export const NEIGHBORHOOD_REVIEWS: NeighborhoodReview[] = [
  {
    id: '1',
    neighborhoodId: '1',
    userId: 'user1',
    userName: 'Kouadio Jean',
    rating: 5,
    comment:
      'Excellent quartier, très calme et sécurisé. Proche de tout, écoles internationales, supermarchés et restaurants de qualité.',
    aspects: {
      safety: 5,
      transport: 4,
      amenities: 5,
      noise: 4,
      cleanliness: 5,
    },
    createdAt: '2025-01-20T10:30:00Z',
  },
  {
    id: '2',
    neighborhoodId: '1',
    userId: 'user2',
    userName: 'Aya Marie',
    rating: 4,
    comment:
      'Très bon quartier résidentiel. Parfait pour les familles. Le seul bémol est la circulation aux heures de pointe.',
    aspects: {
      safety: 5,
      transport: 3,
      amenities: 4,
      noise: 4,
      cleanliness: 4,
    },
    createdAt: '2025-01-18T15:20:00Z',
  },
  {
    id: '3',
    neighborhoodId: '2',
    userId: 'user3',
    userName: 'Yao Patrick',
    rating: 4,
    comment:
      'Centre des affaires dynamique. Idéal pour travailler mais peut être bruyant. Excellente connectivité.',
    aspects: {
      safety: 4,
      transport: 5,
      amenities: 5,
      noise: 2,
      cleanliness: 4,
    },
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: '4',
    neighborhoodId: '3',
    userId: 'user4',
    userName: 'Bamba Fatou',
    rating: 5,
    comment:
      'J\'adore ce quartier ! Vue magnifique sur la lagune, commerces à proximité, et très bien desservi par les transports.',
    aspects: {
      safety: 4,
      transport: 5,
      amenities: 5,
      noise: 3,
      cleanliness: 4,
    },
    createdAt: '2025-01-12T14:45:00Z',
  },
];

export const NEIGHBORHOOD_STATS: NeighborhoodStats[] = [
  {
    neighborhoodId: '1',
    averageRating: 4.5,
    totalReviews: 28,
    aspectsAverage: {
      safety: 5.0,
      transport: 3.5,
      amenities: 4.5,
      noise: 4.0,
      cleanliness: 4.5,
    },
    popularFeatures: [
      'Quartier résidentiel haut standing',
      'Écoles internationales',
      'Centres commerciaux',
      'Restaurants gastronomiques',
      'Espaces verts',
    ],
    nearbyPlaces: {
      schools: 12,
      hospitals: 5,
      supermarkets: 8,
      restaurants: 25,
    },
  },
  {
    neighborhoodId: '2',
    averageRating: 4.0,
    totalReviews: 45,
    aspectsAverage: {
      safety: 4.0,
      transport: 5.0,
      amenities: 5.0,
      noise: 2.5,
      cleanliness: 4.0,
    },
    popularFeatures: [
      'Centre des affaires',
      'Banques et institutions',
      'Accès facile',
      'Vie nocturne',
      'Restaurants d\'affaires',
    ],
    nearbyPlaces: {
      schools: 5,
      hospitals: 8,
      supermarkets: 15,
      restaurants: 50,
    },
  },
  {
    neighborhoodId: '3',
    averageRating: 4.3,
    totalReviews: 32,
    aspectsAverage: {
      safety: 4.0,
      transport: 4.5,
      amenities: 4.5,
      noise: 3.5,
      cleanliness: 4.0,
    },
    popularFeatures: [
      'Vue sur la lagune',
      'Zone résidentielle moderne',
      'Bien desservi',
      'Centres commerciaux',
      'Complexes sportifs',
    ],
    nearbyPlaces: {
      schools: 10,
      hospitals: 4,
      supermarkets: 12,
      restaurants: 30,
    },
  },
];
