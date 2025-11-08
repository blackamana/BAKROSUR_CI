export type TransportType = 'GARE' | 'GBAKA' | 'WORO_WORO' | 'TAXI' | 'BUS';

export interface Transport {
  id: string;
  name: string;
  type: TransportType;
  neighborhoodId: string;
  neighborhoodName: string;
  description: string;
  fare: number;
  destinations: string[];
  operatingHours: string;
  latitude: number;
  longitude: number;
}

export const TRANSPORTS: Transport[] = [
  {
    id: 'T1',
    name: 'Gare de Cocody',
    type: 'GARE',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    description: 'Gare routière principale de Cocody avec connexions vers Plateau, Marcory',
    fare: 200,
    destinations: ['Plateau', 'Marcory', 'Yopougon', 'Adjamé'],
    operatingHours: '05:00 - 22:00',
    latitude: 5.3473,
    longitude: -3.9856,
  },
  {
    id: 'T2',
    name: 'Gare de Yopougon Siporex',
    type: 'GARE',
    neighborhoodId: '4',
    neighborhoodName: 'Yopougon',
    description: 'Grande gare de Yopougon, dessert tout Abidjan',
    fare: 150,
    destinations: ['Plateau', 'Adjamé', 'Cocody', 'Treichville'],
    operatingHours: '04:30 - 23:00',
    latitude: 5.3393,
    longitude: -4.0858,
  },
  {
    id: 'T3',
    name: 'Gare de Marcory Zone 4',
    type: 'GARE',
    neighborhoodId: '3',
    neighborhoodName: 'Marcory',
    description: 'Gare de Marcory avec connexions vers le Plateau et Cocody',
    fare: 150,
    destinations: ['Plateau', 'Cocody', 'Treichville', 'Koumassi'],
    operatingHours: '05:00 - 22:00',
    latitude: 5.3273,
    longitude: -4.0156,
  },
  {
    id: 'T4',
    name: 'Gare d\'Adjamé',
    type: 'GARE',
    neighborhoodId: '5',
    neighborhoodName: 'Adjamé',
    description: 'Plus grande gare d\'Abidjan, connexions nationales et urbaines',
    fare: 100,
    destinations: ['Toutes communes', 'Villes intérieures'],
    operatingHours: '04:00 - 23:30',
    latitude: 5.3540,
    longitude: -4.0210,
  },
  {
    id: 'T5',
    name: 'Station Gbaka Plateau Cité Administrative',
    type: 'GBAKA',
    neighborhoodId: '2',
    neighborhoodName: 'Plateau',
    description: 'Point de départ des Gbakas vers Cocody et Marcory',
    fare: 150,
    destinations: ['Cocody', 'Marcory', 'Treichville'],
    operatingHours: '05:30 - 21:00',
    latitude: 5.3196,
    longitude: -4.0251,
  },
  {
    id: 'T6',
    name: 'Ligne Woro-Woro Cocody-Angré',
    type: 'WORO_WORO',
    neighborhoodId: '1',
    neighborhoodName: 'Cocody',
    description: 'Transport rapide en moto-taxi dans tout Cocody',
    fare: 300,
    destinations: ['Angré', 'Riviera', 'Deux Plateaux', 'Blockhaus'],
    operatingHours: '06:00 - 22:00',
    latitude: 5.3600,
    longitude: -3.9700,
  },
  {
    id: 'T7',
    name: 'Station Taxi Treichville Gare Lagunaire',
    type: 'TAXI',
    neighborhoodId: '6',
    neighborhoodName: 'Treichville',
    description: 'Taxis collectifs et privés',
    fare: 500,
    destinations: ['Plateau', 'Marcory', 'Port-Bouët', 'Aéroport'],
    operatingHours: '24/7',
    latitude: 5.3044,
    longitude: -4.0096,
  },
];

export function getTransportsByNeighborhood(neighborhoodId: string): Transport[] {
  return TRANSPORTS.filter((t) => t.neighborhoodId === neighborhoodId);
}

export function getTransportsByType(type: TransportType): Transport[] {
  return TRANSPORTS.filter((t) => t.type === type);
}
