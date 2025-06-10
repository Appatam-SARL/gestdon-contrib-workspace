import { create } from 'zustand';

export type Mfa = {
  secret: string;
  qrCode: string;
};

export type MfaStore = {
  mfa: Mfa | null;
  setMfaStore: (key: keyof MfaStore, value: MfaStore[keyof MfaStore]) => void;
};

export const useMfaStore = create<MfaStore>((set) => ({
  mfa: null,
  setMfaStore: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
}));
