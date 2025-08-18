import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { withDashboard } from '@/hoc/withDashboard';
import { usePackagePermissions } from '@/hook/packagePermissions.hook';
import { formInviteSchema, FormInviteValues } from '@/schema/admins.schema';
// import useStaffStore, { INIT_MEMBER_FILTER } from '@/stores/staff.store';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useGetStaffMembers, useInviteUser } from '@/hook/admin.hook';
// import useStaffStore, { INIT_MEMBER_FILTER } from '@/store/staff.store';
import animationData from '@/assets/svg/send-invitation.json';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import useContributorStore from '@/store/contributor.store';
import useUserStore from '@/store/user.store';
import { StaffMemberFilter, StaffStatus } from '@/types/staff';
import { IUser, IUserFilterForm, setUserStore } from '@/types/user';
import { helperUserPermission } from '@/utils';
import { getRoleLayout } from '@/utils/display-of-variable';
import { cleanEmail, validateEmailComplete } from '@/utils/emailValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Eye,
  Filter,
  Info,
  Loader2,
  RefreshCcw,
  Search,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';

const getStatusBadgeVariant = (status: StaffStatus) => {
  switch (status) {
    case 'actif':
      return 'success';
    case 'inactif':
      return 'secondary';
    case 'suspendu':
      return 'destructive';
    default:
      return 'default';
  }
};

