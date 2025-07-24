import {
  activateMfa,
  createUser,
  deactivateMfa,
  findByToken,
  forgotPassword,
  getStaffMembers,
  getUserProfile,
  inviteUser,
  login,
  logoutByAdmin,
  registerUserByInvite,
  resetPassword,
  setupMfa,
  updatePassword,
  updateUserProfile,
  verifyAccount,
  verifyMfa,
} from '@/api/admin.api';
import { getLogs } from '@/api/logs.api';
import { toast, useToast } from '@/components/ui/use-toast';
import { IContributor } from '@/interface/contributor';
import {
  FormInviteRegisterUserValues,
  FormInviteValues,
} from '@/schema/admins.schema';
import useContributorStore from '@/store/contributor.store';
import { useMfaStore } from '@/store/mfa.store';
import useUserStore from '@/store/user.store';
import { IlogFilter, ILogsResponse } from '@/types/log.type';
import { StaffMemberForm } from '@/types/staff';
import { IUser, IUserFilterForm } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();
  const setUserStore = useUserStore((s) => s.setUserStore);
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: { login: string; password: string }) => {
      const response = await login(data);
      return response;
    },
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      console.log('🚀 ~ useLogin ~ data:', data.user);
      // onSuccess
      if (data?.requireMfa) {
        localStorage.setItem('userId', data?.userId as string);
        navigate('/mfa');
      } else {
        localStorage.setItem('token', data?.token as string);
        setUserStore('user', data?.user as unknown as IUser);
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue sur votre espace administrateur',
          variant: 'default',
        });
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      // onError
      toast({
        title: error.message,
        description: 'Une erreur est survenue lors de la connexion',
        variant: 'destructive',
      });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => logoutByAdmin(),
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      // onSuccess
      localStorage.removeItem('token');
      toast({
        title: data.message,
        description:
          'Vous êtes maintenant déconnecté de votre espace administrateur',
        variant: 'default',
      });
      navigate('/');
    },
    onError: (error) => {
      // onError
      toast({
        title: error.message,
        description: 'Une erreur est survenue lors de la déconnexion',
        variant: 'destructive',
        duration: 5000,
      });
    },
  });
}

// get all staff members
export function useGetStaffMembers(filter: IUserFilterForm) {
  return useQuery({
    queryKey: [
      'users',
      ...(typeof filter === 'object' ? Object.values(filter) : []),
    ],
    queryFn: () => getStaffMembers(filter),
  });
}

// get logs
export function useGetLogs(
  entityId: string,
  entityType: string,
  filter: IlogFilter
) {
  return useQuery({
    queryKey: [
      'logs',
      'admin',
      entityId,
      ...(typeof filter === 'object' ? Object.values(filter) : []),
    ],
    queryFn: async (): Promise<ILogsResponse> =>
      getLogs(entityId, entityType, filter),
  });
}

// get a staff member
export function useUserProfile(id: string) {
  return useQuery({
    queryKey: ['user', 'profile', id],
    queryFn: async () => await getUserProfile(id),
    enabled: !!id,
  });
}

// update a staff member
export function useUpdateStaffMember(
  id: string,
  setIsInfoModalOpen: (value: boolean) => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: StaffMemberForm) => updateUserProfile(id, data),
    onMutate: () => {
      // onMutate
      toast({
        title: 'Mise à jour',
        description: 'Mise à jour en cours...',
      });
    },
    onSuccess: () => {
      // onSuccess
      toast({
        title: 'Succès',
        description: 'Vos informations ont été mises à jour avec succès.',
      });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', id] });
      setIsInfoModalOpen(false);
    },
    onError: (error) => {
      // onError
      toast({
        title: error.message,
        description: 'Une erreur est survenue lors de la mise à jour.',
        variant: 'destructive',
      });
      setIsInfoModalOpen(true);
    },
  });
}

