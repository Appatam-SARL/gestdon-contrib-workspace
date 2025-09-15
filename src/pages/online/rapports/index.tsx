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
import { useReports, useStatsReport } from '@/hook/report.hook';
import imgArrayEmpty from '@/assets/img/activityempty.png';
import {
  IReport,
  IReportFilterForm,
  IReportState,
  tReportStatus,
} from '@/interface/report';
import useContributorStore from '@/store/contributor.store';
import useReportStore from '@/store/report.store';
import { helperUserPermission } from '@/utils';
import { displayStatusReport } from '@/utils/display-of-variable';
import { Eye, EyeOff, Filter, RefreshCcw, Search } from 'lucide-react';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import StatsReport from './Stats';

// Helper function for status display layout - adapt as needed for report statuses
export const getReportStatusLayout = (status: tReportStatus) => {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'VALIDATED':
      return 'Validé';
    case 'REFUSED':
      return 'Refusé';
  }
};

// Filter modal component - adapt filters for reports
const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: any; // Replace 'any' with proper type for report filters
  onFilterChange: (key: string, value: {}) => void; // Replace 'any' with proper type for report filters
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className='sm:max-w-[500px]'>
      <DialogHeader>
        <DialogTitle>Filtres des rapports</DialogTitle>
        <DialogDescription>
          Appliquer des filtres pour affiner la liste des rapports.
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Statut</label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                onFilterChange('reportFilterForm', {
                  ...filters,
                  status: value === 'all' ? '' : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Tous les statuts' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tous les statuts</SelectItem>
                <SelectItem value='PENDING'>En attente</SelectItem>
                <SelectItem value='VALIDATED'>Validé</SelectItem>
                <SelectItem value='REFUSED'>Refusé</SelectItem>
                <SelectItem value='ARCHIVED'>Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Add more filter options as needed */}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export const RepportsPage = withDashboard(() => {
  const navigate = useNavigate();

  const contributorId = useContributorStore((s) => s.contributor?._id);
  const { reportFilterForm, setReportStore } = useReportStore((s) => s);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  // HOOK de récupération des rapports
  const {
    data: reportsResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useReports({
    ...reportFilterForm,
    contributorId,
  });

  const {
    data: statsReport,
    isLoading: isLoadingStats,
    isRefetching: isRefetchingStats,
  } = useStatsReport({
    contributorId: contributorId as string,
  });
  console.log('🚀 ~ RepportsPage ~ statsReport:', statsReport);
  const handleFilterChange = (key: keyof IReportFilterForm, value: any) => {
    setReportStore('reportFilterForm', {
      [key]: value,
      page: 1, // Reset to first page on filter change
    });
  };

  const handleClearFilters = () => {
    setReportStore('reportFilterForm', {
      page: 1,
      limit: 10,
      search: '',
      contributorId: contributorId as string,
    });
    refetch();
  };

  const activeFiltersCount =
    Object.values(reportFilterForm).filter(Boolean).length;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='text-3xl font-bold'>Rapports</h4>
          <p className='text-muted-foreground'>Gestion des rapports</p>
        </div>
      </div>

      <StatsReport
        handleFilterChange={handleFilterChange}
        data={statsReport?.data as IReportState}
        isLoadingStats={isLoadingStats}
        isRefetchingStats={isRefetchingStats}
      />

      <div className='flex gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='flex-1 pl-10'
            placeholder='Rechercher un rapport par titre...'
            value={searchQuery}
            onChange={(e) => {
              const searchValue = e.target.value;
              setSearchQuery(searchValue);
              if (searchValue.length >= 3 || searchValue.length === 0) {
                handleFilterChange('search', searchValue);
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
          onClick={handleClearFilters}
          className='relative'
        >
          <RefreshCcw className='h-4 w-4 mr-2' />
          Actualiser
        </Button>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={reportFilterForm}
        onFilterChange={(key, value) =>
          handleFilterChange(key as keyof IReportFilterForm, value)
        }
      />

      {helperUserPermission('Rapports', 'read') ? (
        <>
          <Table className='border'>
            <TableHeader>
              <TableRow>
                <TableHead>Titre du rapport</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Initier par</TableHead>
                <TableHead>Valider par</TableHead>
                <TableHead>Date de génération</TableHead>
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
                reportsResponse?.data.map((report: IReport) => (
                  <TableRow key={report._id}>
                    <TableCell className='font-medium'>{report.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          displayStatusReport(report?.status as string) ===
                          'Validé'
                            ? 'success'
                            : displayStatusReport(report?.status as string) ===
                              'Archivé'
                            ? 'warning'
                            : displayStatusReport(report?.status as string) ===
                              'Refusé'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        <span
                          className={
                            displayStatusReport(report?.status as string) ===
                            'Validé'
                              ? 'text-success'
                              : displayStatusReport(
                                  report?.status as string
                                ) === 'Archivé'
                              ? 'text-warning'
                              : displayStatusReport(
                                  report?.status as string
                                ) === 'Refusé'
                              ? 'text-white'
                              : 'text-dark'
                          }
                        >
                          {displayStatusReport(report?.status as string) ===
                          'Validé'
                            ? '✅ Validé'
                            : displayStatusReport(report?.status as string) ===
                              'Archivé'
                            ? '📦 Archivé'
                            : displayStatusReport(report?.status as string) ===
                              'Refusé'
                            ? '❌ Rejeté'
                            : '🕐 En attente'}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {report.createdBy?.firstName +
                        ' ' +
                        report.createdBy?.lastName}
                    </TableCell>
                    <TableCell>
                      {typeof report.validateBy === 'object'
                        ? report.validateBy?.firstName +
                          ' ' +
                          report.validateBy?.lastName
                        : report.validateBy}
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt as string).toLocaleDateString(
                        'fr-FR'
                      )}
                    </TableCell>
                    <TableCell>
                      {helperUserPermission('Rapports', 'read_detail') ? (
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => navigate(`/repport/${report._id}`)}
                          className='hover:bg[#8e2bd9]'
                        >
                          <Eye className='h-4 w-4' />
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

              {/* Empty state */}
              {!isLoading &&
                !isRefetching &&
                (reportsResponse?.data?.length === 0 ||
                  !reportsResponse?.data) && (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8'>
                      <div className='flex flex-col items-center justify-center'>
                      <img src={imgArrayEmpty} alt='empty' className='w-1/4 h-1/2' />
                      <p className='text-gray-500'>Aucun rapport trouvé.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>

          {/* Pagination */}
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
                    size={'sm'}
                    className={
                      Number(reportFilterForm?.page) === 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                    onClick={() =>
                      setReportStore('reportFilterForm', {
                        page: Number(reportFilterForm?.page) - 1,
                      })
                    }
                  />
                </PaginationItem>
                {[...Array(reportsResponse?.metadata?.totalPages)].map(
                  (_, i) => (
                    <PaginationItem key={i + 1}>
                      <Button
                        variant={
                          Number(reportFilterForm?.page) === i + 1
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() =>
                          setReportStore('reportFilterForm', { page: i + 1 })
                        }
                        size='sm'
                      >
                        {i + 1}
                      </Button>
                    </PaginationItem>
                  )
                )}
                {Number(reportsResponse?.metadata?.totalPages) > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    size={'sm'}
                    className={
                      Number(reportFilterForm?.page) ===
                      Number(reportsResponse?.metadata?.totalPages)
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                    onClick={() =>
                      setReportStore('reportFilterForm', {
                        page: Number(reportFilterForm?.page) + 1,
                      })
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className='text-muted-foreground'>
          Vous n'avez pas les permissions pour accéder à la liste des rapports.
        </div>
      )}
    </div>
  );
});

export default RepportsPage;