// Composant Modal de filtres
const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: StaffMemberFilter;
  onFilterChange: (key: string, value: {}) => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className='sm:max-w-[500px]'>
      <DialogHeader>
        <DialogTitle>Filtres</DialogTitle>
        <DialogDescription>
          Appliquer des filtres pour affiner la liste du personnel.
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Rôle</label>
            <Select
              value={filters.role || 'all'}
              onValueChange={(value) =>
                onFilterChange('userFilterForm', {
                  ...filters,
                  role: value === 'all' ? '' : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Tous les rôles' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tous les rôles</SelectItem>
                <SelectItem value='MANAGER'>Manager</SelectItem>
                <SelectItem value='COORDINATOR'>Coordinateur</SelectItem>
                <SelectItem value='EDITOR'>Redacteur</SelectItem>
                <SelectItem value='AGENT'>Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export const StaffPage = withDashboard(() => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Hook pour vérifier les permissions et limites d'utilisateurs
  const { hasReachedUserLimit, getUserLimit, getRemainingUsersCount } =
    usePackagePermissions();

  // state local
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isUserLimitAlertOpen, setIsUserLimitAlertOpen] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [responseServerSuccess, setResponseServerSuccess] =
    useState<boolean>(false);
  const [validation, setValidation] = useState<null | any>(null);

  // state store zustand
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const { userFilterForm, setUserStore, user } = useUserStore((s) => s);
  console.log('🚀 ~ StaffPage ~ user:', user);
  // hook de récupération des données
  const { data, isLoading, refetch } = useGetStaffMembers({
    ...userFilterForm,
    contributorId,
  } as IUserFilterForm);
  // hook de mutation
  const mutationInviteUser = useInviteUser(user?._id as string);
  const formInviteForm = useForm<FormInviteValues>({
    resolver: zodResolver(formInviteSchema),
    defaultValues: {
      email: '',
      role: 'AGENT',
    },
  });

  const activeFiltersCount = Object.values(
    userFilterForm as IUserFilterForm
  ).filter(Boolean).length;

  // Calculer le nombre actuel de membres du staff
  const currentStaffCount = data?.data?.length || 0;

  // Vérifier si la limite d'utilisateurs est atteinte
  const hasReachedLimit = hasReachedUserLimit(currentStaffCount);

  // Récupérer les informations de limite
  const maxUsers = getUserLimit();
  const remainingUsers = getRemainingUsersCount(currentStaffCount);

  const handleStatusChange = (memberId: string, isActive: boolean) => {
    // À implémenter: mise à jour du statut
    console.log('Status changed:', memberId, isActive);
  };

  // Fonction pour gérer l'ajout de membre avec vérification de limite
  const handleAddMember = () => {
    if (hasReachedLimit) {
      setIsUserLimitAlertOpen(true);
      return;
    }
    navigate('/staff/create');
  };

  // Fonction pour gérer l'invitation avec vérification de limite
  const handleInviteMember = () => {
    if (hasReachedLimit) {
      setIsUserLimitAlertOpen(true);
      return;
    }
    setIsInviteModalOpen(true);
  };

  const handleInvite = async (data: FormInviteValues) => {
    if (!data.email || !cleanEmail(data.email)) {
      toast({
        title: 'Email invalide',
        description: 'Veuillez entrer une adresse email valide.',
        variant: 'destructive',
      });
      return;
    }
    mutationInviteUser.mutate(data);
    mutationInviteUser.isSuccess
      ? setResponseServerSuccess(true)
      : setResponseServerSuccess(false);
    mutationInviteUser.isError ? setResponseServerSuccess(false) : null;
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    if (mutationInviteUser.isSuccess) {
      setResponseServerSuccess(true);
    } else {
      setResponseServerSuccess(false);
    }
    return () => {
      setResponseServerSuccess(false);
    };
  }, [mutationInviteUser.isSuccess]);

  return (
    <div className='space-y-6'>
      {/* En-tête */}
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='text-3xl font-bold'>Personnel</h4>
          <p className='text-muted-foreground'>
            Gestion des membres du personnel
          </p>

          {/* Indicateur de limite d'utilisateurs */}
          {maxUsers && maxUsers > 0 && (
            <div className='mt-3 flex items-center gap-3'>
              <div className='flex items-center gap-2 text-sm'>
                <Users className='h-4 w-4 text-gray-500' />
                <span className='text-gray-600'>
                  {currentStaffCount} / {maxUsers} membres
                </span>
              </div>

              {/* Barre de progression compacte */}
              <div className='w-32 bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    hasReachedLimit
                      ? 'bg-red-500'
                      : currentStaffCount / maxUsers > 0.8
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      (currentStaffCount / maxUsers) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              {/* Badge d'alerte si proche de la limite */}
              {!hasReachedLimit &&
                remainingUsers !== null &&
                remainingUsers <= 2 && (
                  <Badge
                    variant='secondary'
                    className='bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  >
                    <AlertTriangle className='h-3 w-3 mr-1' />
                    {remainingUsers === 1
                      ? '1 place restante'
                      : `${remainingUsers} places restantes`}
                  </Badge>
                )}

              {/* Badge si limite atteinte */}
              {hasReachedLimit && (
                <Badge variant='destructive'>
                  <AlertTriangle className='h-3 w-3 mr-1' />
                  Limite atteinte
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className='flex gap-2'>
          {helperUserPermission('staff', 'create') && (
            <Button
              onClick={handleAddMember}
              disabled={hasReachedLimit}
              className={hasReachedLimit ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <UserPlus className='h-4 w-4 mr-2' />
              Ajouter un membre
              {hasReachedLimit && (
                <span className='ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full'>
                  Limite atteinte
                </span>
              )}
            </Button>
          )}
          {helperUserPermission('staff', 'create_by_invitation') && (
            <Button
              onClick={handleInviteMember}
              disabled={hasReachedLimit}
              className={hasReachedLimit ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <UserPlus className='h-4 w-4 mr-2' />
              Ajouter un membre par invitation
              {hasReachedLimit && (
                <span className='ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full'>
                  Limite atteinte
                </span>
              )}
            </Button>
          )}
          {/* Modal d'alerte pour limite d'utilisateurs */}
          <Dialog
            open={isUserLimitAlertOpen}
            onOpenChange={setIsUserLimitAlertOpen}
          >
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-red-100 rounded-full'>
                    <AlertTriangle className='h-6 w-6 text-red-600' />
                  </div>
                  <div>
                    <DialogTitle className='text-red-800'>
                      Limite d'utilisateurs atteinte
                    </DialogTitle>
                    <DialogDescription className='text-red-600'>
                      Vous avez atteint le nombre maximal de membres de staff
                      autorisés par votre package.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className='space-y-4'>
                {/* Informations sur la limite */}
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label className='text-sm font-medium text-gray-600'>
                        Utilisateurs actuels
                      </Label>
                      <p className='text-lg font-semibold text-gray-900'>
                        {currentStaffCount}
                      </p>
                    </div>
                    <div>
                      <Label className='text-sm font-medium text-gray-600'>
                        Limite maximale
                      </Label>
                      <p className='text-lg font-semibold text-gray-900'>
                        {maxUsers || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  {maxUsers && maxUsers > 0 && (
                    <div className='mt-4'>
                      <div className='flex justify-between text-sm text-gray-600 mb-2'>
                        <span>Utilisation</span>
                        <span>
                          {Math.round((currentStaffCount / maxUsers) * 100)}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='h-2 bg-red-500 rounded-full transition-all duration-300'
                          style={{
                            width: `${Math.min(
                              (currentStaffCount / maxUsers) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Message d'information */}
                <div className='flex items-start gap-3 p-3 bg-blue-50 rounded-lg'>
                  <Info className='h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0' />
                  <div className='text-sm text-blue-800'>
                    <p className='font-medium mb-1'>Pourquoi cette limite ?</p>
                    <p>
                      Votre package d'abonnement actuel limite le nombre de
                      membres de staff que vous pouvez ajouter. Pour ajouter
                      plus de membres, vous devez mettre à niveau votre package.
                    </p>
                  </div>
                </div>

                {/* Actions suggérées */}
                <div className='space-y-3'>
                  <h4 className='font-medium text-gray-900'>
                    Que pouvez-vous faire ?
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                      <span>
                        Gérer les membres existants (modifier, désactiver)
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                      <span>
                        Mettre à niveau votre package pour plus d'utilisateurs
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                      <span>
                        Contacter le support pour des options personnalisées
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setIsUserLimitAlertOpen(false)}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setIsUserLimitAlertOpen(false);
                    navigate('/settings/subscription/pricing');
                  }}
                  className='bg-blue-600 hover:bg-blue-700'
                >
                  <Users className='h-4 w-4 mr-2' />
                  Voir les packages
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal d'invitation */}
          <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inviter un membre</DialogTitle>
                <DialogDescription>
                  Invitez un membre à rejoindre votre espace administrateur.
                </DialogDescription>
              </DialogHeader>
              <div>
                <div className='space-y-4'>
                  {responseServerSuccess ? (
                    <div className='flex items-center justify-center'>
                      <div className='w-full max-w-[400px] space-y-6'>
                        <Lottie
                          options={defaultOptions}
                          height={200}
                          width={200}
                          isStopped={false}
                          isPaused={false}
                        />
                        <div className='flex flex-col space-y-2 text-center'>
                          <p className='text-sm text-muted-foreground'>
                            Invitation envoyée avec succès
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Form {...formInviteForm}>
                        <form
                          onSubmit={formInviteForm.handleSubmit(handleInvite)}
                        >
                          <FormField
                            control={formInviteForm.control}
                            name='email'
                            render={({ field }) => (
                              <FormItem>
                                <Label htmlFor='email'>Email</Label>
                                <FormControl>
                                  <Input
                                    id='email'
                                    type='email'
                                    placeholder='Email'
                                    // {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      const result = validateEmailComplete(
                                        e.target.value
                                      );
                                      setValidation(result);
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {validation ? (
                                    <div
                                      className={`p-3 rounded-md ${
                                        validation.isValid
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {validation.isValid ? (
                                        <div>
                                          <span className='mt-1 font-medium'>
                                            ✓ Email valide
                                          </span>
                                          {validation.info.provider && (
                                            <div className='text-sm'>
                                              Fournisseur:{' '}
                                              {validation.info.provider}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div>
                                          <span className='mt-1 font-medium'>
                                            ✗ Email invalide
                                          </span>
                                          <div className='text-sm'>
                                            {validation.suggestion}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className='mt-1 text-sm text-gray-600'>
                                      <h3 className='font-medium mb-2'>
                                        Exemples valides :
                                      </h3>
                                      <ul className='space-y-1'>
                                        <li>• utilisateur@exemple.com</li>
                                        <li>• jean.dupont@gmail.com</li>
                                        <li>• contact+info@entreprise.fr</li>
                                        <li>• test_123@domaine.co.uk</li>
                                      </ul>
                                    </div>
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={formInviteForm.control}
                            name='role'
                            render={({ field }) => (
                              <FormItem>
                                <Label htmlFor='role'>Rôle</Label>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) =>
                                    field.onChange(value as string)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='Sélectionnez un rôle' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='MANAGER'>
                                      Manager
                                    </SelectItem>
                                    <SelectItem value='COORDINATOR'>
                                      Coordinateur
                                    </SelectItem>
                                    <SelectItem value='EDITOR'>
                                      Redacteur
                                    </SelectItem>
                                    <SelectItem value='AGENT'>Agent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    </>
                  )}
                </div>
              </div>
              <DialogFooter>
                {responseServerSuccess ? (
                  <Button
                    disabled={mutationInviteUser.isPending}
                    onClick={() => {
                      setResponseServerSuccess(false);
                      setIsInviteModalOpen(false);
                      formInviteForm.reset();
                    }}
                  >
                    <X />
                    Fermer
                  </Button>
                ) : (
                  <Button
                    disabled={mutationInviteUser.isPending}
                    onClick={formInviteForm.handleSubmit(handleInvite)}
                  >
                    {mutationInviteUser.isPending ? (
                      <>
                        <Loader2 className='animate-spin' />
                        <span>Enregistrement en cours...</span>
                      </>
                    ) : (
                      "Envoyer l'invitation"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres */}
      <div className='flex gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='flex-1 pl-10'
            placeholder='Rechercher un membre du personnel...'
            value={searchQuery}
            onChange={(e) => {
              const searchValue = e.target.value;
              setSearchQuery(searchValue);
              if (searchValue.length >= 3) {
                setUserStore('userFilterForm', {
                  ...userFilterForm,
                  search: searchValue,
                });
              } else {
                setUserStore('userFilterForm', {
                  ...userFilterForm,
                  search: '',
                });
              }
            }}
          />
        </div>
        <Button
          variant='outline'
          onClick={() => setIsFilterModalOpen(true)}
          className='relative'
        >
          <Filter className='h-4 w-4 mr-2' />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center'
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            setUserStore('userFilterForm', {});
            refetch();
          }}
          className='relative'
        >
          <RefreshCcw className='h-4 w-4 mr-2' />
          Refresh
        </Button>
      </div>

      {/* Modal de filtres */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={userFilterForm as StaffMemberFilter}
        onFilterChange={(key: string, value: {}) => {
          setUserStore(
            key as keyof setUserStore,
            value as setUserStore[keyof setUserStore]
          );
        }}
      />

      {/* Tableau du personnel */}
      {/* {helperUserPermission('staff', 'read') && ( */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date d'ajout</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow className='p-8'>
              <TableCell colSpan={7}>
                <Skeleton
                  count={1}
                  width='100%'
                  height={300}
                  style={{ width: '100%' }}
                />
              </TableCell>
            </TableRow>
          ) : (
            data?.data.map((user: IUser) => (
              <TableRow key={user._id}>
                <TableCell className='font-medium flex items-center gap-2'>
                  <Avatar>
                    <AvatarImage
                      src='https://github.com/shadcn.png'
                      alt='@shadcn'
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge>{getRoleLayout(user.role as string)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(
                      user.isActive ? 'actif' : 'inactif'
                    )}
                  >
                    <span>{user.isActive ? 'actif' : 'inactif'}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt as string).toLocaleDateString(
                    'fr-FR'
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='secondary'
                      size='icon'
                      onClick={() => navigate(`/staff/${user._id}`)}
                    >
                      <Eye className='h-4 w-4' color='white' />
                    </Button>
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={(checked) =>
                        handleStatusChange(user._id as string, checked)
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* )} */}

      {/* Pagination */}
      <div className='p-4 border-t'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                size={'sm'}
                onClick={() =>
                  setCurrentPage(
                    Math.max(Number(data?.metadata?.page), currentPage - 1)
                  )
                }
              />
            </PaginationItem>
            {isLoading ? (
              <Skeleton className='h-4 w-4' />
            ) : (
              // INSERT_YOUR_REWRITE_HERE
              <></>
            )}
            {Number(data?.metadata?.total) > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href='#'
                size={'sm'}
                onClick={() =>
                  setCurrentPage(
                    Math.min(Number(data?.metadata?.page), currentPage + 1)
                  )
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
});
