# Cahier des charges de l'application **Swipe & Cook**

## 1. Présentation du projet

- **Nom du projet** : Swipe & Cook
- **Description** : Swipe & Cook est une application mobile qui permet aux utilisateurs de découvrir des recettes en "swipant" de manière ludique, à l'instar de Tinder. L'application intègre des fonctionnalités avancées telles que la possibilité d’ajouter des recettes personnelles ou publiques, ainsi que des filtres spécifiques pour les régimes alimentaires, les allergies et les styles de cuisine.
- **Objectif** : Simplifier la recherche de recettes adaptées aux goûts et aux restrictions alimentaires des utilisateurs, tout en rendant l’expérience amusante et interactive.

## 2. Contexte et objectifs

- **Contexte** : La recherche de recettes en ligne peut être fastidieuse, notamment pour les personnes ayant des restrictions alimentaires ou des allergies. L'application Swipe & Cook répond à ce besoin en combinant la simplicité d'une application de "swiping" avec des fonctionnalités pratiques comme la gestion des ingrédients, des régimes alimentaires et des listes de courses adaptées.
- **Objectifs principaux** :
  - Offrir une expérience de découverte de recettes via un système de "swiping" simple et intuitif.
  - Permettre l'ajout de recettes personnelles ou publiques pour enrichir la communauté.
  - Prendre en compte les allergies, les intolérances et les goûts alimentaires pour proposer des recettes adaptées aux besoins de chacun.

## 3. Cibles

**Utilisateurs principaux** :

- Cuisiniers amateurs cherchant des idées de recettes rapides et amusantes.
- Personnes ayant des régimes et des styles alimentaires spécifiques (végétarien, végan, sans gluten, indien, américain, libanais...).
- Personnes souffrant d’allergies ou d’intolérances alimentaires (lactose, arachides, noix, etc.).

## 4. Fonctionnalités principales

1. **Système de swiping pour la découverte des recettes**

   - **Description** : Interface où les utilisateurs peuvent découvrir des recettes en faisant glisser les cartes à droite pour les sauvegarder ou à gauche pour les ignorer.
   - **Fonctionnalités associées** :
     - Swipe à droite pour sauvegarder la recette dans une liste de favoris.
     - Swipe à gauche pour passer à la recette suivante.
     - Visualisation détaillée d'une recette en tapant sur la carte : ingrédients, étapes, temps de préparation, etc.
     - **Filtres** :
       - Restrictions alimentaires (végétarien, végan, sans gluten, sans lactose, sans noix, etc.).
       - Produits détestés.
       - Type de cuisine.
       - Mode découverte.
     - **Alertes sur les allergies** : système d’alerte pour indiquer si une recette contient un ingrédient allergène défini par l'utilisateur (avec possibilité de le remplacer par une alternative recommandée).
     - Suggestions de nouvelles recettes en fonction des préférences enregistrées via les likes précédents.

2. **Ajout de recettes (personnelles ou publiques)**

   - **Description** : Les utilisateurs peuvent ajouter leurs propres recettes, soit en privé dans leur espace personnel, soit en les partageant avec la communauté.
   - **Fonctionnalités associées** :
     - Ajout de recettes personnelles pour un usage privé avec possibilité de les consulter plus tard.
     - Option pour partager une recette avec toute la communauté de Swipe & Cook (modération par l’équipe).
     - **Indicateurs d'allergènes** : Lors de l’ajout de recettes publiques, il sera obligatoire de spécifier si la recette contient des ingrédients allergènes (ex : gluten, noix, produits laitiers, etc.).
     - Catégorisation des recettes partagées (type de plat, temps de cuisson, niveau de difficulté, etc.).

3. **Autres fonctionnalités standards**
   - **Liste de favoris** : Sauvegarder des recettes aimées pour les consulter plus tard.

## 5. Spécifications techniques

- **Frontend** : Utilisation de frameworks comme React Native pour une compatibilité avec iOS et Android.
- **Backend** : Utilisation de Node.js ou Python (Django/Flask) pour gérer les API et les interactions avec la base de données.
- **Base de données (BDD)** : MongoDB ou PostgreSQL pour stocker les utilisateurs, recettes, et informations liées.

## 6. Interface utilisateur (UI/UX)

- **Design** : Interface moderne et épurée pour une utilisation intuitive.
- **Accessibilité** : Options pour ajuster la taille du texte et le contraste, navigation simplifiée pour les utilisateurs ayant des besoins spécifiques.

## 7. Sécurité\*\*

- **Modération** :
  - Validation des recettes par un modérateur avant leur publication.
  - **TOP 10** : affichage des recettes tendances du jour, de la semaine et du mois.
  - Modérateur avec la capacité de modifier les recettes en cas d’incohérences ou de fautes d’orthographe.
