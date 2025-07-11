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
