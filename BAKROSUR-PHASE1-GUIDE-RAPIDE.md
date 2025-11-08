# 🚀 GUIDE DE DÉMARRAGE RAPIDE - PHASE 1

## ⏱️ Installation en 30 minutes

### ÉTAPE 1 : Obtenir l'accès SIGFU (3-6 semaines)

```
┌─────────────────────────────────────────┐
│  📞 Contacter le MCLU                   │
│  ✉️ contact@mclu.gouv.ci                │
│  📍 Cité Administrative, Plateau        │
│  ⏰ Délai : 3-6 semaines                │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  📄 Documents requis :                  │
│  • Statuts entreprise                   │
│  • RCCM                                 │
│  • Plan d'utilisation API               │
│  • Engagement confidentialité           │
│  • Assurance RC Pro                     │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  🎫 Réception credentials :             │
│  • SIGFU_API_KEY                        │
│  • SIGFU_API_SECRET                     │
│  • SIGFU_WEBHOOK_SECRET                 │
└─────────────────────────────────────────┘
```

### ÉTAPE 2 : Installation technique (30 min)

```bash
# 1️⃣ Extraire l'archive
tar -xzf BAKROSUR-PHASE1-INTEGRATION-COMPLETE.tar.gz
cd bakrosur-phase1

# 2️⃣ Copier les fichiers
cp -r lib/* ~/votre-projet/lib/
cp -r components/* ~/votre-projet/components/
cp -r app/* ~/votre-projet/app/

# 3️⃣ Installer les dépendances
cd ~/votre-projet
npm install axios ioredis react-native-circular-progress

# 4️⃣ Configurer .env
cp bakrosur-phase1/.env.example .env
nano .env  # Ajouter vos credentials

# 5️⃣ Exécuter les migrations SQL
# Via Supabase Dashboard > SQL Editor
# Copier/Coller le contenu de chaque fichier dans sql/

# 6️⃣ Lancer l'app
npm start
```

---

## 📊 ARCHITECTURE VISUELLE

```
┌─────────────────────────────────────────────────────────────┐
│                    BAKRÔSUR MOBILE APP                       │
│                   (React Native + Expo)                      │
└────────────────────┬───────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐         ┌──────────────┐
│   Supabase   │         │ Redis Cache  │
│  PostgreSQL  │◄────────┤   (Upstash)  │
└──────┬───────┘         └──────────────┘
       │
       │  ┌─── Module 1: SIGFU API ───┐
       │  │                            │
       │  │  • Vérification titres     │
       │  │  • Cache intelligent       │
       │  │  • Rate limiting           │
       │  └────────────────────────────┘
       │
       │  ┌─── Module 2: BakroScore ───┐
       │  │                             │
       │  │  • Calcul auto (0-100)      │
       │  │  • 5 catégories             │
       │  │  • Recommandations          │
       │  └─────────────────────────────┘
       │
       │  ┌─── Module 3: Notaires ───┐
       │  │                           │
       │  │  • Matching intelligent   │
       │  │  • Réservations           │
       │  │  • Messagerie             │
       │  └───────────────────────────┘
       │
       ▼
┌────────────────┐
│  SIGFU API     │
│ (Gouv. CI)     │
└────────────────┘
```

---

## 💡 EXEMPLE D'UTILISATION

### Scénario 1 : Vérifier un bien immobilier

```typescript
// 1. Un utilisateur publie une annonce
const property = {
  title: "Villa 4 pièces Cocody",
  title_number: "ACD-AB-2024-12345",
  title_type: "ACD",
  // ...
};

// 2. SIGFU vérifie automatiquement
const verification = await verifyTitle(
  property.id,
  property.title_number,
  property.title_type
);

// 3. BakroScore calculé automatiquement
const score = await calculateBakroScore(property.id);

// 4. Badge affiché sur l'annonce
<SIGFUBadge 
  verified={verification.status === 'VERIFIED'}
  score={score.score}
/>
```

### Résultat visuel dans l'app :

