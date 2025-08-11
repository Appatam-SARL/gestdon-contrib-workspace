// import { ActivityApi } from '@/api/activity.api';
import ActivityApi from '@/api/activity.api';
import { useToast } from '@/components/ui/use-toast';
import { IActivityFilterForm } from '@/interface/activity';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useGetActivities = (filters: IActivityFilterForm) => {
  return useQuery({
    queryKey: ['activities', ...Object.values(filters)],
    queryFn: () => ActivityApi.getActivities(filters),
  });
};

export const useActivity = (id: string) => {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: () => ActivityApi.getActivity(id),
    enabled: !!id,
  });
};

export const useValidateActivity = (
  id: string,
  setIsValidateDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: { startDate: string; endDate: string }) =>
      ActivityApi.validateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast({
        title: 'Vous venez de valider une nouvelle activité.',
        variant: 'default',
        duration: 1000,
      });
      setIsValidateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to validate activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
        duration: 500,
      });
    },
  });
};

export const useArchiveActivity = (
  id: string,
  setIsArchiveDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => ActivityApi.archiveActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast({
        title: 'Vous venez de archiver une nouvelle activité.',
        variant: 'default',
      });
      setIsArchiveDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to archive activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteActivity = (
  id: string,
  setIsDeleteDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => ActivityApi.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: 'Vous venez de supprimer une nouvelle activité.',
        variant: 'default',
      });
      setIsDeleteDialogOpen(false);
      navigate('/activity');
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateActivity = (
  id: string,
  setIsEditDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: any) => ActivityApi.updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: 'Vous venez de modifier une nouvelle activité.',
        variant: 'default',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });
};

export const useDraftActivity = (
  id: string,
  setIsDraftDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => ActivityApi.draftActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast({
        title: 'Vous venez de valider une nouvelle activité.',
        variant: 'default',
      });
      setIsDraftDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to draft activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });
};

export const useAssignActivity = (
  id: string,
  setIsAssignDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: { assigneeId: string }) => {
      return ActivityApi.assignActivity(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast({
        title: 'Vous venez de assigner une nouvelle activité.',
        variant: 'default',
      });
      setIsAssignDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to assign activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });
};

export const useReportActivity = (
  id: string,
  setIsReportDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: any) => ActivityApi.reportActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast({
        title: 'Vous venez de reporter cette activité.',
        variant: 'default',
      });
      setIsReportDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to report activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });
};

export const useRepresentant = (
  id: string,
  setIsRepresentantDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: { representative: any }) => {
      return ActivityApi.representative(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast({
        title: 'Vous venez de modifier une nouvelle activité.',
        variant: 'default',
      });
      setIsRepresentantDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });
};

export const useRejectActivity = (
  id: string,
  setIsRejectDialogOpen: (val: boolean) => void
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: { motif: string }) =>
      ActivityApi.rejectActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast({
        title: 'Vous venez de rejeter une nouvelle activité.',
        variant: 'default',
      });
      setIsRejectDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to reject activity.',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });
};

export const useGetActivityStats = (contributorId: string) => {
  return useQuery({
    queryKey: ['activityStats', contributorId],
    queryFn: () => ActivityApi.getActivityStats({ contributorId }),
    enabled: !!contributorId,
  });
};
