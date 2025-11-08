import { z } from 'zod';

export const kycStatusEnum = z.enum(['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED']);
export const profileTypeEnum = z.enum(['particulier', 'professionnel', 'intervenant']);

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().regex(/^\+[0-9]{10,15}$/),
  avatar: z.string().url().optional(),
  kycStatus: kycStatusEnum.optional(),
  profileType: profileTypeEnum.optional(),
});

export type User = z.infer<typeof userSchema>;
