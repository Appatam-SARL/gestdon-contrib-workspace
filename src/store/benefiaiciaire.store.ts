import {
  BENEFICIAIRE_FILTER_FORM_INITIAL_STATE,
  BENEFICIAIRE_INITIAL_STATE,
} from '@/assets/constants/beneficiaire';
import { BeneficiaireStore } from '@/interface/beneficiaire';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useBeneficiaireStore = create<BeneficiaireStore>()(
  devtools((set) => ({
    beneficiaire: BENEFICIAIRE_INITIAL_STATE,
    beneficiaireForm: BENEFICIAIRE_INITIAL_STATE,
    beneficiaireFilterForm: BENEFICIAIRE_FILTER_FORM_INITIAL_STATE,
    setBeneficiaryStore: <K extends keyof BeneficiaireStore>(
      key: K,
      value: BeneficiaireStore[K]
    ) => {
      set((state) => ({
        ...state,
        [key]: value,
      }));
    },
  }))
);
