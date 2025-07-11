export interface IPermission {
  menu: string;
  label: string;
  actions: IPermissionAction[];
}

export interface IPermissionStore {
  permissionMemberLogged: IPermission | null;
  permission: IPermission | null;
  permissionForm: IPermission | null;
  setPermissionStore: <
    K extends keyof Omit<IPermissionStore, 'setPermissionStore'>
  >(
    key: K,
    value: IPermissionStore[K]
  ) => void;
}

export interface IPermissionAction {
  name: string;
  value: string;
  enabled: boolean;
}
