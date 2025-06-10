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
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { withDashboard } from '@/hoc/withDashboard';
// TODO: Replace with actual audience hook
import { useAudiences } from '@/hook/audience.hook';
// TODO: Replace with actual create audience hook
import { useCreateAudience } from '@/hook/audience.hook';
// TODO: Replace with actual audience interface and filter form interface
import { IAudience, IAudienceFilterForm } from '@/interface/audience';
// TODO: Replace with actual audience schema and form schema
import {
  createAudienceSchema,
  FormCreateAudienceSchema,
} from '@/schema/audience.schema';
// TODO: Replace with actual audience store
import { useAudienceStore } from '@/store/audience.store';
import useUserStore from '@/store/user.store';
// import useStaffStore from '@/store/staff.store';
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
  // TODO: Replace with actual audience filter form interface
  filters: IAudienceFilterForm;
  // TODO: Replace with actual audience filter form interface key
  onFilterChange: (key: keyof IAudienceFilterForm, value: any) => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className='sm:max-w-[630px]'>
      <DialogHeader>
        <DialogTitle>Filtres des audiences</DialogTitle>
        <DialogDescription>
          Appliquer des filtres pour affiner la liste des audiences.
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

// TODO: Replace with AudiencePage
export const AudiencePage = withDashboard(() => {
  const navigate = useNavigate();
  const contributorId = useUserStore((s) => s.user?.contributorId);
  // TODO: Replace with useAudienceStore and audienceFilterForm
  const { audienceFilterForm, setAudienceStore } = useAudienceStore((s) => s);
  // TODO: Replace with isCreateAudienceOpen and setIsCreateAudienceOpen
  const [isCreateAudienceOpen, setIsCreateAudienceOpen] =
    useState<boolean>(false);
  const [dateSelected, setDateSelected] = useState<Date | null>(null);
  // TODO: Remove or replace if no beneficiaries are needed for audience creation
  // const { isLoading: isLoadingBeneficiaries, data: beneficiaries } =
  //   useBeneficiaries({
  //     limit: 100000,
  //     page: 1,
  //   });
  // TODO: Replace with useAudiences hook and IAudienceFilterForm
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAudiences({
      ...audienceFilterForm,
      contributorId: contributorId as string,
    } as IAudienceFilterForm);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });

  // TODO: Replace with useCreateAudience mutation
  const mutation = useCreateAudience(setIsCreateAudienceOpen);

  // TODO: Replace with IAudienceFilterForm key
  const handleFilterChange = (key: keyof IAudienceFilterForm, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // TODO: Replace with FormCreateAudienceSchema and createAudienceSchema
  const formAddAudience = useForm<FormCreateAudienceSchema>({
    resolver: zodResolver(createAudienceSchema),
    defaultValues: {
      // TODO: Replace with audience fields
      name: '',
      email: '',
    },
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // TODO: Replace with audienceId and audience route
  const handleRowClick = (audienceId: string) => {
    navigate(`/audience/${audienceId}`);
  };

  // TODO: Replace with FormCreateAudienceSchema and console log message
  const onSubmit = (data: FormCreateAudienceSchema) => {
    console.log('Audience:', data);
    mutation.mutate(data);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Audiences</h1>
          <p className='text-muted-foreground'>Gestion des audiences</p>
        </div>
        <div className='flex gap-2'>
          {/* TODO: Replace with Create Audience button */}
          <Button onClick={() => setIsCreateAudienceOpen(true)}>
            <UserPlus className='h-4 w-4 mr-2' />
            Enregistrer une audience
          </Button>
          {/* Dialog create audience */}
          {/* TODO: Replace with isCreateAudienceOpen and setIsCreateAudienceOpen */}
          <Dialog
            open={isCreateAudienceOpen}
            onOpenChange={setIsCreateAudienceOpen}
          >
            <DialogContent className='sm:max-w-[500px] overflow-auto h-full'>
              <DialogHeader>
                <DialogTitle>Créer une audience</DialogTitle>
                <DialogDescription>
                  Saisissez les informations pour créer une audience.
                </DialogDescription>
              </DialogHeader>
              <div>
                {/* TODO: Replace with formAddAudience and onSubmit */}
                <Form {...formAddAudience}>
                  <form
                    className='grid gap-4 py-4'
                    onSubmit={formAddAudience.handleSubmit(onSubmit)}
                  >
                    {/* TODO: Replace with audience form fields */}
                    <FormField
                      control={formAddAudience.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Nom
                          </label>
                          <FormControl>
                            <Input
                              type='text'
                              placeholder="Nom de l'audience"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAddAudience.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Email
                          </label>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder="Email de l'audience"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* TODO: Add other audience creation fields */}

                    <DialogFooter>
                      {/* TODO: Replace with setIsCreateAudienceOpen */}
                      <Button
                        variant='outline'
                        onClick={() => setIsCreateAudienceOpen(false)}
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
            // TODO: Replace with audience search placeholder
            placeholder='Rechercher par nom ou email...'
            value={searchQuery}
            onChange={(e) => {
              const searchValue = e.target.value;
              setSearchQuery(searchValue);
              if (searchValue.length >= 3 || searchValue.length === 0) {
                // TODO: Replace with setAudienceStore and audienceFilterForm
                // setAudienceStore({
                //   ...audienceFilterForm,
                //   search: searchValue,
                // });
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
              // TODO: Implement refresh logic for audience filter and refetch
              // setAudienceStore('audienceFilterForm', INIT_AUDIENCE_FILTER);
              // refetch();
              // setSearchQuery('');
              // setFilters(INIT_AUDIENCE_FILTER);
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
        filters={filters as IAudienceFilterForm}
        onFilterChange={(key: string, value: {}) => {
          // TODO: Implement filter change logic for audience store
          // setAudienceStore(
          //   key as keyof AudienceStore,
          //   value as AudienceStore[keyof AudienceStore]
          // );
          // setFilters(value as AudienceFilter);
        }}
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {/* TODO: Replace with audience table headers */}
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isRefetching ? (
              <TableRow className='p-8'>
                <TableCell colSpan={3}>
                  {' '}
                  {/* Adjust colspan based on new headers */}
                  <Skeleton
                    count={1}
                    width='100%'
                    height={300}
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              // TODO: Replace with IAudience interface and audience data mapping
              data?.data?.map((audience: IAudience) => (
                <TableRow
                  key={audience._id}
                  onClick={() => handleRowClick(audience._id)}
                  className='cursor-pointer hover:bg-gray-100'
                >
                  {/* TODO: Replace with audience data cells */}
                  <TableCell className='font-medium'>{audience.name}</TableCell>
                  <TableCell>{audience.email}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      {/* TODO: Replace with audience route */}
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(audience._id);
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
                  <TableCell colSpan={3} className='text-center py-8'>
                    {' '}
                    {/* Adjust colspan */}
                    Aucune audience trouvée.
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
                      currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                    onClick={
                      () => {}
                      // TODO: Implement pagination logic for audience
                      // handleFilterChange(
                      //   'page',
                      //   data?.metadata?.page
                      //     ? Number(data.metadata.page) - 1
                      //     : 1
                      // )
                    }
                    size='sm'
                  />
                </PaginationItem>
                {/* {isLoading
                  ? [...Array(2)].map((_, i) => (
                      <Skeleton className='h-4 w-4' key={i + 1} />
                    ))
                  : [
                      ...Array(Math.min(Number(data?.metadata?.totalPages))),
                    ].map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          size='sm'
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))} */}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    size={'sm'}
                    onClick={() =>
                      setCurrentPage(
                        (p) =>
                          p === Number(data?.metadata?.totalPages) ? p : p + 1
                        // Math.min(Number(partners?.pagination?.pages), p + 1)
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

// TODO: Export AudiencePage
export default AudiencePage;