// create a new staff member
export function useCreateUser() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => createUser(data),
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess() {
      toast({
        title: 'Membre ajouté avec succès',
        description: 'Un membre a été ajouté avec succès.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['staff', 'members'] });
      navigate('/staff');
    },
    onError(error) {
      // onError
      toast({
        title: error.message,
        description: "Une erreur est survenue lors de l'ajout du membre.",
        variant: 'destructive',
      });
    },
  });
}

// use update password mutation
export function useUpdatePassword(
  id: string,
  setIsPasswordModalOpen: (value: boolean) => void,
  setPasswordForm: (formPassword: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      const response = await updatePassword(id, payload);
      return response;
    },
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: (data) => {
      // onSuccess
      toast({
        title: data.message || 'Succès',
        description: 'Votre mot de passe a été modifié avec succès.',
      });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', id] });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsPasswordModalOpen(false);
    },
    onError: (error: AxiosError) => {
      // onError
      toast({
        title: error.message,
        description:
          (error.response?.data as { message: string })?.message ||
          'Une erreur est survenue.',
        variant: 'destructive',
      });
      setIsPasswordModalOpen(true);
    },
  });
}

// setup mfa
export function useSetupMfa(
  userId: string,
  setIsMFAModalOpen: (value: boolean) => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const setMfaStore = useMfaStore((s) => s.setMfaStore);
  return useMutation({
    mutationFn: async () => {
      const response = await setupMfa(userId);
      return response;
    },
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      setMfaStore('mfa', data.data);
      // onSuccess
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', userId] });
      toast({
        title: 'Succès',
        description: 'Votre MFA a été configuré avec succès.',
      });
      setIsMFAModalOpen(true);
    },
    onError: (error) => {
      // onError
      toast({
        title: error.message,
        description:
          'Une erreur est survenue lors de la configuration de votre MFA.',
        variant: 'destructive',
      });
    },
  });
}

// activate mfa
export function useActivateMfa(
  id: string,
  setIsMFAModalOpen: (value: boolean) => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutationOptions = {
    mutationFn: async (data: { mfaToken: string }) => {
      const response = await activateMfa(id, data.mfaToken);
      return response;
    },
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'member', id] });
      toast({
        title: 'Succès',
        description: 'Votre MFA a été activé avec succès.',
      });
      setIsMFAModalOpen(false);
    },
    onError: (error: AxiosError) => {
      toast({
        title: error.message,
        description:
          (error.response?.data as { message: string })?.message ||
          'Une erreur est survenue lors de la configuration de votre MFA.',
        variant: 'destructive',
      });
      setIsMFAModalOpen(true);
    },
  };

  return useMutation(mutationOptions);
}

// deactivate mfa
export function useDeactivateMfa(
  id: string,
  setIsMFAModalOpen: (value: boolean) => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { mfaToken: string }) => deactivateMfa(id, data),
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess: () => {
      // onSuccess
      queryClient.invalidateQueries({ queryKey: ['staff', 'member', id] });
      toast({
        title: 'Succès',
        description: 'Votre MFA a été désactivé avec succès.',
      });
      setIsMFAModalOpen(false);
    },
    onError: (error) => {
      // onError
      toast({
        title: error.message,
        description:
          'Une erreur est survenue lors de la désactivation de votre MFA.',
        variant: 'destructive',
      });
      setIsMFAModalOpen(true);
    },
  });
}

// use verify mfa
export function useVerifyMfa(id: string) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { mfaToken: string }) => {
      const payload = {
        userId: id,
        mfaToken: data.mfaToken,
      };
      const response = await verifyMfa(payload);
      return response;
    },
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      // onSuccess
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries({ queryKey: ['staff', 'member', id] });
      toast({
        title: 'Authentification réussie',
        description: 'Vous allez être redirigé vers le tableau de bord.',
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      // onError
      toast({
        title: error.message,
        description:
          'Une erreur est survenue lors de la configuration de votre MFA.',
        variant: 'destructive',
      });
    },
  });
}

