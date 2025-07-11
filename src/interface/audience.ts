import { IUser } from '@/types/user';
import { IBeneficiaire } from './beneficiaire';

export interface IAudience {
  _id: string;
  assigneeId?: string | IUser;
  title: string;
  locationOfActivity: string;
  description: string;
  startDate?: string;
  endDate?: string;
  type: 'normal' | 'representative';
  representative?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  motif?: string;
  status?: tStatusAudience;
  beneficiaryId: string | IBeneficiaire;
  contributorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAudienceState {
  PENDING: number;
  VALIDATED: number;
  REFUSED: number;
  ARCHIVED: number;
  DRAFT: number;
}

export interface IAudienceForm {
  beneficiaryId: string;
  locationOfActivity: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  contributorId: string;
}

export interface IAudienceFilterForm {
  search?: string;
  period?: { from: string; to: string };
  page?: number;
  limit?: number;
  contributorId?: string;
  type?: 'normal' | 'representative';
  status?: tStatusAudience;
}

export type tStatusAudience =
  | 'PENDING'
  | 'VALIDATED'
  | 'REFUSED'
  | 'ARCHIVED'
  | 'DRAFT';
