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
import { useReports } from '@/hook/report.hook';
import { IReport, IReportFilterForm, tReportStatus } from '@/interface/report';
import useContributorStore from '@/store/contributor.store';
import useReportStore from '@/store/report.store';
import { Eye, Filter, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

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
                onFilterChange('reportFilter', {
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

  const [currentPage, setCurrentPage] = useState(1);
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

  const handleRowClick = (reportId: string) => {
    // Navigate to report details page - adjust the route as needed
    navigate(`/repport/${reportId}`);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Rapports</h1>
          <p className='text-muted-foreground'>Gestion des rapports</p>
        </div>
      </div>

      <Card className='p-4'>
        <div className='flex gap-4'>
          <Input
            className='flex-1'
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
      </Card>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={reportFilterForm}
        onFilterChange={(key, value) =>
          handleFilterChange(key as keyof IReportFilterForm, value)
        }
      />

      <Card>
        <Table>
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
                <TableRow
                  key={report._id}
                  onClick={() => handleRowClick(String(report._id))}
                  className='cursor-pointer hover:bg-gray-100'
                >
                  <TableCell className='font-medium'>{report.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === 'PENDING'
                          ? 'secondary'
                          : report.status === 'VALIDATED'
                          ? 'success'
                          : 'destructive'
                      }
                    >
                      {getReportStatusLayout(report.status as tReportStatus)}
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
                    {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => navigate(`/repport/${report._id}`)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
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
                  <TableCell colSpan={4} className='text-center py-8'>
                    Aucun rapport trouvé.
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
                    size={'sm'}
                    onClick={() =>
                      setCurrentPage(
                        Math.max(
                          Number(reportsResponse?.metadata?.page),
                          currentPage - 1
                        )
                      )
                    }
                  />
                </PaginationItem>
                {[...Array(reportsResponse?.metadata?.totalPages)].map(
                  (_, i) => (
                    <PaginationItem key={i + 1}>
                      <Button
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(i + 1)}
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
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          Number(reportsResponse?.metadata?.page),
                          currentPage + 1
                        )
                      )
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

export default RepportsPage;
