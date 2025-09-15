import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ITypeMouvementCheckout } from "@/interface/activity";
import MouvementCheckoutTypeApi from "@/api/mouvement-checkout-type.api";

export const useGetTypesMouvementCheckouts = (contributorId: string) => {  
  return useQuery({
    queryKey: ['types-mouvement-checkouts', contributorId],
    queryFn: () => MouvementCheckoutTypeApi.getTypesMouvementCheckoutsByContributorId(contributorId),
  });
};

export const useCreateMouvementCheckoutType = (setIsAddDialogOpen: (isOpen: boolean) => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ITypeMouvementCheckout) => MouvementCheckoutTypeApi.createTypeMouvementCheckout(data),
    onSuccess: () => {
      toast({
        title: 'Mouvement de caisse type créé avec succès',
        description: 'Mouvement de caisse type créé avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['types-mouvement-checkouts'] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: error.message,
        variant: 'destructive',
      });
      setIsAddDialogOpen(true);
    },
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
  });
};

export const useUpdateMouvementCheckoutType = (setIsEditDialogOpen: (isOpen: boolean) => void, setEditingActivityId: (id: string | null) => void, refetchActivityTypes: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ITypeMouvementCheckout) => MouvementCheckoutTypeApi.updateTypeMouvementCheckout(data._id, data),
    onSuccess: () => {
      toast({
        title: 'Mouvement de caisse type mis à jour avec succès',
        description: 'Mouvement de caisse type mis à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['types-mouvement-checkouts'] });
      setIsEditDialogOpen(false);
      setEditingActivityId(null);
      refetchActivityTypes();
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: error.message,
        variant: 'destructive',
      });
      setIsEditDialogOpen(true);
    },
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
  });
};

export const useDeleteMouvementCheckoutType = (refetchActivityTypes: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MouvementCheckoutTypeApi.deleteTypeMouvementCheckout(id),
    onSuccess: () => {
      toast({
        title: 'Mouvement de caisse type supprimé avec succès',
        description: 'Mouvement de caisse type supprimé avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['types-mouvement-checkouts'] });
      refetchActivityTypes();
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: error.message,
        variant: 'destructive',
      });
      refetchActivityTypes();
    },
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
  });
};