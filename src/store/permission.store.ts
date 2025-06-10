// import { IPermission } from '@/interfaces/permission';
// import { toast } from 'react-toastify';
// import { create } from 'zustand';
// import { IPermissionStore } from '../interfaces/permission';

import { IPermissionStore } from '@/interface/permission';
import { create } from 'zustand';

export const usePermissionStore = create<IPermissionStore>((set) => ({
  permissionMemberLogged: null,
  permission: null,
  permissionForm: null,
  setPermissionStore: (key, value) => {
    set((state) => ({
      ...state,
      [key]: value,
    }));
  },
}));

/**
 * Vérifie si l'utilisateur a la permission d'effectuer une action sur un menu donné.
 * Affiche un toast d'erreur si la permission n'est pas trouvée ou désactivée.
 * @param menu Le menu concerné (ex: 'staff', 'station', ...)
 * @param value L'action concernée (ex: 'create', 'read', ...)
 * @returns boolean
 */
// export function useHelperUserPermission(menu: string, value: string): boolean {
//   const { toast } = useToast();
//   const { permissionMemberLogged } = usePermissionStore() as {
//     permissionMemberLogged: IPermission[] | null;
//   };
//   console.log(
//     '🚀 ~ const{permissionMemberLogged}=usePermissionStore ~ permissionMemberLogged:',
//     permissionMemberLogged
//   );
//   // const { toast } = useToast();

//   if (!permissionMemberLogged) {
//     toast.error('Permissions non chargées', {
//       position: 'top-right',
//     });
//     return false;
//   }

//   const findPermission = permissionMemberLogged.find(
//     (perm) =>
//       perm.menu === menu &&
//       perm.actions.some((action) => action.value === value)
//   );

//   if (!findPermission) {
//     toast.error('Permission introuvable', {
//       position: 'top-right',
//     });
//     return false;
//   }

//   const isEnabled = findPermission.actions.some(
//     (action) => action.value === value && action.enabled
//   );

//   // if (!isEnabled) {
//   //   toast.error('Action non autorisée', {
//   //     position: 'top-right',
//   //   });
//   // }

//   return isEnabled;
// }
