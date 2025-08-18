import usePackageStore from '@/store/package.store';
import {
  checkMultipleFeatures,
  getFeatureValue,
  getMaxUsersLimit,
  getRemainingUsersCount as getRemainingUsersCountUtil,
  hasAllFeaturesAccess,
  hasAnyFeatureAccess,
  hasFeatureAccessFromHook,
  hasReachedMaxUsers,
  PackageFeature,
} from '@/utils/packagePermissions';
import { useSubscriptionCheck } from './subscription.hook';

/**
 * Hook personnalisé pour vérifier les permissions des packages
 * Combine les données d'abonnement et de packages pour vérifier l'accès aux fonctionnalités
 */
export const usePackagePermissions = () => {
  const { data: subscriptionData, isLoading, error } = useSubscriptionCheck();
  const { packages } = usePackageStore();

  /**
   * Vérifie si l'utilisateur a accès à une fonctionnalité spécifique
   * @param featureName - Le nom de la fonctionnalité à vérifier
   * @returns true si l'utilisateur a accès, false sinon
   */
  const hasAccess = (featureName: string): boolean => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return false;
    }

    return hasFeatureAccessFromHook(subscriptionData, packages, featureName);
  };

  /**
   * Récupère la valeur d'une fonctionnalité spécifique
   * @param featureName - Le nom de la fonctionnalité
   * @returns La valeur de la fonctionnalité ou null si non accessible
   */
  const getFeature = (featureName: string): string | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }

    return getFeatureValue(
      subscriptionData.data.subscription,
      packages,
      featureName
    );
  };

  /**
   * Vérifie l'accès à plusieurs fonctionnalités
   * @param featureNames - Les noms des fonctionnalités à vérifier
   * @returns Un objet avec le statut d'accès pour chaque fonctionnalité
   */
  const checkFeatures = (featureNames: string[]): Record<string, boolean> => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return featureNames.reduce(
        (acc, name) => ({ ...acc, [name]: false }),
        {}
      );
    }

    return checkMultipleFeatures(
      subscriptionData.data.subscription,
      packages,
      featureNames
    );
  };

  /**
   * Vérifie si l'utilisateur a accès à au moins une des fonctionnalités
   * @param featureNames - Les noms des fonctionnalités à vérifier
   * @returns true si l'utilisateur a accès à au moins une fonctionnalité
   */
  const hasAnyAccess = (featureNames: string[]): boolean => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return false;
    }

    return hasAnyFeatureAccess(
      subscriptionData.data.subscription,
      packages,
      featureNames
    );
  };

  /**
   * Vérifie si l'utilisateur a accès à toutes les fonctionnalités
   * @param featureNames - Les noms des fonctionnalités à vérifier
   * @returns true si l'utilisateur a accès à toutes les fonctionnalités
   */
  const hasAllAccess = (featureNames: string[]): boolean => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return false;
    }

    return hasAllFeaturesAccess(
      subscriptionData.data.subscription,
      packages,
      featureNames
    );
  };

  /**
   * Récupère toutes les fonctionnalités accessibles de l'utilisateur
   * @returns Un tableau des fonctionnalités accessibles
   */
  const getAccessibleFeatures = (): PackageFeature[] => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return [];
    }

    const subscription = subscriptionData.data.subscription;
    const packageId = subscription.packageId;
    let userPackage = null;

    if (typeof packageId === 'string') {
      userPackage = packages.find((pkg) => pkg._id === packageId);
    } else {
      userPackage = packageId;
    }

    if (!userPackage) {
      return [];
    }

    return userPackage.features.filter((feature) => feature.enable);
  };

  /**
   * Récupère le package actuel de l'utilisateur
   * @returns Le package actuel ou null
   */
  const getCurrentPackage = () => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }

    const subscription = subscriptionData.data.subscription;
    const packageId = subscription.packageId;

    if (typeof packageId === 'string') {
      return packages.find((pkg) => pkg._id === packageId) || null;
    }

    return packageId;
  };

  /**
   * Vérifie si le compte contributeur a atteint le nombre maximal d'utilisateurs
   * @param currentUserCount - Le nombre actuel d'utilisateurs/membres de staff
   * @returns true si la limite maximale est atteinte, false sinon
   */
  const hasReachedUserLimit = (currentUserCount: number): boolean => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return true; // Considérer que la limite est atteinte si pas d'abonnement
    }

    return hasReachedMaxUsers(
      subscriptionData.data.subscription,
      packages,
      currentUserCount
    );
  };

  /**
   * Récupère le nombre maximal d'utilisateurs autorisés pour le package actuel
   * @returns Le nombre maximal d'utilisateurs ou null si non trouvé
   */
  const getUserLimit = (): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }

    return getMaxUsersLimit(subscriptionData.data.subscription, packages);
  };

  /**
   * Récupère le nombre d'utilisateurs restants autorisés pour le package actuel
   * @param currentUserCount - Le nombre actuel d'utilisateurs/membres de staff
   * @returns Le nombre d'utilisateurs restants ou null si non calculable
   */
  const getRemainingUsersCount = (currentUserCount: number): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }

    return getRemainingUsersCountUtil(
      subscriptionData.data.subscription,
      packages,
      currentUserCount
    );
  };

  return {
    // État
    isLoading,
    error,

    // Fonctionnalités de base
    hasAccess,
    getFeature,

    // Vérifications multiples
    checkFeatures,
    hasAnyAccess,
    hasAllAccess,

    // Informations du package
    getAccessibleFeatures,
    getCurrentPackage,

    // Gestion des utilisateurs
    hasReachedUserLimit,
    getUserLimit,
    getRemainingUsersCount,

    // Données brutes (pour utilisation avancée)
    subscription: subscriptionData?.data?.subscription || null,
    packages,

    // Utilitaires
    hasActiveSubscription:
      subscriptionData?.data?.hasActiveSubscription || false,
  };
};

/**
 * Hook spécialisé pour vérifier une fonctionnalité spécifique
 * Plus simple à utiliser quand on n'a besoin que d'une vérification
 */
export const useFeatureAccess = (featureName: string) => {
  const { hasAccess, isLoading, error } = usePackagePermissions();

  return {
    hasAccess: hasAccess(featureName),
    isLoading,
    error,
  };
};

/**
 * Hook pour vérifier plusieurs fonctionnalités spécifiques
 */
export const useMultipleFeaturesAccess = (featureNames: string[]) => {
  const { checkFeatures, hasAnyAccess, hasAllAccess, isLoading, error } =
    usePackagePermissions();

  return {
    features: checkFeatures(featureNames),
    hasAnyAccess: hasAnyAccess(featureNames),
    hasAllAccess: hasAllAccess(featureNames),
    isLoading,
    error,
  };
};
