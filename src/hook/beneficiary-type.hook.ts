import BeneficiaryTypeApi from '@/api/beneficiary-type.api';
import { useToast } from '@/components/ui/use-toast';
import {
  IBeneficiaryTypeFilters,
  IBeneficiaryTypeForm,
} from '@/interface/beneficiary-type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetBeneficiaryType = (filter: IBeneficiaryTypeFilters) => {
  return useQuery({
    queryKey: ['beneficiary-type', ...(Object.values(filter) as string[])],
    queryFn: () => BeneficiaryTypeApi.getBeneficiaryTypes(filter),
  });
};

export const useCreateBeneficiaryType = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IBeneficiaryTypeForm) =>
      BeneficiaryTypeApi.createBeneficiaryType(data),
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
      queryClient.invalidateQueries({ queryKey: ['beneficiary-type'] });
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: error?.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBeneficiaryType = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IBeneficiaryTypeForm) =>
      BeneficiaryTypeApi.updateBeneficiaryType(data),
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
      queryClient.invalidateQueries({ queryKey: ['beneficiary-type'] });
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: error?.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteBeneficiaryType = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BeneficiaryTypeApi.deleteBeneficiaryType(id),
    onMutate: () => {
      // onMutate
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      // onSuccess
      toast({
        title: 'Succès',
        description: 'Le bénéficiaire a été supprimé avec succès.',
      });
      queryClient.invalidateQueries({ queryKey: ['beneficiary-type'] });
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
};
