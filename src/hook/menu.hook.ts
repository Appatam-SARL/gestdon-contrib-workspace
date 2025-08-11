import MenuApi from '@/api/menu.api';
import { useQuery } from '@tanstack/react-query';

export const useGetMenus = (filter: { contributorId: string }) => {
  return useQuery({
    queryKey: ['menus', ...((Object.values(filter) as string[]) ?? [])],
    queryFn: () => MenuApi.getMenus(filter),
    enabled: !!filter.contributorId,
    staleTime: Infinity,
  });
};
