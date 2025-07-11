import AudienceApi from '@/api/audience.api';
import { toast, useToast } from '@/components/ui/use-toast';
import { IAudienceFilterForm, IAudienceForm } from '@/interface/audience';
import {
  FormAssignAudienceSchema,
  FormRejectedAudienceSchema,
  FormReportAudienceSchema,
  FormRepresentantAudienceSchema,
  FormValidateAudienceSchema,
} from '@/schema/audience.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

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

export const useUpdateAudience = (id: string) => {
  const navigate = useNavigate();
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
      navigate(`/audiences/${id}`);
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

export const useValidateAudience = (
  id: string,
  setIsValidateDialogOpen: (value: boolean) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormValidateAudienceSchema) => {
      return AudienceApi.validateAudience(id, data);
    },
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
      queryClient.invalidateQueries({ queryKey: ['audiences'] });
      queryClient.invalidateQueries({ queryKey: ['audience', id] });
      setIsValidateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la validation de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsValidateDialogOpen(true);
    },
  });
};

export const useAssignAudience = (
  id: string,
  setIsAssignDialogOpen: (val: boolean) => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormAssignAudienceSchema) => {
      return AudienceApi.assignAudience(id, data);
    },
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Assigné',
        description: "L'audience a été assignée.",
      });
      queryClient.invalidateQueries({ queryKey: ['audiences'] });
      queryClient.invalidateQueries({ queryKey: ['audience', id] });
      setIsAssignDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'assignation de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsAssignDialogOpen(true);
    },
  });
};

export const useRepresentant = (
  id: string,
  setIsRepresentantDialogOpen: (val: boolean) => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormRepresentantAudienceSchema) =>
      AudienceApi.updateRepresentant(id, data),
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Assigné',
        description: "L'audience a été assignée.",
      });
      queryClient.invalidateQueries({ queryKey: ['audiences'] });
      queryClient.invalidateQueries({ queryKey: ['audience', id] });
      setIsRepresentantDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'assignation de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsRepresentantDialogOpen(true);
    },
  });
};

export const useRejectedAudience = (
  id: string,
  setIsOpenDialogRejeted: (value: boolean) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormRejectedAudienceSchema) => {
      return AudienceApi.rejectedAudience(id, data);
    },
    onMutate: () => {
      toast({
        title: "Rejet de l'audience en cours",
        description: `La rejet de l'audience est en cours.`,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Audience rejetée avec succès',
        description: `L'audience a été rejetée.`,
      });
      queryClient.invalidateQueries({ queryKey: ['audiences'] });
      queryClient.invalidateQueries({ queryKey: ['audience', id] });
      setIsOpenDialogRejeted(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la rejet de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsOpenDialogRejeted(true);
    },
  });
};

export const useArchiveAudience = (
  id: string,
  setIsArchiveDialogOpen: (val: boolean) => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AudienceApi.archiveAudience(id),
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
      queryClient.invalidateQueries({ queryKey: ['audience', id] });
      setIsArchiveDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'archivage de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsArchiveDialogOpen(true);
    },
  });
};

export const useBrouillonAudience = (
  id: string,
  setIsBrouillonDialogOpen: (val: boolean) => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AudienceApi.brouillonAudience(id),
    onMutate: () => {
      toast({
        title: "Brouillon de l'audience en cours",
        description: `La brouillon de l'audience est en cours.`,
      });
    },
    onSuccess: () => {
      toast({
        title: "Brouillon de l'audience réussi",
        description: `L'audience a été brouillon.`,
      });
      queryClient.invalidateQueries({ queryKey: ['audiences'] });
      queryClient.invalidateQueries({ queryKey: ['audience', id] });
      setIsBrouillonDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la brouillon de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsBrouillonDialogOpen(true);
    },
  });
};

export const useReportAudience = (
  id: string,
  setIsReporterDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (audience: FormReportAudienceSchema) =>
      AudienceApi.reportAudience(id, audience),
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
      queryClient.invalidateQueries({ queryKey: ['audiences'] });
      queryClient.invalidateQueries({ queryKey: ['audience', id] });
      setIsReporterDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'archivage de l'audience",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsReporterDialogOpen(true);
    },
  });
};

export const useStatsAudience = (filter: { contributorId: string }) => {
  return useQuery({
    queryKey: ['audiences', 'stats', ...(Object.values(filter) as string[])],
    queryFn: () => AudienceApi.getStatsAudience(filter),
    enabled: !!filter.contributorId,
  });
};
