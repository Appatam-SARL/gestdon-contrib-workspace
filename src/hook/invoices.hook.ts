import InvoiceApi from '@/api/invoice.api';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useDownloadInvoice = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const response = await InvoiceApi.downloadInvoice(subscriptionId);
      return response;
    },
    onSuccess: (blobData, subscriptionId) => {
      try {
        // Créer un blob PDF et déclencher le téléchargement
        const blob = new Blob([blobData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facture-${subscriptionId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Facture téléchargée',
          description: 'La facture PDF a été téléchargée avec succès',
        });
      } catch (error) {
        console.error('Erreur lors de la création du fichier:', error);
        toast({
          title: 'Erreur de téléchargement',
          description: 'Impossible de créer le fichier de facture',
          variant: 'destructive',
        });
      }
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

export const useGetInvoices = (contributorId: string) => {
  return useQuery({
    queryKey: ['invoices', contributorId],
    queryFn: () => InvoiceApi.getInvoices(contributorId),
    enabled: !!contributorId,
  });
};
