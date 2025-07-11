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
