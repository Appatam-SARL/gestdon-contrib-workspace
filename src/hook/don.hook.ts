import DonApi from '@/api/don.api';
import { useToast } from '@/components/ui/use-toast';
import { IDon, IDonFilterForm } from '@/interface/don';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

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

export const useCreateDon = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    },
    onSuccess: () => {
      // TODO: Implémenter la redirection vers la page de création
      toast({
        title: 'Don créé',
        description: 'Votre don a bien été créé',
      });
      queryClient.invalidateQueries({ queryKey: ['dons'] });
      navigate('/don');
    },
  });
};

export const useDownloadPDF = (id: string) => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const response = await DonApi.downloadPdf(id);
      // Création du blob et déclenchement du téléchargement
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      // Tenter de récupérer un nom de fichier depuis Content-Disposition
      const disposition = response.headers['content-disposition'] as string | undefined;
      let filename = 'don.pdf';
      if (disposition) {
        const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
        const raw = decodeURIComponent((match?.[1] || match?.[2] || '').trim());
        if (raw) filename = raw;
      }
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    },
    onMutate: () => {
      // TODO: Implémenter l'affichage de l'overlay
      toast({
        title: 'Veuillez patienter',
        description: 'Merci de patienter pendant que nous téléchargeons votre pdf',
      });
    },
    onError: () => {
      // TODO: Implémenter l'affichage d'une erreur
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du téléchargement de votre pdf',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Téléchargement lancé',
        description: 'Votre fichier PDF est en cours de téléchargement.',
      });
    },
  });
};

export const useVerifyQrCode = (token: string) => {
  return useQuery({
    queryKey: ['verifyDon', token],
    queryFn: () => DonApi.verifyQRCode(token),
    enabled: !!token,
  });
};