// verify account with token
export function useVerifyAccount(
  setMessageConfirmation: (value: string) => void,
  setIsConfirmed: (value: boolean) => void
) {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: { token: string }) => {
      const response = await verifyAccount(data);
      return response;
    },
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess: (data) => {
      if (data.emailVerified === true) {
        setMessageConfirmation(data.message);
        setIsConfirmed(true);
        toast({
          title: 'Compte validé',
          description: data.message,
        });
      }
    },
    onError: (error) => {
      // onError
      setMessageConfirmation(error.message);
      setIsConfirmed(false);
      toast({
        title: error.message,
        description: 'Une erreur est survenue lors de la validation du compte.',
        variant: 'destructive',
      });
    },
  });
}

export function useForgotPassword() {
  const mutationForgetPassword = useMutation({
    mutationFn: (data: { email: string }) => forgotPassword(data),
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message,
        description: 'Un email a été envoyé à votre adresse email.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: "Une erreur est survenue lors de l'envoi du mail.",
        variant: 'destructive',
      });
    },
  });
  return mutationForgetPassword;
}

export function useResetPassword() {
  const navigate = useNavigate();
  const mutationResetPassword = useMutation({
    mutationFn: resetPassword,
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message,
        description: 'Votre mot de passe a été modifié avec succès.',
      });
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: error.message,
        description:
          'Une erreur est survenue lors de la modification du mot de passe.',
        variant: 'destructive',
      });
    },
  });
  return mutationResetPassword;
}

export function useFindByToken() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUserStore = useUserStore((s) => s.setUserStore);
  const setContributorStore = useContributorStore((s) => s.setContributorStore);
  const handleCheckToken = React.useCallback(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          localStorage.clear();
          toast({
            title: 'Vous devez vous connecter pour accéder à cette page',
            description: 'Token inexistant, veuillez vous reconnecter.',
          });
          navigate('/');
          return;
        }
        const response = await findByToken();
        if (!response.success) {
          // Ne pas supprimer le token ici, juste afficher le toast et rediriger
          toast({ description: 'Token invalide, veuillez vous reconnecter.' });
          navigate('/');
          return;
        }
        setUserStore('user', response.user as IUser);
        setContributorStore(
          'contributor',
          response.contributor as IContributor
        );
      } catch (error) {
        // Ne pas supprimer le token ici
        if (
          error instanceof AxiosError &&
          error.message.includes('Network Error')
        ) {
          toast({
            title: 'Erreur réseau',
            description:
              'Impossible de contacter le serveur. Vérifiez votre connexion ou la configuration CORS.',
          });
        } else {
          toast({
            title: 'Erreur lors de la vérification de la session',
            description: 'Erreur lors de la vérification de la session.',
          });
        }
        navigate('/');
      }
    })();
  }, [navigate]);

  React.useEffect(() => {
    handleCheckToken();
  }, []);
}

export function useInviteUser(id: string) {
  return useMutation({
    mutationFn: (data: FormInviteValues) => inviteUser(id, data),
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Invitation envoyée avec succès',
        description: "Un email a été envoyé à l'adresse email.",
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: error.message,
        description: "Une erreur est survenue lors de l'envoi de l'invitation.",
        variant: 'destructive',
      });
    },
  });
}

export function useRegisterUserByInvite(token: string) {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: FormInviteRegisterUserValues) => {
      const response = await registerUserByInvite(token, data);
      return response;
    },
    onMutate: async () => {
      toast({
        title: 'Requête en cours',
        description: 'Veuillez patienter...',
        duration: 5000,
      });
    },
    onSuccess: () => {
      // onSuccess
      toast({
        title: 'Création de compte réussie',
        description: "Un email a été envoyé à l'adresse email.",
        variant: 'default',
      }); // onSuccess
      navigate('/');
    },
    onError: (error) => {
      // onError
      toast({
        title: error.message,
        description: "Une erreur est survenue lors de l'envoi de l'invitation.",
        variant: 'destructive',
      });
    },
  });
}
