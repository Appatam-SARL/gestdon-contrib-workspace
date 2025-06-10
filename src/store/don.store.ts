import {
  DON_FILTER_FORM_INITIAL_STATE,
  DON_INITIAL_STATE,
} from '@/assets/constants/don';
import { DonStore } from '@/interface/don';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useDonStore = create<DonStore>()(
  devtools((set) => ({
    dons: null,
    don: null,
    donForm: DON_INITIAL_STATE,
    donFilterForm: DON_FILTER_FORM_INITIAL_STATE,
    setDonStore: <K extends keyof DonStore>(key: K, value: DonStore[K]) => {
      set((state) => ({
        ...state,
        [key]: value,
      }));
    },
  }))
);
