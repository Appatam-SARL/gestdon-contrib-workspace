# Implémentation des Limites d'Utilisateurs - Page Staff

## Vue d'ensemble

La page de gestion du personnel (`/staff`) a été améliorée pour intégrer un système de vérification des limites d'utilisateurs basé sur les packages d'abonnement. Cette implémentation respecte les normes UX et utilise le composant Dialog de shadcn/ui pour afficher des alertes informatives.

## Fonctionnalités Implémentées

### 1. **Vérification Automatique des Limites**

- Utilisation du hook `usePackagePermissions` pour vérifier les limites
- Calcul automatique du nombre actuel de membres du staff
- Vérification avant toute action d'ajout d'utilisateur

### 2. **Interface Utilisateur Adaptative**

- Boutons désactivés et stylisés quand la limite est atteinte
- Indicateurs visuels de l'état des limites
- Barres de progression colorées selon l'utilisation

### 3. **Alerte UX avec Dialog shadcn/ui**

- Modal informatif et non-bloquant
- Explication claire de la situation
- Actions suggérées pour résoudre le problème
- Navigation directe vers la page des packages

## Structure de l'Implémentation

### Imports et Hooks

```typescript
import { usePackagePermissions } from '@/hook/packagePermissions.hook';
import { AlertTriangle, Users, Info } from 'lucide-react';

// Hook pour vérifier les permissions et limites
const { hasReachedUserLimit, getUserLimit, getRemainingUsersCount } =
  usePackagePermissions();
```

### État Local

```typescript
const [isUserLimitAlertOpen, setIsUserLimitAlertOpen] =
  useState<boolean>(false);
```

### Calculs des Limites

```typescript
// Calculer le nombre actuel de membres du staff
const currentStaffCount = data?.data?.length || 0;

// Vérifier si la limite d'utilisateurs est atteinte
const hasReachedLimit = hasReachedUserLimit(currentStaffCount);

// Récupérer les informations de limite
const maxUsers = getUserLimit();
const remainingUsers = getRemainingUsersCount(currentStaffCount);
```

## Composants d'Interface

### 1. **Indicateur de Limite dans l'En-tête**

```typescript
{
  /* Indicateur de limite d'utilisateurs */
}
{
  maxUsers && maxUsers > 0 && (
    <div className='mt-3 flex items-center gap-3'>
      <div className='flex items-center gap-2 text-sm'>
        <Users className='h-4 w-4 text-gray-500' />
        <span className='text-gray-600'>
          {currentStaffCount} / {maxUsers} membres
        </span>
      </div>

      {/* Barre de progression compacte */}
      <div className='w-32 bg-gray-200 rounded-full h-2'>
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            hasReachedLimit
              ? 'bg-red-500'
              : currentStaffCount / maxUsers > 0.8
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`}
          style={{
            width: `${Math.min((currentStaffCount / maxUsers) * 100, 100)}%`,
          }}
        />
      </div>

      {/* Badges d'alerte */}
      {!hasReachedLimit && remainingUsers !== null && remainingUsers <= 2 && (
        <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
          <AlertTriangle className='h-3 w-3 mr-1' />
          {remainingUsers === 1
            ? '1 place restante'
            : `${remainingUsers} places restantes`}
        </Badge>
      )}

      {hasReachedLimit && (
        <Badge variant='destructive'>
          <AlertTriangle className='h-3 w-3 mr-1' />
          Limite atteinte
        </Badge>
      )}
    </div>
  );
}
```

### 2. **Boutons d'Action Modifiés**

```typescript
{
  helperUserPermission('staff', 'create') && (
    <Button
      onClick={handleAddMember}
      disabled={hasReachedLimit}
      className={hasReachedLimit ? 'opacity-50 cursor-not-allowed' : ''}
    >
      <UserPlus className='h-4 w-4 mr-2' />
      Ajouter un membre
      {hasReachedLimit && (
        <span className='ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full'>
          Limite atteinte
        </span>
      )}
    </Button>
  );
}
```

### 3. **Dialog d'Alerte UX**

```typescript
<Dialog open={isUserLimitAlertOpen} onOpenChange={setIsUserLimitAlertOpen}>
  <DialogContent className='sm:max-w-[500px]'>
    <DialogHeader>
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-red-100 rounded-full'>
          <AlertTriangle className='h-6 w-6 text-red-600' />
        </div>
        <div>
          <DialogTitle className='text-red-800'>
            Limite d'utilisateurs atteinte
          </DialogTitle>
          <DialogDescription className='text-red-600'>
            Vous avez atteint le nombre maximal de membres de staff autorisés
            par votre package.
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>

    {/* Contenu informatif et actions suggérées */}
  </DialogContent>
