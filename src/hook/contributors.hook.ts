import { useMutation, useQuery } from '@tanstack/react-query';

import { ContributorsAPI } from '@/api/contributors.api';
import { uploadFile } from '@/api/file.api';
import { useToast } from '@/components/ui/use-toast';
import { IContributor } from '@/interface/contributor';
import { ContributorFormValues } from '@/pages/auth/register';
import { useNavigate } from 'react-router';
// import { Contributor } from '@/interface/contributor';

const contributorKeys = {
  all: ['contributors'] as const,
  lists: () => [...contributorKeys.all, 'list'] as const,
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
      try {
        const formData = new FormData();
        formData.append('file', files[0]);
        const response = await uploadFile(formData, 'logo');
        if (response.success) {
          data.logo = {
            fileId: response.filesData[0].fileId,
            fileUrl: response.filesData[0].fileUrl,
          };
          await ContributorsAPI.createContributor(data);
        }
      } catch (error) {
        console.error('Error creating contributor:', error);
      }
    },
    onMutate: () => {
      toast({
        title: 'Création en cours',
        description: 'Merci de patienter...',
        duration: 5000,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Création réussie',
        description: 'Merci de patienter...',
        duration: 5000,
      });
      navigate('/register-successfull');
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors de la création',
        description: error.message,
        duration: 5000,
      });
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
