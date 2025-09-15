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
  budget?: number;
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

export interface IMouvementCheckout {
  _id: string;
  typeMouvementCheckout: string | ITypeMouvementCheckout;
  categoryMouvementCheckout: string | ICategorieMouvementCheckout;
  description: string;
  amount: number;
  activityId: string;
  contributorId: string;
  beneficiaryId?: string;
  document: Array<{
    fileId: string;
    type: string;
    fileUrl: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ITypeMouvementCheckout {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}


export interface ISummaryMouvementCheckout {
  activityId: string;
  contributorId: string;
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  budget: number;
  budgetRemaining: number;
  movementsCount: number;
}

export interface ICategorieMouvementCheckout {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Optionnels côté API pour indiquer l'utilisation et la suppression possible
  isDeletable?: boolean;
  usagesCount?: number;
}
