import { AgendaApi } from '@/api/agenda.api';
import { useToast } from '@/components/ui/use-toast';
import { AgendaEvent } from '@/interface/agenda';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAgendaEvents = (filter: { contributorId: string }) => {
  return useQuery({
    queryKey: ['agendaEvents', ...(Object.values(filter) as string[])],
    queryFn: () => AgendaApi.getEvents(filter),
  });
};

export const useCreateAgendaEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newEvent: AgendaEvent) => AgendaApi.createEvent(newEvent),
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendaEvents'] });
      toast({
        title: 'Tâche ajoutée avec succès',
        description: 'Une tâche a été ajoutée avec succès.',
      });
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: 'Une erreur est survenue lors de la création.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAgendaEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: AgendaEvent }) =>
      AgendaApi.updateEvent(id, event),
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendaEvents'] });
      toast({
        title: 'Tâche mise à jour avec succès',
        description: 'Une tâche a été mise à jour avec succès.',
      });
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: 'Une erreur est survenue lors de la mise à jour.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAgendaEvent = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AgendaApi.deleteEvent(id),
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendaEvents'] });
      toast({
        title: 'Tâche supprimée avec succès',
        description: 'Une tâche a été supprimée avec succès.',
      });
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: 'Une erreur est survenue lors de la suppression.',
        variant: 'destructive',
      });
    },
  });
};
