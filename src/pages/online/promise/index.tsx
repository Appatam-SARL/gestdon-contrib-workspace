import { INIT_FILTER_PROMESSE } from '@/assets/constants/promesse';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { withDashboard } from '@/hoc/withDashboard';
import { useBeneficiaries } from '@/hook/beneficiaire.hook';
import { usePackagePermissions } from '@/hook/packagePermissions.hook';
import {
  useCreatePromesse,
  useDeletePromesse,
  usePromesse,
} from '@/hook/promesse.hook';
import { IBeneficiaire } from '@/interface/beneficiaire';
import { IPromesseFilters, tPromesse } from '@/interface/promesse';
import useContributorStore from '@/store/contributor.store';
import { helperUserPermission } from '@/utils';
import { displayStatus } from '@/utils/display-of-variable';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertTriangle,
  Eye,
  Filter,
  Loader2,
  RefreshCcw,
  ScrollTextIcon,
  Search,
  Trash,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  description: z.string().min(1, { message: 'La description est requise' }),
  beneficiaireId: z.string().min(1, { message: 'Le bénéficiaire est requis' }),
  amount: z.string().min(1, { message: 'Le montant est requis' }),
});

const FilterModal = ({
  isOpen,
  onClose,
  beneficiaires,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  beneficiaires: IBeneficiaire[];
  filters: IPromesseFilters;
  onFilterChange: (key: keyof IPromesseFilters, value: any) => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className='sm:max-w-[630px]'>
      <DialogHeader>
        <DialogTitle>Filtres des dons</DialogTitle>
        <DialogDescription>
          Appliquer des filtres pour affiner la liste des dons.
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Bénéficiaires</label>
            <Select
              value={filters.beneficiaireId}
              onValueChange={(value) => onFilterChange('beneficiaireId', value)}
              defaultValue={filters.beneficiaireId}
            >
              <SelectTrigger>
                <SelectValue placeholder='Sélectionnez un Bénéficiaire' />
              </SelectTrigger>
              <SelectContent>
                {beneficiaires?.map((beneficiaire) => (
                  <SelectItem key={beneficiaire._id} value={beneficiaire._id}>
                    {beneficiaire.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Période d'inscription</label>
            <DateRangePicker
              locale={fr}
              ranges={[
                {
                  startDate: filters.period?.from
                    ? new Date(filters.period.from)
                    : new Date(),
                  endDate: filters.period?.to
                    ? new Date(filters.period.to)
                    : addDays(new Date(), 7),
                  key: 'selection',
                },
              ]}
              onChange={(item) => {
                onFilterChange('period', {
                  from: item.selection.startDate?.toISOString() || '',
                  to: item.selection.endDate?.toISOString() || '',
                });
              }}
            />
          </div>
          {/* Add more filter options as needed */}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const PromesseDetailModal = ({
  isOpen,
  onClose,
  promesse,
}: {
  isOpen: boolean;
  onClose: () => void;
  promesse: tPromesse | null;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className='sm:max-w-[630px] sm:max-h-[90vh] overflow-auto'>
      <DialogHeader>
        <DialogTitle>Détail de la promesse</DialogTitle>
        <DialogDescription>
          Détail de la promesse sélectionnée
        </DialogDescription>
      </DialogHeader>
      {promesse ? (
        <div className='bg-white rounded-xl shadow-md border p-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Titre
            </span>
            <span className='text-base font-semibold text-gray-800'>
              {promesse.title}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Bénéficiaire
            </span>
            <span className='text-base text-gray-700'>
              {typeof promesse.beneficiaireId === 'string'
                ? promesse.beneficiaireId
                : promesse.beneficiaireId.fullName}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Montant
            </span>
            <span className='text-lg font-bold text-green-600'>
              {promesse.amount} FCFA
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Date de création
            </span>
            <span className='text-base text-gray-700'>
              {new Date(promesse.createdAt).toLocaleString('fr-FR')}
            </span>
          </div>
          <div className='flex flex-col col-span-2'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Description
            </span>
            <span className='text-base text-gray-700 whitespace-pre-wrap'>
              {promesse.description}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Statut
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                displayStatus(promesse.status) === 'Validé'
                  ? 'bg-green-100 text-green-700'
                  : displayStatus(promesse.status) === 'En attente'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {displayStatus(promesse.status)}
            </span>
          </div>
        </div>
      ) : (
        <div>Chargement...</div>
      )}
    </DialogContent>
  </Dialog>
);

export const PromisesPage = withDashboard(() => {
  const contributorId = useContributorStore((s) => s.contributor?._id);

  const [openAddPromise, setOpenAddPromise] = useState<boolean>(false);
  const [isPromiseLimitAlertOpen, setIsPromiseLimitAlertOpen] =
    useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filters, setFilters] =
    useState<IPromesseFilters>(INIT_FILTER_PROMESSE);
  const [selectedPromesse, setSelectedPromesse] = useState<tPromesse | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    data: promesses,
    isLoading,
    refetch,
  } = usePromesse({
    ...filters,
    contributorId: contributorId as string,
  });
  const { data: beneficiaires } = useBeneficiaries({
    limit: 100,
    page: 1,
    search: '',
    contributorId,
  });

  const mutation = useCreatePromesse(setOpenAddPromise);
  const mutationDeleted = useDeletePromesse();

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Limites de promesses via package
  const { hasReachedPromiseLimit, getPromiseLimit, getRemainingPromisesCount } =
    usePackagePermissions();
  const currentPromiseCount = promesses?.totalData || 0;
  const promiseLimit = getPromiseLimit();
  const promiseLimitReached = hasReachedPromiseLimit(currentPromiseCount);
  const remainingPromises = getRemainingPromisesCount(currentPromiseCount);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      beneficiaireId: '',
      amount: '0',
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate({
      title: data.title,
      description: data.description,
      beneficiaireId: data.beneficiaireId,
      amount: data.amount,
      contributorId: contributorId as string,
    });
    form.reset();
  }
  const handleDeletePromesse = (id: string) => {
    mutationDeleted.mutate(id);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between mt-4'>
        <div>
          <h4 className='text-3xl font-bold'>Promesses</h4>
          <p className='text-muted-foreground'>Gérer vos promesses ici.</p>

          {promiseLimit && promiseLimit > 0 && (
            <div className='mt-3 flex items-center gap-3'>
              <div className='flex items-center gap-2 text-sm'>
                <span className='text-gray-600'>
                  {currentPromiseCount} / {promiseLimit} promesses
                </span>
              </div>
              <div className='w-32 bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    promiseLimitReached
                      ? 'bg-red-500'
                      : currentPromiseCount / promiseLimit > 0.8
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      (currentPromiseCount / promiseLimit) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              {/* Badge d'alerte si proche de la limite */}
              {!promiseLimitReached &&
                remainingPromises !== null &&
                remainingPromises <= 2 && (
                  <Badge
                    variant='secondary'
                    className='bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  >
                    <AlertTriangle className='h-3 w-3 mr-1' />
                    {remainingPromises === 1
                      ? '1 promesse restante'
                      : `${remainingPromises} promesses restantes`}
                  </Badge>
                )}

              {promiseLimitReached && (
                <Badge variant='destructive' className='hover:bg-red-200'>
                  <AlertTriangle className='h-3 w-3 mr-1' />
                  Limite atteinte
                </Badge>
              )}
            </div>
          )}
        </div>
        <div>
          {helperUserPermission('promesse', 'create') ? (
            <Button
              onClick={() => {
                if (promiseLimitReached) {
                  setIsPromiseLimitAlertOpen(true);
                  return;
                }
                setOpenAddPromise(true);
              }}
              disabled={promiseLimitReached}
              className={
                promiseLimitReached ? 'opacity-50 cursor-not-allowed' : ''
              }
            >
              <ScrollTextIcon />
              <span>Ajouter une promesse</span>
              {promiseLimitReached && (
                <span className='ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full'>
                  Limite atteinte
                </span>
              )}
            </Button>
          ) : (
            <div className='text-muted-foreground'>
              Vous n'avez pas les permissions pour créer une promesses.
            </div>
          )}

          {/* Modal pour ajouter une promesse */}
          <Dialog open={openAddPromise} onOpenChange={setOpenAddPromise}>
            <DialogContent className='overflow-y-auto max-h-[80vh]'>
              <DialogHeader>
                <DialogTitle>Ajouter une promesse</DialogTitle>
                <DialogDescription>
                  Utilisez le formulaire ci-dessous pour ajouter une promesse.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre de la promesse</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            placeholder='Titre de la promesse'
                            disabled={mutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='beneficiaireId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bénéficiaire</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            value={field.value as string}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Sélectionnez un bénéficiaire' />
                            </SelectTrigger>
                            <SelectContent>
                              {beneficiaires?.data?.map((beneficiaire) => (
                                <SelectItem
                                  key={beneficiaire._id}
                                  value={beneficiaire._id}
                                >
                                  {beneficiaire.fullName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='amount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Montant</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Montant'
                            disabled={mutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description de la promesse</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Description de la promesse'
                            disabled={mutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className='mt-4'>
                    <Button type='submit' disabled={mutation.isPending}>
                      {mutation.isPending ? (
                        <>
                          <Loader2 className='animate-spin' />
                          <span>Ajout en cours</span>
                        </>
                      ) : (
                        'Ajouter'
                      )}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      disabled={mutation.isPending}
                      onClick={() => setOpenAddPromise(false)}
                    >
                      Annuler
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* <Card className='p-4'> */}
      <div className='flex gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='flex-1 pl-10'
            placeholder='Rechercher une promesse par titre...'
            // value={filters.search}
            defaultValue={filters.search}
            onChange={(e) => {
              e.target.value &&
                e.target.value.length > 3 &&
                setFilters({ ...filters, search: e.target.value });
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
            <Badge className='ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center'>
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            refetch();
            setFilters(INIT_FILTER_PROMESSE);
          }}
          className='relative'
        >
          <RefreshCcw className='h-4 w-4 mr-2' />
          Refresh
        </Button>
      </div>
      {/* </Card> */}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        beneficiaires={beneficiaires?.data as IBeneficiaire[]}
        filters={filters}
        onFilterChange={(key: keyof IPromesseFilters, value: any) => {
          setFilters({ ...filters, [key]: value });
        }}
      />

      {/* <Card> */}
      {helperUserPermission('promesse', 'read') ? (
        <>
          <Table className='border'>
            <TableHeader>
              <TableRow>
                <TableHead>Titre de la promesse</TableHead>
                <TableHead>Bénéficiaire</TableHead>
                <TableHead>Date d'échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton
                      count={1}
                      width='100%'
                      height={300}
                      style={{ width: '100%' }}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                promesses?.data?.map((promesse: tPromesse) => (
                  <TableRow
                    key={promesse._id}
                    className='cursor-pointer hover:bg-gray-100'
                  >
                    <TableCell className='font-medium'>
                      {promesse.title.substring(0, 50) + '...'}
                    </TableCell>
                    <TableCell>
                      {typeof promesse.beneficiaireId === 'string' ? (
                        <div className='flex items-center gap-2'>
                          <div className='flex-1'>
                            <div className='text-sm font-medium'>
                              {promesse.beneficiaireId}
                            </div>
                          </div>
                        </div>
                      ) : (
                        promesse.beneficiaireId.fullName
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(promesse.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className='ml-2 rounded-full p-2 text-xs flex items-center justify-center'
                        variant={
                          displayStatus(promesse.status) === 'Validé'
                            ? 'success'
                            : 'secondary'
                        }
                      >
                        {displayStatus(promesse.status) === 'Validé'
                          ? '✅' + displayStatus(promesse.status)
                          : '🕐' + displayStatus(promesse.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='secondary'
                          size='icon'
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPromesse(promesse);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye className='h-4 w-4' color='white' />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant='destructive'
                              size='icon'
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Trash color='white' className='h-4 w-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Êtes-vous absolument sûr ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. Elle supprimera
                                définitivement les informations concernant cette
                                promesse.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                <XIcon className='h-4 w-4' />
                                <span>Non, j'annule</span>
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeletePromesse(promesse._id)
                                }
                              >
                                <Trash color='white' className='h-4 w-4' />
                                <span>Oui, je supprime</span>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading &&
                (promesses?.data?.length === 0 || !promesses?.data) && (
                  <TableRow>
                    <TableCell colSpan={4} className='text-center py-8'>
                      Aucune promesse trouvée.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
          {/* Pagination */}
          {/* <div className='p-4 border-t'> */}
          {isLoading ? (
            <Skeleton
              count={1}
              width='100%'
              height={50}
              style={{ width: '100%' }}
            />
          ) : (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    className={
                      filters.page === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                    onClick={() =>
                      setFilters((p) => ({ ...p, page: Number(p.page) - 1 }))
                    }
                    size='sm'
                  />
                </PaginationItem>
                {isLoading
                  ? [...Array(2)].map((_, i) => (
                      <Skeleton className='h-4 w-4' key={i + 1} />
                    ))
                  : [
                      ...Array(
                        Math.min(Number(promesses?.metadata?.totalPages))
                      ),
                    ].map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() =>
                            setFilters((p) => ({ ...p, page: i + 1 }))
                          }
                          isActive={filters.page === i + 1}
                          size='sm'
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    size={'sm'}
                    onClick={() =>
                      setFilters((p) => ({ ...p, page: Number(p.page) + 1 }))
                    }
                    className={
                      filters.page === promesses?.metadata?.totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className='text-muted-foreground'>
          Vous n'avez pas les permissions pour accéder à la liste des promesses.
        </div>
      )}

      <PromesseDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        promesse={selectedPromesse}
      />
    </div>
  );
});
