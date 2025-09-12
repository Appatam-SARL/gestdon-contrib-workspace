# Système de Permissions des Packages

## Vue d'ensemble

Ce système permet de vérifier si le package auquel un utilisateur est abonné a le droit d'accéder à des fonctionnalités spécifiques. Il utilise la propriété `features` de l'interface `IPackage` qui contient un tableau d'objets avec les propriétés `name`, `value` et `enable`.

## Structure des Features

Chaque package contient un tableau de fonctionnalités avec la structure suivante :

```typescript
features: {
  name: string; // Nom de la fonctionnalité (ex: "create_activity")
  value: string; // Valeur/limite de la fonctionnalité (ex: "10", "unlimited")
  enable: boolean; // Si la fonctionnalité est activée ou non
}
[];
```

### Exemple de Features

```typescript
const packageFeatures = [
  {
    name: 'create_activity',
    value: '10',
    enable: true,
  },
  {
    name: 'upload_files',
    value: '100MB',
    enable: true,
  },
  {
    name: 'advanced_analytics',
    value: 'basic',
    enable: false,
  },
];
```

## Fonctions Utilitaires

### 1. `hasFeatureAccess`

Vérifie si l'utilisateur a accès à une fonctionnalité spécifique.

```typescript
import { hasFeatureAccess } from '@/utils/packagePermissions';

const canCreateActivity = hasFeatureAccess(
  userSubscription,
  availablePackages,
  'create_activity'
);

if (canCreateActivity) {
  // Afficher le bouton de création d'activité
}
```

### 2. `getFeatureValue`

Récupère la valeur d'une fonctionnalité spécifique.

```typescript
import { getFeatureValue } from '@/utils/packagePermissions';

const maxActivities = getFeatureValue(
  userSubscription,
  availablePackages,
  'create_activity'
);

// maxActivities = "10" ou null si non accessible
```

### 3. `checkMultipleFeatures`

Vérifie l'accès à plusieurs fonctionnalités en une seule fois.

```typescript
import { checkMultipleFeatures } from '@/utils/packagePermissions';

const permissions = checkMultipleFeatures(userSubscription, availablePackages, [
  'create_activity',
  'upload_files',
  'advanced_analytics',
]);

// permissions = {
//   create_activity: true,
//   upload_files: true,
//   advanced_analytics: false
// }
```

### 4. `hasAnyFeatureAccess`

Vérifie si l'utilisateur a accès à au moins une des fonctionnalités.

```typescript
import { hasAnyFeatureAccess } from '@/utils/packagePermissions';

const hasAdvancedFeatures = hasAnyFeatureAccess(
  userSubscription,
  availablePackages,
  ['advanced_analytics', 'custom_fields', 'api_access']
);

if (hasAdvancedFeatures) {
  // Afficher le menu des fonctionnalités avancées
}
```

### 5. `hasAllFeaturesAccess`

Vérifie si l'utilisateur a accès à toutes les fonctionnalités.

```typescript
import { hasAllFeaturesAccess } from '@/utils/packagePermissions';

const hasCompleteAccess = hasAllFeaturesAccess(
  userSubscription,
  availablePackages,
  ['create_activity', 'upload_files', 'delete_activity']
);

if (hasCompleteAccess) {
  // Afficher toutes les options
}
```

## Hooks Personnalisés

### 1. `usePackagePermissions`

Hook principal qui combine toutes les fonctionnalités.

```typescript
import { usePackagePermissions } from '@/hook/packagePermissions.hook';

const MyComponent = () => {
  const {
    hasAccess,
    getFeature,
    checkFeatures,
    hasAnyAccess,
    hasAllAccess,
    getAccessibleFeatures,
    getCurrentPackage,
    isLoading,
    error,
    hasActiveSubscription,
  } = usePackagePermissions();

  // Vérifier une fonctionnalité
  const canCreateActivity = hasAccess('create_activity');

  // Récupérer la valeur
  const maxActivities = getFeature('create_activity');

  // Vérifier plusieurs fonctionnalités
  const permissions = checkFeatures(['create_activity', 'upload_files']);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      {canCreateActivity && (
        <button>Créer une activité ({maxActivities} restantes)</button>
      )}
    </div>
  );
};
```

