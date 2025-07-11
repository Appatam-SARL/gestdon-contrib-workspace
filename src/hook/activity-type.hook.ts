import ActivityTypeApi from '@/api/activity-type.api';
import { useToast } from '@/components/ui/use-toast';
import { IFilterActivityType } from '@/pages/online/activity/AddActivity';
import { ActivityFormValues } from '@/pages/online/settings/setting-activity';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface UpdateActivityPayload {
  id: string;
  label: string;
}

export function useGetActivityType(filter: IFilterActivityType) {
  return useQuery({
    queryKey: ['activity-type', ...Object.values(filter || {})],
    queryFn: () => ActivityTypeApi.getActivityTypes(filter),
  });
}

export function useCreateActivityType(
  setIsAddDialogOpen: (val: boolean) => void,
  refetchActivityTypes: () => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ActivityFormValues) =>
      ActivityTypeApi.createActivityType(data),
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message,
        description: data.data.createdAt,
      });
      queryClient.invalidateQueries({ queryKey: ['activity-type'] });
      setIsAddDialogOpen(false);
      refetchActivityTypes();
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: error?.message,
        variant: 'destructive',
      });
      setIsAddDialogOpen(true);
    },
  });
}

export function useUpdateActivityType(
  setIsEditDialogOpen: (val: boolean) => void,
  setEditingActivityId: (val: string | null) => void,
  refetchActivityTypes: () => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateActivityPayload) =>
      ActivityTypeApi.updateActivityType(data),
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message,
        description: data.data.updatedAt,
      });
      setEditingActivityId(null);
      setIsEditDialogOpen(false);
      refetchActivityTypes();
      queryClient.invalidateQueries({ queryKey: ['activity-type'] });
    },
    onError: (error) => {
      setIsEditDialogOpen(true);
      toast({
        title: error.message,
        description: error?.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteActivityType() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ActivityTypeApi.deleteActivityType(id),
    onMutate: () => {
      // onMutate
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      // onSuccess
      queryClient.invalidateQueries({ queryKey: ['activity-type'] });
      toast({
        title: 'Succès',
        description: "Le type d'activité a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      // onError
      toast({
        title: error.message,
        description: 'Une erreur est survenue lors de la suppression.',
        variant: 'destructive',
      });
    },
  });
}
