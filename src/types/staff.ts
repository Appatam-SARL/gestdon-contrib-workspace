export type StaffRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN';
export type StaffStatus = 'actif' | 'inactif' | 'suspendu';

export interface ReponseLoginByStaffWithMfa {
  readonly requireMfa?: boolean;
  readonly adminId?: string;
  readonly message?: string;
}

export interface ReponseLoginByStaff extends ReponseLoginByStaffWithMfa {
  token?: string;
  readonly admin?: {
    id?: string | null;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: string | null;
    mfaEnabled?: string | null;
  };
}

export type ReponseLoginByStaffData = ReponseLoginByStaff | null;

export interface StaffMember {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: StaffRole;
  status?: StaffStatus;
  contributorId?: string;
  isActive?: boolean;
  mfaEnabled?: boolean;
  createdAt?: string;
  lastLogin?: string;
  permissions?: string[];
}

export interface StaffMemberResponse {
  admins: StaffMember[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface StaffMemberFilter {
  search?: string | null;
  role?: StaffRole | string;
  isActive?: boolean | '';
  page?: number;
  limit?: number;
}

export interface StaffMemberForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
}

export interface StaffMemberStore {
  staffMember: StaffMember | null;
  staffMembers: StaffMember[] | null;
  staffMemberForm: StaffMemberForm | null;
  staffMemberFilter: StaffMemberFilter | null;
  setStaffMemberStore: (
    key: keyof StaffMemberStore,
    value: StaffMemberStore[keyof StaffMemberStore]
  ) => void;
}
