import ActivityTypeApi from '@/api/activity-type.api';
import { ActivityFormValues } from '@/pages/online/settings/setting-activity';
import { useMutation, useQuery } from '@tanstack/react-query';

interface UpdateActivityPayload {
  id: string;
  label: string;
}

export function useGetActivityType() {
  return useQuery({
    queryKey: ['activity-type'],
    queryFn: () => ActivityTypeApi.getActivityTypes(),
  });
}

export function useCreateActivityType() {
  return useMutation({
    mutationFn: (data: ActivityFormValues) =>
      ActivityTypeApi.createActivityType(data),
  });
}

export function useUpdateActivityType() {
  return useMutation({
    mutationFn: (data: UpdateActivityPayload) =>
      ActivityTypeApi.updateActivityType(data),
  });
}

export function useDeleteActivityType() {
  return useMutation({
    mutationFn: (id: string) => ActivityTypeApi.deleteActivityType(id),
  });
}
