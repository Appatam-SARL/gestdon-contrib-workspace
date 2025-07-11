import DonApi from '@/api/don.api';
import { useToast } from '@/components/ui/use-toast';
import { IDon, IDonFilterForm } from '@/interface/don';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useDons = (filter: IDonFilterForm) => {
  return useQuery({
    queryKey: ['dons', ...(Object.values(filter) as string[])],
    queryFn: () => DonApi.getDons(filter),
    enabled: true,
  });
};

export const useDon = (id: string) => {
  return useQuery({
    queryKey: ['don', id],
    queryFn: () => DonApi.getDon(id),
    enabled: !id,
  });
};

export const useStatsDon = (filter: { contributorId: string }) => {
  return useQuery({
    queryKey: ['statsDon'],
    queryFn: () => DonApi.getStatsDon(filter),
  });
};

export const useCreateDon = (setIsCreateDonOpen: (value: boolean) => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (don: Partial<IDon>) => DonApi.createDon(don),
    onMutate: () => {
      // TODO: Implémenter l'affichage de l'overlay
      toast({
        title: 'Veuillez patienter',
        description: 'Merci de patienter pendant que nous créons votre don',
      });
    },
    onError: () => {
      // TODO: Implémenter l'affichage d'une erreur
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création de votre don',
        variant: 'destructive',
      });
      setIsCreateDonOpen(true);
    },
    onSuccess: () => {
      // TODO: Implémenter la redirection vers la page de création
      toast({
        title: 'Don créé',
        description: 'Votre don a bien été créé',
      });
      queryClient.invalidateQueries({ queryKey: ['dons'] });
      setIsCreateDonOpen(false);
    },
  });
};
