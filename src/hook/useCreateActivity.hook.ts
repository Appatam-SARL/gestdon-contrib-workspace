import ActivityApi from '@/api/activity.api';
import { useToast } from '@/components/ui/use-toast';
// import { QUERY_KEYS } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useCreateActivity = (activityTypeId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: any) => ActivityApi.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: 'Vous venez de créer une nouvelle activité.',
        variant: 'default',
      });
      navigate(`/activity${activityTypeId ? `?type=${activityTypeId}` : ''}`);
    },
    onError: (error) => {
      toast({
        title: 'Failed to create activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });
};
