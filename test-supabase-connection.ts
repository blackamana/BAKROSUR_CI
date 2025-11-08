/**
 * Script de test de connexion Supabase
 * Usage: npx ts-node test-supabase-connection.ts
 */

import { supabase } from './lib/supabase';

async function testSupabaseConnection() {
  console.log('🔌 Test de connexion à Supabase...\n');

  // Vérifier que le client est initialisé
  if (!supabase) {
    console.error('❌ Client Supabase non initialisé');
    console.log('\nVérifiez vos variables d\'environnement :');
    console.log('- EXPO_PUBLIC_SUPABASE_URL');
    console.log('- EXPO_PUBLIC_SUPABASE_ANON_KEY');
    console.log('\nCes variables doivent être définies dans votre fichier .env');
    return false;
  }

  console.log('✅ Client Supabase initialisé');
  console.log(`📍 URL: ${process.env.EXPO_PUBLIC_SUPABASE_URL}\n`);

  try {
    // Test 1: Vérifier la connexion à la base de données
    console.log('Test 1: Connexion à la base de données...');
    const { error: connectionError } = await supabase.from('properties').select('count', { count: 'exact', head: true });

    if (connectionError) {
      if (connectionError.message.includes('relation') && connectionError.message.includes('does not exist')) {
        console.log('⚠️  La table "properties" n\'existe pas encore');
        console.log('   Vous devez créer votre schéma de base de données');
        console.log('   Consultez: SUPABASE-INTEGRATION-GUIDE.md\n');
      } else {
        console.error('❌ Erreur de connexion:', connectionError.message);
        return false;
      }
    } else {
      console.log('✅ Connexion à la base de données réussie\n');
    }

    // Test 2: Compter les propriétés
    console.log('Test 2: Comptage des propriétés...');
    const { count, error: countError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`✅ ${count || 0} propriétés dans la base de données\n`);
    }

    // Test 3: Vérifier les autres tables
    console.log('Test 3: Vérification des tables...');
    const tables = ['cities', 'neighborhoods', 'search_history'];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`⚠️  Table "${table}" n'existe pas`);
        } else {
          console.log(`❌ Erreur pour la table "${table}": ${error.message}`);
        }
      } else {
        console.log(`✅ Table "${table}" accessible`);
      }
    }

    console.log('\n✅ Tests terminés avec succès !');
    console.log('\n📚 Prochaines étapes :');
    console.log('1. Créer le schéma de base de données (voir SUPABASE-INTEGRATION-GUIDE.md)');
    console.log('2. Insérer des données de test');
    console.log('3. Utiliser les hooks dans vos composants (usePropertySearch, useSearchSuggestions)');

    return true;
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return false;
  }
}

// Exécuter les tests
testSupabaseConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });
