import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { formInviteSchema, FormInviteValues } from '@/schema/admins.schema';
// import useStaffStore, { INIT_MEMBER_FILTER } from '@/stores/staff.store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useGetStaffMembers, useInviteUser } from '@/hook/admin.hook';
// import useStaffStore, { INIT_MEMBER_FILTER } from '@/store/staff.store';
import animationData from '@/assets/svg/send-invitation.json';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import useContributorStore from '@/store/contributor.store';
import useUserStore from '@/store/user.store';
import { StaffMemberFilter, StaffStatus } from '@/types/staff';
import { IUser, IUserFilterForm, setUserStore } from '@/types/user';
import { getRoleLayout } from '@/utils/display-of-variable';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Filter, Loader2, RefreshCcw, UserPlus, X } from 'lucide-react';
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
  // state local
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [responseServerSuccess, setResponseServerSuccess] =
    useState<boolean>(false);

  // state store zustand
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const { userFilterForm, setUserStore, user } = useUserStore((s) => s);
  console.log('🚀 ~ StaffPage ~ user:', user);
  // hook de récupération des données
  const { data, isPending, refetch, isRefetching } = useGetStaffMembers({
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

  const activeFiltersCount =
    Object.values(userFilterForm).filter(Boolean).length;

  const handleStatusChange = (memberId: string, isActive: boolean) => {
    // À implémenter: mise à jour du statut
    console.log('Status changed:', memberId, isActive);
  };

  const handleInvite = async (data: FormInviteValues) => {
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
          <h1 className='text-3xl font-bold'>Personnel</h1>
          <p className='text-muted-foreground'>
            Gestion des membres du personnel
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => navigate('/staff/create')}>
            <UserPlus className='h-4 w-4 mr-2' />
            Ajouter un membre
          </Button>
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus className='h-4 w-4 mr-2' />
            Ajouter un membre par invitation
          </Button>
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
                                    {...field}
                                  />
                                </FormControl>
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
      <Card className='p-4'>
        <div className='flex gap-4'>
          <Input
            className='flex-1'
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
      </Card>

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
      <Card>
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
            {isPending || isRefetching ? (
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
                  <TableCell className='font-medium'>
                    {user.firstName} {user.lastName}
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
                        variant='ghost'
                        size='icon'
                        onClick={() => navigate(`/staff/${user._id}`)}
                      >
                        <Eye className='h-4 w-4' />
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
              {isPending ? (
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
      </Card>
    </div>
  );
});
