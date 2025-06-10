interface IAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// Interface pour le document User
export interface IUser {
  _id?: string;
  email?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  password: string;
  phone: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  contributorId: string;
  address?: IAddress;
  isActive: boolean;
  isVerified: boolean;
  mfaEnabled: boolean;
  mfaSecret?: string;
  mfaTempSecret?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  accountDeletionScheduled?: Date;
  pushToken?: string;
  pushTokens?: string[];
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    types: Record<string, boolean>;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  fullName: string;
}

export interface IResponseUsers {
  success: string;
  data: {
    users: Array<IUser>;
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

export interface IResponseUser {
  success: string;
  data: {
    user: IUser;
  };
}

export interface IResponseUserStats {
  success: string;
  stats: {
    deliveryOrders: number;
    rideOrders: number;
    completedDeliveryOrders: number;
    completedRideOrders: number;
    averageRating: number;
    totalRatedOrders: number;
  };
}

export interface IUserFilterForm {
  search?: string | null;
  role?: string | null;
  contributorId?: string | null;
  page?: number;
  limit?: number;
}

export interface setUserStore {
  user: Partial<IUser> | null;
  users: IUser[] | null;
  userAddForm: Partial<IUser> | null;
  userFilterForm: IUserFilterForm | null;
  setUserStore: (
    key: keyof setUserStore,
    value: setUserStore[keyof setUserStore]
  ) => void;
}

export interface ReponseLoginByStaffWithMfa {
  readonly requireMfa?: boolean;
  readonly adminId?: string;
  readonly message?: string;
}

export interface ReponseLoginByUser extends ReponseLoginByStaffWithMfa {
  token?: string;
  readonly user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}
