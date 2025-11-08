export type VerificationStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';

export type DocumentType = 'CNI' | 'PASSPORT' | 'DRIVER_LICENSE' | 'RESIDENCE_PERMIT';
export type PropertyDocumentType = 'TF' | 'ACD' | 'ADU' | 'AV' | 'PHOTOS' | 'PLANS' | 'CADASTRE' | 'NOTAIRE';

export interface VerificationDocument {
  id: string;
  type: DocumentType | PropertyDocumentType;
  frontImageUri?: string;
  backImageUri?: string;
  documentNumber?: string;
  expiryDate?: string;
  issuedDate?: string;
  uploadedAt: string;
  status: VerificationStatus;
  rejectionReason?: string;
}

export interface KYCData {
  userId: string;
  profileType: 'particulier' | 'professionnel' | 'intervenant';
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    nationality?: string;
    phoneNumber: string;
    email: string;
  };
  professionalInfo?: {
    companyName?: string;
    rccm?: string;
    activityType?: string;
    profession?: string;
    agrementNumber?: string;
    cabinet?: string;
  };
  address: {
    street?: string;
    cityId: string;
    cityName: string;
    neighborhoodId: string;
    neighborhoodName: string;
  };
  documents: VerificationDocument[];
  status: VerificationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface PropertyVerification {
  propertyId: string;
  ownerId: string;
  legalStatus: 'TF' | 'ACD' | 'ADU' | 'AV';
  documents: VerificationDocument[];
  ownershipProof: {
    documentType: PropertyDocumentType;
    documentNumber?: string;
    issuedBy?: string;
    issuedDate?: string;
  };
  propertyInspection?: {
    inspectedAt?: string;
    inspectorId?: string;
    inspectorName?: string;
    notes?: string;
    photos?: string[];
    verified: boolean;
  };
  status: VerificationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  expiresAt?: string;
  badge?: VerificationBadge;
}

export type VerificationBadgeType = 
  | 'VERIFIED_OWNER'
  | 'VERIFIED_PROPERTY'
  | 'VERIFIED_DOCUMENTS'
  | 'INSPECTED'
  | 'PREMIUM_VERIFIED'
  | 'TRUSTED_SELLER';

export interface VerificationBadge {
  type: VerificationBadgeType;
  earnedAt: string;
  expiresAt?: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
}

export const VERIFICATION_BADGES: Record<VerificationBadgeType, Omit<VerificationBadge, 'earnedAt' | 'expiresAt'>> = {
  VERIFIED_OWNER: {
    type: 'VERIFIED_OWNER',
    displayName: 'Propriétaire vérifié',
    description: 'Identité vérifiée par BAKRÔSUR',
    icon: '✓',
    color: '#10B981',
  },
  VERIFIED_PROPERTY: {
    type: 'VERIFIED_PROPERTY',
    displayName: 'Bien vérifié',
    description: 'Propriété vérifiée et authentifiée',
    icon: '🏠',
    color: '#3B82F6',
  },
  VERIFIED_DOCUMENTS: {
    type: 'VERIFIED_DOCUMENTS',
    displayName: 'Documents vérifiés',
    description: 'Tous les documents légaux vérifiés',
    icon: '📄',
    color: '#8B5CF6',
  },
  INSPECTED: {
    type: 'INSPECTED',
    displayName: 'Inspecté',
    description: 'Bien inspecté par un professionnel',
    icon: '👁️',
    color: '#F59E0B',
  },
  PREMIUM_VERIFIED: {
    type: 'PREMIUM_VERIFIED',
    displayName: 'Vérification Premium',
    description: 'Vérification complète et approfondie',
    icon: '⭐',
    color: '#EF4444',
  },
  TRUSTED_SELLER: {
    type: 'TRUSTED_SELLER',
    displayName: 'Vendeur de confiance',
    description: 'Vendeur fiable avec historique positif',
    icon: '🛡️',
    color: '#06B6D4',
  },
};

export const DOCUMENT_REQUIREMENTS: Record<DocumentType, { label: string; requiresBack: boolean; expiryRequired: boolean }> = {
  CNI: {
    label: 'Carte Nationale d\'Identité',
    requiresBack: true,
    expiryRequired: true,
  },
  PASSPORT: {
    label: 'Passeport',
    requiresBack: false,
    expiryRequired: true,
  },
  DRIVER_LICENSE: {
    label: 'Permis de conduire',
    requiresBack: true,
    expiryRequired: true,
  },
  RESIDENCE_PERMIT: {
    label: 'Titre de séjour',
    requiresBack: true,
    expiryRequired: true,
  },
};

export const PROPERTY_DOCUMENT_REQUIREMENTS: Record<PropertyDocumentType, { label: string; description: string; required: boolean }> = {
  TF: {
    label: 'Titre Foncier',
    description: 'Document officiel prouvant la propriété du terrain',
    required: true,
  },
  ACD: {
    label: 'Arrêté de Concession Définitive',
    description: 'Arrêté accordant la propriété définitive',
    required: false,
  },
  ADU: {
    label: 'Arrêté de Concession d\'Urbanisme',
    description: 'Autorisation pour construire',
    required: false,
  },
  AV: {
    label: 'Attestation Villageoise',
    description: 'Document de propriété villageoise',
    required: false,
  },
  PHOTOS: {
    label: 'Photos',
    description: 'Photos récentes du bien',
    required: true,
  },
  PLANS: {
    label: 'Plans',
    description: 'Plans architecturaux',
    required: false,
  },
  CADASTRE: {
    label: 'Plan Cadastral',
    description: 'Plan de délimitation officiel',
    required: false,
  },
  NOTAIRE: {
    label: 'Actes Notariés',
    description: 'Documents notariés de transaction',
    required: false,
  },
};
