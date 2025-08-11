import { IPermission } from '@/interface/permission';
import { usePermissionStore } from '@/store/permission.store';

export type tAddress = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export function helperInitial(lastName: string, firstNames: string) {
  if (!lastName || !firstNames) return '';
  return lastName.charAt(0) + firstNames.charAt(0);
}

export const formatPrice = (amount: number): string => {
  return Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
  }).format(amount);
};

export const splitFullName = (
  fullName: string
): { firstname: string; lastname: string } => {
  const [firstname, ...rest] = fullName.split(' ');
  const lastname = rest.join(' ');
  return { firstname, lastname };
};

export const helperFullName = (firstname: string, lastname: string): string => {
  return firstname + ' ' + lastname;
};

export const helperFullAddress = (address: tAddress): string => {
  return (
    address?.street +
    ', ' +
    address?.city +
    ' ' +
    address?.postalCode +
    ' ' +
    address?.country
  );
};

export function helperRemoveDuplicates(arr: any[], key: string): any[] {
  const seen = new Set();
  return arr.filter((item) => {
    const keyValue = item[key as keyof any];
    if (seen.has(keyValue)) {
      return false;
    } else {
      seen.add(keyValue);
      return true;
    }
  });
}

export const truncateText = (text: string, maxLength: number = 10) => {
  const textTruncate: string =
    text?.length > maxLength ? text?.substring(0, maxLength) + '...' : text;

  return textTruncate;
};

export const truncateTextWithEllipsis = (
  text: string,
  maxLength: number = 10
) => {
  const textTruncate: string =
    text?.length > maxLength ? text?.substring(0, maxLength) + '...' : text;

  return textTruncate;
};

export const helperUserPermission = (
  menu: string,
  actionValue: string
): boolean => {
  const permissions = usePermissionStore.getState().permissionMemberLogged;
  if (!permissions || !Array.isArray(permissions)) return false;
  const menuPermission = permissions.find(
    (perm: IPermission) => perm.menu === menu
  );
  if (!menuPermission || !Array.isArray(menuPermission.actions)) return false;
  return menuPermission.actions.some(
    (action: any) => action.value === actionValue && action.enabled === true
  );
};

export const validatePhoneNumber = (value: any) => {
  const strictIvorianPhoneRegex = /^\+225(01|05|07|27)[0-9]{8}$/;
  // Nettoyer le numéro (enlever espaces)
  const cleanNumber = value.replace(/\s+/g, '');

  // Vérifier avec le regex
  const isValidNumber = strictIvorianPhoneRegex.test(cleanNumber);
  console.log('🚀 ~ validatePhoneNumber ~ isValidNumber:', isValidNumber);

  let formatted = '';
  // Formater le numéro si valide
  if (isValidNumber) {
    formatted = cleanNumber;
    // Ajouter +225 si pas présent
    if (!formatted.startsWith('+225') && !formatted.startsWith('225')) {
      formatted = '+225' + formatted;
    } else if (formatted.startsWith('225')) {
      formatted = '+' + formatted;
    }

    // Formater avec espaces : +225 XX XX XX XX XX
    const match = formatted.match(
      /^(\+225)([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$/
    );
    if (match) {
      formatted = `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]} ${match[6]}`;
      console.log('🚀 ~ validatePhoneNumber ~ formatted:', formatted);
    }
  }

  return { isValidNumber, formattedNumber: formatted };
};

export const verifyIfContributorExistsInFollowing = (
  followerId: string,
  following: string[]
) => {
  return following.some((followingId) => followingId === followerId);
};

export const verifyIfContributorLikeThePost = (
  userId: string,
  likes: any[]
) => {
  if (!likes || !Array.isArray(likes)) return false;

  return likes.some((like) => {
    // Gérer le cas où like est un objet avec une propriété user
    if (typeof like === 'object' && like !== null && 'user' in like) {
      return like.user === userId;
    }
    // Gérer le cas où like est directement l'ID de l'utilisateur
    if (typeof like === 'string') {
      return like === userId;
    }
    // Gérer le cas où like est un objet avec _id
    if (typeof like === 'object' && like !== null && '_id' in like) {
      return like._id === userId;
    }
    return false;
  });
};

export const verifyIfContributorLikeTheComment = (
  userId: string,
  likes: any[]
) => {
  if (!likes || !Array.isArray(likes)) return false;

  return likes.some((like) => {
    // Gérer le cas où like est un objet avec une propriété user
    if (typeof like === 'object' && like !== null && 'user' in like) {
      return like.user === userId;
    }
    // Gérer le cas où like est directement l'ID de l'utilisateur
    if (typeof like === 'string') {
      return like === userId;
    }
    // Gérer le cas où like est un objet avec _id
    if (typeof like === 'object' && like !== null && '_id' in like) {
      return like._id === userId;
    }
    return false;
  });
};

export const verifyIfContributorFollowsContributor = (
  followerId: string,
  following: string[]
) => {
  return following.some((followingId) => followingId === followerId);
};
