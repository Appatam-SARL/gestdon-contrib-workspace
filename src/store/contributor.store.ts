import { ContributorStore } from '@/interface/contributor';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useContributorStore = create<ContributorStore>()(
  devtools((set) => ({
    contributor: null,
    contributorForm: null,
    setContributorStore: (key, value) =>
      set((state) => ({ ...state, [key]: value })),
  }))
);

export default useContributorStore;
