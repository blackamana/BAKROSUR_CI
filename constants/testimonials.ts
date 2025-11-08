export type TestimonialCategory = 'ACHAT' | 'VENTE' | 'KYC' | 'SERVICE' | 'GENERAL';

export interface Testimonial {
  id: string;
  userName: string;
  rating: number;
  category: TestimonialCategory;
  comment: string;
  featured: boolean;
  createdAt: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    userName: 'Kouadio Jean',
    rating: 5,
    category: 'ACHAT',
    comment: 'Excellente expérience avec BAKRÔSUR ! J\'ai trouvé la maison de mes rêves à Cocody. Le processus était transparent et professionnel.',
    featured: true,
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    userName: 'Aminata Diallo',
    rating: 5,
    category: 'VENTE',
    comment: 'J\'ai vendu mon appartement en moins de 2 semaines grâce à BAKRÔSUR. Service impeccable et très réactif.',
    featured: true,
    createdAt: '2025-01-08T14:30:00Z',
  },
  {
    id: '3',
    userName: 'Yao Pascal',
    rating: 4,
    category: 'SERVICE',
    comment: 'Très bon accompagnement du début à la fin. L\'équipe est à l\'écoute et professionnelle.',
    featured: true,
    createdAt: '2025-01-05T09:15:00Z',
  },
  {
    id: '4',
    userName: 'Fatou Koné',
    rating: 5,
    category: 'ACHAT',
    comment: 'Plateforme moderne et facile à utiliser. J\'ai trouvé mon appartement à Marcory rapidement.',
    featured: false,
    createdAt: '2025-01-03T16:20:00Z',
  },
  {
    id: '5',
    userName: 'Mamadou Traoré',
    rating: 4,
    category: 'KYC',
    comment: 'Processus de vérification KYC rapide et sécurisé. Je me sens en confiance.',
    featured: false,
    createdAt: '2025-01-01T11:45:00Z',
  },
];
