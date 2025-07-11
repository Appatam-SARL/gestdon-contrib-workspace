import BeneficiaireApi from '@/api/beneficiaire.api';
import { useToast } from '@/components/ui/use-toast';
import {
  IBeneficiaire,
  IBeneficiaireFilterForm,
} from '@/interface/beneficiaire';
import {
  FormAddRepresentantBeneficiarySchemaValue,
  FormUpdateNameBeneficiarySchemaValue,
  FormUpdateRepresentantBeneficiarySchemaValue,
} from '@/schema/beneficiary.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useBeneficiaries = (filter: IBeneficiaireFilterForm) => {
  return useQuery({
    queryKey: ['beneficiaires', ...(Object.values(filter) as string[])],
    queryFn: () => BeneficiaireApi.getBeneficiaries(filter),
    enabled: !!filter.contributorId,
  });
};

export const useBeneficiary = (id: string) => {
  return useQuery({
    queryKey: ['beneficiaire', id],
    queryFn: () => BeneficiaireApi.getBeneficiary(id),
  });
};

export const useCreateBeneficiary = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (beneficiary: Partial<IBeneficiaire>) =>
      BeneficiaireApi.createBeneficiary(beneficiary),
    onMutate: () => {
      // TODO: Implémenter l'affichage de l'overlay
      toast({
        title: 'Veuillez patienter',
        description:
          'Merci de patienter pendant que nous créons votre bénéficiaire',
      });
    },
    onError: () => {
      // TODO: Implémenter l'affichage d'une erreur
      toast({
        title: 'Erreur',
        description:
          'Une erreur est survenue lors de la création de votre bénéficiaire',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      // TODO: Implémenter la redirection vers la page de création
      toast({
        title: 'Bénéficiaire créé',
        description: 'Votre bénéficiaire a bien été créé',
      });
      navigate('/community');
    },
  });
};

export const useAddRepresentantBeneficiary = (
  id: string,
  setIsOpenAddRepresentantBeneficiary: (val: boolean) => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (representant: FormAddRepresentantBeneficiarySchemaValue) =>
      BeneficiaireApi.addRepresentantBeneficiary(id, representant),
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Representant ajouté',
        description: 'Le représentant a bien été ajouté',
      });
      queryClient.invalidateQueries({ queryKey: ['beneficiaire', id] });
      setIsOpenAddRepresentantBeneficiary(false);
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      setIsOpenAddRepresentantBeneficiary(true);
    },
  });
};

export const useUpdateRepresentantBeneficiary = (
  id: string,
  setIsOpenUpdateRepresentantBeneficiary: (val: boolean) => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormUpdateRepresentantBeneficiarySchemaValue) =>
      BeneficiaireApi.updateRepresentantBeneficiary(id, data),
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Representant ajouté',
        description: 'Le représentant a bien été ajouté',
      });
      queryClient.invalidateQueries({ queryKey: ['beneficiaire', id] });
      setIsOpenUpdateRepresentantBeneficiary(false);
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      setIsOpenUpdateRepresentantBeneficiary(true);
    },
  });
};

export const useUpdateBeneficiary = (
  id: string,
  setIsOpenUpdateBeneficiary?: (val: boolean) => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormUpdateNameBeneficiarySchemaValue) =>
      BeneficiaireApi.updateBeneficiary(id, data),
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
      queryClient.invalidateQueries({ queryKey: ['beneficiary'] });
      queryClient.invalidateQueries({ queryKey: ['beneficiaire', id] });
      if (setIsOpenUpdateBeneficiary) setIsOpenUpdateBeneficiary(false);
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      if (setIsOpenUpdateBeneficiary) setIsOpenUpdateBeneficiary(true);
    },
  });
};

export const useDeleteRepresentantBeneficiary = (id: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { _id: string }) =>
      BeneficiaireApi.deleteRepresentantBeneficiaire(id, data),
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Representant supprimé',
        description: 'Le représentant a bien été supprimé.',
      });
      queryClient.invalidateQueries({ queryKey: ['beneficiaire', id] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
