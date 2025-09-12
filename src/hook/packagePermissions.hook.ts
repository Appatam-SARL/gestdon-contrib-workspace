import usePackageStore from '@/store/package.store';
import {
  checkMultipleFeatures,
  getFeatureValue,
  getMaxEntityLimit,
  getMaxUsersLimit,
  getRemainingActivitiesCount as getRemainingActivitiesCountUtil,
  getRemainingAudiencesCount as getRemainingAudiencesCountUtil,
  getRemainingBeneficiariesCount as getRemainingBeneficiariesCountUtil,
  getRemainingDonationsCount as getRemainingDonationsCountUtil,
  getRemainingPromisesCount as getRemainingPromisesCountUtil,
  getRemainingUsersCount as getRemainingUsersCountUtil,
  hasAllFeaturesAccess,
  hasAnyFeatureAccess,
  hasFeatureAccessFromHook,
  hasReachedMaxActivities,
  hasReachedMaxAudiences,
  hasReachedMaxBeneficiaries,
  hasReachedMaxDonations,
  hasReachedMaxPromises,
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

  /**
   * Limites d'activités
   */
  const hasReachedActivityLimit = (currentActivityCount: number): boolean => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return true;
    }
    return hasReachedMaxActivities(
      subscriptionData.data.subscription,
      packages,
      currentActivityCount
    );
  };

  const getActivityLimit = (): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getMaxEntityLimit(subscriptionData.data.subscription, packages);
  };

  const getRemainingActivitiesCount = (
    currentActivityCount: number
  ): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getRemainingActivitiesCountUtil(
      subscriptionData.data.subscription,
      packages,
      currentActivityCount
    );
  };

  /**
   * Limites de dons
   */
  const hasReachedDonationLimit = (currentDonationCount: number): boolean => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return true;
    }
    return hasReachedMaxDonations(
      subscriptionData.data.subscription,
      packages,
      currentDonationCount
    );
  };

  const getDonationLimit = (): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getMaxEntityLimit(subscriptionData.data.subscription, packages);
  };

  const getRemainingDonationsCount = (
    currentDonationCount: number
  ): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getRemainingDonationsCountUtil(
      subscriptionData.data.subscription,
      packages,
      currentDonationCount
    );
  };

  /**
   * Limites d'audiences
   */
  const hasReachedAudienceLimit = (currentAudienceCount: number): boolean => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return true;
    }
    return hasReachedMaxAudiences(
      subscriptionData.data.subscription,
      packages,
      currentAudienceCount
    );
  };

  const getAudienceLimit = (): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getMaxEntityLimit(subscriptionData.data.subscription, packages);
  };

  const getRemainingAudiencesCount = (
    currentAudienceCount: number
  ): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getRemainingAudiencesCountUtil(
      subscriptionData.data.subscription,
      packages,
      currentAudienceCount
    );
  };

  /**
   * Limites de promesses
   */
  const hasReachedPromiseLimit = (currentPromiseCount: number): boolean => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return true;
    }
    return hasReachedMaxPromises(
      subscriptionData.data.subscription,
      packages,
      currentPromiseCount
    );
  };

  const getPromiseLimit = (): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getMaxEntityLimit(subscriptionData.data.subscription, packages);
  };

  const getRemainingPromisesCount = (
    currentPromiseCount: number
  ): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getRemainingPromisesCountUtil(
      subscriptionData.data.subscription,
      packages,
      currentPromiseCount
    );
  };

  /**
   * Limites de bénéficiaires
   */
  const hasReachedBeneficiaryLimit = (
    currentBeneficiaryCount: number
  ): boolean => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return true;
    }
    return hasReachedMaxBeneficiaries(
      subscriptionData.data.subscription,
      packages,
      currentBeneficiaryCount
    );
  };

  const getBeneficiaryLimit = (): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getMaxEntityLimit(subscriptionData.data.subscription, packages);
  };

  const getRemainingBeneficiariesCount = (
    currentBeneficiaryCount: number
  ): number | null => {
    if (isLoading || error || !subscriptionData?.data?.subscription) {
      return null;
    }
    return getRemainingBeneficiariesCountUtil(
      subscriptionData.data.subscription,
      packages,
      currentBeneficiaryCount
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

    // Gestion des activités
    hasReachedActivityLimit,
    getActivityLimit,
    getRemainingActivitiesCount,

    // Gestion des dons
    hasReachedDonationLimit,
    getDonationLimit,
    getRemainingDonationsCount,

    // Gestion des audiences
    hasReachedAudienceLimit,
    getAudienceLimit,
    getRemainingAudiencesCount,

    // Gestion des promesses
    hasReachedPromiseLimit,
    getPromiseLimit,
    getRemainingPromisesCount,

    // Gestion des bénéficiaires
    hasReachedBeneficiaryLimit,
    getBeneficiaryLimit,
    getRemainingBeneficiariesCount,

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
