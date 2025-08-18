import PackageApi from '@/api/package.api';
import usePackageStore from '@/store/package.store';
import { useQuery } from '@tanstack/react-query';

export const usePackages = () => {
  const { setPackageStore } = usePackageStore((state) => state);
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      try {
        const { data } = await PackageApi.getPackages();
        setPackageStore('packages', data);
        return data;
      } catch (error) {
        console.warn('API error:', error);
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};

export const usePackage = (id: string) => {
  const { setPackageStore } = usePackageStore((state) => state);
  return useQuery({
    queryKey: ['package', id],
    queryFn: async () => {
      try {
        const { data } = await PackageApi.getPackage(id);
        setPackageStore('currentPackage', data);
        return data;
      } catch (error) {
        console.warn('Error fetching package:', error);
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};
