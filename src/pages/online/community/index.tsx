import { BENEFICIAIRE_FILTER_FORM_INITIAL_STATE } from '@/assets/constants/beneficiaire';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
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
import useContributorStore from '@/store/contributor.store';
import { helperUserPermission } from '@/utils';
// import useStaffStore from '@/store/staff.store';
import { addDays } from 'date-fns';
import fr from 'date-fns/locale/fr';
import {
  Eye,
  EyeOff,
  Filter,
  RefreshCcw,
  Search,
  UserPlus,
} from 'lucide-react';
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
          <div className='grid gap-2 grid-cols-2'>
            <label className='text-sm font-medium'>Type de bénéficiaire</label>
            <Select>
              <SelectContent>
                <SelectItem value='all'>Tous</SelectItem>
                <SelectItem value='active'>Actifs</SelectItem>
                <SelectItem value='inactive'>Inactifs</SelectItem>
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

export const CommunityPage = withDashboard(() => {
  const navigate = useNavigate();
  const { beneficiaireFilterForm, setBeneficiaryStore } = useBeneficiaireStore(
    (s) => s
  );
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const { data, isLoading, refetch, isRefetching } = useBeneficiaries({
    ...beneficiaireFilterForm,
    contributorId: contributorId as string,
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IBeneficiaireFilterForm>({
    period: {
      from: new Date().toISOString(),
      to: addDays(new Date(), 7).toISOString(),
    },
    search: '',
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleRowClick = (beneficiaryId: string) => {
    // Navigate to beneficiary details page - adjust the route as needed
    navigate(`/community/${beneficiaryId}`);
  };

  const totalPages = Number(data?.metadata?.totalPages) || 0;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='text-3xl font-bold'>Bénéficiaires</h4>
          <p className='text-muted-foreground'>Gestion des bénéficiaires</p>
        </div>
        <div className='flex gap-2'>
          {helperUserPermission('Bénéficiaires', 'create') && (
            <Button onClick={() => navigate('/community/create')}>
              <UserPlus className='h-4 w-4 mr-2' />
              Enregistrer une bénéficiaire
            </Button>
          )}
        </div>
      </div>

      <div className='flex gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='flex-1 pl-10'
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

      {helperUserPermission('Bénéficiaires', 'read') ? (
        <>
          <Table className='bg-white border rounded-2xl'>
            <TableHeader className='bg-[#6c2bd9] text-white'>
              <TableRow className='text-white'>
                <TableHead className='text-white'>
                  Nom du bénéficiaire
                </TableHead>
                <TableHead className='text-white'>
                  Chef ou représentant
                </TableHead>
                <TableHead className='text-white'>Date d'inscription</TableHead>
                <TableHead className='text-white'>Actions</TableHead>
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
                    <TableCell className='font-medium flex gap-4 items-center'>
                      <Avatar>
                        <AvatarImage src='' />
                        <AvatarFallback>
                          {beneficiary.fullName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {beneficiary.fullName}
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-row'>
                        {beneficiary.representant.map((rep) => (
                          <Avatar key={rep._id}>
                            <AvatarImage />
                            <AvatarFallback>
                              <span className='font-medium'>
                                {rep.firstName.slice(0, 1)}{' '}
                                {rep.lastName.slice(0, 1)}
                              </span>
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(beneficiary.createdAt).toLocaleDateString(
                        'fr-FR'
                      )}
                    </TableCell>
                    <TableCell>
                      {helperUserPermission('Bénéficiaires', 'read') ? (
                        <Button
                          variant='secondary'
                          size='icon'
                          onClick={() =>
                            navigate(`/community/${beneficiary._id}`)
                          }
                        >
                          <Eye className='h-4 w-4' color='white' />
                        </Button>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <EyeOff className='h-4 w-4' />
                          <span className='text-muted-foreground'>
                            Non autorisé
                          </span>
                        </div>
                      )}
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
                        beneficiaireFilterForm?.page === 1
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                      onClick={() =>
                        setBeneficiaryStore('beneficiaireFilterForm', {
                          ...beneficiaireFilterForm,
                          page:
                            Number(data?.metadata?.page) > 1
                              ? Number(data?.metadata?.page) - 1
                              : 1,
                        })
                      }
                      size='sm'
                    />
                  </PaginationItem>
                  {isLoading || isRefetching
                    ? [...Array(2)].map((_, i) => (
                        <Skeleton className='h-4 w-4' key={i + 1} />
                      ))
                    : [...Array(Math.max(0, totalPages))].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            onClick={() =>
                              setBeneficiaryStore('beneficiaireFilterForm', {
                                ...beneficiaireFilterForm,
                                page: i + 1,
                              })
                            }
                            isActive={beneficiaireFilterForm?.page === i + 1}
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
                        setBeneficiaryStore('beneficiaireFilterForm', {
                          ...beneficiaireFilterForm,
                          page: data?.metadata?.totalPages
                            ? Number(data.metadata.totalPages)
                            : 1,
                        })
                      }
                      className={
                        beneficiaireFilterForm?.page ===
                        data?.metadata?.totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </>
      ) : (
        <div className='text-muted-foreground'>
          Vous n'avez pas les permissions pour accéder à la liste des
          bénéficiaires.
        </div>
      )}
    </div>
  );
});

export default CommunityPage;
