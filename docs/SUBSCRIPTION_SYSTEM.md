# Système de Gestion des Abonnements

## Vue d'ensemble

Ce système permet de gérer les abonnements des contributeurs avec différents types de packages et une expérience utilisateur fluide. Il inclut la vérification automatique des abonnements, la redirection vers la page de pricing si nécessaire, et une interface moderne pour la gestion des abonnements.

## Architecture

### Composants principaux

#### 1. **SubscriptionStatus** (`src/pages/online/settings/subscription-status.tsx`)

- **Fonction** : Page principale affichant le statut de l'abonnement
- **Fonctionnalités** :
  - Affichage du statut actuel (actif/inactif)
  - Liste des packages disponibles avec badges visuels
  - Actions rapides selon le type de package
  - Redirection automatique vers `/pricing` si abonnement requis

#### 2. **SubscriptionManagement** (`src/pages/online/settings/subscription-management.tsx`)

- **Fonction** : Interface complète de gestion des abonnements
- **Fonctionnalités** :
  - Vue d'ensemble avec métriques
  - Détails de l'abonnement actuel
  - Historique des abonnements
  - Gestion de la facturation
  - Actions (modifier, annuler, télécharger factures)

#### 3. **SubscriptionBanner** (`src/components/commons/SubscriptionBanner.tsx`)

- **Fonction** : Bannière contextuelle affichant le statut d'abonnement
- **Fonctionnalités** :
  - Affichage conditionnel selon le statut
  - Actions rapides intégrées
  - Option de fermeture
  - Design responsive et accessible
  - **Nouveau** : Affichage de la date d'échéance et des jours restants
  - **Nouveau** : Badge visuel pour le statut temporel
  - **Nouveau** : Calcul automatique des jours jusqu'à expiration

#### 4. **SubscriptionToast** (`src/components/commons/SubscriptionToast.tsx`)

- **Fonction** : Notifications toast automatiques pour les changements de statut
- **Fonctionnalités** :
  - Toast d'alerte pour abonnement requis
  - Toast de succès pour abonnement actif
  - Actions intégrées dans les toasts
  - Durée configurable

### Hooks personnalisés

#### 1. **useSubscriptionCheck** (`src/hook/subscription.hook.ts`)

```typescript
const { subscriptionStatus, error, isSubscriptionRequired, isLoading } =
  useSubscriptionCheck();
```

- **Fonction** : Vérifie le statut de l'abonnement et redirige automatiquement
- **Retour** : Statut, erreurs, indicateurs de chargement et de redirection

#### 2. **useRouteSubscriptionGuard** (`src/hook/subscription.hook.ts`)

```typescript
const { isSubscriptionRequired, isLoading, shouldRedirect } =
  useRouteSubscriptionGuard(true);
```

- **Fonction** : Protège une route en vérifiant l'abonnement
- **Retour** : Indicateurs pour la logique de protection

### API

#### **SubscriptionApi** (`src/api/subscription.api.ts`)

- `checkSubscriptionStatus()` : Vérifie le statut de l'abonnement
- `createFreeTrialSubscription()` : Active un essai gratuit
- `submitContactRequest()` : Soumet une demande de contact

## Fonctionnalités Temporelles

### **Gestion des Dates d'Échéance**

Le système d'abonnement inclut maintenant des fonctionnalités avancées pour la gestion temporelle :

#### **Calcul Automatique des Jours Restants**

- Fonction `getDaysRemaining()` : Calcule précisément le nombre de jours jusqu'à l'échéance
- Précision au jour près (ignore les heures/minutes pour éviter la confusion)
- Gestion des cas d'expiration (passé, présent, futur)

#### **Affichage Contextuel Intelligent**

- **Bannière verte** (abonnement actif) : Affiche les jours restants en vert
- **Bannière orange** (abonnement requis) : Affiche le statut temporel en orange
- **Badge visuel** : Indicateur coloré pour attirer l'attention sur l'urgence

#### **Formatage Intelligent du Texte**

- "5 jours" (pluriel automatique)
- "1 jour" (singulier automatique)
- "Expire aujourd'hui" (cas spécial)
- "Expiré depuis X jour(s)" (gestion des expirations)

### **Intégration dans l'Interface**

Ces fonctionnalités sont intégrées dans le composant `SubscriptionBanner` et s'adaptent automatiquement :

- Affichage de la date d'échéance avec icône de calendrier
- Badge de statut temporel contextuel
- Mise à jour automatique selon l'état de l'abonnement

## Types de Packages

### 1. **FREE** (ex: SOLIDARITÉ)

- **Comportement** : Activation gratuite immédiate
- **UI** : Badge vert "Gratuit", bouton "Activer gratuitement"
- **Redirection** : Aucune, activation directe

