import ActivityApi from '@/api/activity.api';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateActivity = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ActivityApi.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: 'Activity created successfully!',
        variant: 'default',
      });
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
