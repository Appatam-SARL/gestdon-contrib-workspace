import { IPackage } from '@/interface/package.interface';
import { tSubscription } from '@/types/souscription.type';

/**
 * Interface pour les fonctionnalités d'un package
 */
export interface PackageFeature {
  name: string;
  value: string;
  enable: boolean;
}

/**
 * Vérifie si le package de l'utilisateur a le droit d'accéder à une fonctionnalité spécifique
 *
 * @param subscription - L'abonnement actuel de l'utilisateur
 * @param packages - La liste des packages disponibles
 * @param featureName - Le nom de la fonctionnalité à vérifier
 * @returns true si l'utilisateur a accès à la fonctionnalité, false sinon
 */
export const hasFeatureAccess = (
  subscription: tSubscription | null,
  packages: IPackage[],
  featureName: string
): boolean => {
  // Si pas d'abonnement, pas d'accès
  if (!subscription) {
    return false;
  }

  // Récupérer le package de l'abonnement
  const packageId = subscription.packageId;
  let userPackage: IPackage | null = null;

  // Si packageId est une string, chercher dans la liste des packages
  if (typeof packageId === 'string') {
    userPackage = packages.find((pkg) => pkg._id === packageId) || null;
  } else {
    // Si packageId est déjà un objet IPackage, l'utiliser directement
    userPackage = packageId as IPackage;
  }

  // Si pas de package trouvé, pas d'accès
  if (!userPackage) {
    return false;
  }

  // Vérifier si la fonctionnalité existe et est activée
  const feature = userPackage.features.find((f) => f.name === featureName);

  if (!feature) {
    return false;
  }

  return feature.enable;
};

/**
 * Vérifie si le compte contributeur de l'utilisateur a atteint le nombre maximal de membres de staff/personnel
 * basée sur la propriété maxUsers de l'interface IPackage
 *
 * @param subscription - L'abonnement actuel de l'utilisateur
 * @param packages - La liste des packages disponibles
 * @param currentUserCount - Le nombre actuel d'utilisateurs/membres de staff
 * @returns true si la limite maximale est atteinte, false sinon
 */
export const hasReachedMaxUsers = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentUserCount: number
): boolean => {
  // Si pas d'abonnement, considérer que la limite est atteinte
  if (!subscription) {
    return true;
  }

  // Récupérer le package de l'abonnement
  const packageId = subscription.packageId;
  let userPackage: IPackage | null = null;

  // Si packageId est une string, chercher dans la liste des packages
  if (typeof packageId === 'string') {
    userPackage = packages.find((pkg) => pkg._id === packageId) || null;
  } else {
    // Si packageId est déjà un objet IPackage, l'utiliser directement
    userPackage = packageId as IPackage;
  }

  // Si pas de package trouvé, considérer que la limite est atteinte
  if (!userPackage) {
    return true;
  }

  // Limite illimitée
  if (userPackage.maxUsers === 'infinite') {
    return false;
  }
  // Vérifier si le nombre actuel d'utilisateurs a atteint ou dépassé la limite
  return currentUserCount >= userPackage.maxUsers;
};

/**
 * Récupère le nombre maximal d'utilisateurs autorisés pour le package de l'utilisateur
 *
 * @param subscription - L'abonnement actuel de l'utilisateur
 * @param packages - La liste des packages disponibles
 * @returns Le nombre maximal d'utilisateurs ou null si non trouvé
 */
export const getMaxUsersLimit = (
  subscription: tSubscription | null,
  packages: IPackage[]
): number | null => {
  // Si pas d'abonnement, pas de limite
  if (!subscription) {
    return null;
  }

  // Récupérer le package de l'abonnement
  const packageId = subscription.packageId;
  let userPackage: IPackage | null = null;

  // Si packageId est une string, chercher dans la liste des packages
  if (typeof packageId === 'string') {
    userPackage = packages.find((pkg) => pkg._id === packageId) || null;
  } else {
    // Si packageId est déjà un objet IPackage, l'utiliser directement
    userPackage = packageId as IPackage;
  }

  // Si pas de package trouvé, pas de limite
  if (!userPackage) {
    return null;
  }

  // Si illimité, retourner null pour signifier "sans limite"
  if (userPackage.maxUsers === 'infinite') {
    return null;
  }
  return userPackage.maxUsers;
};

