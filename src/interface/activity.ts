import { IUser } from '@/types/user';
import { IActivityType } from './activity-type';
import { IBeneficiaire } from './beneficiaire';

export interface IActivity {
  _id: number;
  assigneeId: string | IUser;
  representative?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };
  title: string;
  locationOfActivity: string;
  description: string;
  status: 'Draft' | 'Approved' | 'Rejected' | 'Archived' | 'Waiting' | '';
  contributorId: number;
  beneficiaryId: string | IBeneficiaire;
  activityTypeId: string | IActivityType;
  customFields: Map<string, any>;
  motif?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IActivityFilterForm {
  search?: string;
  status?: 'Draft' | 'Approved' | 'Rejected' | 'Waiting' | 'Archived' | '';
  contributorId?: string;
  activityTypeId?: string;
  page?: number;
  limit?: number;
  period?: {
    from?: string;
    to?: string;
  };
}
