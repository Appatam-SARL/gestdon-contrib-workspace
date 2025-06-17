import AudienceApi from '@/api/audience.api';
import { toast } from '@/components/ui/use-toast';
import { IAudienceFilterForm, IAudienceForm } from '@/interface/audience';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAudiences = (filters: IAudienceFilterForm) => {
  return useQuery({
    queryKey: ['audiences', filters],
    queryFn: () => AudienceApi.getAudiences(filters),
  });
};

export const useAudience = (id: string) => {
  return useQuery({
    queryKey: ['audience', id],
    queryFn: () => AudienceApi.getAudience(id),
    enabled: !!id,
  });
};

export const useCreateAudience = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (audience: IAudienceForm) =>
      AudienceApi.createAudience(audience),
    onMutate: () => {
      toast({
        title: "Création de l'audience en cours",
        description: `La création de l'audience est en cours.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] });
      toast({
        title: 'Audience créée avec succès',
        description: `La nouvelle audience a été ajoutée.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la création de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAudience = (
  id: string,
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (audience: Partial<IAudienceForm>) =>
      AudienceApi.updateAudience(id, audience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] });
      queryClient.invalidateQueries({ queryKey: ['audience', id] });
      toast({
        title: 'Audience mise à jour avec succès',
        description: `L'audience a été modifiée.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la mise à jour de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAudience = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AudienceApi.deleteAudience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] });
      toast({
        title: 'Audience supprimée avec succès',
        description: `L'audience a été retirée.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la suppression de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useValidateAudience = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: (id: string) => AudienceApi.validateAudience(id),
    onMutate: () => {
      toast({
        title: "Validation de l'audience en cours",
        description: `La validation de l'audience est en cours.`,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Audience validée avec succès',
        description: `L'audience a été validée.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la validation de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useArchiveAudience = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: (id: string) => AudienceApi.archiveAudience(id),
    onMutate: () => {
      toast({
        title: "Archivage de l'audience en cours",
        description: `L'archivage de l'audience est en cours.`,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Audience archivée avec succès',
        description: `L'audience a été archivée.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'archivage de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useReportAudience = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: (audience: Partial<IAudienceForm>) =>
      AudienceApi.reportAudience(audience),
    onMutate: () => {
      toast({
        title: "Reportage de l'audience en cours",
        description: `La reportage de l'audience est en cours.`,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Audience reportée avec succès',
        description: `L'audience a été reportée.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'archivage de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};
