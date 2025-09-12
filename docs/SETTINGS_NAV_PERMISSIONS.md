# Améliorations du Composant SettingsNav avec Permissions

## Vue d'ensemble

Le composant `SettingsNav` a été amélioré pour intégrer un système de permissions basé sur les packages d'abonnement. Les sections "Configuration" et "Personnalisations des formulaires" sont maintenant conditionnées par les permissions de l'utilisateur.

## Modifications Apportées

### 1. Import du Hook de Permissions

```typescript
import { usePackagePermissions } from '@/hook/packagePermissions.hook';
```

### 2. Utilisation du Hook dans le Composant

```typescript
const SettingsNav = () => {
  // Vérifier les permissions des packages
  const { hasAccess, isLoading } = usePackagePermissions();

  // ... reste du composant
};
```

### 3. Gestion du Chargement

Un indicateur de chargement est affiché pendant la vérification des permissions :

```typescript
// Afficher un indicateur de chargement si les permissions sont en cours de chargement
if (isLoading) {
  return (
    <nav className='space-y-1 border-r border-t border-border bg-white'>
      <div className='p-4'>
        <div className='flex items-center justify-center'>
          <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
          <span className='ml-2 text-sm text-gray-500'>
            Chargement des permissions...
          </span>
        </div>
      </div>
    </nav>
  );
}
```

## Structure des Permissions

### Section Configuration

**Permission requise :** `"Ajout de type d'activité et bénéficiaire"`

```typescript
{
  /* Section Configuration - Conditionnée par les permissions */
}
{
  hasAccess("Ajout de type d'activité et bénéficiaire") && (
    <>
      <h3 className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8'>
        Configuration
      </h3>
      <NavLink
        href='activity'
        label={
          <>
            <Activity className='mr-2 h-4 w-4' />
            Type d'activités
          </>
        }
      />
      <NavLink
        href='beneficiary'
        label={
          <>
            <Users className='mr-2 h-4 w-4' />
            Type Bénéficiaires
          </>
        }
      />
    </>
  );
}
```

**Fonctionnalités incluses :**

- Type d'activités (`/settings/activity`)
- Type Bénéficiaires (`/settings/beneficiary`)

### Section Personnalisations des Formulaires

**Permission requise :** `"Personnalisation des champs formulaire (activité, bénéficiaire)"`

```typescript
{
  /* Section Personnalisations des formulaires - Conditionnée par les permissions */
}
{
  hasAccess(
    'Personnalisation des champs formulaire (activité, bénéficiaire)'
  ) && (
    <>
      <h3 className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8'>
        Personnalisations des formulaires
      </h3>
      <NavLink
        href='activity-customizable-form'
        label={
          <>
            <NotebookPen className='mr-2 h-4 w-4' />
            Activités
          </>
        }
      />
      <NavLink
        href='beneficiary-customizable-form'
        label={
          <>
            <NotebookPen className='mr-2 h-4 w-4' />
            Bénéficiaires
          </>
        }
      />
    </>
  );
}
```

**Fonctionnalités incluses :**

- Formulaires personnalisables pour les activités (`/settings/activity-customizable-form`)
- Formulaires personnalisables pour les bénéficiaires (`/settings/beneficiary-customizable-form`)

## Configuration des Packages

### Package avec Toutes les Permissions

```typescript
{
  name: "Package Premium",
  features: [
    {
      name: "Ajout de type d'activité et bénéficiaire",
      value: "true",
      enable: true
    },
    {
      name: "Personnalisation des champs formulaire (activité, bénéficiaire)",
      value: "true",
      enable: true
    }
  ]
}
```

### Package avec Permissions Partielles

```typescript
{
  name: "Package Standard",
  features: [
    {
      name: "Ajout de type d'activité et bénéficiaire",
      value: "true",
      enable: true
    },
    {
      name: "Personnalisation des champs formulaire (activité, bénéficiaire)",
      value: "false",
      enable: false
    }
  ]
}
```

### Package sans Permissions

```typescript
{
  name: "Package Basique",
  features: [
    {
      name: "Ajout de type d'activité et bénéficiaire",
      value: "false",
      enable: false
    },
    {
      name: "Personnalisation des champs formulaire (activité, bénéficiaire)",
      value: "false",
      enable: false
    }
  ]
}
```

## Comportement de l'Interface

### 1. Avec Toutes les Permissions

- Section "Configuration" visible
- Section "Personnalisations des formulaires" visible
- Navigation complète disponible

### 2. Avec Permissions Partielles

- Seules les sections autorisées sont visibles
- Les sections non autorisées sont masquées
- Interface adaptée aux capacités de l'utilisateur

### 3. Sans Permissions

- Sections "Configuration" et "Personnalisations des formulaires" masquées
- Seule la section "Abonnement" reste visible
- Interface simplifiée

### 4. Pendant le Chargement

- Indicateur de chargement avec spinner
- Message "Chargement des permissions..."
- Interface temporaire pendant la vérification

