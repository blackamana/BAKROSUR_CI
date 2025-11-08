# Guide de migration BAKROSUR

## Etapes completees

- [x] Creation .env.local et .env.example
- [x] Structure des dossiers
- [x] Validateur environnement
- [x] Schemas validation Zod
- [x] Composants UI de base

## Prochaines etapes

1. Editez .env.local avec vos vraies valeurs
2. Installez les packages: bun install
3. Mettez a jour lib/supabase.ts pour utiliser env-validator
4. Testez: bun run start

## Packages a installer

bun add zustand expo-notifications expo-device expo-constants
bun add @sentry/react-native mixpanel-react-native
bun add @react-native-community/netinfo
bun add -d @testing-library/react-native jest

## Utiliser les schemas

Dans vos formulaires:
import { loginSchema } from '@/lib/schemas/auth.schema';

const validated = loginSchema.parse({ email, password });

Bon courage!
