import { useQuery } from '@tanstack/react-query';
import { ICategorieMouvementCheckout } from '@/interface/activity';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MouvementCheckoutCategoryApi from '@/api/categorie-mouvement-checkout.api';

export const useGetCategoriesMouvementCheckouts = (contributorId: string) => {
  return useQuery({
    queryKey: ['categories-mouvement-checkouts', contributorId],
    queryFn: () => MouvementCheckoutCategoryApi.getCategoriesMouvementCheckouts(contributorId),
  });
};

export const useCreateCategorieMouvementCheckout = (setIsCategorieMouvementCheckoutDialogOpen: (isOpen: boolean) => void ) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICategorieMouvementCheckout) => MouvementCheckoutCategoryApi.createCategorieMouvementCheckout(data),
    onSuccess: () => {
      toast({
        title: 'Catégorie de mouvement de caisse créée avec succès',
        description: 'Catégorie de mouvement de caisse créée avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['categories-mouvement-checkouts'] });
      setIsCategorieMouvementCheckoutDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: error.message,
        variant: 'destructive',
      });
      setIsCategorieMouvementCheckoutDialogOpen(true);
      queryClient.invalidateQueries({ queryKey: ['categories-mouvement-checkouts'] });
    },
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
  });
};

export const useDeleteCategorieMouvementCheckout = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MouvementCheckoutCategoryApi.deleteCategorieMouvementCheckout(id),
    onSuccess: () => {
      toast({
        title: 'Catégorie de mouvement de caisse supprimée avec succès',
        description: 'Catégorie de mouvement de caisse supprimée avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['categories-mouvement-checkouts'] });
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: error.message,
        variant: 'destructive',
      });
    },
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
  });
};