## Sécurité et UX

### 1. Principe de Sécurité

- **Refus par défaut** : Les sections sont masquées si les permissions ne sont pas clairement accordées
- **Vérification en temps réel** : Les permissions sont vérifiées à chaque rendu
- **Fallback sécurisé** : En cas d'erreur, l'interface reste sécurisée

### 2. Expérience Utilisateur

- **Interface adaptative** : L'interface s'adapte aux capacités de l'utilisateur
- **Feedback visuel** : Indicateur de chargement pendant la vérification
- **Navigation cohérente** : Seules les fonctionnalités autorisées sont accessibles

### 3. Performance

- **Vérification optimisée** : Utilisation du hook `usePackagePermissions` avec mise en cache
- **Rendu conditionnel** : Les sections non autorisées ne sont pas rendues
- **Chargement asynchrone** : Les permissions sont vérifiées en arrière-plan

## Cas d'Usage

### 1. Administrateur/Utilisateur Premium

```typescript
// Accès complet à toutes les fonctionnalités
const permissions = {
  "Ajout de type d'activité et bénéficiaire": true,
  'Personnalisation des champs formulaire (activité, bénéficiaire)': true,
};

// Résultat : Interface complète avec toutes les sections
```

### 2. Utilisateur Standard

```typescript
// Accès limité aux types d'activités et bénéficiaires
const permissions = {
  "Ajout de type d'activité et bénéficiaire": true,
  'Personnalisation des champs formulaire (activité, bénéficiaire)': false,
};

// Résultat : Section Configuration visible, Personnalisations masquée
```

### 3. Utilisateur Basique

```typescript
// Aucun accès aux fonctionnalités avancées
const permissions = {
  "Ajout de type d'activité et bénéficiaire": false,
  'Personnalisation des champs formulaire (activité, bénéficiaire)': false,
};

// Résultat : Seules les sections de base visibles
```

## Tests et Validation

### 1. Test des Permissions

```typescript
// Test unitaire
describe('SettingsNav Permissions', () => {
  it('should show Configuration section with permission', () => {
    const mockHasAccess = jest.fn().mockReturnValue(true);
    const { getByText } = render(<SettingsNav hasAccess={mockHasAccess} />);
    expect(getByText('Configuration')).toBeInTheDocument();
  });

  it('should hide Configuration section without permission', () => {
    const mockHasAccess = jest.fn().mockReturnValue(false);
    const { queryByText } = render(<SettingsNav hasAccess={mockHasAccess} />);
    expect(queryByText('Configuration')).not.toBeInTheDocument();
  });
});
```

### 2. Test du Chargement

```typescript
// Test du state de chargement
describe('SettingsNav Loading State', () => {
  it('should show loading indicator when permissions are loading', () => {
    const { getByText } = render(<SettingsNav isLoading={true} />);
    expect(getByText('Chargement des permissions...')).toBeInTheDocument();
  });
});
```

## Maintenance et Extensibilité

### 1. Ajout de Nouvelles Permissions

```typescript
// Exemple d'ajout d'une nouvelle section
{
  hasAccess('Gestion des rapports avancés') && (
    <>
      <h3 className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8'>
        Rapports Avancés
      </h3>
      <NavLink
        href='advanced-reports'
        label={
          <>
            <BarChart3 className='mr-2 h-4 w-4' />
            Rapports détaillés
          </>
        }
      />
    </>
  );
}
```

### 2. Gestion des Erreurs

```typescript
const { hasAccess, isLoading, error } = usePackagePermissions();

// Gestion des erreurs de permissions
if (error) {
  console.error('Erreur lors de la vérification des permissions:', error);
  // Fallback sécurisé : masquer les sections sensibles
  return renderSecureFallback();
}
```

### 3. Logs et Monitoring

```typescript
// Log pour le monitoring
if (process.env.NODE_ENV === 'development') {
  console.log('Permissions SettingsNav:', {
    configuration: hasAccess("Ajout de type d'activité et bénéficiaire"),
    customization: hasAccess(
      'Personnalisation des champs formulaire (activité, bénéficiaire)'
    ),
  });
}
```

## Conclusion

Cette amélioration du composant `SettingsNav` offre une solution robuste et sécurisée pour contrôler l'accès aux fonctionnalités de configuration et de personnalisation selon les permissions du package de l'utilisateur.

### Avantages

- **Sécurité renforcée** : Contrôle d'accès granulaire basé sur les permissions
- **UX améliorée** : Interface adaptée aux capacités de l'utilisateur
- **Maintenabilité** : Code centralisé et facilement extensible
- **Performance** : Vérifications optimisées avec mise en cache

### Bonnes Pratiques

- Toujours vérifier les permissions côté serveur
- Utiliser des fallbacks sécurisés
- Tester tous les cas d'usage
- Documenter les nouvelles contraintes
- Maintenir la cohérence de l'interface utilisateur
