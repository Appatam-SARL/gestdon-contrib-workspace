import { IBeneficiaire } from './beneficiaire';

export interface IDon {
  _id: string;
  title: string;
  beneficiaire: Pick<IBeneficiaire, '_id' | 'fullName'>;
  type: string;
  montant: number;
  description?: string;
  devise: string;
  contributorId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IDonFilterForm {
  limit?: number;
  page?: number;
  search?: string;
  type?: string;
  period?: {
    from?: Date | string;
    to?: Date | string;
  };
  beneficiaire?: string;
  contributorId?: string;
}

// store zustand store
export interface DonStore {
  dons: Array<IDon> | null;
  don: IDon | null;
  donForm: Partial<IDon> | null;
  donFilterForm: IDonFilterForm | null;
  setDonStore: <K extends keyof DonStore>(key: K, value: DonStore[K]) => void;
}
