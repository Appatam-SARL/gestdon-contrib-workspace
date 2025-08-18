import SubscriptionApi from '@/api/subscription.api';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

// Hook pour vérifier l'abonnement et rediriger si nécessaire
export const useSubscriptionCheck = () => {
  // Vérifier le statut de l'abonnement
  return useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      return await SubscriptionApi.checkSubscriptionStatus();
    },
    retry: false, // Ne pas réessayer en cas d'erreur
    refetchOnWindowFocus: false,
  });
};

// Hook pour vérifier l'abonnement sur une route spécifique
export const useRouteSubscriptionGuard = (redirectOnMissing = true) => {
  const { data, isLoading } = useSubscriptionCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && data?.data?.hasActiveSubscription && redirectOnMissing) {
      navigate('/pricing');
    }
  }, [data, isLoading, redirectOnMissing, navigate]);

  return {
    isSubscriptionRequired: data?.data?.hasActiveSubscription ?? false,
    isLoading,
    shouldRedirect:
      (data?.data?.hasActiveSubscription ?? false) && redirectOnMissing,
    data,
  };
};

export const useCreateFreeTrialSubscription = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      contributorId,
      packageId,
    }: {
      contributorId: string;
      packageId: string;
    }) => SubscriptionApi.createFreeTrialSubscription(contributorId, packageId),
    onSuccess: () => {
      toast({
        title: 'Abonnement créé avec succès',
        description: "L'abonnement a été créé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la création de l'abonnement",
        description: error.message,
      });
      console.error(error);
    },
  });
};

export const useGetSubscriptionHistory = (contributorId: string) => {
  return useQuery({
    queryKey: ['subscription-history', contributorId],
    queryFn: () => SubscriptionApi.getSubscriptionHistory(contributorId),
    enabled: !!contributorId,
  });
};

export const useDownloadInvoice = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const response = await SubscriptionApi.downloadInvoice(subscriptionId);
      return response;
    },
    onSuccess: (data, subscriptionId) => {
      // Créer un lien de téléchargement avec l'URL retournée par Puppeteer
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.filename || `facture-${subscriptionId}.pdf`;
      // link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Facture téléchargée',
        description: 'La facture a été téléchargée avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur de téléchargement',
        description: error.message || 'Impossible de télécharger la facture',
        variant: 'destructive',
      });
      console.error('Erreur téléchargement facture:', error);
    },
  });
};

// Note: These hooks are commented out as the corresponding API methods don't exist yet
// export const useCreateSubscription = () => {
//   const { toast } = useToast();
//   return useMutation({
//     mutationFn: (subscription: SubscriptionType) =>
//       SubscriptionApi.createSubscription(subscription),
//     onSuccess: () => {
//       toast({
//         title: 'Abonnement créé avec succès',
//         description: "L'abonnement a été créé avec succès",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Erreur lors de la création de l'abonnement",
//         description: error.message,
//       });
//       console.error(error);
//     },
//   });
// };

// export const useGetSubscription = (id: string) => {
//   return useQuery({
//     queryKey: ['subscription', id],
//     queryFn: () => SubscriptionApi.getSubscription(id),
//     refetchOnMount: true,
//     enabled: !!id,
//   });
// };

// export const useGetSubscriptions = () => {
//   return useQuery({
//     queryKey: ['subscriptions'],
//     queryFn: () => SubscriptionApi.getSubscriptions(),
//   });
// };
