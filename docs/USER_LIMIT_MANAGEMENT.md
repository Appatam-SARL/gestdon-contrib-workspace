# Gestion des Limites d'Utilisateurs

## Vue d'ensemble

Ce document décrit les nouvelles fonctions utilitaires créées pour gérer les limites d'utilisateurs basées sur la propriété `maxUsers` de l'interface `IPackage`. Ces fonctions permettent de vérifier si un compte contributeur a atteint le nombre maximal de membres de staff/personnel autorisés par son package.

## Fonctions Utilitaires

### 1. `hasReachedMaxUsers`

**Fichier :** `src/utils/packagePermissions.ts`

**Signature :**

```typescript
export const hasReachedMaxUsers = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentUserCount: number
): boolean
```

**Description :**
Vérifie si le compte contributeur de l'utilisateur a atteint le nombre maximal de membres de staff/personnel basée sur la propriété `maxUsers` de l'interface `IPackage`.

**Paramètres :**

- `subscription` : L'abonnement actuel de l'utilisateur
- `packages` : La liste des packages disponibles
- `currentUserCount` : Le nombre actuel d'utilisateurs/membres de staff

**Retour :**

- `true` si la limite maximale est atteinte
- `false` si la limite n'est pas encore atteinte

**Logique :**

1. Vérifie si l'utilisateur a un abonnement actif
2. Récupère le package associé à l'abonnement
3. Compare le nombre actuel d'utilisateurs avec `maxUsers`
4. Retourne `true` si `currentUserCount >= maxUsers`

**Exemple d'utilisation :**

```typescript
import { hasReachedMaxUsers } from '@/utils/packagePermissions';

const hasReachedLimit = hasReachedMaxUsers(
  userSubscription,
  availablePackages,
  currentStaffCount
);

if (hasReachedLimit) {
  console.log("Limite maximale d'utilisateurs atteinte");
  // Empêcher l'ajout de nouveaux membres
}
```

### 2. `getMaxUsersLimit`

**Fichier :** `src/utils/packagePermissions.ts`

**Signature :**

```typescript
export const getMaxUsersLimit = (
  subscription: tSubscription | null,
  packages: IPackage[]
): number | null
```

**Description :**
Récupère le nombre maximal d'utilisateurs autorisés pour le package de l'utilisateur.

**Paramètres :**

- `subscription` : L'abonnement actuel de l'utilisateur
- `packages` : La liste des packages disponibles

**Retour :**

- Le nombre maximal d'utilisateurs (`number`)
- `null` si l'abonnement ou le package n'est pas trouvé

**Exemple d'utilisation :**

```typescript
import { getMaxUsersLimit } from '@/utils/packagePermissions';

const maxUsers = getMaxUsersLimit(userSubscription, availablePackages);

if (maxUsers !== null) {
  console.log(`Limite maximale : ${maxUsers} utilisateurs`);
  // Afficher la limite dans l'interface
}
```

### 3. `getRemainingUsersCount`

**Fichier :** `src/utils/packagePermissions.ts`

**Signature :**

```typescript
export const getRemainingUsersCount = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentUserCount: number
): number | null
```

**Description :**
Récupère le nombre d'utilisateurs restants autorisés pour le package de l'utilisateur.

**Paramètres :**

- `subscription` : L'abonnement actuel de l'utilisateur
- `packages` : La liste des packages disponibles
- `currentUserCount` : Le nombre actuel d'utilisateurs/membres de staff

**Retour :**

- Le nombre d'utilisateurs restants (`number`)
- `0` si la limite est atteinte ou dépassée
- `null` si l'abonnement ou le package n'est pas trouvé

**Logique :**

1. Récupère la limite maximale avec `getMaxUsersLimit`
2. Calcule la différence : `maxUsers - currentUserCount`
3. Retourne `Math.max(0, difference)` pour éviter les valeurs négatives

**Exemple d'utilisation :**

```typescript
import { getRemainingUsersCount } from '@/utils/packagePermissions';

const remainingUsers = getRemainingUsersCount(
  userSubscription,
  availablePackages,
  currentStaffCount
);

if (remainingUsers !== null) {
  if (remainingUsers === 0) {
    console.log('Aucun utilisateur restant');
  } else {
    console.log(`${remainingUsers} utilisateur(s) restant(s)`);
  }
}
```

