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
import {
  useCreatePromesse,
  useDeletePromesse,
  usePromesse,
} from '@/hook/promesse.hook';
import { IBeneficiaire } from '@/interface/beneficiaire';
import { IPromesseFilters, tPromesse } from '@/interface/promesse';
import useContributorStore from '@/store/contributor.store';
import { helperFullName } from '@/utils';
import { displayStatus } from '@/utils/display-of-variable';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge, Eye, Filter, Loader2, RefreshCcw, Trash } from 'lucide-react';
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

export const PromisesPage = withDashboard(() => {
  const [isOpenDetailPromesse, setIsOpenDetailPromesse] =
    useState<boolean>(false);
  const [openAddPromise, setOpenAddPromise] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filters, setFilters] =
    useState<IPromesseFilters>(INIT_FILTER_PROMESSE);
  const contributorId = useContributorStore((s) => s.contributor?._id);

  const {
    data: promesses,
    isLoading,
    isRefetching,
    refetch,
  } = usePromesse({
    ...filters,
    contributorId: contributorId as string,
  });
  const { data: beneficiaires } = useBeneficiaries({
    limit: 100,
    page: 1,
    search: '',
  });
  const mutation = useCreatePromesse(setOpenAddPromise);
  const mutationDeleted = useDeletePromesse();

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

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
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Promesses</h1>
          <p className='text-muted-foreground'>Gérer vos promesses ici.</p>
        </div>
        <div>
          <Button onClick={() => setOpenAddPromise(true)}>
            Ajouter une promesse
          </Button>
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

      <Card className='p-4'>
        <div className='flex gap-4'>
          <Input
            className='flex-1'
            placeholder='Rechercher une promesse...'
            // value={filters.search}
            defaultValue={filters.search}
            onChange={(e) => {
              e.target.value &&
                e.target.value.length > 3 &&
                setFilters({ ...filters, search: e.target.value });
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
      </Card>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        beneficiaires={beneficiaires?.data as IBeneficiaire[]}
        filters={filters}
        onFilterChange={(key: keyof IPromesseFilters, value: any) => {
          setFilters({ ...filters, [key]: value });
        }}
      />

      <Card>
        <Table>
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
            {isLoading || isRefetching ? (
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
                    {promesse.title}
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
                      helperFullName(
                        promesse.beneficiaireId.representant.firstName,
                        promesse.beneficiaireId.representant.lastName
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(promesse.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{displayStatus(promesse.status)}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpenDetailPromesse(true);

                          // handleRowClick(promesse._id);
                        }}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                      {/* Dialog detail promesse */}
                      <Dialog
                        open={isOpenDetailPromesse}
                        onOpenChange={setIsOpenDetailPromesse}
                      >
                        <DialogContent className='sm:max-w-[500px]'>
                          <DialogHeader>
                            <DialogTitle>Détail du promesse</DialogTitle>
                            <DialogDescription>
                              Détails de la promesse
                            </DialogDescription>
                          </DialogHeader>
                          <div>
                            <div>
                              <p className='text-sm text-muted-foreground'>
                                Titre
                              </p>
                              <p className='font-medium'>
                                {isLoading ? (
                                  <Skeleton className='h-4 w-4' />
                                ) : (
                                  promesse.title
                                )}
                              </p>
                            </div>
                            <div>
                              <p className='text-sm text-muted-foreground'>
                                Nom complet
                              </p>
                              <p className='font-medium'>
                                {isLoading ? (
                                  <Skeleton className='h-4 w-4' />
                                ) : typeof promesse.beneficiaireId ===
                                  'string' ? (
                                  promesse.beneficiaireId
                                ) : (
                                  (promesse.beneficiaireId.fullName as string)
                                )}
                              </p>
                            </div>
                            <div>
                              <p className='text-sm text-muted-foreground'>
                                Nom complet
                              </p>
                              <p className='font-medium'>
                                {isLoading ? (
                                  <Skeleton className='h-4 w-4' />
                                ) : (
                                  promesse.description
                                )}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={(e) => {
                              e.stopPropagation();
                              // handleRowEdit(promesse._id);
                            }}
                          >
                            <Trash color='red' className='h-4 w-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Êtes-vous absolument sûr ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Elle supprimera
                              définitivement les informations concernant ce
                              promesse.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePromesse(promesse._id)}
                            >
                              confirmer
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
              !isRefetching &&
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
        <div className='p-4 border-t'>
          {isLoading || isRefetching ? (
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
                    // ajoute une classe pour disactivé le boutton si la page est à 1 ou si le nombre de pages est inférieur à 2
                    className={
                      filters.page === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                    onClick={() =>
                      setFilters((p) =>
                        p.page === Number(beneficiaires?.metadata?.totalPages)
                          ? p
                          : { ...p, page: p.page + 1 }
                      )
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
                        Math.min(Number(beneficiaires?.metadata?.totalPages))
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
                    onClick={() => {
                      (p: number) =>
                        p === Number(beneficiaires?.metadata?.totalPages)
                          ? p
                          : p + 1;
                    }}
                    className={
                      filters.page === beneficiaires?.metadata?.totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </Card>
    </div>
  );
});
