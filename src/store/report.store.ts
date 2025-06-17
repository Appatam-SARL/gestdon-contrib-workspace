import { IReportStore } from '@/interface/report';
import { create } from 'zustand';

const useReportStore = create<IReportStore>((set) => ({
  reports: [],
  report: null,
  reportForm: {
    content: '',
    contributorId: '',
  },
  reportFilterForm: {
    search: '',
    page: 1,
    limit: 10,
    contributorId: '',
  },
  setReportStore: (key, value) => {
    set((state) => ({
      ...state,
      [key]: value,
    }));
  },
}));

export default useReportStore;
