import { z } from 'zod';

export const propertyTypeEnum = z.enum(['apartment', 'house', 'land', 'commercial', 'office', 'villa']);
export const listingTypeEnum = z.enum(['sale', 'rent']);

export const propertySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(5, 'Minimum 5 caracteres').max(100, 'Trop long'),
  description: z.string().min(20, 'Minimum 20 caracteres').max(2000, 'Trop long'),
  price: z.number().positive('Prix positif').min(10000, 'Prix minimum 10000 FCFA'),
  type: listingTypeEnum,
  propertyType: propertyTypeEnum,
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(10),
  area: z.number().positive().min(10, 'Superficie minimum 10 m2'),
  cityId: z.string().min(1, 'Ville requise'),
  neighborhoodId: z.string().min(1, 'Quartier requis'),
  address: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'Au moins une image').max(20, 'Maximum 20 images'),
  amenities: z.array(z.string()).default([]),
  verified: z.boolean().default(false),
  ownerId: z.string().uuid(),
});

export type Property = z.infer<typeof propertySchema>;
