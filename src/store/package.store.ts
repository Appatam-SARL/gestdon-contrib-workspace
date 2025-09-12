import zukeeper from 'zukeeper';
import { create } from 'zustand';
import { IPackageStore } from '../interface/package.interface';

const usePackageStore = create<IPackageStore>(
  zukeeper((set: any) => ({
    packages: [],
    package: null,
    currentPackage: null,

    setPackageStore: (key: keyof IPackageStore, value: any) =>
      set((state: any) => ({
        ...state,
        [key]: value,
      })),
  }))
);

export default usePackageStore;
