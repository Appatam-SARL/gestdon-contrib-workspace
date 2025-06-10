import {
  getDocumentById,
  getDocumentyByPartnerId,
  rejectDocument,
  uploadDocument,
  verifyDocument,
} from '@/api/document.api';
import { downloadFile } from '@/api/file.api';
import { useToast } from '@/components/ui/use-toast';
import { IDocument } from '@/types/document';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useUploadDocument = (
  setListDocumentsId?: (value: Array<string>) => void,
  listDocumentsId?: string[],
  setIsEditDocsOpen?: (value: boolean) => void
) => {
  const { toast } = useToast();
  return useMutation({
    mutationKey: ['uploadDocument'],
    mutationFn: async (data: IDocument) => {
      const response = await uploadDocument(data);
      setListDocumentsId?.([
        ...((listDocumentsId as string[]) || []),
        response.data.document._id !== null ? response.data.document._id : '',
      ]);
      console.log('🚀 ~ mutationFn: ~ listDocumentsId:', listDocumentsId);
      return response;
    },
    onSuccess(data) {
      if (data.success === 'success') {
        toast({
          title: 'Document uploadé avec succès',
          description: "Vous pouvez maintenant l'ajouter à votre profil",
          duration: 5000,
        });
        setIsEditDocsOpen?.(false);
      }
    },
    onError(error) {
      toast({
        title: "Erreur lors de l'upload du document",
        description: error.message,
        duration: 5000,
      });
      setIsEditDocsOpen?.(true);
    },
  });
};

export const useGetAllDocumentsForAPartner = (
  id: string,
  ownerType: string
) => {
  return useQuery({
    queryKey: ['documents', 'partner', id],
    queryFn: async () => {
      const response = await getDocumentyByPartnerId(id, ownerType);
      return response.data;
    },
  });
};

export const useGetOneDocumentForAPartner = (id: string) => {
  return useQuery({
    queryKey: ['document', 'partner', id],
    queryFn: async () => {
      const response = await getDocumentById(id);
      return response.data;
    },
  });
};

export const useDowwloadDocument = () => {
  const { toast } = useToast();
  return useMutation({
    mutationKey: ['downloadDocument'],
    mutationFn: async ({
      fileId,
      filename,
    }: {
      fileId: string;
      filename: string;
    }) => {
      const response = await downloadFile(fileId, filename);
      return response;
    },
    onSuccess(data) {
      toast({
        title: 'Document downloadé avec succès',
        description: "Vous pouvez maintenant l'ajouter à votre profil",
        duration: 5000,
      });
    },
    onError(error) {
      toast({
        title: 'Erreur lors du téléchargement du document',
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useVerifyDocument = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await verifyDocument(id);
      return response;
    },
    onSuccess(data) {
      toast({
        title: 'Document vérifié avec succès',
        description: "Vous pouvez maintenant l'ajouter à votre profil",
        duration: 5000,
      });
    },
    onError(error) {
      toast({
        title: 'Erreur lors de la vérification du document',
        description: error.message,
        duration: 5000,
      });
    },
  });
};

export const useRejectDocument = (
  setIsViewDocsOpen: (value: boolean) => void,
  setIsRejectOpen: (value: boolean) => void
) => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: { id: string; reason: string }) => {
      const response = await rejectDocument(data.id, data.reason);
      return response;
    },
    onSuccess() {
      toast({
        title: 'Document rejeté avec succès',
        description: "Vous pouvez maintenant l'ajouter à votre profil",
        duration: 5000,
      });
      setIsViewDocsOpen(true);
      setIsRejectOpen(false);
    },
    onError(error) {
      toast({
        title: 'Erreur lors de la rejet du document',
        description: error.message,
        duration: 5000,
      });
      setIsViewDocsOpen(true);
      setIsRejectOpen(false);
    },
  });
};