## Hook `usePackagePermissions`

### Nouvelles Fonctions Ajoutées

#### 1. `hasReachedUserLimit`

**Signature :**

```typescript
const hasReachedUserLimit = (currentUserCount: number): boolean
```

**Description :**
Vérifie si le compte contributeur a atteint le nombre maximal d'utilisateurs (version hook).

**Exemple d'utilisation :**

```typescript
const { hasReachedUserLimit } = usePackagePermissions();

const hasReachedLimit = hasReachedUserLimit(currentStaffCount);

if (hasReachedLimit) {
  // Afficher un message d'erreur
  // Désactiver le bouton d'ajout
}
```

#### 2. `getUserLimit`

**Signature :**

```typescript
const getUserLimit = (): number | null
```

**Description :**
Récupère le nombre maximal d'utilisateurs autorisés pour le package actuel (version hook).

**Exemple d'utilisation :**

```typescript
const { getUserLimit } = usePackagePermissions();

const maxUsers = getUserLimit();

if (maxUsers !== null) {
  // Afficher la limite dans l'interface
  // Créer une barre de progression
}
```

#### 3. `getRemainingUsersCount`

**Signature :**

```typescript
const getRemainingUsersCount = (currentUserCount: number): number | null
```

**Description :**
Récupère le nombre d'utilisateurs restants autorisés pour le package actuel (version hook).

**Exemple d'utilisation :**

```typescript
const { getRemainingUsersCount } = usePackagePermissions();

const remainingUsers = getRemainingUsersCount(currentStaffCount);

if (remainingUsers !== null) {
  // Afficher le nombre restant
  // Afficher des alertes si proche de la limite
}
```

## Cas d'Usage

### 1. Vérification Avant Ajout d'Utilisateur

```typescript
const { hasReachedUserLimit } = usePackagePermissions();

const handleAddUser = () => {
  if (hasReachedUserLimit(currentStaffCount)) {
    toast.error("Limite maximale d'utilisateurs atteinte");
    return;
  }

  // Procéder à l'ajout de l'utilisateur
  addNewStaffMember();
};
```

### 2. Affichage de la Limite dans l'Interface

```typescript
const { getUserLimit, getRemainingUsersCount } = usePackagePermissions();

const maxUsers = getUserLimit();
const remainingUsers = getRemainingUsersCount(currentStaffCount);

return (
  <div>
    <p>Utilisateurs actuels : {currentStaffCount}</p>
    {maxUsers && <p>Limite maximale : {maxUsers}</p>}
    {remainingUsers !== null && <p>Utilisateurs restants : {remainingUsers}</p>}
  </div>
);
```

### 3. Barre de Progression

```typescript
const { getUserLimit, hasReachedUserLimit } = usePackagePermissions();

const maxUsers = getUserLimit();
const hasReachedLimit = hasReachedUserLimit(currentStaffCount);

if (maxUsers && maxUsers > 0) {
  const percentage = (currentStaffCount / maxUsers) * 100;

  return (
    <div className='w-full bg-gray-200 rounded-full h-2'>
      <div
        className={`h-2 rounded-full transition-all ${
          hasReachedLimit
            ? 'bg-red-500'
            : percentage > 80
            ? 'bg-yellow-500'
            : 'bg-green-500'
        }`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}
```

### 4. Validation de Formulaire

```typescript
const { hasReachedUserLimit } = usePackagePermissions();

const validateForm = () => {
  if (hasReachedUserLimit(currentStaffCount)) {
    setError("Limite maximale d'utilisateurs atteinte");
    return false;
  }

  return true;
};
```

## Gestion des Erreurs

### 1. Pas d'Abonnement Actif

```typescript
const { hasActiveSubscription, hasReachedUserLimit } = usePackagePermissions();

if (!hasActiveSubscription) {
  return <div>Abonnement requis pour cette fonctionnalité</div>;
}

const hasReachedLimit = hasReachedUserLimit(currentStaffCount);
```

### 2. Package Non Trouvé

```typescript
const { getCurrentPackage, getUserLimit } = usePackagePermissions();

const currentPackage = getCurrentPackage();
const maxUsers = getUserLimit();

if (!currentPackage || maxUsers === null) {
  return <div>Impossible de récupérer les informations du package</div>;
}
```

