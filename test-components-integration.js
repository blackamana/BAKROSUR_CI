#!/usr/bin/env node
/**
 * Script de test d'intégration des composants Bien'ici
 * Vérifie que tous les fichiers nécessaires sont présents et correctement structurés
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Test d\'intégration des composants Bien\'ici\n');

const checks = [];

// 1. Vérifier les composants UI de base
console.log('1️⃣ Vérification des composants UI de base...');
const uiComponents = [
  'components/ui/inputs/RangeSlider.tsx',
  'components/ui/inputs/MultiSelect.tsx',
  'components/ui/buttons/FAB.tsx',
];

uiComponents.forEach(comp => {
  const exists = fs.existsSync(comp);
  checks.push({ name: comp, status: exists });
  console.log(`   ${exists ? '✅' : '❌'} ${comp}`);
});

// 2. Vérifier les composants de recherche
console.log('\n2️⃣ Vérification des composants de recherche Bien\'ici...');
const searchComponents = [
  'components/search/PropertySearchBar.tsx',
  'components/search/TransactionTypeTabs.tsx',
  'components/search/MainFilters.tsx',
  'components/search/ActiveFiltersBar.tsx',
  'components/search/SearchExample.tsx',
];

searchComponents.forEach(comp => {
  const exists = fs.existsSync(comp);
  checks.push({ name: comp, status: exists });
  console.log(`   ${exists ? '✅' : '❌'} ${comp}`);
});

// 3. Vérifier les types
console.log('\n3️⃣ Vérification des types TypeScript...');
const typeFiles = [
  'lib/types/search.types.ts',
];

typeFiles.forEach(file => {
  const exists = fs.existsSync(file);
  checks.push({ name: file, status: exists });
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// 4. Vérifier l'intégration dans search.tsx
console.log('\n4️⃣ Vérification de l\'intégration dans search.tsx...');
const searchPagePath = 'app/(tabs)/search.tsx';
if (fs.existsSync(searchPagePath)) {
  const content = fs.readFileSync(searchPagePath, 'utf-8');

  const imports = [
    'PropertySearchBar',
    'TransactionTypeTabs',
    'MainFilters',
    'ActiveFiltersBar',
  ];

  imports.forEach(imp => {
    const hasImport = content.includes(`import ${imp}`);
    const isUsed = content.includes(`<${imp}`);
    const integrated = hasImport && isUsed;
    checks.push({ name: `${imp} integration`, status: integrated });
    console.log(`   ${integrated ? '✅' : '❌'} ${imp} ${integrated ? '(importé et utilisé)' : '(non intégré)'}`);
  });
} else {
  console.log('   ❌ search.tsx n\'existe pas');
  checks.push({ name: 'search.tsx', status: false });
}

// 5. Vérifier les services Supabase
console.log('\n5️⃣ Vérification des services Supabase...');
const services = [
  'lib/services/property-search.service.ts',
  'lib/services/search-suggestions.service.ts',
  'lib/services/geolocation.service.ts',
];

services.forEach(service => {
  const exists = fs.existsSync(service);
  checks.push({ name: service, status: exists });
  console.log(`   ${exists ? '✅' : '❌'} ${service}`);
});

// 6. Vérifier les hooks React
console.log('\n6️⃣ Vérification des hooks React...');
const hooks = [
  'lib/hooks/usePropertySearch.ts',
  'lib/hooks/useSearchSuggestions.ts',
];

hooks.forEach(hook => {
  const exists = fs.existsSync(hook);
  checks.push({ name: hook, status: exists });
  console.log(`   ${exists ? '✅' : '❌'} ${hook}`);
});

// 7. Vérifier les documentations
console.log('\n7️⃣ Vérification de la documentation...');
const docs = [
  'BIENICI-UX-UI-ANALYSIS.md',
  'BIENICI-UI-SPECIFICATIONS.md',
  'BIENICI-TECHNICAL-IMPLEMENTATION.md',
  'BIENICI-IMPLEMENTATION-ROADMAP.md',
  'SUPABASE-INTEGRATION-GUIDE.md',
  'SUPABASE-DATABASE-ANALYSIS.md',
  'components/search/README.md',
];

docs.forEach(doc => {
  const exists = fs.existsSync(doc);
  checks.push({ name: doc, status: exists });
  console.log(`   ${exists ? '✅' : '❌'} ${doc}`);
});

// Résumé
console.log('\n' + '='.repeat(60));
const passed = checks.filter(c => c.status).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

if (percentage === 100) {
  console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
  console.log(`✅ ${passed}/${total} vérifications réussies (${percentage}%)`);
  console.log('\n🚀 Les composants Bien\'ici sont correctement intégrés !');
  console.log('\n📱 Prochaines étapes :');
  console.log('   1. Lancez l\'application : npm run start-web');
  console.log('   2. Naviguez vers la page "Recherche"');
  console.log('   3. Testez les nouveaux composants interactifs');
  console.log('   4. Exécutez bakrosur-extensions.sql sur Supabase');
} else {
  console.log('⚠️  CERTAINS TESTS ONT ÉCHOUÉ');
  console.log(`${passed}/${total} vérifications réussies (${percentage}%)`);
  console.log('\n❌ Fichiers manquants :');
  checks.filter(c => !c.status).forEach(c => {
    console.log(`   - ${c.name}`);
  });
}
console.log('='.repeat(60));
