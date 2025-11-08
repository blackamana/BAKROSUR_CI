import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caracteres'),
});

export const signupSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string()
    .min(8, 'Minimum 8 caracteres')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[a-z]/, 'Au moins une minuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Minimum 2 caracteres').max(100, 'Trop long'),
  phone: z.string().regex(/^\+225[0-9]{10}$/, 'Numero ivoirien invalide').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
