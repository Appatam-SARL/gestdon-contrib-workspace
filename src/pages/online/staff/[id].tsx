import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import imgArrayEmpty from '@/assets/img/activityempty.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { withDashboard } from '@/hoc/withDashboard';
import {
  useActivateMfa,
  useDeactivateMfa,
  useGetLogs,
  useSetupMfa,
  useUpdatePassword,
  useUpdateStaffMember,
  useUserProfile,
} from '@/hook/admin.hook';
import {
  useGetPermissionByAdminId,
  useUpdatePermissionByadminId,
} from '@/hook/permission.hook';
import { IPermission } from '@/interface/permission';
import { cn } from '@/lib/utils';
import { useMfaStore } from '@/store/mfa.store';
import useUserStore from '@/store/user.store';
import { ILog, IlogFilter } from '@/types/log.type';
import { StaffMemberForm } from '@/types/staff';
import { helperUserPermission, validatePhoneNumber } from '@/utils';
import { getRoleLayout } from '@/utils/display-of-variable';
import { DialogTrigger } from '@radix-ui/react-dialog';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LockIcon,
  PencilIcon,
  SaveIcon,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import PhoneInput from 'react-phone-number-input';
import QrCode from 'react-qr-code';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formChangePasswordSchema, FormChangePasswordValues } from '@/schema/admins.schema';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

const getActionBadgeVariant = (type: string) => {
  switch (type) {
    case 'connexion':
      return 'default';
    case 'modification':
      return 'secondary';
    case 'validation':
      return 'success';
    default:
      return 'default';
  }
};

