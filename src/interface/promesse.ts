import { IBeneficiaire } from './beneficiaire';

export interface IPromesse {
  _id: string;
  title: string;
  description: string;
  beneficiaireId: IBeneficiaire | string;
  contributorId: string;
  amount: string;
  status: tStatusPromesse;
  type: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export type tPromesseForm = Partial<IPromesse>;
export type tPromesse = Readonly<IPromesse>;
export type tStatusPromesse = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RECEIVED';

export interface IPromesseFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  beneficiaireId?: string;
  period?: {
    from?: string;
    to?: string;
  };
  contributorId?: string;
}

export interface IPromesseStore {
  promesses: tPromesse[];
  promesseForm: tPromesseForm;
  filters: IPromesseFilters;

  setPromesseStore<K extends keyof Omit<IPromesseStore, 'setPromesseStore'>>(
    key: K,
    value: IPromesseStore[K]
  ): void;
}
