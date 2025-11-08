export type AmenityType = 
  | 'HOPITAL' 
  | 'PHARMACIE' 
  | 'SUPERMARCHE' 
  | 'MARCHE' 
  | 'BANQUE' 
  | 'RESTAURANT' 
  | 'STATION_SERVICE'
  | 'MOSQUEE'
  | 'EGLISE';

export interface Amenity {
  id: string;
  name: string;
  type: AmenityType;
  neighborhoodId: string;
  neighborhoodName: string;
  address: string;
  description?: string;
  rating?: number;
  openingHours?: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
}

export const AMENITIES: Amenity[] = [
  {
    id: 'A1',
    name: 'CHU de Cocody',
    type: 'HOPITAL',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Boulevard de France, Cocody',
    description: 'Centre Hospitalier Universitaire, l\'un des meilleurs hôpitaux d\'Abidjan',
    rating: 4.2,
    openingHours: '24/7',
    latitude: 5.3500,
    longitude: -3.9800,
    phoneNumber: '+2252721111111',
  },
  {
    id: 'A2',
    name: 'Polyclinique Sainte Anne-Marie',
    type: 'HOPITAL',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Cocody Angré 8ème tranche',
    description: 'Clinique privée de haut standing',
    rating: 4.6,
    openingHours: '24/7',
    latitude: 5.3600,
    longitude: -3.9700,
    phoneNumber: '+2252722222222',
  },
  {
    id: 'A3',
    name: 'Pharmacie de la Riviera',
    type: 'PHARMACIE',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Riviera Palmeraie',
    description: 'Pharmacie de garde 24h/24',
    rating: 4.3,
    openingHours: '24/7',
    latitude: 5.3512,
    longitude: -3.9723,
    phoneNumber: '+2252723333333',
  },
  {
    id: 'A4',
    name: 'Carrefour Market Cocody',
    type: 'SUPERMARCHE',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Boulevard Latrille',
    description: 'Grand supermarché avec produits importés',
    rating: 4.5,
    openingHours: '08:00 - 22:00',
    latitude: 5.3473,
    longitude: -3.9856,
    phoneNumber: '+2252724444444',
  },
  {
    id: 'A5',
    name: 'Marché de Cocody',
    type: 'MARCHE',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Cocody Centre',
    description: 'Marché municipal avec produits frais',
    rating: 4.0,
    openingHours: '06:00 - 19:00',
    latitude: 5.3450,
    longitude: -3.9900,
  },
  {
    id: 'A6',
    name: 'Banque Atlantique Cocody',
    type: 'BANQUE',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Cocody II Plateaux',
    description: 'Agence bancaire avec distributeur',
    rating: 3.8,
    openingHours: '08:00 - 17:00',
    latitude: 5.3550,
    longitude: -3.9800,
    phoneNumber: '+2252725555555',
  },
  {
    id: 'A7',
    name: 'La Taverne Romaine',
    type: 'RESTAURANT',
    neighborhoodId: '2',
    neighborhoodName: 'Plateau',
    address: 'Plateau, Boulevard de la République',
    description: 'Restaurant gastronomique italien',
    rating: 4.7,
    openingHours: '12:00 - 23:00',
    latitude: 5.3196,
    longitude: -4.0251,
    phoneNumber: '+2252726666666',
  },
  {
    id: 'A8',
    name: 'Station Total Marcory',
    type: 'STATION_SERVICE',
    neighborhoodId: '3',
    neighborhoodName: 'Marcory',
    address: 'Boulevard Valéry Giscard d\'Estaing',
    description: 'Station-service avec boutique 24h/24',
    rating: 4.1,
    openingHours: '24/7',
    latitude: 5.3273,
    longitude: -4.0156,
  },
  {
    id: 'A9',
    name: 'Mosquée Riviera Palmeraie',
    type: 'MOSQUEE',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    address: 'Riviera Palmeraie',
    description: 'Grande mosquée moderne',
    rating: 4.8,
    latitude: 5.3512,
    longitude: -3.9723,
  },
  {
    id: 'A10',
    name: 'Cathédrale Saint-Paul',
    type: 'EGLISE',
    neighborhoodId: '2',
    neighborhoodName: 'Plateau',
    address: 'Boulevard Carde, Plateau',
    description: 'Cathédrale catholique, monument historique',
    rating: 4.9,
    openingHours: '06:00 - 20:00',
    latitude: 5.3200,
    longitude: -4.0200,
  },
  {
    id: 'A11',
    name: 'Supermarché Sococé Yopougon',
    type: 'SUPERMARCHE',
    neighborhoodId: '4',
    neighborhoodName: 'Yopougon',
    address: 'Yopougon Siporex',
    description: 'Supermarché local avec bons prix',
    rating: 4.0,
    openingHours: '07:00 - 21:00',
    latitude: 5.3393,
    longitude: -4.0858,
  },
  {
    id: 'A12',
    name: 'Marché d\'Adjamé',
    type: 'MARCHE',
    neighborhoodId: '5',
    neighborhoodName: 'Adjamé',
    address: 'Adjamé Liberté',
    description: 'Plus grand marché d\'Abidjan, tous types de produits',
    rating: 4.2,
    openingHours: '05:00 - 20:00',
    latitude: 5.3540,
    longitude: -4.0210,
  },
];

export function getAmenitiesByNeighborhood(neighborhoodId: string): Amenity[] {
  return AMENITIES.filter((a) => a.neighborhoodId === neighborhoodId);
}

export function getAmenitiesByType(type: AmenityType): Amenity[] {
  return AMENITIES.filter((a) => a.type === type);
}

export function getAmenitiesNearby(latitude: number, longitude: number, radiusKm: number = 2): Amenity[] {
  return AMENITIES.filter((a) => {
    const distance = calculateDistance(latitude, longitude, a.latitude, a.longitude);
    return distance <= radiusKm;
  });
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
