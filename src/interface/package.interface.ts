export type TUnlimitedNumber = number | 'infinite';

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
  type: 'FREE' | 'PAID' | 'CONTACT_REQUIRED';
  maxUsers: TUnlimitedNumber;
  maxFollowing: TUnlimitedNumber;
  maxActivity: TUnlimitedNumber;
  maxAudience: TUnlimitedNumber;
  maxDon: TUnlimitedNumber;
  maxPromesse: TUnlimitedNumber;
  maxReport: TUnlimitedNumber;
  maxBeneficiary: TUnlimitedNumber;
  isPopular: boolean;
  isFree: boolean;
  duration?: number;
  durationUnit?: string;
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
