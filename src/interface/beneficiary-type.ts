import { IContributor } from '@/interface/contributor';
export interface IBeneficiaryType {
  _id: string;
  label: string;
  contributorId: string | IContributor;
  createdAt: string;
  updatedAt: string;
}

export interface IBeneficiaryTypeForm {
  id?: string;
  label: string;
}

export interface IBeneficiaryTypeFilters {
  search?: string;
  page?: number;
  limit?: number;
  contributorId?: string;
}
