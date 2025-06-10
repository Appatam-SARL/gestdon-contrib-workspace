import PromesseApi from '@/api/promesse.api';
import { useToast } from '@/components/ui/use-toast';
import { IPromesseFilters, tPromesseForm } from '@/interface/promesse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const usePromesse = (filters: IPromesseFilters) => {
  return useQuery({
    queryKey: ['promesses', ...(Object.values(filters) || [])],
    queryFn: () => PromesseApi.getPromesses(filters),
  });
};

export const useCreatePromesse = (
  setOpenAddPromise: (value: boolean) => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (promesse: tPromesseForm) =>
      PromesseApi.createPromesse(promesse),
    onMutate: () => {
      toast({
        title: 'Création de la promesse en cours...',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Promesse créée avec succès',
        description: 'La promesse a bien été créée',
      });
      queryClient.invalidateQueries({
        queryKey: ['promesses'],
      });
      navigate(`/promises`);
      setOpenAddPromise(false);
    },
    onError: () => {
      toast({
        title: 'Erreur lors de la création de la promesse',
        description:
          'Une erreur est survenue lors de la création de la promesse',
        variant: 'destructive',
      });
      setOpenAddPromise(true);
    },
  });
};

export const useUpdatePromesse = (
  id: string,
  setOpenAddPromise: (value: boolean) => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: tPromesseForm) => PromesseApi.updatePromesse(id, data),
    onMutate: () => {
      toast({
        title: 'Création de la promesse en cours...',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: (data, varialbles) => {
      toast({
        title: 'Promesse créée avec succès',
        description: 'La promesse a bien été créée',
      });
      queryClient.invalidateQueries({
        queryKey: ['promesses', ...(Object.values(varialbles) as any)],
      });
      navigate(`/promises`);
      setOpenAddPromise(false);
    },
    onError: () => {
      toast({
        title: 'Erreur lors de la création de la promesse',
        description:
          'Une erreur est survenue lors de la création de la promesse',
        variant: 'destructive',
      });
      setOpenAddPromise(true);
    },
  });
};

export const useDeletePromesse = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PromesseApi.deletePromesse(id),
    onMutate: () => {
      toast({
        title: 'Création de la promesse en cours...',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: (data, varialbles) => {
      toast({
        title: 'Promesse supprimée avec succès',
        description: 'La promesse a bien été supprimée',
      });
      queryClient.invalidateQueries({
        queryKey: ['promesses', ...(Object.values(varialbles) as any)],
      });
    },
    onError: () => {
      toast({
        title: 'Erreur lors de la suppression de la promesse',
        description:
          'Une erreur est survenue lors de la suppression de la promesse',
        variant: 'destructive',
      });
    },
  });
};
