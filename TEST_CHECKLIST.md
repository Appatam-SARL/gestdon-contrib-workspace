# Checklist de Test - GestDon Contrib

Utilisez cette checklist pour suivre votre progression lors des tests.

## 🔐 Authentification

- [ ] Connexion avec compte admin
- [ ] Connexion avec compte editor
- [ ] Connexion avec compte manager
- [ ] Connexion avec compte coordinator
- [ ] Déconnexion fonctionne
- [ ] Redirection après connexion

## 💰 Gestion des Dons

### Création de don
- [ ] Formulaire s'affiche correctement
- [ ] Tous les champs sont présents
- [ ] Soumission avec données valides fonctionne
- [ ] Validation des champs requis fonctionne
- [ ] Messages d'erreur s'affichent correctement
- [ ] Redirection après création réussie

### Liste des dons
- [ ] Liste s'affiche correctement
- [ ] Pagination fonctionne
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent
- [ ] Bouton "Enregistrer un don" visible selon permissions

### Détails d'un don
- [ ] Modal s'ouvre correctement
- [ ] Toutes les informations s'affichent
- [ ] Téléchargement PDF fonctionne
- [ ] Design responsive sur mobile

### Limites de package
- [ ] Barre de progression s'affiche
- [ ] Couleurs changent selon le pourcentage
- [ ] Badge d'alerte s'affiche à < 2 dons restants
- [ ] Message d'alerte s'affiche à la limite
- [ ] Bouton désactivé à la limite

## 👥 Gestion des Audiences

### Création d'audience
- [ ] Formulaire s'affiche correctement
- [ ] Tous les champs sont présents
- [ ] Validation des dates fonctionne
- [ ] Soumission avec données valides fonctionne
- [ ] Messages d'erreur s'affichent

### Détails d'audience
- [ ] Page s'affiche correctement
- [ ] Toutes les informations sont présentes
- [ ] Statut s'affiche correctement
- [ ] Boutons d'action selon le statut

### Validation d'audience
- [ ] Modal s'ouvre
- [ ] Formulaire de validation fonctionne
- [ ] Dates de validation s'enregistrent
- [ ] Statut se met à jour

### Rejet d'audience
- [ ] Modal s'ouvre
- [ ] Formulaire de motif fonctionne
- [ ] Motif s'enregistre
- [ ] Statut se met à jour

### Assignation d'audience
- [ ] Modal s'ouvre
- [ ] Liste des membres s'affiche
- [ ] Sélection fonctionne
- [ ] Assignation s'enregistre

### Assignation à un représentant
- [ ] Modal s'ouvre
- [ ] Formulaire complet fonctionne
- [ ] Validation des champs fonctionne
- [ ] Création du représentant fonctionne

### Archivage d'audience
- [ ] Confirmation s'affiche
- [ ] Archivage fonctionne
- [ ] Statut se met à jour

## 📄 Gestion des Rapports

### Création de rapport (3 étapes)

#### Étape 1 - Informations générales
- [ ] Formulaire s'affiche
- [ ] Champs nom et description présents
- [ ] Validation fonctionne
- [ ] Bouton "Suivant" fonctionne

#### Étape 2 - Engagements
- [ ] Formulaire s'affiche
- [ ] Tous les champs sont présents
- [ ] Validation fonctionne
- [ ] Bouton "Précédent" fonctionne
- [ ] Bouton "Suivant" fonctionne

#### Étape 3 - Documents
- [ ] Formulaire s'affiche
- [ ] Upload de fichiers fonctionne
- [ ] Sélection multiple fonctionne
- [ ] Validation du type de fichier fonctionne
- [ ] Bouton "Précédent" fonctionne
- [ ] Bouton "Créer le rapport" fonctionne

#### Soumission complète
- [ ] Tous les fichiers sont uploadés
- [ ] Rapport est créé
- [ ] Pas d'erreur "File is not iterable"
- [ ] Redirection après création
- [ ] Formulaire se réinitialise

### Visualisation de rapport
- [ ] Liste des rapports s'affiche
- [ ] Détails du rapport s'affichent
- [ ] Documents associés s'affichent
- [ ] Statut du rapport s'affiche

## 📱 Tests Responsive

### Mobile (< 640px)
- [ ] Page de liste des dons
- [ ] Page de détails d'audience
- [ ] Formulaire de création de don
- [ ] Formulaire de création de rapport
- [ ] Modals s'adaptent
- [ ] Navigation fonctionne
- [ ] Boutons accessibles

### Tablet (641px - 1024px)
- [ ] Mise en page optimisée
- [ ] Tableaux lisibles
- [ ] Formulaires bien espacés
- [ ] Modals bien centrés

### Desktop (> 1024px)
- [ ] Mise en page complète
- [ ] Toutes les colonnes visibles
- [ ] Espacement optimal
- [ ] Statistiques bien disposées

## ⚠️ Messages d'erreur

### Validation de formulaire
- [ ] Champs requis
- [ ] Format email invalide
- [ ] Format téléphone invalide
- [ ] Format date invalide
- [ ] Date de fin avant date de début
- [ ] Montant invalide

### Upload de fichiers
- [ ] Aucun fichier sélectionné
- [ ] Type de fichier invalide
- [ ] Taille de fichier trop grande

### Erreurs réseau
- [ ] Erreur de connexion
- [ ] Erreur serveur
- [ ] Session expirée

### Permissions
- [ ] Accès refusé
- [ ] Action non autorisée

## 🔍 Surveillance JavaScript

### Console du navigateur
- [ ] Aucune erreur JavaScript
- [ ] Aucun warning React
- [ ] Requêtes API réussies
- [ ] Pas de fuites de mémoire

### Performance
- [ ] Temps de chargement acceptable
- [ ] Pas de re-renders excessifs
- [ ] Images chargées correctement

## 🎯 Tests de workflow

### Workflow 1 : Audience complète
- [ ] Créer audience
- [ ] Valider audience
- [ ] Assigner audience
- [ ] Créer rapport
- [ ] Voir rapport

### Workflow 2 : Don complet
- [ ] Créer don
- [ ] Voir détails
- [ ] Télécharger PDF
- [ ] Filtrer les dons

### Workflow 3 : Permissions
- [ ] Tester avec EDITOR
- [ ] Tester avec MANAGER
- [ ] Tester avec COORDINATOR
- [ ] Vérifier les restrictions

### Workflow 4 : Limites
- [ ] Atteindre limite de dons
- [ ] Vérifier alertes
- [ ] Vérifier blocage

## 🐛 Bugs identifiés

### Bug 1
- **Description** : ________________
- **Page** : ________________
- **Sévérité** : Haute / Moyenne / Basse
- **Étapes pour reproduire** :
  1. ________________
  2. ________________
  3. ________________
- **Comportement attendu** : ________________
- **Comportement observé** : ________________

### Bug 2
- **Description** : ________________
- **Page** : ________________
- **Sévérité** : Haute / Moyenne / Basse
- **Étapes pour reproduire** :
  1. ________________
  2. ________________
  3. ________________
- **Comportement attendu** : ________________
- **Comportement observé** : ________________

## ✅ Résumé

- **Tests réussis** : ___ / ___
- **Tests échoués** : ___ / ___
- **Bugs critiques** : ___
- **Bugs majeurs** : ___
- **Bugs mineurs** : ___

## 📝 Notes

________________
________________
________________

---

**Date** : _______________
**Testeur** : _______________
**Version** : _______________