### 3. Erreur de Chargement

```typescript
const { isLoading, error, hasReachedUserLimit } = usePackagePermissions();

if (isLoading) {
  return <div>Chargement des permissions...</div>;
}

if (error) {
  return <div>Erreur : {error.message}</div>;
}

const hasReachedLimit = hasReachedUserLimit(currentStaffCount);
```

## Bonnes Pratiques

### 1. Vérification Systématique

Toujours vérifier la limite avant d'autoriser l'ajout d'un nouvel utilisateur :

```typescript
// ✅ Bon
if (!hasReachedUserLimit(currentStaffCount)) {
  addNewUser();
} else {
  showLimitReachedMessage();
}

// ❌ Mauvais
addNewUser(); // Sans vérification
```

### 2. Feedback Utilisateur

Fournir un feedback clair sur l'état des limites :

```typescript
const { getUserLimit, getRemainingUsersCount } = usePackagePermissions();

const maxUsers = getUserLimit();
const remainingUsers = getRemainingUsersCount(currentStaffCount);

if (remainingUsers !== null && remainingUsers <= 2) {
  showWarning(`Il ne reste que ${remainingUsers} utilisateur(s) disponible(s)`);
}
```

### 3. Gestion des États de Chargement

Gérer correctement les états de chargement et d'erreur :

```typescript
const { isLoading, error, hasReachedUserLimit } = usePackagePermissions();

if (isLoading) {
  return <Spinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

const hasReachedLimit = hasReachedUserLimit(currentStaffCount);
```

## Tests

### 1. Test des Limites

```typescript
describe('User Limit Functions', () => {
  it('should detect when user limit is reached', () => {
    const mockSubscription = { packageId: 'package1' };
    const mockPackages = [{ _id: 'package1', maxUsers: 5 }];

    expect(hasReachedMaxUsers(mockSubscription, mockPackages, 5)).toBe(true);
    expect(hasReachedMaxUsers(mockSubscription, mockPackages, 6)).toBe(true);
    expect(hasReachedMaxUsers(mockSubscription, mockPackages, 4)).toBe(false);
  });

  it('should return correct remaining users count', () => {
    const mockSubscription = { packageId: 'package1' };
    const mockPackages = [{ _id: 'package1', maxUsers: 10 }];

    expect(getRemainingUsersCount(mockSubscription, mockPackages, 7)).toBe(3);
    expect(getRemainingUsersCount(mockSubscription, mockPackages, 10)).toBe(0);
    expect(getRemainingUsersCount(mockSubscription, mockPackages, 12)).toBe(0);
  });
});
```

### 2. Test des Cas d'Erreur

```typescript
describe('User Limit Error Handling', () => {
  it('should handle null subscription', () => {
    const mockPackages = [{ _id: 'package1', maxUsers: 5 }];

    expect(hasReachedMaxUsers(null, mockPackages, 3)).toBe(true);
    expect(getMaxUsersLimit(null, mockPackages)).toBe(null);
  });

  it('should handle package not found', () => {
    const mockSubscription = { packageId: 'nonexistent' };
    const mockPackages = [{ _id: 'package1', maxUsers: 5 }];

    expect(hasReachedMaxUsers(mockSubscription, mockPackages, 3)).toBe(true);
    expect(getMaxUsersLimit(mockSubscription, mockPackages)).toBe(null);
  });
});
```

## Conclusion

Ces nouvelles fonctions utilitaires offrent une solution robuste et sécurisée pour gérer les limites d'utilisateurs basées sur les packages d'abonnement. Elles s'intègrent parfaitement avec le système de permissions existant et offrent une API claire et intuitive pour les développeurs.

### Avantages

- **Sécurité** : Vérification automatique des limites avant autorisation
- **Flexibilité** : Support des packages avec `packageId` string ou objet direct
- **Performance** : Calculs optimisés avec gestion du cache
- **Maintenabilité** : Code centralisé et facilement testable
- **UX** : Feedback utilisateur clair sur l'état des limites

### Utilisation Recommandée

- Vérifier les limites avant toute opération d'ajout d'utilisateur
- Afficher les informations de limite dans l'interface utilisateur
- Utiliser les hooks React pour une intégration facile
- Gérer correctement les états de chargement et d'erreur
- Tester tous les cas d'usage et d'erreur
