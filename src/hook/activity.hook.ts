// import { ActivityApi } from '@/api/activity.api';
import ActivityApi from '@/api/activity.api';
import { IActivityFilterForm } from '@/interface/activity';
import { useQuery } from '@tanstack/react-query';

export const useGetActivities = (filters: IActivityFilterForm) => {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: () => ActivityApi.getActivities(filters),
  });
};
