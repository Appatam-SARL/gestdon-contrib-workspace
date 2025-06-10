import { useMutation, useQuery } from '@tanstack/react-query';

import { ContributorsAPI } from '@/api/contributors.api';
import { useToast } from '@/components/ui/use-toast';
import { Contributor } from '@/interface/contributor';

const contributorKeys = {
  all: ['contributors'] as const,
  lists: () => [...contributorKeys.all, 'list'] as const,
  detail: (id: string) => [...contributorKeys.all, 'detail', id] as const,
};

export const useCreateContributor = () => {
  return useMutation({
    mutationFn: (data: Contributor) => ContributorsAPI.createContributor(data),
    onSuccess: (data) => {
      console.log('Contributor created successfully:', data);
      // TODO: Invalidate relevant queries or update cache
    },
    onError: (error) => {
      console.error('Error creating contributor:', error);
    },
  });
};

export const useGetContributors = () => {
  return useQuery({
    queryKey: contributorKeys.lists(),
    queryFn: () => ContributorsAPI.getContributors(),
  });
};

export const useGetContributorById = (id: string) => {
  return useQuery({
    queryKey: contributorKeys.detail(id),
    queryFn: () => ContributorsAPI.getContributorById(id),
    enabled: !!id, // Only run query if id is provided
  });
};

export const useUpdateContributor = () => {
  return useMutation({
    mutationFn: ({
      id,
      contributor,
    }: {
      id: string;
      contributor: Partial<Contributor>;
    }) => ContributorsAPI.updateContributor(id, contributor),
    onSuccess: (data) => {
      console.log('Contributor updated successfully:', data);
      // TODO: Invalidate relevant queries or update cache
    },
    onError: (error) => {
      console.error('Error updating contributor:', error);
    },
  });
};

export const useDeleteContributor = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => ContributorsAPI.deleteContributor(id),
    onMutate: () => {
      toast({
        title: 'Suppression en cours',
        description: 'Votre compte est en cours de suppression',
      });
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast({
          title: 'Compte supprimé',
          description: 'Votre compte a été supprimé avec succès',
        });
      }
    },
    onError: (error) => {
      console.error('Error deleting contributor:', error);
    },
  });
};
