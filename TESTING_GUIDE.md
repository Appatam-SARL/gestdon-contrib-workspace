# Guide de Test Complet - GestDon Contrib

Ce document fournit des données de test et des scénarios pour tester tous les formulaires, workflows, designs responsive et messages d'erreur de l'application.

## 📋 Table des matières

1. [Données de test](#données-de-test)
2. [Formulaires à tester](#formulaires-à-tester)
3. [Workflows à tester](#workflows-à-tester)
4. [Tests responsive](#tests-responsive)
5. [Messages d'erreur à vérifier](#messages-derreur-à-vérifier)
6. [Surveillance JavaScript](#surveillance-javascript)

---

## 🧪 Données de test

### Données utilisateur de test

```javascript
// Utilisateur administrateur
{
  email: "admin@test.com",
  password: "Test1234!",
  firstName: "Admin",
  lastName: "Test",
  phone: "+33612345678"
}

// Utilisateur éditeur
{
  email: "editor@test.com",
  password: "Test1234!",
  firstName: "Éditeur",
  lastName: "Test",
  phone: "+33612345679"
}

// Utilisateur manager
{
  email: "manager@test.com",
  password: "Test1234!",
  firstName: "Manager",
  lastName: "Test",
  phone: "+33612345680"
}
```

### Données de don

```javascript
{
  title: "Don de test - Matériel scolaire",
  description: "Matériel scolaire pour enfants défavorisés",
  montant: "50000",
  devise: "XOF",
  type: "Par nature",
  donorFullname: "Jean Dupont",
  donorPhone: "+33612345678",
  observation: "Livraison prévue le 15/12/2024"
}
```

### Données d'audience

```javascript
{
  title: "Audience de test - Réunion communautaire",
  description: "Réunion avec les membres de la communauté pour discuter des projets futurs",
  locationOfActivity: "Salle communautaire, Abidjan",
  startDate: "2024-12-20T10:00:00",
  endDate: "2024-12-20T12:00:00"
}
```

### Données de rapport

```javascript
{
  name: "Rapport de test - Audience communautaire",
  description: "Rapport détaillé de la réunion communautaire du 20 décembre 2024. Points discutés : projets futurs, budget, calendrier.",
  commitments: {
    action: "Organiser une prochaine réunion dans un mois",
    responsible: {
      firstName: "Marie",
      lastName: "Martin"
    },
    dueDate: "2025-01-20"
  }
}
```

### Données de bénéficiaire

```javascript
{
  fullName: "Association Test Solidarité",
  email: "contact@test-solidarite.org",
  phone: "+22501234567",
  address: "123 Rue Test, Abidjan",
  type: "ORGANISATION"
}
```

---

## 📝 Formulaires à tester

### 1. Formulaire de création de don (`/dons/new`)

**Données de test valides :**
- Titre : "Don de matériel médical"
- Description : "Matériel médical pour le centre de santé"
- Montant : "100000"
- Devise : "XOF"
- Type : "Par nature"
- Nom du donateur : "Pierre Martin"
- Téléphone : "+33612345678"
- Observations : "Livraison urgente"

**Tests à effectuer :**
- [ ] Soumission avec tous les champs remplis
- [ ] Validation des champs requis (essayer de soumettre sans titre)
- [ ] Validation du format de téléphone
- [ ] Validation du montant (doit être numérique)
- [ ] Affichage des messages d'erreur appropriés
- [ ] Redirection après soumission réussie

**Messages d'erreur attendus :**
- "Le titre est requis"
- "Le montant doit être un nombre valide"
- "Le format du téléphone est invalide"

### 2. Formulaire de création d'audience (`/audiences/new`)

**Données de test valides :**
- Titre : "Réunion de coordination"
- Description : "Réunion pour coordonner les activités du mois"
- Lieu : "Salle de réunion principale"
- Date de début : "2024-12-25T09:00:00"
- Date de fin : "2024-12-25T11:00:00"

**Tests à effectuer :**
- [ ] Soumission avec tous les champs remplis
- [ ] Validation des dates (date de fin après date de début)
- [ ] Validation des champs requis
- [ ] Affichage des messages d'erreur

**Messages d'erreur attendus :**
- "La date de fin doit être après la date de début"
- "Le lieu est requis"

### 3. Formulaire de création de rapport (3 étapes)

**Étape 1 - Informations générales :**
- Nom du rapport : "Rapport mensuel décembre"
- Description : "Rapport détaillé des activités du mois de décembre"

**Étape 2 - Engagements :**
- Action : "Organiser une formation"
- Nom du responsable : "Sophie"
- Prénom du responsable : "Bernard"
- Date d'échéance : "2025-01-15"

**Étape 3 - Documents :**
- Uploader au moins une image (PNG, JPG, JPEG)

**Tests à effectuer :**
- [ ] Navigation entre les étapes (Précédent/Suivant)
- [ ] Validation à chaque étape
- [ ] Upload de fichiers multiples
- [ ] Validation du type de fichier (essayer d'uploader un PDF)
- [ ] Soumission complète du formulaire
- [ ] Vérification que les fichiers sont bien envoyés

**Messages d'erreur attendus :**
- "Veuillez sélectionner au moins un fichier"
- "Type de fichier non accepté. Formats acceptés : PNG, JPG, JPEG"

### 4. Formulaire de validation d'audience

**Données de test :**
- Date de début : "2024-12-20T10:00:00"
- Date de fin : "2024-12-20T12:00:00"

**Tests à effectuer :**
- [ ] Validation avec dates valides
- [ ] Validation des champs requis
- [ ] Confirmation avant validation

### 5. Formulaire d'assignation d'audience

**Données de test :**
- Sélectionner un membre du staff dans la liste déroulante

**Tests à effectuer :**
- [ ] Affichage de la liste des membres
- [ ] Sélection d'un membre
- [ ] Soumission de l'assignation
- [ ] Vérification de la mise à jour de l'audience

### 6. Formulaire de rejet d'audience

**Données de test :**
- Motif : "Informations incomplètes. Veuillez fournir plus de détails sur le bénéficiaire."

**Tests à effectuer :**
- [ ] Validation du champ motif (requis)
- [ ] Soumission du rejet
- [ ] Vérification de la mise à jour du statut

### 7. Formulaire de représentant

**Données de test :**
- Nom : "Dupont"
- Prénom : "Jean"
- Email : "jean.dupont@test.com"
- Téléphone : "+33612345678"

**Tests à effectuer :**
- [ ] Validation de tous les champs
- [ ] Validation du format d'email
- [ ] Validation du format de téléphone
- [ ] Soumission du formulaire

---

## 🔄 Workflows à tester

### Workflow 1 : Création complète d'une audience avec rapport

1. **Créer une audience**
   - Aller sur `/audiences/new`
   - Remplir le formulaire avec les données de test
   - Soumettre

2. **Valider l'audience**
   - Aller sur la page de détails de l'audience
   - Cliquer sur "Valider"
   - Remplir les dates de validation
   - Confirmer

3. **Assigner l'audience**
   - Cliquer sur "Assigner"
   - Sélectionner un membre du staff
   - Confirmer

4. **Créer un rapport**
   - Cliquer sur "Créer un rapport"
   - Remplir les 3 étapes du formulaire
   - Uploader des images
   - Soumettre

5. **Vérifier le rapport**
   - Vérifier que le rapport apparaît dans la liste
   - Cliquer sur "Voir le rapport"
   - Vérifier tous les détails

**Points de contrôle :**
- [ ] L'audience est créée avec le bon statut
- [ ] La validation fonctionne correctement
- [ ] L'assignation est enregistrée
- [ ] Le rapport est créé avec les fichiers
- [ ] Tous les détails sont corrects

### Workflow 2 : Gestion complète d'un don

1. **Créer un don**
   - Aller sur `/dons/new`
   - Remplir le formulaire
   - Soumettre

2. **Voir les détails**
   - Cliquer sur l'icône "Voir" dans la liste
   - Vérifier toutes les informations

3. **Télécharger le PDF**
   - Cliquer sur "Télécharger le PDF"
   - Vérifier que le téléchargement fonctionne

4. **Filtrer les dons**
   - Utiliser la barre de recherche
   - Appliquer des filtres par période
   - Vérifier les résultats

**Points de contrôle :**
- [ ] Le don est créé correctement
- [ ] Les détails s'affichent correctement
- [ ] Le PDF se télécharge
- [ ] Les filtres fonctionnent

### Workflow 3 : Gestion des permissions

1. **Tester avec différents rôles**
   - Se connecter avec un rôle EDITOR
   - Vérifier les actions disponibles
   - Se connecter avec un rôle MANAGER
   - Vérifier les actions disponibles
   - Se connecter avec un rôle COORDINATOR
   - Vérifier les actions disponibles

2. **Tester les restrictions**
   - Essayer d'accéder à des pages sans permission
   - Vérifier les messages d'erreur appropriés

**Points de contrôle :**
- [ ] Les permissions sont respectées
- [ ] Les boutons appropriés sont affichés/cachés
- [ ] Les messages d'erreur sont clairs

### Workflow 4 : Limites de package

1. **Tester la limite de dons**
   - Créer des dons jusqu'à atteindre la limite
   - Vérifier l'affichage de l'alerte
   - Vérifier que le bouton "Enregistrer un don" est désactivé
   - Vérifier le message d'alerte

2. **Tester la barre de progression**
   - Vérifier que la barre s'affiche correctement
   - Vérifier les couleurs (vert, jaune, rouge)
   - Vérifier le badge d'alerte

**Points de contrôle :**
- [ ] La limite est correctement détectée
- [ ] Les alertes s'affichent au bon moment
- [ ] L'interface est bloquée quand la limite est atteinte

---

## 📱 Tests responsive

### Breakpoints à tester

- **Mobile** : 320px - 640px
- **Tablet** : 641px - 1024px
- **Desktop** : 1025px+

### Pages à tester en responsive

#### 1. Page de liste des dons (`/dons`)

**Mobile (< 640px) :**
- [ ] Le tableau devient une liste de cartes
- [ ] Les boutons d'action sont accessibles
- [ ] La barre de recherche est pleine largeur
- [ ] Les filtres sont dans un modal
- [ ] La pagination est adaptée

**Tablet (641px - 1024px) :**
- [ ] Le tableau s'affiche correctement
- [ ] Les colonnes sont visibles
- [ ] Les boutons sont bien espacés

**Desktop (> 1024px) :**
- [ ] Toutes les colonnes sont visibles
- [ ] L'espacement est optimal
- [ ] Les statistiques sont bien disposées

#### 2. Page de détails d'audience (`/audiences/[id]`)

**Mobile :**
- [ ] Les cartes s'empilent verticalement
- [ ] Les boutons d'action sont accessibles
- [ ] Le formulaire de rapport s'adapte
- [ ] Les modals sont pleine largeur

**Tablet :**
- [ ] La mise en page est optimisée
- [ ] Les informations sont bien organisées

**Desktop :**
- [ ] Toutes les informations sont visibles
- [ ] La mise en page est équilibrée

#### 3. Formulaire de création de rapport (3 étapes)

**Mobile :**
- [ ] Les étapes sont bien visibles
- [ ] Les champs de formulaire sont pleine largeur
- [ ] Les boutons sont accessibles
- [ ] L'upload de fichiers fonctionne

**Tablet :**
- [ ] Le formulaire est bien centré
- [ ] Les champs sont bien espacés

**Desktop :**
- [ ] Le formulaire est centré avec une largeur optimale
- [ ] Tous les éléments sont bien alignés

### Tests spécifiques responsive

- [ ] Navigation hamburger sur mobile
- [ ] Modals pleine largeur sur mobile
- [ ] Tableaux scrollables horizontalement sur mobile
- [ ] Images responsives
- [ ] Textes lisibles sur toutes les tailles
- [ ] Boutons assez grands pour le touch (min 44x44px)

---

## ⚠️ Messages d'erreur à vérifier

### Erreurs de validation de formulaire

1. **Champs requis**
   - Message : "Ce champ est requis"
   - Vérifier sur tous les formulaires

2. **Format invalide**
   - Email : "Format d'email invalide"
   - Téléphone : "Format de téléphone invalide"
   - Date : "Format de date invalide"

3. **Valeurs invalides**
   - Montant : "Le montant doit être un nombre positif"
   - Date de fin avant date de début : "La date de fin doit être après la date de début"

### Erreurs de soumission

1. **Erreur réseau**
   - Message : "Erreur de connexion. Veuillez réessayer."
   - Vérifier le comportement en cas de perte de connexion

2. **Erreur serveur**
   - Message : "Une erreur est survenue. Veuillez réessayer plus tard."
   - Vérifier les messages d'erreur du backend

3. **Erreur d'authentification**
   - Message : "Session expirée. Veuillez vous reconnecter."
   - Vérifier la redirection vers la page de connexion

### Erreurs spécifiques

1. **Upload de fichiers**
   - "Veuillez sélectionner au moins un fichier"
   - "Type de fichier non accepté"
   - "Taille de fichier trop grande (max 5MB)"

2. **Limites de package**
   - "Limite de dons atteinte"
   - "Limite d'utilisateurs atteinte"

3. **Permissions**
   - "Vous n'avez pas les permissions pour effectuer cette action"

### Tests des messages d'erreur

- [ ] Les messages s'affichent au bon endroit
- [ ] Les messages sont clairs et compréhensibles
- [ ] Les messages disparaissent après correction
- [ ] Les messages sont stylisés correctement (rouge pour erreur)
- [ ] Les messages sont accessibles (lecture d'écran)

---

## 🔍 Surveillance JavaScript

### Console du navigateur

Ouvrir la console (F12) et surveiller :

1. **Erreurs JavaScript**
   - Vérifier qu'il n'y a pas d'erreurs rouges
   - Vérifier les warnings (jaunes)
   - Vérifier les erreurs de réseau

2. **Logs de débogage**
   - Vérifier les `console.log` pour le débogage
   - Vérifier que les logs ne sont pas en production

### Erreurs courantes à surveiller

1. **Erreurs de type**
   ```
   TypeError: Cannot read property 'X' of undefined
   ```
   - Vérifier les accès aux propriétés d'objets

2. **Erreurs de rendu React**
   ```
   Warning: Cannot update a component while rendering
   ```
   - Vérifier les mises à jour d'état pendant le rendu

3. **Erreurs de clé React**
   ```
   Warning: Each child in a list should have a unique "key" prop
   ```
   - Vérifier les listes sans clés uniques

4. **Erreurs de hook React**
   ```
   Error: Hooks can only be called inside the body of a function component
   ```
   - Vérifier l'utilisation correcte des hooks

### Tests de performance

1. **Temps de chargement**
   - Vérifier le temps de chargement initial
   - Vérifier le temps de chargement des pages
   - Utiliser l'onglet Network pour voir les requêtes

2. **Mémoire**
   - Surveiller l'utilisation de la mémoire
   - Vérifier les fuites de mémoire (onglet Performance)

3. **Rendu**
   - Vérifier le nombre de re-renders
   - Utiliser React DevTools pour analyser les composants

### Checklist de surveillance

- [ ] Aucune erreur JavaScript dans la console
- [ ] Aucun warning React
- [ ] Les requêtes API se terminent correctement
- [ ] Pas de fuites de mémoire
- [ ] Les performances sont acceptables
- [ ] Les images se chargent correctement
- [ ] Les polices se chargent correctement

---

## 🧪 Scénarios de test supplémentaires

### Test de régression

1. **Test de la correction "File is not iterable"**
   - Créer un rapport avec des fichiers
   - Vérifier que les fichiers sont bien uploadés
   - Vérifier qu'il n'y a pas d'erreur dans la console
   - Vérifier que le rapport est créé correctement

2. **Test de navigation**
   - Naviguer entre les pages
   - Vérifier que les états sont préservés
   - Vérifier que les formulaires se réinitialisent correctement

3. **Test de fermeture de modals**
   - Ouvrir un modal
   - Le fermer
   - Vérifier que les états sont réinitialisés
   - Vérifier qu'il n'y a pas d'erreurs

### Tests d'intégration

1. **Test du flux complet de création d'audience**
   - Créer → Valider → Assigner → Créer rapport → Voir rapport

2. **Test du flux complet de gestion de don**
   - Créer → Voir détails → Télécharger PDF → Filtrer

3. **Test des permissions**
   - Tester avec chaque rôle
   - Vérifier les restrictions
   - Vérifier les accès autorisés

---

## 📊 Rapport de test

Après avoir effectué tous les tests, remplir ce rapport :

### Résultats globaux

- **Formulaires testés** : ___ / ___
- **Workflows testés** : ___ / ___
- **Tests responsive** : ___ / ___
- **Erreurs trouvées** : ___
- **Warnings trouvés** : ___

### Problèmes identifiés

1. **Problème** : ________________
   - **Page** : ________________
   - **Sévérité** : Haute / Moyenne / Basse
   - **Description** : ________________

2. **Problème** : ________________
   - **Page** : ________________
   - **Sévérité** : Haute / Moyenne / Basse
   - **Description** : ________________

### Recommandations

1. ________________
2. ________________
3. ________________

---

## 🎯 Checklist rapide

### Avant de commencer les tests

- [ ] L'application est démarrée (`npm run dev`)
- [ ] Le navigateur est ouvert (Chrome/Firefox recommandé)
- [ ] La console du navigateur est ouverte (F12)
- [ ] Les outils de développement React sont installés
- [ ] Un compte de test est créé

### Après chaque test

- [ ] Vérifier la console pour les erreurs
- [ ] Vérifier que les données sont correctement enregistrées
- [ ] Vérifier que l'interface est mise à jour
- [ ] Noter les problèmes rencontrés

---

**Date du test** : _______________
**Testeur** : _______________
**Version testée** : _______________

