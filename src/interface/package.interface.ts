export interface IPackage {
  _id?: string;
  name: string;
  description: string;
  price: string;
  features: {
    name: string;
    value: string;
    enable: boolean;
  }[];
  highlight?: boolean;
  type: 'FREE' | 'PAID' | 'CONTACT_REQUIRED';
  maxUsers: number;
  maxFollowing: number;
  isPopular: boolean;
  isFree: boolean;
  duration?: number;
  durationUnit?: string;
  currency?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPackageStore {
  packages: IPackage[];
  package: IPackage | null;
  currentPackage: IPackage | null;
  setPackageStore: (
    key: keyof IPackageStore,
    value: IPackageStore[keyof IPackageStore]
  ) => void;
}
