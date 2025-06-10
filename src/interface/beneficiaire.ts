export interface IBeneficiaire {
  _id: string;
  fullName: string;
  description: string;
  representant: {
    firstName: string;
    lastName: string;
    phone: string;
    address: {
      country: string;
      street: string;
      postalCode: string;
      city: string;
    };
  };
  contributorId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IBeneficiaireFilterForm {
  period?: {
    from?: Date | string;
    to?: Date | string;
  };
  search?: string;
  limit?: number;
  page?: number;
  contributorId?: string;
}

// store zustand store
export interface BeneficiaireStore {
  beneficiaires: Array<IBeneficiaire> | null;
  beneficiaire: IBeneficiaire | null;
  beneficiaireForm: Partial<IBeneficiaire> | null;
  beneficiaireFilterForm: IBeneficiaireFilterForm | null;
  setBeneficiaryStore: <K extends keyof BeneficiaireStore>(
    key: K,
    value: BeneficiaireStore[K]
  ) => void;
}