</Dialog>
```

## Fonctions de Gestion

### 1. **Vérification Avant Ajout**

```typescript
const handleAddMember = () => {
  if (hasReachedLimit) {
    setIsUserLimitAlertOpen(true);
    return;
  }
  navigate('/staff/create');
};
```

### 2. **Vérification Avant Invitation**

```typescript
const handleInviteMember = () => {
  if (hasReachedLimit) {
    setIsUserLimitAlertOpen(true);
    return;
  }
  setIsInviteModalOpen(true);
};
```

## Normes UX Respectées

### 1. **Feedback Visuel Immédiat**

- Boutons désactivés avec style approprié
- Indicateurs de couleur (vert, jaune, rouge)
- Badges informatifs et badges d'alerte

### 2. **Prévention des Erreurs**

- Vérification avant action
- Boutons désactivés quand non utilisables
- Messages d'erreur clairs et informatifs

### 3. **Guidance Utilisateur**

- Explication de la situation
- Actions suggérées
- Navigation directe vers la solution

### 4. **Accessibilité**

- Icônes explicites
- Couleurs contrastées
- Textes descriptifs
- Navigation clavier

## États de l'Interface

### 1. **Normal (Vert)**

- Utilisation < 80% de la limite
- Toutes les actions disponibles
- Indicateur vert

### 2. **Attention (Jaune)**

- Utilisation entre 80% et 100% de la limite
- Actions disponibles mais avec avertissement
- Badge "places restantes"

### 3. **Limite Atteinte (Rouge)**

- Utilisation = 100% de la limite
- Actions d'ajout désactivées
- Badge "Limite atteinte"
- Boutons avec style "disabled"

## Gestion des Erreurs

### 1. **Pas d'Abonnement**

- Limite considérée comme atteinte
- Interface sécurisée par défaut

### 2. **Package Non Trouvé**

- Affichage "N/A" pour les limites
- Interface dégradée mais fonctionnelle

### 3. **Erreur de Chargement**

- Gestion des états de chargement
- Fallback sécurisé

## Navigation et Actions

### 1. **Actions Disponibles**

- Fermer l'alerte
- Voir les packages disponibles
- Gérer les membres existants

### 2. **Navigation Intégrée**

- Redirection vers `/settings/subscription/pricing`
- Retour à la page staff
- Gestion des états de modal

## Tests et Validation

### 1. **Scénarios de Test**

- Limite non atteinte : actions normales
- Limite proche : avertissements affichés
- Limite atteinte : actions bloquées
- Pas d'abonnement : interface sécurisée

### 2. **Validation UX**

- Lisibilité des messages
- Cohérence des couleurs
- Responsivité des composants
- Accessibilité des interactions

## Maintenance et Évolutions

### 1. **Extensibilité**

- Ajout de nouvelles actions
- Personnalisation des messages
- Intégration avec d'autres limites

### 2. **Monitoring**

- Suivi des utilisations
- Alertes automatiques
- Statistiques d'utilisation

## Conclusion

Cette implémentation offre une solution complète et UX-friendly pour la gestion des limites d'utilisateurs dans la page staff. Elle respecte les bonnes pratiques de design, assure la sécurité de l'application et guide l'utilisateur vers des solutions appropriées.

### Avantages

- **Sécurité renforcée** : Vérification automatique des limites
- **UX optimisée** : Interface adaptative et informative
- **Guidance utilisateur** : Actions suggérées et navigation directe
- **Maintenabilité** : Code structuré et extensible
- **Accessibilité** : Respect des normes d'accessibilité