```
┌────────────────────────────────────────┐
│ 🏠 Villa 4 pièces Cocody              │
│                                        │
│ ✅ Titre vérifié SIGFU                │
│ 🎯 BakroScore: 85/100 (EXCELLENT)     │
│                                        │
│ [Voir les détails]  [Contacter]       │
└────────────────────────────────────────┘
```

---

## 🎯 RÉSULTATS ATTENDUS

### Semaine 1-2 : SIGFU opérationnel
- ✅ API connectée
- ✅ Cache Redis fonctionnel
- ✅ Premières vérifications réussies

### Semaine 3-4 : BakroScore actif
- ✅ Scores calculés automatiquement
- ✅ Badges affichés sur les annonces
- ✅ Recommandations générées

### Semaine 5-6 : Notaires intégrés
- ✅ 10+ notaires enregistrés
- ✅ Système de matching opérationnel
- ✅ Premières réservations

### Semaine 7-8 : Production
- ✅ Tests complets passés
- ✅ Performance optimisée
- ✅ Monitoring actif
- ✅ **PHASE 1 TERMINÉE** 🎉

---

## 📈 MÉTRIQUES DE SUCCÈS

| Indicateur | Objectif | Priorité |
|------------|----------|----------|
| Vérifications SIGFU correctes | > 95% | 🔴 Critique |
| Temps de réponse API | < 2s | 🔴 Critique |
| Cache hit rate | > 70% | 🟡 Important |
| BakroScore auto-calculés | 100% | 🔴 Critique |
| Notaires enregistrés | 10+ | 🟢 Souhaité |
| Rendez-vous réservés | 50+ | 🟢 Souhaité |
| Couverture de tests | 100% | 🟡 Important |

---

## 🆘 BESOIN D'AIDE ?

### Problème technique ?
```bash
# Vérifier les logs
tail -f /var/log/bakrosur.log

# Tester SIGFU
curl http://localhost:8081/api/sigfu/test

# Vérifier Redis
redis-cli ping
```

### Questions ?
- 📧 dev@bakrosur.ci
- 💬 Slack #bakrosur-phase1
- 📚 docs/TROUBLESHOOTING.md

---

## 📦 CONTENU DE L'ARCHIVE

```
BAKROSUR-PHASE1-INTEGRATION-COMPLETE.tar.gz
├── bakrosur-phase1/
│   ├── lib/                    # Logique métier
│   ├── components/             # Composants React Native
│   ├── app/                    # Écrans
│   ├── sql/                    # Migrations SQL
│   ├── docs/                   # Documentation
│   └── .env.example            # Variables d'environnement
├── BAKROSUR-PHASE1-PLAN-IMPLEMENTATION.md
└── BAKROSUR-PHASE1-MODULE3-ET-DATABASE.md
```

**Taille :** 41 KB  
**Fichiers :** 50+  
**Lignes de code :** 3000+

---

## ✅ CHECKLIST DE DÉMARRAGE

Avant de commencer, assurez-vous d'avoir :

- [ ] Accès API SIGFU (credentials)
- [ ] Compte Supabase configuré
- [ ] Redis opérationnel (Upstash ou local)
- [ ] Node.js 18+ installé
- [ ] Expo CLI installé
- [ ] Git configuré
- [ ] .env créé et rempli
- [ ] Migrations SQL exécutées
- [ ] Tests unitaires passés

---

## 🎓 PROCHAINES ÉTAPES

Une fois Phase 1 terminée :

### Phase 2 (Mois 3-4)
- 💳 **BakroSur Pay** (Escrow + Mobile Money)
- 📚 **Centre d'Information Juridique**
- 🚨 **Système d'Alertes Avancé**

### Phase 3 (Mois 5-6)
- 🔗 **Blockchain Traçabilité**
- 🏠 **Visites Virtuelles 360°**
- 📱 **Application Mobile Native**

---

**🚀 Prêt à révolutionner l'immobilier ivoirien !**

*Développé avec ❤️ par l'équipe Bakrôsur*