### 2. **CONTACT_REQUIRED** (ex: AMBASSADEUR)

- **Comportement** : Formulaire de contact, pas de paiement
- **UI** : Badge bleu "Contact Requis", bouton "Nous contacter"
- **Redirection** : Formulaire de contact

### 3. **PAID** (ex: PARTICIPANT, ACTEUR SOCIAL)

- **Comportement** : Formulaire de paiement standard
- **UI** : Badge violet "Payant", bouton "Continuer avec ce plan"
- **Redirection** : Formulaire de paiement

## Intégration

### 1. **Dans le routeur principal**

```typescript
import ProtectedRoute from '@/components/commons/ProtectedRoute';

<Route
  path='/dashboard'
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

### 2. **Dans les composants HOC**

```typescript
import { useSubscriptionCheck } from '@/hook/subscription.hook';

export function withDashboard<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithDashboardComponent(props: P) {
    // Vérifier l'abonnement du contributeur
    useSubscriptionCheck();

    // ... reste du composant
  };
}
```

### 3. **Dans les pages protégées**

```typescript
import { useSubscriptionCheck } from '@/hook/subscription.hook';

const Dashboard = () => {
  const { isSubscriptionRequired, isLoading } = useSubscriptionCheck();

  if (isLoading) return <LoadingSpinner />;
  if (isSubscriptionRequired) return <SubscriptionRequired />;

  return <DashboardContent />;
};
```

## Flux utilisateur

### 1. **Première visite**

1. L'utilisateur accède à une page protégée
2. Le système vérifie automatiquement son abonnement
3. Si aucun abonnement : redirection vers `/pricing`
4. Si abonnement actif : accès accordé

### 2. **Sélection de package**

1. L'utilisateur choisit un package sur `/pricing`
2. Selon le type :
   - **FREE** : Activation immédiate
   - **CONTACT_REQUIRED** : Formulaire de contact
   - **PAID** : Formulaire de paiement

### 3. **Gestion continue**

1. L'utilisateur peut gérer son abonnement via `/settings/subscription-management`
2. Notifications automatiques pour les changements de statut
3. Bannières contextuelles sur les pages protégées

## Personnalisation

### 1. **Thèmes et couleurs**

```typescript
// Badges selon le type de package
const getPackageBadge = (packageName: string) => {
  const type = getPackageType(packageName);

  switch (type) {
    case 'FREE':
      return (
        <Badge className='bg-green-100 text-green-800 border-green-200'>
          Gratuit
        </Badge>
      );
    case 'CONTACT_REQUIRED':
      return (
        <Badge className='bg-blue-100 text-blue-800 border-blue-200'>
          Contact Requis
        </Badge>
      );
    case 'PAID':
      return (
        <Badge className='bg-purple-100 text-purple-800 border-purple-200'>
          Payant
        </Badge>
      );
  }
};
```

### 2. **Messages et textes**

```typescript
// Messages dynamiques selon le statut
const getStatusMessage = (status: SubscriptionStatus) => {
  switch (status) {
    case 'active':
      return 'Votre compte est entièrement fonctionnel';
    case 'expired':
      return 'Votre abonnement a expiré, renouvelez-le pour continuer';
    case 'cancelled':
      return 'Votre abonnement a été annulé';
  }
};
```

## Sécurité et validation

### 1. **Vérification côté client**

- Hook `useSubscriptionCheck` vérifie le statut à chaque rendu
- Redirection automatique si abonnement requis
- Protection des routes sensibles

### 2. **Vérification côté serveur**

- API endpoints protégés
- Validation des tokens d'authentification
- Vérification des permissions d'abonnement

## Tests et débogage

### 1. **Console logs**

```typescript
console.log('🚀 ~ SubscriptionStatus:', subscriptionStatus);
console.log('Redirection vers /pricing - Abonnement requis');
```

### 2. **États de test**

- `isLoading` : Affichage des loaders
- `error` : Gestion des erreurs
- `isSubscriptionRequired` : Logique de redirection

## Dépendances

- **Shadcn UI** : Composants d'interface
- **Lucide React** : Icônes
- **React Router** : Navigation
- **React Query** : Gestion des données
- **Zustand** : État global
- **Zod** : Validation des schémas

## Prochaines étapes

1. **Intégration avec le système de paiement**
2. **Notifications push pour les renouvellements**
3. **Analytics et métriques d'utilisation**
4. **Système de parrainage et réductions**
5. **Gestion des factures et reçus**
6. **Support multi-devises et multi-langues**

## Support

Pour toute question ou problème avec le système d'abonnements, consultez :

- La documentation des composants Shadcn UI
- Les logs de la console pour le débogage
- Les hooks personnalisés pour la logique métier