export const StaffDetailsPage = withDashboard(() => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isValid, setIsValid] = useState<null | boolean>(null);
  const [formattedNumber, setFormattedNumber] = useState('');

  // state local
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // États pour les modals et formulaires
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMFAModalOpen, setIsMFAModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const [infoForm, setInfoForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string | undefined;
    role: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: undefined, // phone number is not required
    role: '',
  });
  const [codeMfa, setCodeMfa] = useState<string>('');
  const [filterLogs, setFilterLogs] = useState<IlogFilter>({
    entityId: id as string,
    entityType: 'USER',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  });

  // zod
  const formChangePassword = useForm<FormChangePasswordValues>({
    resolver: zodResolver(formChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // store zustand
  const mfa = useMfaStore((s) => s.mfa);
  const { user, setUserStore } = useUserStore((s) => s);

  // hook de récupération des données
  const { data, isLoading, isError, error, isRefetching } = useUserProfile(
    id as string
  );
  const { data: logs, isLoading: isLoadingLogs } = useGetLogs(
    id as string,
    'USER',
    filterLogs
  );

  const isCurrentUser = user?.email === data?.user.email; // À remplacer par la vraie logique de vérification

  // hook de mutation
  const mutation = useUpdateStaffMember(id as string, setIsInfoModalOpen);
  const mutationPassword = useUpdatePassword(
    id as string,
    setIsPasswordModalOpen
  );
  const mutationSetupMFA = useSetupMfa(id as string, setIsMFAModalOpen);
  const mutationActivateMFA = useActivateMfa(id as string, setIsMFAModalOpen);
  const mutationDeactivateMFA = useDeactivateMfa(
    id as string,
    setIsMFAModalOpen
  );

  // const { permission } = usePermissionStore() as {
  //   permission: IPermission[] | null;
  // };
  const {
    isLoading: isPendingPermission,
    data: permission,
    isRefetching: isPendingRefetchPermission,
  } = useGetPermissionByAdminId(id as string);
  const { mutate: updatePermission, isPending: isPendingUpdatePermission } =
    useUpdatePermissionByadminId(id as string, setOpen);

  // Copie locale des permissions pour édition
  const [localPermissions, setLocalPermissions] = useState<
    IPermission[] | null
  >(null);

  // Synchronise la copie locale avec le store quand les permissions sont chargées
  useEffect(() => {
    if (permission) {
      // Deep copy pour éviter de modifier le store directement
      setLocalPermissions(JSON.parse(JSON.stringify(permission.data)));
    }
  }, [permission]);

  // Gestion du toggle d'une action
  const handleToggleAction = (permIndex: number, actionIndex: number) => {
    if (!localPermissions) return;
    setLocalPermissions((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      const actions = [...updated[permIndex].actions];
      actions[actionIndex] = {
        ...actions[actionIndex],
        enabled: !actions[actionIndex].enabled,
      };
      updated[permIndex] = {
        ...updated[permIndex],
        actions,
      };
      return updated;
    });
  };

  // Validation des modifications
  const handleUpdatePermission = () => {
    if (localPermissions) {
      updatePermission(localPermissions);
    }
  };

  const updateUserStore = useCallback(() => {
    if (!data) return;
    setUserStore('user', data.user);
    setInfoForm((prev) => ({
      ...prev,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      email: data.user.email,
      phone: data.user.phone,
      role: data.user.role,
    }));
  }, [data]);

  useEffect(() => {
    updateUserStore();
    return () => {
      console.log('Removing user store listener');
      setUserStore('user', null);
    };
  }, [updateUserStore]);

  // Gestionnaire de changement de mot de passe
  const onSubmitChangePassword = async (data: FormChangePasswordValues) => {
    if (
      !data.currentPassword ||
      !data.newPassword ||
      !data.confirmPassword
    ) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive',
      });
      return;
    }

    // vérifier que le nouveau mot de passe est plus long que 8 caractères
    // ajoute un regex qui vérifie que le mot de passe est composé de lettres, chiffres et caractères spéciaux
    if (
      !data.newPassword.match(
        /^(?=\S+$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
      )
    ) {
      toast({
        title: 'Erreur',
        description:
          'Le nouveau mot de passe doit contenir au moins 8 caractères.',
        variant: 'destructive',
      });
      return;
    }

    // vérifier que les nouveaux mots de passe sont identiques
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les nouveaux mots de passe ne correspondent pas.',
        variant: 'destructive',
      });
      return;
    }
    mutationPassword.mutate(data);
  };

  // Gestionnaire d'activation/désactivation MFA
  const handleMFAToggle = async () => {
    if (user && user?.mfaEnabled) {
      setIsMFAModalOpen(true);
    } else {
      mutationSetupMFA.mutate();
    }
  };

  // Gestionnaire d'activation MFA
  const handleMFAActivation = async () => {
    if (user && user?.mfaEnabled) {
      mutationDeactivateMFA.mutate({ mfaToken: codeMfa as string });
    } else {
      mutationActivateMFA.mutate({
        mfaToken: codeMfa as string,
      });
    }
  };

  // Gestionnaire de modification des informations personnelles
  const handleInfoUpdate = async () => {
    // TODO: Appeler l'API pour mettre à jour les informations
    mutation.mutate(infoForm as StaffMemberForm);
  };

  // if (isPending) return <div>Chargement...</div>;
  if (isError) return `${error.message}`;

  return (
    <div className='space-y-6'>
      {/* En-tête */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link
            to='/staff'
            className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10'
          >
            <ArrowLeft className='h-4 w-4' />
          </Link>
          <div>
            <h4 className='text-3xl font-bold'>
              {isLoading || isRefetching ? (
                <Skeleton className='h-4 w-4' />
              ) : (
                `${data.user?.firstName} ${data.user?.lastName}`
              )}
            </h4>
            <p className='text-muted-foreground'>
              {isLoading || isRefetching ? (
                <Skeleton className='h-4 w-4' />
              ) : (
                getRoleLayout(data.user?.role as string)
              )}
            </p>
          </div>
        </div>
        {isLoading || isRefetching ? (
          <Skeleton className='h-4 w-4' />
        ) : (
          <Badge
            variant={data.user?.isActive ? 'success' : 'secondary'}
            className='capitalize'
          >
            {data.user?.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        )}
      </div>

      <div className='grid grid-cols-12 gap-6'>
        {/* Colonne gauche - Informations personnelles */}
        <div className='col-span-4 space-y-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle>Informations personnelles</CardTitle>
              {user?.role === 'MANAGER' || user?.role === 'COORDINATOR' ? (
                <Button
                  variant='secondary'
                  size='icon'
                  onClick={() => setIsInfoModalOpen(true)}
                  className='h-8 w-8'
                >
                  <Eye className='h-4 w-4' color='white' />
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <p className='font-medium'>
                  {isLoading || isRefetching ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    data.user?.email
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Téléphone</p>
                <p className='font-medium'>
                  {isLoading || isRefetching ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    data.user?.phone || 'Non renseigné'
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Rôle</p>
                <p className='font-medium capitalize'>
                  {isLoading || isRefetching ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    getRoleLayout(data.user?.role as string)
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Statut</p>
                <Badge
                  variant={data?.user?.isActive ? 'success' : 'secondary'}
                  className='capitalize'
                >
                  {isLoading || isRefetching ? (
                    <Skeleton className='h-4 w-4' />
                  ) : data.user?.isActive ? (
                    'Actif'
                  ) : (
                    'Inactif'
                  )}
                </Badge>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Date d'ajout</p>
                <p className='font-medium'>
                  {isLoading || isRefetching ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    new Date(String(data.user?.createdAt)).toLocaleDateString(
                      'fr-FR'
                    )
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {isCurrentUser && (
            <Card>
              <CardHeader>
                <CardTitle>Modifier le mot de passe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground mb-4'>
                  Vous pouvez modifier votre mot de passe à tout moment pour
                  sécuriser votre compte.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant='default'
                  className='w-full'
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  <LockIcon className='h-4 w-4' color='white' />
                  <span>Changer le mot de passe</span>
                </Button>
              </CardFooter>
            </Card>
          )}

          {isCurrentUser && (
            <Card>
              <CardHeader>
                <CardTitle>Authentification à deux facteurs (MFA)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='mfa-toggle'>
                    {data?.user?.mfaEnabled ? 'Désactiver' : 'Activer'} MFA
                  </Label>
                  {mutation.isPending ? (
                    <Skeleton className='w-4 h-4' />
                  ) : (
                    <Switch
                      id='mfa-toggle'
                      checked={data?.user?.mfaEnabled}
                      onCheckedChange={handleMFAToggle}
                    />
                  )}
                </div>
                <p className='text-sm text-muted-foreground mt-4'>
                  L'authentification à deux facteurs ajoute une couche de
                  sécurité supplémentaire à votre compte.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite - Historique des actions */}

        <div className='col-span-8'>
          {(user?.role === 'MANAGER' || user?.role === 'COORDINATOR') &&
            helperUserPermission('staff', 'list_permissions') && (
              <Card className='mb-4'>
                <CardHeader>
                  <CardTitle className='flex justify-between items-center gap-2'>
                    <span>Permission et accès</span>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        {helperUserPermission(
                          'staff',
                          'update_permissions'
                        ) && (
                          <Button
                            variant={'secondary'}
                            size={'icon'}
                            onClick={() => setOpen(true)}
                          >
                            <PencilIcon color='white' />
                          </Button>
                        )}
                      </DialogTrigger>
                      <DialogContent className='w-screen max-h-screen max-w-lg overflow-auto'>
                        <DialogHeader>
                          <DialogTitle>
                            Modifier les permissions de l'utilisateur
                          </DialogTitle>
                          <DialogDescription>
                            Cette modal permet d'attribuer des permissions à un
                            utilisateur
                          </DialogDescription>
                        </DialogHeader>
                        {isPendingPermission ||
                        !localPermissions ||
                        isPendingRefetchPermission ? (
                          <div className='py-4'>
                            <Skeleton
                              height={40}
                              count={5}
                              style={{ marginBottom: 8 }}
                            />
                          </div>
                        ) : (
                          localPermissions.map((perm, permIndex) => (
                            <Accordion
                              type='single'
                              collapsible
                              key={permIndex}
                              className='w-full mb-4 border rounded-md bg-card text-card-foreground shadow-sm'
                            >
                              <AccordionItem
                                id='single'
                                className='border-b'
                                value={String(permIndex)}
                              >
                                <AccordionTrigger className='px-4 py-3 text-sm font-medium hover:no-underline'>
                                  {perm.label}
                                </AccordionTrigger>
                                <AccordionContent className='px-4 py-3 space-y-2'>
                                  {perm.actions.map((action, actionIndex) => (
                                    <div
                                      className='flex items-center space-x-2'
                                      onClick={() =>
                                        handleToggleAction(
                                          permIndex,
                                          actionIndex
                                        )
                                      }
                                      key={actionIndex}
                                    >
                                      <Checkbox
                                        className={cn(
                                          'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                          action.enabled
                                            ? 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                                            : 'data-[state=checked]:bg-red-500 data-[state=checked]:text-white'
                                        )}
                                        checked={action.enabled}
                                        id={`terms2-${permIndex}-${actionIndex}`}
                                      />
                                      <label
                                        htmlFor={`terms2-${permIndex}-${actionIndex}`}
                                        className='text-sm font-regular leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                      >
                                        {action.name}
                                      </label>
                                    </div>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          ))
                        )}
                        <DialogFooter>
                          <Button
                            variant={'secondary'}
                            disabled={isPendingUpdatePermission}
                            onClick={() => setOpen(false)}
                          >
                            <X color='white' />
                            <span className='text-white'>Annuler</span>
                          </Button>
                          <Button
                            disabled={isPendingUpdatePermission}
                            onClick={handleUpdatePermission}
                          >
                            {isPendingUpdatePermission ? (
                              <>
                                <Loader2 className='animate-spin' />
                                <span>En cours de modification...</span>
                              </>
                            ) : (
                              <>
                                <SaveIcon />
                                Valider
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                  <CardDescription>
                    Vous pouvez consulter l'historique des actions effectuées
                    sur votre compte.
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='rounded-md'>
                    {isPendingPermission || isPendingRefetchPermission ? (
                      // <div className='py-4'>
                      <Skeleton
                        className='w-full'
                        style={{ width: '100%', height: '300px' }}
                      />
                    ) : (
                      // </div>
                      permission?.data?.map((perm, permIndex) => (
                        <Accordion
                          type='single'
                          collapsible
                          className='w-full mb-4 border rounded-md bg-card text-card-foreground shadow-sm'
                          key={permIndex}
                        >
                          <AccordionItem
                            id='single'
                            className='border-b'
                            value={String(permIndex)}
                          >
                            <AccordionTrigger className='px-4 py-3 text-sm font-medium hover:no-underline'>
                              {perm.label}
                            </AccordionTrigger>
                            <AccordionContent className='px-4 py-3 space-y-2'>
                              {perm.actions.map((action, actionIndex) => (
                                <div
                                  className='flex items-center space-x-2'
                                  key={actionIndex}
                                >
                                  <Checkbox
                                    className={cn(
                                      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                      action.enabled
                                        ? 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                                        : 'data-[state=checked]:bg-red-500 data-[state=checked]:text-white'
                                    )}
                                    checked={action.enabled}
                                    id={`terms2-${permIndex}-${actionIndex}`}
                                    disabled
                                  />
                                  <label
                                    htmlFor={`terms2-${permIndex}-${actionIndex}`}
                                    className='text-sm font-regular leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                  >
                                    {action.name}
                                  </label>
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {(user?.role === 'MANAGER' ||
            user?.role === 'COORDINATOR' ||
            isCurrentUser) &&
            helperUserPermission('log', 'read') && (
              <Card>
                <CardHeader>
                  <CardTitle>Historique des actions</CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='rounded-md'>
                    <table className='w-full'>
                      <thead className='border-b bg-primary'>
                        <tr className='border-b bg-[#6c2bd9] text-white'>
                          <th className='py-3 px-4 text-left text-sm font-medium'>
                            Date & Heure
                          </th>
                          <th className='py-3 px-4 text-left text-sm font-medium'>
                            Description
                          </th>
                          <th className='py-3 px-4 text-right text-sm font-medium'>
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingLogs ? (
                          <tr>
                            <td colSpan={3} className='py-3 px-4 text-sm'>
                              <div className='py-4'>
                                <Skeleton
                                  count={1}
                                  style={{ marginBottom: 8, height: '300px' }}
                                />
                              </div>
                            </td>
                          </tr>
                        ) : Number(logs?.metadata?.total) > 0 ? (
                          logs?.data?.map((action: ILog) => (
                            <tr
                              key={action._id}
                              className='border-b hover:bg-muted/50 transition-colors'
                            >
                              <td className='py-3 px-4 text-sm'>
                                {new Date(action.createdAt).toLocaleString(
                                  'fr-FR'
                                )}
                              </td>
                              <td className='py-3 px-4 text-sm font-medium'>
                                {action.details}
                              </td>
                              <td className='py-3 px-4 text-right'>
                                <Badge
                                  variant={getActionBadgeVariant(action.action)}
                                  className='capitalize'
                                >
                                  {action.action}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className='border-b hover:bg-muted/50 transition-colors'>
                            <td
                              colSpan={3}
                              className='text-sm text-muted-foreground text-center p-2'
                            >
                              <div className='flex flex-col items-center justify-center'>
                                <img src={imgArrayEmpty} alt='empty' className='w-1/4 h-1/2' />
                                <p className='text-gray-500'>Aucun historique de logs disponible.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href='#'
                            onClick={() =>
                              setFilterLogs((prev) => ({
                                ...prev,
                                page: Number(prev?.page) - 1,
                              }))
                            }
                            className={
                              currentPage === 1
                                ? 'pointer-events-none opacity-50'
                                : ''
                            }
                            size='default'
                          />
                        </PaginationItem>
                        {isLoadingLogs ? (
                          <Skeleton className='h-4 w-4' />
                        ) : Number(logs?.metadata?.totalPages) > 3 ? (
                          <>
                            {[...Array(3)].map((_, i) => (
                              <PaginationItem key={i + 1}>
                                <PaginationLink
                                  href='#'
                                  isActive={currentPage === i + 1}
                                  onClick={() => setCurrentPage(i + 1)}
                                  size='default'
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          </>
                        ) : (
                          [...Array(2)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                href='#'
                                isActive={currentPage === i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                size='default'
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))
                        )}
                        <PaginationItem>
                          <PaginationNext
                            href='#'
                            onClick={() =>
                              setFilterLogs((prev) => ({
                                ...prev,
                                page: Number(prev?.page) + 1,
                              }))
                            }
                            className={
                              currentPage === logs?.metadata?.totalPages
                                ? 'pointer-events-none opacity-50'
                                : ''
                            }
                            size='default'
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      {/* Modal de changement de mot de passe */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>
              Veuillez entrer votre mot de passe actuel et votre nouveau mot de
              passe.
            </DialogDescription>
          </DialogHeader>
          <Form {...formChangePassword}>
            <form
              onSubmit={formChangePassword.handleSubmit(onSubmitChangePassword)}
              className='space-y-4'
            >
              <FormField
                control={formChangePassword.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='current-password'>Mot de passe actuel</FormLabel>
                    <FormControl>
                    <div className='relative mt-2'>
                      <Lock className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                      <Input
                        id='current-password'
                        type={showPassword ? 'text' : 'password'}
                        className='pl-10'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-2 top-2 h-5 w-5 text-muted-foreground hover:text-foreground'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formChangePassword.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='new-password'>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <div className='relative mt-2'>
                        <Lock className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                        <Input
                          id='new-password'
                          type={showNewPassword ? 'text' : 'password'}
                          className='pl-10'
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e)
                          }
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='absolute right-2 top-2 h-5 w-5 text-muted-foreground hover:text-foreground'
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formChangePassword.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel htmlFor='confirm-password'>
                      Confirmer le nouveau mot de passe
                    </FormLabel>
                    <FormControl>
                      <div className='relative mt-2'>
                        <Lock className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                        <Input
                          id='confirm-password'
                          type={showConfirmPassword ? 'text' : 'password'}
                          className='pl-10'
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e)
                          }
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='absolute right-2 top-2 h-5 w-5 text-muted-foreground hover:text-foreground'
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >  
                          {showConfirmPassword ? (  
                            <EyeOff className='h-4 w-4' />  
                          ) : (  
                            <Eye className='h-4 w-4' />  
                          )}  
                        </Button>  
                      </div>  
                    </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={mutationPassword.isPending}
                >
                  Annuler
                </Button>
                <Button
                  type='submit'
                  disabled={mutationPassword.isPending}
                >
                  {mutationPassword.isPending ? (
                    <>
                      <Loader2 className='animate-spin' />
                      <span>Modification en cours...</span>
                    </>
                  ) : (
                    'Confirmer'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal d'activation MFA */}
      <Dialog open={isMFAModalOpen} onOpenChange={setIsMFAModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Activer l'authentification à deux facteurs
            </DialogTitle>
            <DialogDescription>
              Scannez le QR code ci-dessous avec votre application
              d'authentification.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col items-center space-y-4'>
            <div className='w-48 h-48 bg-muted flex items-center justify-center'>
              {/* TODO: Ajouter le QR code ici */}
              <QrCode
                // size={256}
                value={mfa?.qrCode || ''}
                viewBox={`0 0 256 256`}
                level='L'
                version={'40'}
              />
              {/* <p className='text-sm text-muted-foreground'>QR Code</p> */}
            </div>
            <div className='w-full'>
              <Label htmlFor='verification-code'>Code de vérification</Label>
              <Input
                id='verification-code'
                type='text'
                placeholder='Entrez le code à 6 chiffres'
                value={codeMfa}
                onChange={(e) => setCodeMfa(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={
                mutationActivateMFA.isPending || mutationDeactivateMFA.isPending
              }
              variant='outline'
              onClick={() => setIsMFAModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              disabled={
                mutationDeactivateMFA.isPending || mutationActivateMFA.isPending
              }
              onClick={handleMFAActivation}
            >
              {mutationActivateMFA.isPending || mutationDeactivateMFA.isPending
                ? 'Enregistrement en cours...'
                : user?.mfaEnabled
                ? 'Désactiver MFA'
                : 'Activer MFA'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de modification des informations personnelles */}

      <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les informations personnelles</DialogTitle>
            <DialogDescription>
              Modifiez vos informations personnelles ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='firstName'>Prénom</Label>
                <Input
                  id='firstName'
                  value={infoForm.firstName}
                  onChange={(e) =>
                    setInfoForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor='lastName'>Nom</Label>
                <Input
                  id='lastName'
                  value={infoForm.lastName}
                  onChange={(e) =>
                    setInfoForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={infoForm.email}
                onChange={(e) =>
                  setInfoForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor='phone'>Téléphone</Label>
              <PhoneInput
                international={false}
                defaultCountry='CI'
                value={infoForm.phone}
                onChange={(value) => {
                  setInfoForm((prev) => ({
                    ...prev,
                    phone: value,
                  }));

                  const { isValidNumber, formattedNumber } =
                    validatePhoneNumber(value ?? '');
                  setIsValid(isValidNumber);
                  setFormattedNumber(formattedNumber);
                }}
                className={
                  'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                }
              />
              {isValid ? (
                <div
                  className={`p-3 rounded-md ${
                    isValid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <div>
                    <span className='font-medium'>✓ Numéro valide</span>
                    {formattedNumber && (
                      <div className='mt-1 text-sm'>
                        Format: {formattedNumber}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className='mt-6 text-sm text-gray-600'>
                  <h3 className='font-medium mb-2'>Formats acceptés :</h3>
                  <ul className='space-y-1'>
                    <li className='text-red'>• +225 01 23 45 67 89</li>
                    <li className='text-red'>
                      • Préfixes: 01, 05, 07 (mobile), 27 (fixe Abidjan)
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {user?.role === 'MANAGER' ||
              (user?.role === 'COORDINATOR' && (
                <div>
                  <Label htmlFor='role'>Rôle</Label>
                  <Select
                    value={infoForm.role}
                    onValueChange={(value) =>
                      setInfoForm((prev) => ({
                        ...prev,
                        role: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionnez un rôle' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MANAGER'>Manager</SelectItem>
                      <SelectItem value='COORDINATOR'>Coordinateur</SelectItem>
                      <SelectItem value='EDITOR'>Redacteur</SelectItem>
                      <SelectItem value='AGENT'>Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button
              disabled={mutation.isPending ? true : false}
              variant='outline'
              onClick={() => setIsInfoModalOpen(false)}
            >
              Annuler
            </Button>
            <Button disabled={mutation.isPending} onClick={handleInfoUpdate}>
              {mutation.isPending ? (
                <>
                  <Loader2 className='animate-spin' />
                  <span>Enregistrement en cours...</span>
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
