import MouvementCheckoutApi from "@/api/mouvement-checkout.api";
import { IMouvementCheckout } from "@/interface/activity";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMouvementCheckouts = (filter : {contributorId: string, activityId?: string}) => {
  return useQuery({
    queryKey: ['mouvement-checkouts', ...((Object.values(filter) as string[]) ?? [])],
    queryFn: () => MouvementCheckoutApi.getMouvementCheckouts(filter),
  });
};

export const useCreateMouvementCheckout = (setIsMouvementCheckoutDialogOpen: (isOpen: boolean) => void ) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IMouvementCheckout) => MouvementCheckoutApi.createMouvementCheckout(data),
    onSuccess: () => {
      toast({
        title: 'Mouvement de caisse créé avec succès',
        description: 'Mouvement de caisse créé avec succès',
      });
      setIsMouvementCheckoutDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['summary-mouvement-checkouts'] });
      queryClient.invalidateQueries({ queryKey: ['mouvement-checkouts'] });
      },
    onError: (error) => {
      toast({
        title: 'Erreur lors de la création du mouvement de caisse',
        description: error.message,
        variant: 'destructive',
      });
      setIsMouvementCheckoutDialogOpen(true);
      queryClient.invalidateQueries({ queryKey: ['summary-mouvement-checkouts'] });
      queryClient.invalidateQueries({ queryKey: ['mouvement-checkouts'] });
    },
  });
};

export const useSummaryMouvementCheckouts = (filter : {contributorId: string, activityId?: string}) => {
  return useQuery({
    queryKey: ['summary-mouvement-checkouts', ...((Object.values(filter) as string[]) ?? [])],
    queryFn: () => MouvementCheckoutApi.getSummaryMouvementCheckouts(filter),
  });
};

export const useDeleteMouvementCheckout = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MouvementCheckoutApi.deleteMouvementCheckout(id),
    onSuccess: () => {
      toast({
        title: 'Mouvement de caisse supprimé avec succès',
        description: 'Mouvement de caisse supprimé avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['mouvement-checkouts'] });
      queryClient.invalidateQueries({ queryKey: ['summary-mouvement-checkouts'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur lors de la suppression du mouvement de caisse',
        description: error.message,
        variant: 'destructive',
      });
      queryClient.invalidateQueries({ queryKey: ['mouvement-checkouts'] });
      queryClient.invalidateQueries({ queryKey: ['summary-mouvement-checkouts'] });
    },
    onMutate: () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
  });
};