### 2. `useFeatureAccess`

Hook spécialisé pour une fonctionnalité spécifique.

```typescript
import { useFeatureAccess } from '@/hook/packagePermissions.hook';

const CreateActivityButton = () => {
  const { hasAccess, isLoading } = useFeatureAccess('create_activity');

  if (isLoading) return <div>Chargement...</div>;

  return hasAccess ? (
    <button className='btn-primary'>Créer une activité</button>
  ) : (
    <button className='btn-secondary' disabled>
      Création d'activité non disponible
    </button>
  );
};
```

### 3. `useMultipleFeaturesAccess`

Hook pour vérifier plusieurs fonctionnalités.

```typescript
import { useMultipleFeaturesAccess } from '@/hook/packagePermissions.hook';

const AdvancedFeaturesMenu = () => {
  const { features, hasAnyAccess, hasAllAccess } = useMultipleFeaturesAccess([
    'advanced_analytics',
    'custom_fields',
    'api_access',
  ]);

  if (!hasAnyAccess) {
    return <div>Fonctionnalités avancées non disponibles</div>;
  }

  return (
    <div>
      <h3>Fonctionnalités avancées</h3>
      {features.advanced_analytics && <div>Analytics avancés</div>}
      {features.custom_fields && <div>Champs personnalisés</div>}
      {features.api_access && <div>Accès API</div>}
    </div>
  );
};
```

## Cas d'Usage Pratiques

### 1. Vérification d'Accès dans un Composant

```typescript
const ActivityForm = () => {
  const { hasAccess, getFeature } = usePackagePermissions();

  const canCreateActivity = hasAccess('create_activity');
  const maxActivities = getFeature('create_activity');
  const currentCount = 5; // Récupéré depuis l'état

  if (!canCreateActivity) {
    return (
      <div className='alert alert-warning'>
        Création d'activité non disponible avec votre package actuel.
        <Link to='/pricing'>Mettre à niveau</Link>
      </div>
    );
  }

  const remainingActivities = parseInt(maxActivities) - currentCount;

  return (
    <form>
      <div className='form-group'>
        <label>Créer une nouvelle activité</label>
        <input type='text' placeholder="Nom de l'activité" />
        <small>{remainingActivities} activités restantes ce mois-ci</small>
      </div>
      <button type='submit' disabled={remainingActivities <= 0}>
        Créer l'activité
      </button>
    </form>
  );
};
```

### 2. Menu Conditionnel

```typescript
const NavigationMenu = () => {
  const { hasAccess, hasAnyAccess } = usePackagePermissions();

  const showAdvancedMenu = hasAnyAccess([
    'advanced_analytics',
    'custom_fields',
    'api_access',
  ]);

  return (
    <nav>
      <ul>
        <li>
          <Link to='/dashboard'>Tableau de bord</Link>
        </li>
        <li>
          <Link to='/activities'>Activités</Link>
        </li>

        {hasAccess('upload_files') && (
          <li>
            <Link to='/files'>Fichiers</Link>
          </li>
        )}

        {showAdvancedMenu && (
          <li className='dropdown'>
            <span>Fonctionnalités avancées</span>
            <ul>
              {hasAccess('advanced_analytics') && (
                <li>
                  <Link to='/analytics'>Analytics</Link>
                </li>
              )}
              {hasAccess('custom_fields') && (
                <li>
                  <Link to='/custom-fields'>Champs personnalisés</Link>
                </li>
              )}
              {hasAccess('api_access') && (
                <li>
                  <Link to='/api'>Documentation API</Link>
                </li>
              )}
            </ul>
          </li>
        )}
      </ul>
    </nav>
  );
};
```

### 3. Gestion des Limites

