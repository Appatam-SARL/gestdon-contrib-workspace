import { IPackage } from '@/interface/package.interface';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export type SubscriptionType = {
  _id?: string;
  contributorId: string;
  packageId: string;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  amount: number;
  currency: string;
  autoRenewal: boolean;
  renewalAttempts: number;
  lastRenewalDate?: Date;
  nextBillingDate?: Date;
  canceledAt?: Date;
  cancelationReason?: string;
  isFreeTrial: boolean; // Nouveau champ pour identifier les essais gratuits
  usageStats?: {
    apiCalls?: number;
    storageUsed?: number;
    activeUsers?: number;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

export type tSubscription = {
  _id?: string;
  contributorId: string;
  packageId: string | IPackage;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  amount: number;
  currency: string;
  autoRenewal: boolean;
  renewalAttempts: number;
  lastRenewalDate?: Date;
  nextBillingDate?: Date;
  canceledAt?: Date;
  cancelationReason?: string;
  isFreeTrial: boolean; // Nouveau champ pour identifier les essais gratuits
};

export type tSubscriptionStore = {
  subscriptions: SubscriptionType[];
  subscription: SubscriptionType | null;
  setSubscriptionStore: (key: keyof tSubscriptionStore, value: any) => void;
};
