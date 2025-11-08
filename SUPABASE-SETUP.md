# Configuration Supabase pour BakrôSûr

## 🔥 Erreur actuelle
Si vous voyez l'erreur "supabaseUrl is required", c'est parce que les variables d'environnement Supabase ne sont pas configurées.

## ⚡ Solution rapide

### Étape 1: Créer un projet Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Donnez un nom à votre projet (ex: "bakrosur-prod")
5. Choisissez un mot de passe de base de données sécurisé
6. Sélectionnez une région (choisissez la plus proche de vos utilisateurs)
7. Attendez que le projet soit créé (environ 2 minutes)

### Étape 2: Obtenir vos clés API
1. Dans votre projet Supabase, allez dans **Settings** (icône d'engrenage) → **API**
2. Vous verrez deux informations importantes:
   - **Project URL** : Quelque chose comme `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key** : Une longue clé qui commence par `eyJ...`

### Étape 3: Configurer les variables d'environnement
1. Ouvrez le fichier `.env` à la racine du projet
2. Remplacez les valeurs par défaut par vos vraies clés:

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-ici
```

### Étape 4: Exécuter le schéma de base de données
1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Ouvrez le fichier `supabase-schema.sql` dans ce projet
3. Copiez tout le contenu
4. Collez-le dans l'éditeur SQL de Supabase
5. Cliquez sur **Run** pour créer toutes les tables

### Étape 5: Redémarrer l'application
1. Arrêtez le serveur de développement (Ctrl+C)
2. Redémarrez avec `npm start` ou `bun start`
3. L'application devrait maintenant se connecter à Supabase

## 📝 Vérification
Une fois configuré, vous devriez voir dans les logs de la console :
```
[Auth] Loading user session from Supabase...
[tRPC] Supabase connected successfully
```

Si vous voyez encore des avertissements, vérifiez que :
- Les variables d'environnement sont correctement définies dans `.env`
- Le fichier `.env` est à la racine du projet
- Vous avez bien redémarré l'application après avoir modifié `.env`

## 🔒 Sécurité
⚠️ **IMPORTANT**: Ne commitez JAMAIS le fichier `.env` dans Git. Il est déjà dans `.gitignore`.

## 🌐 Mode offline
Si vous ne configurez pas Supabase, l'application fonctionnera en mode "offline" avec des données locales uniquement. Les fonctionnalités suivantes ne seront pas disponibles :
- Authentification (login/signup)
- Synchronisation des propriétés
- Favoris persistants
- Messagerie entre utilisateurs
- Upload d'images

## 🆘 Besoin d'aide ?
Si vous rencontrez des problèmes :
1. Vérifiez que votre URL Supabase est correcte (doit être une vraie URL)
2. Vérifiez que votre clé anon est complète (commence par `eyJ`)
3. Assurez-vous d'avoir exécuté le schéma SQL dans Supabase
4. Redémarrez complètement l'application

## 📚 Ressources
- [Documentation Supabase](https://supabase.com/docs)
- [Guide Supabase + React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
