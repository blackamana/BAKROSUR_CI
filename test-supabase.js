// Test de connexion Supabase
// Collez ce code dans la console du navigateur (F12)

console.log('=== Test Connexion Supabase ===');

// 1. Verifier les variables d'environnement
console.log('Variables env:');
console.log('- SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('- SUPABASE_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Presente' : 'Manquante');

// 2. Importer Supabase (si disponible)
import { supabase } from './lib/supabase';

// 3. Test de connexion basique
async function testConnection() {
  try {
    console.log('Test 1: Verification client Supabase...');
    if (!supabase) {
      console.error('Client Supabase non initialise');
      return;
    }
    console.log('OK - Client Supabase initialise');

    console.log('Test 2: Recuperation session...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Erreur session:', sessionError);
    } else {
      console.log('OK - Session:', session.session ? 'Connecte' : 'Non connecte');
    }

    console.log('Test 3: Test requete table users...');
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Erreur requete:', error.message);
      if (error.code === 'PGRST301') {
        console.warn('Table users non trouvee ou acces refuse');
      }
    } else {
      console.log('OK - Connexion base reussie');
      console.log('Donnees:', data);
    }

    console.log('Test 4: Liste des tables accessibles...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables') // Si cette fonction existe
      .catch(() => ({ data: null, error: { message: 'RPC non disponible' } }));
    
    if (tablesError) {
      console.warn('Impossible de lister les tables');
    } else {
      console.log('Tables:', tables);
    }

    console.log('=== Test termine ===');
  } catch (err) {
    console.error('Erreur test:', err);
  }
}

// Lancer le test
testConnection();

// Fonction utilitaire pour tester une table specifique
window.testTable = async (tableName) => {
  console.log('Test table:', tableName);
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(5);
  
  if (error) {
    console.error('Erreur:', error);
  } else {
    console.log('Resultat:', data);
  }
};

console.log('Fonction testTable disponible!');
console.log('Usage: testTable("nom_de_la_table")');
