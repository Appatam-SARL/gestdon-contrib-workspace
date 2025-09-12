# Fonctions de Gestion des Limites d'Utilisateurs

## Résumé

Nouvelles fonctions utilitaires créées pour vérifier si un compte contributeur a atteint le nombre maximal de membres de staff/personnel basé sur la propriété `maxUsers` de l'interface `IPackage`.

## Fonctions Créées

### 1. `hasReachedMaxUsers` (Utility)

```typescript
export const hasReachedMaxUsers = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentUserCount: number
): boolean
```

**Fonction :** Vérifie si la limite maximale d'utilisateurs est atteinte
**Retour :** `true` si limite atteinte, `false` sinon

### 2. `getMaxUsersLimit` (Utility)

```typescript
export const getMaxUsersLimit = (
  subscription: tSubscription | null,
  packages: IPackage[]
): number | null
```

**Fonction :** Récupère le nombre maximal d'utilisateurs autorisés
**Retour :** Limite maximale ou `null` si non trouvé

### 3. `getRemainingUsersCount` (Utility)

```typescript
export const getRemainingUsersCount = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentUserCount: number
): number | null
```

**Fonction :** Calcule le nombre d'utilisateurs restants
**Retour :** Nombre restant ou `null` si non calculable

## Hook `usePackagePermissions`

### Nouvelles Fonctions Ajoutées

#### `hasReachedUserLimit(currentUserCount: number): boolean`

- Version hook de `hasReachedMaxUsers`
- Gère automatiquement les états de chargement et d'erreur

#### `getUserLimit(): number | null`

- Version hook de `getMaxUsersLimit`
- Retourne la limite du package actuel

#### `getRemainingUsersCount(currentUserCount: number): number | null`

- Version hook de `getRemainingUsersCount`
- Calcule les utilisateurs restants pour le package actuel

## Utilisation

### Vérification de Limite

```typescript
const { hasReachedUserLimit } = usePackagePermissions();

const canAddUser = !hasReachedUserLimit(currentStaffCount);

if (!canAddUser) {
  // Afficher message d'erreur
  // Désactiver bouton d'ajout
}
```

### Affichage des Informations

```typescript
const { getUserLimit, getRemainingUsersCount } = usePackagePermissions();

const maxUsers = getUserLimit();
const remainingUsers = getRemainingUsersCount(currentStaffCount);

// Afficher dans l'interface
// Créer barre de progression
// Afficher alertes
```

### Validation de Formulaire

```typescript
const { hasReachedUserLimit } = usePackagePermissions();

const validateForm = () => {
  if (hasReachedUserLimit(currentStaffCount)) {
    setError('Limite maximale atteinte');
    return false;
  }
  return true;
};
```

## Cas d'Usage

1. **Avant ajout d'utilisateur** : Vérifier la limite
2. **Interface utilisateur** : Afficher limites et progression
3. **Validation** : Empêcher l'ajout si limite atteinte
4. **Alertes** : Notifier quand proche de la limite

## Fichiers Modifiés

- **`src/utils/packagePermissions.ts`** : Nouvelles fonctions utilitaires
- **`src/hook/packagePermissions.hook.ts`** : Nouvelles fonctions dans le hook
- **`src/components/commons/UserLimitDemo.tsx`** : Composant de démonstration

## Sécurité

- **Principe "refuser par défaut"** : Limite atteinte si pas d'abonnement
- **Vérification systématique** : Avant toute opération d'ajout
- **Fallback sécurisé** : Interface sécurisée même en cas d'erreur

## Test

Utiliser le composant `UserLimitDemo` pour tester :

- Différents nombres d'utilisateurs
- Limites de packages
- États de chargement et d'erreur
- Comportement aux limites
