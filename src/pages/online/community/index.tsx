import { BENEFICIAIRE_FILTER_FORM_INITIAL_STATE } from '@/assets/constants/beneficiaire';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { withDashboard } from '@/hoc/withDashboard';
import { useBeneficiaries } from '@/hook/beneficiaire.hook';
import {
  IBeneficiaire,
  IBeneficiaireFilterForm,
} from '@/interface/beneficiaire';
import { useBeneficiaireStore } from '@/store/benefiaiciaire.store';
import useUserStore from '@/store/user.store';
// import useStaffStore from '@/store/staff.store';
import { addDays } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { Eye, Filter, RefreshCcw, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

// Filter modal component - adapt filters for beneficiaries
const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: IBeneficiaireFilterForm;
  onFilterChange: (key: keyof IBeneficiaireFilterForm, value: any) => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className='sm:max-w-[630px]'>
      <DialogHeader>
        <DialogTitle>Filtres des bénéficiaires</DialogTitle>
        <DialogDescription>
          Appliquer des filtres pour affiner la liste des bénéficiaires.
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

export const CommunityPage = withDashboard(() => {
  const navigate = useNavigate();
  const { beneficiaireFilterForm, setBeneficiaryStore } = useBeneficiaireStore(
    (s) => s
  );
  const contributorId = useUserStore((s) => s.user?.contributorId);
  const { data, isLoading, refetch, isRefetching } = useBeneficiaries(
    beneficiaireFilterForm as IBeneficiaireFilterForm
  ); // Use beneficiary hook

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IBeneficiaireFilterForm>({
    period: {
      from: new Date().toISOString(),
      to: addDays(new Date(), 7).toISOString(),
    },
    search: '',
  });

  const handleFilterChange = (
    key: keyof IBeneficiaireFilterForm,
    value: any
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    // The store update is handled inside the onFilterChange prop passed to FilterModal
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleRowClick = (beneficiaryId: string) => {
    // Navigate to beneficiary details page - adjust the route as needed
    navigate(`/community/${beneficiaryId}`);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Bénéficiaires</h1>
          <p className='text-muted-foreground'>Gestion des bénéficiaires</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => navigate('/community/create')}>
            <UserPlus className='h-4 w-4 mr-2' />
            Enregistrer une bénéficiaire
          </Button>
        </div>
      </div>

      <Card className='p-4'>
        <div className='flex gap-4'>
          <Input
            className='flex-1'
            placeholder='Rechercher un bénéficiaire par nom...' // Adjust placeholder
            value={searchQuery}
            onChange={(e) => {
              const searchValue = e.target.value;
              setSearchQuery(searchValue);
              if (searchValue.length >= 3 || searchValue.length === 0) {
                // Update beneficiary filter in store
                setBeneficiaryStore('beneficiaireFilterForm', {
                  ...filters,
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
              // Reset beneficiary filter and refetch data
              setBeneficiaryStore(
                'beneficiaireFilterForm',
                BENEFICIAIRE_FILTER_FORM_INITIAL_STATE
              );
              refetch();
              setSearchQuery('');
              // Re-initialize filters with the default structure including period
              setFilters({
                period: {
                  from: new Date().toISOString(),
                  to: addDays(new Date(), 7).toISOString(),
                },
                search: '',
              });
            }}
            className='relative'
          >
            <RefreshCcw className='h-4 w-4 mr-2' />
            Actualiser
          </Button>
        </div>
      </Card>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFilterChange={(key: keyof IBeneficiaireFilterForm, value: any) => {
          // Update local filters state
          setFilters((prev) => {
            const updatedFilters = {
              ...prev,
              [key]: value,
            };
            // Update the entire beneficiaireFilterForm in the store with the new filters object
            setBeneficiaryStore('beneficiaireFilterForm', updatedFilters);
            return updatedFilters;
          });
        }}
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du bénéficiaire</TableHead>
              <TableHead>Chef ou représentant</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loading state */}
            {isLoading || isRefetching ? (
              <TableRow className='p-8'>
                <TableCell colSpan={4}>
                  <Skeleton
                    count={1}
                    width='100%'
                    height={300}
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((beneficiary: IBeneficiaire) => (
                <TableRow
                  key={beneficiary._id}
                  onClick={() => handleRowClick(beneficiary._id)}
                  className='cursor-pointer hover:bg-gray-100'
                >
                  <TableCell className='font-medium'>
                    {beneficiary.fullName}
                  </TableCell>
                  <TableCell>
                    {beneficiary.representant.firstName}{' '}
                    {beneficiary.representant.lastName}
                  </TableCell>
                  <TableCell>
                    {new Date(beneficiary.createdAt).toLocaleDateString(
                      'fr-FR'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => navigate(`/community/${beneficiary._id}`)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
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
                    onClick={() =>
                      handleFilterChange(
                        'page',
                        data?.metadata?.page
                          ? Number(data.metadata.page) - 1
                          : 1
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
                    ))}
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

export default CommunityPage;