/**
 * Récupère le nombre d'utilisateurs restants autorisés pour le package de l'utilisateur
 *
 * @param subscription - L'abonnement actuel de l'utilisateur
 * @param packages - La liste des packages disponibles
 * @param currentUserCount - Le nombre actuel d'utilisateurs/membres de staff
 * @returns Le nombre d'utilisateurs restants ou null si non calculable
 */
export const getRemainingUsersCount = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentUserCount: number
): number | null => {
  const maxUsers = getMaxUsersLimit(subscription, packages);

  if (maxUsers === null) {
    return null;
  }

  const remaining = maxUsers - currentUserCount;
  return Math.max(0, remaining); // Retourner 0 si négatif
};

/**
 * Vérifie si le package de l'utilisateur à de deppaser le nombre d'utilisateur d'un package
 * @param subscription - L'abonnement actuel de l'utilisateur
 * @param packages - La liste des packages disponibles
 * @param featureName - Le nom de la fonctionnalité à vérifier
 * @returns true si l'utilisateur a accès à la fonctionnalité, false sinon
 */
export const hasUserLimitAccess = (
  subscription: tSubscription | null,
  packages: IPackage[],
  featureName: string
): boolean => {
  return hasFeatureAccess(subscription, packages, featureName);
};

/**
 * Limites génériques (activités, promesses, dons) basées sur maxUsers
 * NOTE: Par choix produit, on réutilise la même limite maxUsers pour ces entités
 */
export const getMaxEntityLimit = (
  subscription: tSubscription | null,
  packages: IPackage[]
): number | null => getMaxUsersLimit(subscription, packages);

export const hasReachedMaxActivities = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentActivityCount: number
): boolean => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return false; // illimité
  return currentActivityCount >= limit;
};

export const hasReachedMaxPromises = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentPromiseCount: number
): boolean => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return false; // illimité
  return currentPromiseCount >= limit;
};

export const hasReachedMaxDonations = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentDonationCount: number
): boolean => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return false; // illimité
  return currentDonationCount >= limit;
};

// Audiences
export const hasReachedMaxAudiences = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentAudienceCount: number
): boolean => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return false; // illimité
  return currentAudienceCount >= limit;
};

export const getRemainingAudiencesCount = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentAudienceCount: number
): number | null => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return null;
  return Math.max(0, limit - currentAudienceCount);
};

export const getRemainingActivitiesCount = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentActivityCount: number
): number | null => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return null;
  return Math.max(0, limit - currentActivityCount);
};

export const getRemainingPromisesCount = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentPromiseCount: number
): number | null => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return null;
  return Math.max(0, limit - currentPromiseCount);
};

export const getRemainingDonationsCount = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentDonationCount: number
): number | null => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return null;
  return Math.max(0, limit - currentDonationCount);
};

// Bénéficiaires
export const hasReachedMaxBeneficiaries = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentBeneficiaryCount: number
): boolean => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return false; // illimité
  return currentBeneficiaryCount >= limit;
};

export const getRemainingBeneficiariesCount = (
  subscription: tSubscription | null,
  packages: IPackage[],
  currentBeneficiaryCount: number
): number | null => {
  const limit = getMaxUsersLimit(subscription, packages);
  if (limit === null) return null;
  return Math.max(0, limit - currentBeneficiaryCount);
};

