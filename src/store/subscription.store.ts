import { tSubscriptionStore } from '@/types/souscription.type';
import zukeeper from 'zukeeper';
import { create } from 'zustand';

export const useSubscriptionStore = create<tSubscriptionStore>(
  zukeeper((set: any, get: any) => ({
    subscriptions: [],
    subscription: null,
    setSubscriptionStore: (key: keyof tSubscriptionStore, value: any) =>
      set({ [key]: value }),
  }))
);

window.store = useSubscriptionStore;
