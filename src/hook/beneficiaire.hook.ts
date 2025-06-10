import BeneficiaireApi from '@/api/beneficiaire.api';
import { useToast } from '@/components/ui/use-toast';
import {
  IBeneficiaire,
  IBeneficiaireFilterForm,
} from '@/interface/beneficiaire';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useBeneficiaries = (filter: IBeneficiaireFilterForm) => {
  return useQuery({
    queryKey: ['beneficiaires', ...(Object.values(filter) as string[])],
    queryFn: () => BeneficiaireApi.getBeneficiaries(filter),
    enabled: !filter.contributorId,
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
