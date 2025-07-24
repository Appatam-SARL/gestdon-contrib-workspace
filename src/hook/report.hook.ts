import { createManyDocuments } from '@/api/document.api';
import { uploadFile } from '@/api/file.api';
import ReportApi from '@/api/report.api';
import { useToast } from '@/components/ui/use-toast';
import { API_ROOT } from '@/config/app.config';
import { IReport, IReportFilterForm, tReportForm } from '@/interface/report';
import { FormRefusedReportSchema } from '@/schema/report.schema';
import { IDocument } from '@/types/document';
import { APIResponse } from '@/types/generic.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';

export const useReports = (filters: IReportFilterForm) => {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => ReportApi.getReports(filters),
    enabled: !!filters.contributorId,
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => ReportApi.getReport(id),
    enabled: !!id,
  });
};

export const useStatsReport = (filter: { contributorId: string }) => {
  return useQuery({
    queryKey: ['reports', 'stats', ...(Object.values(filter) as string[])],
    queryFn: () => ReportApi.getStatsReports(filter),
    enabled: !!filter.contributorId,
  });
};

export const useCreateReport = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Type pour l'argument unique de la mutation
  type CreateReportArgs = {
    report: unknown;
    files: FileList;
  };

  // Fonction utilitaire pour uploader les fichiers
  const uploadFiles = async (files: FileList) => {
    console.log('🚀 ~ uploadFiles ~ files:', files);

    const filesObject: {
      fileId: string;
      fileUrl: string;
      mimetype?: string;
    }[] = [];
    for (const f of files) {
      const formData = new FormData();
      formData.append('files', f);
      const res = await uploadFile(formData, 'media');
      if (res.success) {
        filesObject.push(res.filesData[0]);
      } else {
        toast({
          title: 'Erreur lors de la création du fichier',
          description: res.message,
          duration: 3000,
        });
      }
    }
    return filesObject;
  };

  return useMutation({
    mutationFn: async ({ report, files }: CreateReportArgs) => {
      console.log('🚀 ~ mutationFn: ~ files:', files);
      // 1. Upload des fichiers
      const filesObject = await uploadFiles(files);

      // 2. Création du rapport
      const responsereport = await ReportApi.createReport(report);

      // 3. Création des documents liés aux fichiers
      if (filesObject.length > 0) {
        const documents: IDocument[] = filesObject.map((file) => ({
          owner: String(responsereport.data._id),
          ownerType: 'Report',
          type: 'OTHER',
          status: 'PENDING',
          fileUrl: file.fileUrl,
          fileId: file.fileId,
          mimeType: file.mimetype,
        }));
        await createManyDocuments(documents);
      }

      return responsereport;
    },
    onMutate: () => {
      toast({
        title: 'Création du rapport',
        description: `La création du rapport est en cours.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({
        title: 'Report créé avec succès',
        description: `Le rapport a été ajouté.`,
      });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur lors de la création du rapport',
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
    },
  });
};

export const useCreateReportOffline = (token: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (report: unknown): APIResponse<IReport> => {
      try {
        const response = await axios.post(
          `http://localhost:5000/v1/api/${API_ROOT.reports}/offline/${token}`,
          report
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onMutate: () => {
      toast({
        title: "Création de l'report en cours",
        description: `La création de l'report est en cours.`,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Report créé avec succès',
        description: `L'report a été ajoutée.`,
      });
      navigate('/');
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

export const useUpdateReport = (
  id: string,
  setIsEditDialogOpen: (val: boolean) => void
) => {
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
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la mise à jour de l'report",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsEditDialogOpen(true);
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
  setIsValidateDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: { validateBy: string }) => ReportApi.validate(id, data),
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
      setIsValidateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la validation de l'report",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsValidateDialogOpen(true);
    },
  });
};

export const useRefuseReport = (
  id: string,
  setIsRefuseDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: FormRefusedReportSchema) => ReportApi.refuse(id, data),
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
      setIsRefuseDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de la refus de l'report",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsRefuseDialogOpen(true);
    },
  });
};

export const useArchiveReport = (
  id: string,
  setIsArchiveDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => ReportApi.archiveReport(id),
    onMutate: () => {
      toast({
        title: "Archivage de l'report en cours",
        description: `L'archivage de l'report est en cours.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', id] });
      toast({
        title: 'Report archivé avec succès',
        description: `L'report a été archivé.`,
      });
      setIsArchiveDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur lors de l'archivage de l'report",
        description: error.message || `Une erreur est survenue`,
        variant: 'destructive',
      });
      setIsArchiveDialogOpen(true);
    },
  });
};
