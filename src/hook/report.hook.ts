import ReportApi from '@/api/report.api';
import { useToast } from '@/components/ui/use-toast';
import { IReportFilterForm, tReportForm } from '@/interface/report';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useReports = (filters: IReportFilterForm) => {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => ReportApi.getReports(filters),
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => ReportApi.getReport(id),
    enabled: !!id,
  });
};

export const useCreateReport = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (report: unknown) => ReportApi.createReport(report),
    onMutate: () => {
      toast({
        title: "Création de l'report en cours",
        description: `La création de l'report est en cours.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: 'Report créé avec succès',
        description: `L'report a été ajoutée.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la création de l'report",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateReport = (id: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (report: tReportForm) => ReportApi.updateReport(id, report),
    onMutate: () => {
      toast({
        title: "Mise à jour de l'report en cours",
        description: `La mise à jour de l'report est en cours.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', id] });
      toast({
        title: 'Report mis à jour avec succès',
        description: `L'report a été modifiée.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la mise à jour de l'report",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteReport = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => ReportApi.deleteReport(id),
    onMutate: () => {
      toast({
        title: "Suppression de l'report en cours",
        description: `La suppression de l'report est en cours.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: 'Report supprimée avec succès',
        description: `L'report a été retirée.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la suppression de l'report",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useValidateReport = (
  id: string,
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => ReportApi.validate(id),
    onMutate: () => {
      toast({
        title: "Validation de l'report en cours",
        description: `La validation de l'report est en cours.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', id] });
      toast({
        title: 'Report validé avec succès',
        description: `L'report a été validé.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la validation de l'report",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useRefuseReport = (id: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => ReportApi.refuse(id),
    onMutate: () => {
      toast({
        title: "Refus de l'report en cours",
        description: `La refus de l'report est en cours.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', id] });
      toast({
        title: 'Report refusé avec succès',
        description: `L'report a été refusé.`,
      });
      onSuccessCallback?.();
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la refus de l'report",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};