```typescript
const FileUploader = () => {
  const { hasAccess, getFeature } = usePackagePermissions();

  const canUploadFiles = hasAccess('upload_files');
  const maxFileSize = getFeature('upload_files');
  const maxFiles = getFeature('max_files');

  if (!canUploadFiles) {
    return <div>Upload de fichiers non disponible</div>;
  }

  const handleFileUpload = (files: FileList) => {
    if (files.length > parseInt(maxFiles)) {
      alert(`Maximum ${maxFiles} fichiers autorisés`);
      return;
    }

    // Vérifier la taille des fichiers
    const totalSize = Array.from(files).reduce(
      (sum, file) => sum + file.size,
      0
    );
    const maxSizeBytes = parseFileSize(maxFileSize); // Fonction utilitaire

    if (totalSize > maxSizeBytes) {
      alert(`Taille totale maximale: ${maxFileSize}`);
      return;
    }

    // Procéder à l'upload
    uploadFiles(files);
  };

  return (
    <div>
      <input
        type='file'
        multiple
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
      <small>
        Limite: {maxFiles} fichiers, taille max: {maxFileSize}
      </small>
    </div>
  );
};
```

## Gestion des Erreurs

### 1. États de Chargement

```typescript
const FeatureComponent = () => {
  const { hasAccess, isLoading, error } = usePackagePermissions();

  if (isLoading) {
    return <div className='spinner'>Chargement des permissions...</div>;
  }

  if (error) {
    return (
      <div className='alert alert-error'>
        Erreur lors du chargement des permissions: {error.message}
      </div>
    );
  }

  // Utiliser hasAccess normalement
  return hasAccess('feature_name') ? <Feature /> : <UpgradePrompt />;
};
```

### 2. Fallback en Cas d'Erreur

```typescript
const SafeFeatureCheck = () => {
  const { hasAccess, error } = usePackagePermissions();

  // En cas d'erreur, on peut choisir de bloquer ou d'autoriser
  const isFeatureAvailable = error ? false : hasAccess('feature_name');

  return isFeatureAvailable ? <Feature /> : <FeatureUnavailable />;
};
```

## Bonnes Pratiques

### 1. Nommage des Features

Utilisez des noms clairs et cohérents :

```typescript
// ✅ Bon
'create_activity';
'upload_files';
'advanced_analytics';
'custom_fields';
'api_access';
'bulk_operations';
'export_data';

// ❌ Éviter
'feature1';
'can_do_stuff';
'stuff_enabled';
```

### 2. Vérifications Groupées

Regroupez les vérifications liées :

```typescript
// ✅ Bon - Vérification groupée
const { hasAllAccess } = usePackagePermissions();
const canManageUsers = hasAllAccess([
  'create_user',
  'edit_user',
  'delete_user',
]);

// ❌ Éviter - Vérifications séparées
const canCreateUser = hasAccess('create_user');
const canEditUser = hasAccess('edit_user');
const canDeleteUser = hasAccess('delete_user');
```

### 3. Gestion des Valeurs

Toujours vérifier la valeur retournée :

```typescript
// ✅ Bon
const maxActivities = getFeature('create_activity');
if (maxActivities && maxActivities !== 'unlimited') {
  const limit = parseInt(maxActivities);
  // Utiliser la limite
}

// ❌ Éviter
const maxActivities = getFeature('create_activity');
const limit = parseInt(maxActivities); // Peut échouer si null
```

## Tests

### 1. Test des Permissions

```typescript
// Test unitaire
describe('Package Permissions', () => {
  it('should check feature access correctly', () => {
    const mockSubscription = {
      /* ... */
    };
    const mockPackages = [
      /* ... */
    ];

    const result = hasFeatureAccess(
      mockSubscription,
      mockPackages,
      'create_activity'
    );

    expect(result).toBe(true);
  });
});
```

### 2. Test des Hooks

```typescript
// Test d'intégration
describe('usePackagePermissions', () => {
  it('should return correct permissions', () => {
    const { result } = renderHook(() => usePackagePermissions());

    expect(result.current.hasAccess('create_activity')).toBe(true);
    expect(result.current.getFeature('create_activity')).toBe('10');
  });
});
```

## Conclusion

Ce système de permissions offre une approche flexible et robuste pour gérer l'accès aux fonctionnalités selon le package de l'utilisateur. Il permet de :

- Vérifier facilement l'accès aux fonctionnalités
- Gérer les limites et valeurs des fonctionnalités
- Créer des interfaces conditionnelles
- Maintenir une séparation claire entre la logique métier et l'interface utilisateur

L'utilisation des hooks personnalisés simplifie l'intégration dans les composants React tout en offrant une API claire et intuitive.
