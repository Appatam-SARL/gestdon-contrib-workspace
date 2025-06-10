import { IBeneficiaire } from './beneficiaire';

export interface IDon {
  _id: string;
  beneficiaire: Pick<IBeneficiaire, '_id' | 'fullName'>;
  montant: number;
  description?: string;
  devise: string;
  dateDon: Date;
  contributorId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IDonFilterForm {
  limit?: number;
  page?: number;
  search?: string;
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
