# Améliorations du Composant SettingsNav

## Résumé

Le composant `SettingsNav` a été amélioré pour intégrer un système de permissions basé sur les packages d'abonnement, conditionnant l'affichage des sections "Configuration" et "Personnalisations des formulaires".

## Modifications Apportées

### 1. Import du Hook

```typescript
import { usePackagePermissions } from '@/hook/packagePermissions.hook';
```

### 2. Utilisation du Hook

```typescript
const SettingsNav = () => {
  const { hasAccess, isLoading } = usePackagePermissions();

  // ... reste du composant
};
```

### 3. Gestion du Chargement

```typescript
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

## Permissions Appliquées

### Section Configuration

**Permission :** `"Ajout de type d'activité et bénéficiaire"`

- Type d'activités (`/settings/activity`)
- Type Bénéficiaires (`/settings/beneficiary`)

### Section Personnalisations des Formulaires

**Permission :** `"Personnalisation des champs formulaire (activité, bénéficiaire)"`

- Formulaires personnalisables pour les activités
- Formulaires personnalisables pour les bénéficiaires

## Comportement

- **Avec permission** : Section visible avec tous les liens
- **Sans permission** : Section complètement masquée
- **Pendant chargement** : Indicateur de chargement affiché

## Sécurité

- Vérification des permissions à chaque rendu
- Fallback sécurisé (masqué par défaut)
- Principe "refuser par défaut"

## Fichiers Modifiés

- `src/components/online/settings/SettingsNav.tsx`
- Ajout de la logique de permissions
- Utilisation du hook `usePackagePermissions` existant

## Test

Pour tester, modifiez les permissions dans le package de l'utilisateur :

- `"Ajout de type d'activité et bénéficiaire"`
- `"Personnalisation des champs formulaire (activité, bénéficiaire)"`