/**
 * Vérifie si l'utilisateur a accès à une fonctionnalité en utilisant directement le hook d'abonnement
 *
 * @param subscriptionData - Les données d'abonnement depuis useSubscriptionCheck
 * @param packages - La liste des packages depuis le store
 * @param featureName - Le nom de la fonctionnalité à vérifier
 * @returns true si l'utilisateur a accès à la fonctionnalité, false sinon
 */
export const hasFeatureAccessFromHook = (
  subscriptionData: any,
  packages: IPackage[],
  featureName: string
): boolean => {
  if (!subscriptionData?.data?.subscription) {
    return false;
  }

  return hasFeatureAccess(
    subscriptionData.data.subscription,
    packages,
    featureName
  );
};

/**
 * Récupère la valeur d'une fonctionnalité spécifique du package de l'utilisateur
 *
 * @param subscription - L'abonnement actuel de l'utilisateur
 * @param packages - La liste des packages disponibles
 * @param featureName - Le nom de la fonctionnalité
 * @returns La valeur de la fonctionnalité ou null si non trouvée/désactivée
 */
export const getFeatureValue = (
  subscription: tSubscription | null,
  packages: IPackage[],
  featureName: string
): string | null => {
  // Si pas d'abonnement, pas de valeur
  if (!subscription) {
    return null;
  }

  // Récupérer le package de l'abonnement
  const packageId = subscription.packageId;
  let userPackage: IPackage | null = null;

  // Si packageId est une string, chercher dans la liste des packages
  if (typeof packageId === 'string') {
    userPackage = packages.find((pkg) => pkg._id === packageId) || null;
  } else {
    // Si packageId est déjà un objet IPackage, l'utiliser directement
    userPackage = packageId as IPackage;
  }

  // Si pas de package trouvé, pas de valeur
  if (!userPackage) {
    return null;
  }

  // Vérifier si la fonctionnalité existe et est activée
  const feature = userPackage.features.find((f) => f.name === featureName);

  if (!feature || !feature.enable) {
    return null;
  }

  return feature.value;
};

/**
 * Vérifie si l'utilisateur a accès à plusieurs fonctionnalités
 *
 * @param subscription - L'abonnement actuel de l'utilisateur
 * @param packages - La liste des packages disponibles
 * @param featureNames - Les noms des fonctionnalités à vérifier
 * @returns Un objet avec le statut d'accès pour chaque fonctionnalité
 */
export const checkMultipleFeatures = (
  subscription: tSubscription | null,
  packages: IPackage[],
  featureNames: string[]
): Record<string, boolean> => {
  const result: Record<string, boolean> = {};

  featureNames.forEach((featureName) => {
    result[featureName] = hasFeatureAccess(subscription, packages, featureName);
  });

  return result;
};

/**
 * Vérifie si l'utilisateur a accès à au moins une des fonctionnalités spécifiées
 *
 * @param subscription - L'abonnement actuel de l'utilisateur
 * @param packages - La liste des packages disponibles
 * @param featureNames - Les noms des fonctionnalités à vérifier
 * @returns true si l'utilisateur a accès à au moins une fonctionnalité
 */
export const hasAnyFeatureAccess = (
  subscription: tSubscription | null,
  packages: IPackage[],
  featureNames: string[]
): boolean => {
  return featureNames.some((featureName) =>
    hasFeatureAccess(subscription, packages, featureName)
  );
};

/**
 * Vérifie si l'utilisateur a accès à toutes les fonctionnalités spécifiées
 *
 * @param subscription - L'abonnement actuel de l'utilisateur
 * @param packages - La liste des packages disponibles
 * @param featureNames - Les noms des fonctionnalités à vérifier
 * @returns true si l'utilisateur a accès à toutes les fonctionnalités
 */
export const hasAllFeaturesAccess = (
  subscription: tSubscription | null,
  packages: IPackage[],
  featureNames: string[]
): boolean => {
  return featureNames.every((featureName) =>
    hasFeatureAccess(subscription, packages, featureName)
  );
};
