#!/usr/bin/env node

/**
 * Script de test de connexion Supabase
 * Démonstration que Claude Code peut se connecter à Supabase
 */

const SUPABASE_URL = 'https://ogczokdoufahfrhvkyig.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nY3pva2RvdWZhaGZyaHZreWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjA3MDEsImV4cCI6MjA3NzQzNjcwMX0._SQpQRJwGSvoVOYwO6CyacA2zkgJh9xBWLKxwZoT3fI';

async function testSupabaseConnection() {
  console.log('🔍 Test de connexion à Supabase...\n');
  console.log('📍 URL:', SUPABASE_URL);
  console.log('🔑 Clé:', SUPABASE_ANON_KEY.substring(0, 20) + '...\n');

  try {
    // Test 1: Vérifier que l'API répond
    console.log('1️⃣ Test de l\'API REST...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      console.log('   ✅ API REST accessible\n');
    } else {
      console.log(`   ❌ Erreur API: ${response.status} ${response.statusText}\n`);
      return false;
    }

    // Test 2: Compter les propriétés
    console.log('2️⃣ Test de la table properties...');
    const propertiesResponse = await fetch(`${SUPABASE_URL}/rest/v1/properties?select=count`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'count=exact'
      }
    });

    if (propertiesResponse.ok) {
      const countHeader = propertiesResponse.headers.get('content-range');
      const count = countHeader ? countHeader.split('/')[1] : 'unknown';
      console.log(`   ✅ Table properties accessible (${count} enregistrements)\n`);
    } else {
      console.log(`   ⚠️  Table properties: ${propertiesResponse.status} ${propertiesResponse.statusText}`);
      console.log('   💡 La table existe peut-être pas encore\n');
    }

    // Test 3: Vérifier les autres tables
    console.log('3️⃣ Test des autres tables...');
    const tables = ['cities', 'neighborhoods', 'users'];

    for (const table of tables) {
      const tableResponse = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'count=exact'
        }
      });

      if (tableResponse.ok) {
        const countHeader = tableResponse.headers.get('content-range');
        const count = countHeader ? countHeader.split('/')[1] : '0';
        console.log(`   ✅ Table ${table}: ${count} enregistrements`);
      } else {
        console.log(`   ⚠️  Table ${table}: non accessible ou inexistante`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ CONNEXION SUPABASE RÉUSSIE !');
    console.log('='.repeat(60));
    console.log('\n💡 Résultat: Claude Code peut se connecter à Supabase');
    console.log('   de la même manière qu\'il se connecte à GitHub !\n');

    return true;

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return false;
  }
}

// Exécuter le test
testSupabaseConnection();
