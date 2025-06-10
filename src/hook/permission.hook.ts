import PermissionApi from '@/api/permission.api';
import { useToast } from '@/components/ui/use-toast';
import { IPermission } from '@/interface/permission';
import { usePermissionStore } from '@/store/permission.store';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCreatePermissionByadminId = (adminId: string) => {
  const { toast } = useToast();
  return useMutation({
    mutationKey: ['createPermissionBadminId'],
    mutationFn: async (data: IPermission) => {
      return await PermissionApi.createPermissionByadminId(adminId, data);
    },
    onSuccess: () => {
      toast({
        title: 'Permission créée avec succès',
        description: 'Vous pouvez maintenant ajouter des permissions',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Erreur lors de la création de la permission',
        variant: 'destructive',
        description: 'Veuillez réessayer plus tard',
        duration: 3000,
      });
    },
  });
};

export const useGetPermissionByAdminId = (adminId: string) => {
  const setPermissionStore = usePermissionStore.getState().setPermissionStore;
  return useQuery({
    queryKey: ['getPermissionBadminId', adminId],
    queryFn: async () => {
      const data = await PermissionApi.getPermissionByadminId(adminId);
      setPermissionStore('permission', data.data);
      return data;
    },
  });
};

export const useUpdatePermissionByadminId = (
  adminId: string,
  setOpen: (open: boolean) => void
) => {
  const setPermissionStore = usePermissionStore.getState().setPermissionStore;
  const { toast } = useToast();
  return useMutation({
    mutationKey: ['updatePermissionBadminId'],
    mutationFn: async (data: IPermission[]) => {
      return await PermissionApi.updatePermissionByadminId(adminId, data);
    },
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      setPermissionStore('permission', data.data);
      toast({
        title: 'Permission mise à jour avec succès',
        duration: 3000,
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Erreur lors de la mise à jour de la permission',
        variant: 'destructive',
        duration: 3000,
      });
      setOpen(false);
    },
  });
};
