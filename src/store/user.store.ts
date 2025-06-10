import { IUserFilterForm, setUserStore } from '@/types/user';
import { create } from 'zustand';

export const INIT_USER_FILTER: IUserFilterForm = {
  search: '',
  role: '',
  contributorId: '',
  page: 1,
  limit: 10,
};

const useUserStore = create<setUserStore>((set) => ({
  user: null,
  users: null,
  userAddForm: null,
  userFilterForm: INIT_USER_FILTER,
  setUserStore: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
}));

export default useUserStore;
