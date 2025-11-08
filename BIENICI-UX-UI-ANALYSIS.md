# Analyse du site Bien'ici – Recommandations UX/UI pour un portail immobilier

> **Date**: 2025-11-08
> **Projet**: BAKROSUR_CI
> **Objectif**: Documenter les meilleures pratiques UX/UI observées sur Bien'ici pour guider le développement du portail immobilier BakroSur

## Table des matières

1. [Ergonomie des fenêtres de recherche de biens](#1-ergonomie-des-fenêtres-de-recherche-de-biens)
   - [Clarté et accessibilité des filtres](#clarté-et-accessibilité-des-filtres)
   - [Fonctionnalités de recherche avancées](#fonctionnalités-de-recherche-avancées)
   - [Recommandations pour la recherche](#recommandations-pour-la-recherche)
2. [Présentation des résultats de recherche](#2-présentation-des-résultats-de-recherche)
   - [Organisation et contenu des fiches résultats](#organisation-et-contenu-des-fiches-résultats)
   - [Recommandations pour l'affichage des résultats](#recommandations-pour-laffichage-des-résultats)

---

## 1. Ergonomie des fenêtres de recherche de biens (filtres et intuitivité)

Bien'ici se distingue par une interface de recherche immobilière à la fois claire, riche en fonctionnalités et facile à prendre en main. Sur la page d'accueil, l'utilisateur accède d'emblée à une **barre de recherche unifiée et intuitive**. Des onglets permettent de basculer rapidement entre « Acheter », « Louer », « Neuf » et « Terrain », orientant ainsi la recherche dès le départ.

Ce découpage guide l'utilisateur selon son projet et simplifie l'interface (par exemple, un acheteur de bien neuf n'aura pas les mêmes options qu'un locataire). Les champs de recherche offrent des **suggestions automatiques** (localités, quartiers…) pour accélérer la saisie et éviter les fautes. Un texte indicatif (« J'envisage d'acheter en… ») sert de placeholder, mettant en contexte les critères attendus. L'ensemble donne la possibilité de « rechercher en 1 phrase » et d'accéder instantanément à la carte du lieu choisi.

### Clarté et accessibilité des filtres

Une fois la recherche initiale lancée, Bien'ici présente des filtres supplémentaires de manière organisée et non intrusive. Les critères essentiels (budget, surface, nombre de pièces, etc.) sont immédiatement accessibles via des menus déroulants ou boutons bien libellés, tandis que les critères plus spécifiques (par exemple jardin, parking, ascenseur) sont regroupés dans un panneau **« Plus de filtres »**.

Ce design évite de surcharger l'écran tout en permettant aux utilisateurs exigeants de préciser leur recherche. Tous les filtres classiques sont disponibles :

- **Localisation** (ville/quartier)
- **Surface habitable**
- **Fourchettes de prix**
- **Nombre de pièces**
- **Équipements du logement** (jardin, parking, ascenseur, etc.)

#### Points forts de l'ergonomie

Le libellé des filtres est clair et compréhensible (par exemple, « 1+ », « 2+ chambres » pour le nombre minimal de chambres). La sélection des valeurs se fait par des contrôles appropriés :

- **Curseurs** pour les budgets
- **Cases à cocher** ou **boutons à bascule** pour les équipements

**Feedback en temps réel** : Chaque choix de filtre met à jour le nombre de résultats instantanément, donnant un retour immédiat à l'utilisateur.

**Résumé des critères actifs** : Juste au-dessus de la liste des résultats s'affiche une phrase du type :
> « Achat appartement à Paris – 3 pièces – max 700 000€ »

Cette formulation en langage naturel permet à l'utilisateur de garder à l'esprit les filtres appliqués et améliore grandement la transparence de l'interface.

### Fonctionnalités de recherche avancées

Bien'ici intègre des fonctionnalités innovantes qui enrichissent l'expérience sans nuire à l'intuitivité :

#### 1. Recherche par tracé sur carte

Un outil **« dessin »** permet de dessiner directement une zone à main levée sur la carte, afin de limiter la recherche à ce périmètre personnalisé. Cette solution est idéale pour :
- Cibler un quartier précis
- Éviter les secteurs indésirables
- Dépasser les limites administratives

#### 2. Recherche par temps de trajet

L'utilisateur peut indiquer :
- Une adresse de référence (travail, école…)
- Un temps de trajet maximal

Le site trouve alors tous les biens dans le périmètre correspondant. Par exemple :
> « Les appartements à 15 minutes en vélo de mon bureau »

Le portail calcule en quelques secondes la zone couverte et affiche les annonces correspondantes sur la carte et dans la liste.

#### 3. Recherche « Autour de moi »

Fonction de **géolocalisation** permettant de trouver les biens dans un rayon proche de la position actuelle de l'utilisateur – très utile sur mobile pour explorer le quartier où l'on se trouve.

#### 4. Adaptabilité mobile

Bien'ici est entièrement **responsive** :
- Sur mobile, les filtres se présentent dans des écrans dédiés
- La carte reste consultable en plein écran
- L'interface 3D demeure fluide
- Possibilité de basculer facilement entre vue carte et vue liste

### Recommandations pour la recherche

#### ✅ Structure des filtres

1. **Inclure tous les filtres essentiels** dès l'interface de recherche, avec des libellés clairs et un agencement logique (regrouper les critères par catégories)

2. **Garder l'interface épurée et intuitive** :
   - Afficher que les filtres principaux d'abord
   - Placer les critères avancés dans une section escamotable « plus de filtres »

3. **Mettre à jour le nombre de résultats** à chaque changement de filtre pour un retour instantané

4. **Afficher en haut de page un résumé des critères actifs** en langage clair (reprendre le modèle de Bien'ici qui formule la recherche comme une phrase)

#### ✅ Fonctions avancées

5. **Intégrer des fonctions avancées** inspirées de Bien'ici :
   - Dessin libre de zone sur la carte
   - Filtre par temps de trajet
   - Bouton de recherche autour de soi par géolocalisation

#### ✅ Accessibilité mobile

6. **Soigner l'accessibilité sur mobile** :
   - Prévoir une présentation adaptée (filtres sous forme de pop-up pleine page, bouton flottant pour accéder à la liste, etc.)
   - Veiller à la performance pour que l'application reste fluide

7. **Permettre de changer de mode d'affichage** (carte interactive versus liste classique) en un clic

---

## 2. Présentation des résultats de recherche (carte, liste, fiches de biens)

Bien'ici met l'accent sur une **visualisation géographique immersive** des résultats. Contrairement aux sites traditionnels qui listent simplement les annonces, Bien'ici affiche chaque bien géolocalisé sur une **carte interactive en 3D**, en complément de la liste classique.

### Interface carte + liste

Cette carte occupe une bonne partie de l'écran, notamment sur desktop, tandis qu'une liste ou grille de résultats apparaît à côté. L'utilisateur peut ainsi visualiser les logements dans leur environnement immédiat :
- Le quartier
- La rue
- Les espaces verts
- La densité du quartier

### Cartographie 3D

La cartographie 3D est un atout majeur du site :
- Chaque bâtiment est représenté (modèle 3D pour les programmes neufs, volume simple pour les constructions existantes)
- La hauteur correspond au nombre d'étages
- Permet de comprendre la densité du quartier sans occulter les annonces

### Points d'intérêt

Autour des biens, la carte intègre également les points d'intérêt pertinents :
- 🏫 Écoles
- 🛒 Commerces
- 🚇 Transports en commun
- 🌳 Parcs

Cette **contextualisation riche** permet à l'utilisateur d'évaluer d'un coup d'œil la qualité de l'emplacement du bien (proximité des commodités, accessibilité…).

### Interactivité de la carte

Sur Bien'ici, la carte n'est pas un simple décor, c'est un **élément central et interactif** :

1. **Navigation libre** : L'utilisateur peut naviguer librement (zoom, déplacement) et les résultats se mettent à jour en temps réel

2. **Commutateur intelligent** : Un commutateur « Rechercher quand je déplace la carte » laisse le choix entre un rafraîchissement automatique ou manuel des résultats

3. **Aperçu instantané** : Lorsqu'un bien est cliqué sur la carte, un aperçu de l'annonce s'affiche (photo + infos) sans changer de page

4. **Corrélation carte-liste** : Survoler ou sélectionner une annonce dans la liste peut surligner son emplacement sur la carte

5. **Affichage du prix** : Le prix ou un symbole est affiché directement sur chaque repère de bien sur la carte

### Organisation et contenu des fiches résultats

Chaque résultat sur Bien'ici est présenté sous forme de **carte compacte (card)** très lisible contenant :

#### Informations clés visibles

- 📷 **Photo du bien** (ou plusieurs, sous forme de carrousel)
- 💰 **Prix affiché en évidence**
- 🏠 **Type de bien** et description succincte (ex : Appartement 3 pièces, 67 m²)
- 📍 **Localisation** (ville et éventuellement quartier)

#### Badges et indicateurs

Des pictogrammes et badges pour indiquer :
- 🎥 Présence d'une visite virtuelle ou d'une vidéo
- ❤️ Mise en favoris
- 🆕 Badge « Neuf » pour les programmes neufs
- ⭐ Badge « Exclusivité »

#### Pour BakroSur

Dans le cadre du projet BakroSur, on pourrait imaginer :
- **BakroScore** : Score de confiance affiché sur la vignette
- 🛡️ **Badge « Titre vérifié »** : Pour que l'acheteur repère immédiatement les biens à faible risque

### Navigation fluide

Bien'ici ouvre souvent la fiche détaillée dans un **panneau latéral** sans rechargement complet de page. Cette approche :
- Maintient le contexte de recherche (carte + autres résultats) visible en arrière-plan
- Évite de « perdre » l'utilisateur lors de la navigation
- Encourage à explorer plusieurs annonces successivement

### Recommandations pour l'affichage des résultats

#### ✅ Carte interactive

1. **Intégrer une carte affichant les biens géolocalisés** en parallèle de la liste
   - Permettre zoom/dézoom, déplacement
   - Afficher directement des indicateurs sur les marqueurs (prix, statut)
   - Inclure une option de recherche dans la zone affichée avec mise à jour automatique

#### ✅ Liens carte-liste

2. **Synchronisation carte-liste** :
   - Cliquer sur un bien sur la carte surligne le bien dans la liste (et vice-versa)
   - Aperçu rapide du bien au survol/clic sur la carte (photo + prix + titre)

#### ✅ Liste de résultats claire

3. **Utiliser des vignettes avec photo et infos clés** bien visibles :
   - Prix, type, surface, localisation
   - Appliquer des badges ou labels pour distinguer certains types de biens
   - Garder une mise en page cohérente et lisible

#### ✅ Visuels de qualité

4. **Toujours montrer au moins une photo par annonce** :
   - Utiliser de grandes photos attractives
   - Intégrer les outils modernes (visite virtuelle)
   - Indiquer visuellement leur disponibilité pour encourager le clic

#### ✅ Fiche détaillée intégrée

5. **Permettre l'ouverture d'une fiche bien détaillée sans rupture** :
   - Par exemple sous forme de panneau latéral
   - L'utilisateur peut revenir facilement à la liste ou à la carte ensuite

#### ✅ Informations de contexte

6. **Afficher les informations de quartier** :
   - Points d'intérêt à proximité
   - Transports
   - Scores de commodités
   - Distance du bien aux éléments importants (ex : 500 m du métro, École à 5 min à pied)

#### ✅ Adaptation mobile

7. **Sur mobile, privilégier** :
   - Soit un affichage liste avec un bouton pour voir la carte en plein écran
   - Soit l'inverse
   - Basculement aisé entre carte et liste
   - Légèreté des contenus (désactiver certains éléments 3D trop lourds si nécessaire)

---

## Conclusion

En priorisant ces bonnes pratiques UX/UI observées sur Bien'ici, le projet BakroSur gagnera en :
- **Convivialité** : Interface intuitive et agréable
- **Efficacité** : Recherche rapide et sans frustration
- **Attractivité** : Navigation immersive et dynamique

### Points clés à retenir

1. **Clarté de la recherche** : Filtres bien pensés, outils innovants (tracé, temps de trajet)
2. **Présentation dynamique** : Carte interactive + fiches riches en informations visuelles
3. **Immersion** : Cartographie 3D, points d'intérêt, contexte géographique
4. **Fluidité** : Navigation sans rupture, aperçus instantanés, synchronisation carte-liste

### Spécificités BakroSur

Le projet BakroSur peut se différencier en ajoutant :
- **BakroScore** visible sur les vignettes
- **Badge « Titre vérifié »** pour la sécurisation des transactions
- **Système de confiance** intégré à l'expérience de recherche

En s'inspirant de l'ergonomie réussie de Bien'ici – un portail décrit comme « simplifié, immersif et personnalisé » – le projet BakroSur offrira une expérience utilisateur moderne et optimisée, gage de satisfaction accrue et de succès à long terme.

---

## Références

- [Bien'ici - Site officiel](https://www.bienici.com)
- [Solutions Pro Bien'ici](https://solutionspro.bienici.com)
- [Immo2.pro - Analyse Bien'ici](https://immo2.pro)
- [Trustpilot - Avis Bien'ici](https://trustpilot.com)
- [Resources Piano - Étude Bien'ici](https://resources.piano.io)

---

**Document créé le** : 2025-11-08
**Dernière modification** : 2025-11-08
**Auteur** : Équipe BakroSur
**Statut** : ✅ Validé pour référence UX/UI
