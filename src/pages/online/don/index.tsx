import { DON_FILTER_FORM_INITIAL_STATE } from '@/assets/constants/don';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { withDashboard } from '@/hoc/withDashboard';
import { useBeneficiaries } from '@/hook/beneficiaire.hook';
import { useCreateDon, useDons } from '@/hook/don.hook';
import { IDon, IDonFilterForm } from '@/interface/don';
import { createDonSchema, FormCreateDonSchema } from '@/schema/don.schema';
import useContributorStore from '@/store/contributor.store';
import { useDonStore } from '@/store/don.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { Eye, Filter, Loader2, RefreshCcw, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: IDonFilterForm;
  onFilterChange: (key: keyof IDonFilterForm, value: any) => void;
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

export const DonPage = withDashboard(() => {
  const navigate = useNavigate();
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const { donFilterForm, setDonStore } = useDonStore((s) => s);
  const [isCreateDonOpen, setIsCreateDonOpen] = useState<boolean>(false);
  const [dateSelected, setDateSelected] = useState<Date | null>(null);
  const { isLoading: isLoadingBeneficiaries, data: beneficiaries } =
    useBeneficiaries({
      limit: 100000,
      page: 1,
    });
  const { data, isLoading, isError, error, refetch, isRefetching } = useDons({
    ...donFilterForm,
    contributorId: contributorId as string,
  } as IDonFilterForm);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });

  const mutation = useCreateDon(setIsCreateDonOpen);

  const handleFilterChange = (key: keyof IDonFilterForm, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formAddDon = useForm<FormCreateDonSchema>({
    resolver: zodResolver(createDonSchema),
    defaultValues: {
      beneficiaire: '',
      montant: '0',
      title: '',
      devise: 'FCFA',
      startDate: '',
      endDate: '',
    },
  });

  const activeFiltersCount = Object.values(
    donFilterForm as IDonFilterForm
  ).filter(Boolean).length;

  const handleRowClick = (donationId: string) => {
    navigate(`/don/${donationId}`);
  };

  const onSubmit = async (data: FormCreateDonSchema) => {
    console.log('Don:', data);
    const payload = {
      ...data,
      contributorId: contributorId as string,
    };
    mutation.mutateAsync(payload as unknown as Partial<IDon>);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Dons</h1>
          <p className='text-muted-foreground'>Gestion des dons</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => setIsCreateDonOpen(true)}>
            <UserPlus className='h-4 w-4 mr-2' />
            Enregistrer un don
          </Button>
          {/* Dialog create don */}
          <Dialog open={isCreateDonOpen} onOpenChange={setIsCreateDonOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un don</DialogTitle>
                <DialogDescription>
                  Saisissez les informations pour créer un don.
                </DialogDescription>
              </DialogHeader>
              <div>
                <Form {...formAddDon}>
                  <form
                    className='grid gap-4 py-4'
                    onSubmit={formAddDon.handleSubmit(onSubmit)}
                  >
                    <FormField
                      control={formAddDon.control}
                      name='beneficiaire'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Bénéficiaire
                          </label>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Sélectionnez un donateur' />
                              </SelectTrigger>
                              <SelectContent>
                                {beneficiaries?.data?.map((beneficiaire) => (
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
                      control={formAddDon.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Titre
                          </label>
                          <FormControl>
                            <Input placeholder='Titre' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAddDon.control}
                      name='montant'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Montant
                          </label>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Montant'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAddDon.control}
                      name='devise'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Devise
                          </label>
                          <FormControl>
                            <Select
                              {...field}
                              value={field.value as string}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Sélectionnez une devise' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='FCFA'>FCFA</SelectItem>
                                <SelectItem value='EUR'>EUR</SelectItem>
                                <SelectItem value='GBP'>GBP</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAddDon.control}
                      name='startDate'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Date de début
                          </label>
                          <FormControl>
                            <Input
                              type='datetime-local'
                              placeholder='Date de début'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAddDon.control}
                      name='endDate'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Date de fin
                          </label>
                          <FormControl>
                            <Input
                              type='datetime-local'
                              placeholder='Date de fin'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        variant='outline'
                        onClick={() => setIsCreateDonOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button type='submit' disabled={mutation.isPending}>
                        {mutation.isPending ? (
                          <>
                            <Loader2 className='animate-spin' />
                            <span>En cours de création...</span>
                          </>
                        ) : (
                          'Créer'
                        )}
                      </Button>
                      {/* TODO: Implémenter la redirection vers la page de création */}
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className='p-4'>
        <div className='flex gap-4'>
          <Input
            className='flex-1'
            placeholder='Rechercher un donateur ou un montant...'
            value={searchQuery}
            onChange={(e) => {
              const searchValue = e.target.value;
              setSearchQuery(searchValue);
              if (searchValue.length >= 3 || searchValue.length === 0) {
                setDonStore('donFilterForm', {
                  ...donFilterForm,
                  search: searchValue,
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
              setDonStore('donFilterForm', {
                ...DON_FILTER_FORM_INITIAL_STATE,
                contributorId: contributorId as string,
              });
              refetch();
              setSearchQuery('');
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
        filters={donFilterForm as IDonFilterForm}
        onFilterChange={(key: string, value: {}) => {
          setDonStore('donFilterForm', {
            ...donFilterForm,
            [key]: value,
          });
        }}
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bénéficiaire</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Devise</TableHead>
              <TableHead>Date du don</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isRefetching ? (
              <TableRow className='p-8'>
                <TableCell colSpan={6}>
                  <Skeleton
                    count={1}
                    width='100%'
                    height={300}
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((donation: IDon) => (
                <TableRow
                  key={donation._id}
                  onClick={() => handleRowClick(donation._id)}
                  className='cursor-pointer hover:bg-gray-100'
                >
                  <TableCell className='font-medium'>
                    {donation.beneficiaire.fullName}
                  </TableCell>
                  <TableCell>{donation.montant}</TableCell>
                  <TableCell>{donation.devise}</TableCell>
                  <TableCell>
                    {new Date(donation.dateDon).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(donation._id);
                        }}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!isLoading &&
              !isRefetching &&
              !isRefetching &&
              (data?.data?.length === 0 || !data?.data) && (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8'>
                    Aucun don trouvé.
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
                    disabled={currentPage === 1}
                    className={
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                    onClick={() => {
                      setCurrentPage(currentPage - 1);
                    }}
                    size='sm'
                  />
                </PaginationItem>
                {isLoading ? (
                  <Skeleton className='h-4 w-4' count={1} />
                ) : (
                  [...Array(Math.min(Number(data?.metadata?.totalPages)))].map(
                    (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          size='sm'
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )
                )}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    size={'sm'}
                    onClick={() =>
                      setCurrentPage((p) =>
                        p === Number(data?.metadata?.totalPages) ? p : p + 1
                      )
                    }
                    className={
                      currentPage === data?.metadata?.totalPages
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
