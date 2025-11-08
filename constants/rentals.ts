export type ContractStatus = 'ACTIF' | 'EXPIRE' | 'RESILIÉ' | 'EN_ATTENTE';
export type PaymentStatus = 'PAYÉ' | 'EN_ATTENTE' | 'EN_RETARD' | 'ANNULÉ';
export type MaintenanceStatus = 'NOUVEAU' | 'EN_COURS' | 'RÉSOLU' | 'REJETÉ';
export type MaintenancePriority = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'URGENTE';
export type PaymentMethod = 'WAVE' | 'ORANGE_MONEY' | 'MTN_MONEY' | 'MOOV_MONEY' | 'ESPÈCES' | 'VIREMENT';

export interface RentalContract {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  monthlyRent: number;
  deposit: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  contractUrl?: string;
  signedDate?: string;
  terms?: string;
}

export interface RentPayment {
  id: string;
  contractId: string;
  tenantId: string;
  tenantName: string;
  propertyTitle: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  reference?: string;
  receiptUrl?: string;
  notes?: string;
}

export interface MaintenanceRequest {
  id: string;
  contractId: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  title: string;
  description: string;
  category: 'PLOMBERIE' | 'ÉLECTRICITÉ' | 'CLIMATISATION' | 'MÉNAGE' | 'JARDIN' | 'SÉCURITÉ' | 'AUTRE';
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  images?: string[];
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
}

export interface Document {
  id: string;
  contractId: string;
  type: 'CONTRAT' | 'QUITTANCE' | 'ÉTAT_LIEUX' | 'FACTURE' | 'AUTRE';
  title: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export const MOCK_CONTRACTS: RentalContract[] = [
  {
    id: '1',
    propertyId: '2',
    propertyTitle: 'Appartement Standing Marcory Zone 4',
    propertyAddress: 'Marcory Zone 4, Abidjan',
    landlordId: 'landlord1',
    landlordName: 'Kouadio Jean',
    landlordPhone: '+225 0707123456',
    tenantId: 'tenant1',
    tenantName: 'Koffi Marie',
    tenantPhone: '+225 0708234567',
    tenantEmail: 'koffi.marie@example.com',
    monthlyRent: 350000,
    deposit: 700000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'ACTIF',
    signedDate: '2024-12-15',
  },
  {
    id: '2',
    propertyId: '6',
    propertyTitle: 'Duplex Moderne Yopougon',
    propertyAddress: 'Yopougon, Abidjan',
    landlordId: 'landlord1',
    landlordName: 'Kouadio Jean',
    landlordPhone: '+225 0707123456',
    tenantId: 'tenant2',
    tenantName: 'Yao Pierre',
    tenantPhone: '+225 0709345678',
    tenantEmail: 'yao.pierre@example.com',
    monthlyRent: 280000,
    deposit: 560000,
    startDate: '2024-11-01',
    endDate: '2025-10-31',
    status: 'ACTIF',
    signedDate: '2024-10-20',
  },
  {
    id: '3',
    propertyId: '8',
    propertyTitle: 'Villa Familiale Koumassi',
    propertyAddress: 'Koumassi, Abidjan',
    landlordId: 'landlord2',
    landlordName: 'Bamba Fatou',
    landlordPhone: '+225 0706456789',
    tenantId: 'tenant3',
    tenantName: 'Diallo Ibrahim',
    tenantPhone: '+225 0705567890',
    tenantEmail: 'diallo.ibrahim@example.com',
    monthlyRent: 250000,
    deposit: 500000,
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    status: 'ACTIF',
    signedDate: '2024-05-15',
  },
];

export const MOCK_PAYMENTS: RentPayment[] = [
  {
    id: '1',
    contractId: '1',
    tenantId: 'tenant1',
    tenantName: 'Koffi Marie',
    propertyTitle: 'Appartement Standing Marcory Zone 4',
    amount: 350000,
    dueDate: '2025-01-05',
    paidDate: '2025-01-03',
    status: 'PAYÉ',
    method: 'WAVE',
    reference: 'WAV20250103001',
  },
  {
    id: '2',
    contractId: '1',
    tenantId: 'tenant1',
    tenantName: 'Koffi Marie',
    propertyTitle: 'Appartement Standing Marcory Zone 4',
    amount: 350000,
    dueDate: '2025-02-05',
    status: 'EN_ATTENTE',
  },
  {
    id: '3',
    contractId: '2',
    tenantId: 'tenant2',
    tenantName: 'Yao Pierre',
    propertyTitle: 'Duplex Moderne Yopougon',
    amount: 280000,
    dueDate: '2025-01-05',
    paidDate: '2025-01-04',
    status: 'PAYÉ',
    method: 'ORANGE_MONEY',
    reference: 'OM20250104002',
  },
  {
    id: '4',
    contractId: '2',
    tenantId: 'tenant2',
    tenantName: 'Yao Pierre',
    propertyTitle: 'Duplex Moderne Yopougon',
    amount: 280000,
    dueDate: '2025-02-05',
    status: 'EN_ATTENTE',
  },
  {
    id: '5',
    contractId: '3',
    tenantId: 'tenant3',
    tenantName: 'Diallo Ibrahim',
    propertyTitle: 'Villa Familiale Koumassi',
    amount: 250000,
    dueDate: '2025-01-01',
    status: 'EN_RETARD',
  },
];

export const MOCK_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: '1',
    contractId: '1',
    propertyId: '2',
    propertyTitle: 'Appartement Standing Marcory Zone 4',
    tenantId: 'tenant1',
    tenantName: 'Koffi Marie',
    title: 'Fuite d\'eau salle de bain',
    description: 'Une fuite d\'eau s\'est développée sous le lavabo de la salle de bain principale. L\'eau coule continuellement.',
    category: 'PLOMBERIE',
    priority: 'HAUTE',
    status: 'EN_COURS',
    createdAt: '2025-01-20T08:30:00Z',
    estimatedCost: 50000,
  },
  {
    id: '2',
    contractId: '2',
    propertyId: '6',
    propertyTitle: 'Duplex Moderne Yopougon',
    tenantId: 'tenant2',
    tenantName: 'Yao Pierre',
    title: 'Climatisation chambre ne fonctionne pas',
    description: 'La climatisation de la chambre principale ne démarre plus. Vérification nécessaire.',
    category: 'CLIMATISATION',
    priority: 'MOYENNE',
    status: 'NOUVEAU',
    createdAt: '2025-01-22T14:15:00Z',
  },
  {
    id: '3',
    contractId: '1',
    propertyId: '2',
    propertyTitle: 'Appartement Standing Marcory Zone 4',
    tenantId: 'tenant1',
    tenantName: 'Koffi Marie',
    title: 'Panne électrique cuisine',
    description: 'Les prises de courant de la cuisine ne fonctionnent plus depuis hier soir.',
    category: 'ÉLECTRICITÉ',
    priority: 'URGENTE',
    status: 'NOUVEAU',
    createdAt: '2025-01-25T09:00:00Z',
  },
  {
    id: '4',
    contractId: '3',
    propertyId: '8',
    propertyTitle: 'Villa Familiale Koumassi',
    tenantId: 'tenant3',
    tenantName: 'Diallo Ibrahim',
    title: 'Entretien jardin',
    description: 'Le jardin nécessite un entretien régulier. Les herbes ont beaucoup poussé.',
    category: 'JARDIN',
    priority: 'BASSE',
    status: 'RÉSOLU',
    createdAt: '2025-01-10T10:30:00Z',
    resolvedAt: '2025-01-15T16:00:00Z',
    actualCost: 25000,
  },
];
