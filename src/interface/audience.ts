export interface IAudience {
  _id: string;
  title: string;
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
  status?: tStatusAudience;
  beneficiaryId: string;
  contributorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAudienceForm {
  beneficiaryId: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  type: 'normal' | 'representative';
  representative?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  contributorId: string;
}

export interface IAudienceFilterForm {
  search?: string;
  period?: { from: string; to: string };
  page?: number;
  limit?: number;
  contributorId?: string;
  type?: 'normal' | 'representative';
}

export type tStatusAudience = 'PENDING' | 'VALIDATED' | 'REFUSED' | 'ARCHIVED';
