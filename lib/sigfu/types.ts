export type TitleType = 'TF' | 'ACD' | 'ADU' | 'AV';

export type VerificationStatus = 
  | 'VALID' 
  | 'INVALID' 
  | 'PENDING' 
  | 'LITIGE' 
  | 'ERROR';

export interface SIGFUTitleVerification {
  numero_acd: string;
  status: VerificationStatus;
  proprietaire: {
    nom: string;
    type: 'PHYSIQUE' | 'MORALE';
    id_national?: string;
  };
  parcelle: {
    numero_ilot: string;
    numero_lot: string;
    superficie: number;
    localisation: {
      commune: string;
      quartier: string;
      ville: string;
    };
  };
  dates: {
    date_approbation: string;
    date_delivrance: string;
    date_derniere_mutation?: string;
  };
  charges?: {
    hypotheques: Array<{
      montant: number;
      creancier: string;
      date_inscription: string;
    }>;
    servitudes: string[];
  };
  litiges?: Array<{
    type: string;
    status: string;
    date_depot: string;
  }>;
  documents?: {
    plan_cadastral_url?: string;
    acd_pdf_url?: string;
  };
  score_fiabilite: number;
  dernier_controle: string;
}

export interface VerificationResult {
  property_id: string;
  title_number: string;
  title_type: TitleType;
  status: 'VERIFIED' | 'INVALID' | 'PENDING' | 'ERROR';
  sigfu_data?: SIGFUTitleVerification;
  verification_date: string;
  score: number;
  issues: string[];
  cache_hit: boolean;
}