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
import { withDashboard } from '@/hoc/withDashboard';
import { useAudiences, useStatsAudience } from '@/hook/audience.hook';
import { IAudienceFilterForm, IAudienceState } from '@/interface/audience';
import useContributorStore from '@/store/contributor.store';
import useUserStore from '@/store/user.store';
import { helperUserPermission } from '@/utils';
import { addDays } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { Filter, RefreshCcw, Search, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useNavigate } from 'react-router-dom';
import { AudienceTable } from './components/AudienceTable';
import StatsAudience from './components/Stats';

const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: IAudienceFilterForm;
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

export const AudiencePage = withDashboard(() => {
  const navigate = useNavigate();
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const user = useUserStore((s) => s.user);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<IAudienceFilterForm>({
    page: 1,
    limit: 10,
    search: '',
    period: { from: '', to: '' },
    type: undefined, // Initial filter for audience type
  });

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAudiences({
      ...filters,
      contributorId: contributorId as string,
    });
  const {
    data: statsAudience,
    isLoading: isLoadingStats,
    isRefetching: isRefetchingStats,
  } = useStatsAudience({
    contributorId: contributorId as string,
  });

  const handleFilterChange = (key: keyof IAudienceFilterForm, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    handleFilterChange('search', searchValue);
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      period: { from: '', to: '' },
      type: undefined,
    });
    refetch();
  };

  const handleViewAudience = (id: string) => {
    navigate(`/audiences/${id}`);
  };

  const handleEditAudience = (id: string) => {
    navigate(`/audiences/${id}/edit`);
  };

  const handleDeleteAudience = (id: string) => {
    navigate(`/audiences/${id}`);
  };

  if (isError) {
    return (
      <div className='text-red-500'>
        Erreur: {error?.message || 'Impossible de charger les audiences.'}
      </div>
    );
  }

  const totalPages = data?.metadata?.totalPages
    ? Number(data.metadata.totalPages)
    : 1;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='text-3xl font-bold'>Audiences</h4>
          <p className='text-muted-foreground'>Gestion des audiences</p>
        </div>
        <div className='flex gap-2'>
          {(user?.role === 'AGENT' ||
            user?.role === 'EDITOR' ||
            user?.role === 'MANAGER') &&
            helperUserPermission('Audience', 'create') && (
              <Button onClick={() => navigate('/audiences/create')}>
                <UserPlus className='h-4 w-4 mr-2' />
                Nouvelle audience
              </Button>
            )}
        </div>
      </div>

      <StatsAudience
        handleFilterChange={handleFilterChange}
        data={statsAudience?.data as IAudienceState}
        isLoadingStats={isLoadingStats}
        isRefetchingStats={isRefetchingStats}
      />

      {/* <Card className='p-4'> */}
      <div className='flex gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='flex-1 pl-10'
            placeholder='Rechercher par titre ...'
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        <Button
          variant='outline'
          onClick={() => setIsFilterModalOpen(true)}
          className='relative'
        >
          <Filter className='h-4 w-4 mr-2' />
          Filtres
          {Object.values(filters).filter(
            (value) =>
              value !== '' &&
              value !== null &&
              value !== undefined &&
              (typeof value === 'object'
                ? value.from !== '' || value.to !== ''
                : true)
          ).length > 3 && ( // Simple way to count active filters, adjust as needed
            <Badge
              variant='secondary'
              className='ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center'
            >
              {Object.values(filters).filter(
                (value) =>
                  value !== '' &&
                  value !== null &&
                  value !== undefined &&
                  (typeof value === 'object'
                    ? value.from !== '' || value.to !== ''
                    : true)
              ).length - 3}{' '}
              {/* Subtract 3 for page, limit, search as they are always present or have default values */}
            </Badge>
          )}
        </Button>
        <Button
          variant='outline'
          onClick={handleClearFilters}
          className='relative'
        >
          <RefreshCcw className='h-4 w-4 mr-2' />
          Rafraîchir
        </Button>
      </div>
      {/* </Card> */}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {helperUserPermission('Audience', 'read') ? (
        <AudienceTable
          audiences={data?.data}
          isLoading={isLoading}
          isRefetching={isRefetching}
          onView={handleViewAudience}
          onEdit={handleEditAudience}
          onDelete={handleDeleteAudience}
          currentPage={filters.page || 1}
          totalPages={totalPages}
          setFilters={setFilters}
        />
      ) : (
        <div className='text-muted-foreground'>
          Vous n'avez pas les permissions pour accéder à la liste des audiences.
        </div>
      )}
    </div>
  );
});

export default AudiencePage;
