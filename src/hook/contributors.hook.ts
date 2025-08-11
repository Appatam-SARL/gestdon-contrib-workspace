import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ContributorsAPI } from '@/api/contributors.api';
import { uploadFile } from '@/api/file.api';
import { useToast } from '@/components/ui/use-toast';
import { IContributor, IContributorFilters } from '@/interface/contributor';
import { ContributorFormValues } from '@/pages/auth/register';
import useContributorStore from '@/store/contributor.store';
import { useNavigate } from 'react-router';
// import { Contributor } from '@/interface/contributor';

const contributorKeys = {
  all: ['contributors'] as const,
  lists: (filters: IContributorFilters) =>
    [...contributorKeys.all, 'list', filters] as const,
  detail: (id: string) => [...contributorKeys.all, 'detail', id] as const,
};

export const useCreateContributor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({
      data,
      files,
    }: {
      data: ContributorFormValues;
      files: Array<File>;
    }) => {
      const formData = new FormData();
      formData.append('file', files[0]);
      const response = await uploadFile(formData, 'logo');
      if (response.success) {
        data.logo = {
          fileId: response.filesData[0].fileId,
          fileUrl: response.filesData[0].fileUrl,
        };
        const responseAfterCreatingAccountContributor =
          await ContributorsAPI.createContributor(data);
        return responseAfterCreatingAccountContributor;
      }
    },
    onMutate: () => {
      toast({
        title: 'Création en cours',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Message de confirmation',
        description: data?.message,
        duration: 5000,
      });
      navigate('/register-successfull');
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors de la création',
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });
};

export const useGetContributors = (filters: IContributorFilters) => {
  return useQuery({
    queryKey: contributorKeys.lists(filters),
    queryFn: () => ContributorsAPI.getContributors(filters),
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
      contributor: Partial<IContributor>;
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

export const useGetContributorFollowers = (id: string) => {
  return useQuery({
    queryKey: ['followers', id],
    queryFn: () => ContributorsAPI.getContributorFollowers(id),
  });
};

export const useGetContributorFollowing = (id: string) => {
  return useQuery({
    queryKey: ['following', id],
    queryFn: () => ContributorsAPI.getContributorFollowing(id),
  });
};

export const useFollowContributor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const setContributorStore = useContributorStore((s) => s.setContributorStore);
  return useMutation({
    mutationFn: (data: { followerId: string; followedId: string }) =>
      ContributorsAPI.followContributor(data),
    onMutate: () => {
      toast({
        title: 'Suivi en cours',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Suivi effectué',
        description: 'Vous suivez maintenant ce compte',
      });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['contributors'] });
      queryClient.invalidateQueries({
        queryKey: ['contributors', 'detail'],
      });
      setContributorStore('contributor', data.data);
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors du suivi',
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });
};

export const useUnfollowContributor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const setContributorStore = useContributorStore((s) => s.setContributorStore);
  return useMutation({
    mutationFn: (data: { followerId: string; followedId: string }) =>
      ContributorsAPI.unfollowContributor(data),
    onMutate: () => {
      toast({
        title: 'Désabonnement en cours',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Désabonnement effectué',
        description: 'Vous ne suivez plus ce compte',
      });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['contributors'] });
      queryClient.invalidateQueries({
        queryKey: ['contributors', 'detail'],
      });
      setContributorStore('contributor', data.data);
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors du désabonnement',
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });
};

export const useCountContributorFollowers = (id: string) => {
  return useQuery({
    queryKey: ['followers', id, 'count'],
    queryFn: () => ContributorsAPI.countContributorFollowers(id),
  });
};

export const useCountContributorFollowing = (id: string) => {
  return useQuery({
    queryKey: ['following', id, 'count'],
    queryFn: () => ContributorsAPI.countContributorFollowing(id),
  });
};
