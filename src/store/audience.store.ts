import { create } from 'zustand';

// TODO: Define the state and actions for your audience store
interface AudienceStore {
  audienceFilterForm: {
    // TODO: Replace with your actual filter form interface
    search?: string;
    period?: { from: string; to: string };
    page?: number;
    limit?: number;
    contributorId?: string;
  };
  setAudienceStore: (
    key: keyof AudienceStore['audienceFilterForm'],
    value: any
  ) => void;
}

export const useAudienceStore = create<AudienceStore>((set) => ({
  audienceFilterForm: {
    // TODO: Set initial filter values
    search: '',
    page: 1,
    limit: 10,
  },
  setAudienceStore: (key, value) =>
    set((state) => ({
      audienceFilterForm: {
        ...state.audienceFilterForm,
        [key]: value,
      },
    })),
}));
