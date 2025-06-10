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
// import { useGetReports } from '@/hook/report.hook'; // Assuming a similar hook exists
// import useReportStore, { INIT_REPORT_FILTER } from '@/store/report.store'; // Assuming a similar store exists
// import { Report, ReportFilter, ReportStore } from '@/types/report'; // Assuming similar types exist
import { Filter, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for reports - replace with actual data fetching logic
const mockReportData = [
  {
    _id: 'r1',
    title: 'Monthly Performance Report',
    status: 'generated',
    generationDate: '2023-11-01T10:00:00Z',
  },
  {
    _id: 'r2',
    title: 'Quarterly Financial Report',
    status: 'pending',
    generationDate: '2023-10-15T12:30:00Z',
  },
  {
    _id: 'r3',
    title: 'Annual Summary Report',
    status: 'failed',
    generationDate: '2023-09-20T15:45:00Z',
  },
];

// Helper function for status badge variant - adapt as needed for report statuses
const getReportStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'generated':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'failed':
      return 'destructive';
    default:
      return 'default';
  }
};

// Helper function for status display layout - adapt as needed for report statuses
const getReportStatusLayout = (status: string) => {
  switch (status) {
    case 'generated':
      return 'Généré';
    case 'pending':
      return 'En attente';
    case 'failed':
      return 'Échoué';
    default:
      return 'Inconnu';
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
                <SelectItem value='generated'>Généré</SelectItem>
                <SelectItem value='pending'>En attente</SelectItem>
                <SelectItem value='failed'>Échoué</SelectItem>
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
  //   const { reportFilter, setReportStore } = useReportStore((s) => s); // Use report store
  //   const { data, isPending, isError, error, refetch, isRefetching } = useGetReports(reportFilter); // Use report hook

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    // Add more filter states as needed
  });

  // const handleFilterChange = (key: keyof ReportFilter, value: any) => {
  //   setFilters((prev) => ({
  //     ...prev.reportFilter, // Adjust according to your store structure
  //     [key]: value,
  //   }));
  //   // setReportStore('reportFilter', filters); // Update the store
  // };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleRowClick = (reportId: string) => {
    // Navigate to report details page - adjust the route as needed
    navigate(`/rapports/${reportId}`);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Rapports</h1>
          <p className='text-muted-foreground'>Gestion des rapports</p>
        </div>
        {/* Add button for adding new report if needed */}
        {/* <Button>Générer un rapport</Button> */}
      </div>

      <Card className='p-4'>
        <div className='flex gap-4'>
          <Input
            className='flex-1'
            placeholder='Rechercher un rapport par titre...' // Adjust placeholder
            value={searchQuery}
            onChange={(e) => {
              const searchValue = e.target.value;
              setSearchQuery(searchValue);
              if (searchValue.length >= 3 || searchValue.length === 0) {
                // Update report filter in store
                // setReportStore('reportFilter', {
                //   ...filters,
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
              // Reset report filter and refetch data
              // setReportStore('reportFilter', INIT_REPORT_FILTER);
              // refetch();
              // setSearchQuery('');
              // setFilters(INIT_REPORT_FILTER);
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
        onFilterChange={(key: string, value: {}) => {
          // Update report store with filter changes
          // setReportStore(
          //   key as keyof ReportStore,
          //   value as ReportStore[keyof ReportStore]
          // );
          // setFilters(value as ReportFilter);
        }}
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre du rapport</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de génération</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loading state */}
            {/* {isPending || isRefetching ? ( */}
            {/* <TableRow className='p-8'>
                <TableCell colSpan={4}>
                  <Skeleton
                    count={1}
                    width='100%'
                    height={300}
                    style={{ width: '100%' }}
                  />
                </TableCell>
              </TableRow> */}
            {/* ) : ( */}
            {
              mockReportData.map((report) => (
                <TableRow
                  key={report._id}
                  onClick={() => handleRowClick(report._id)}
                  className='cursor-pointer hover:bg-gray-100'
                >
                  <TableCell className='font-medium'>{report.title}</TableCell>
                  <TableCell>
                    <Badge variant={getReportStatusBadgeVariant(report.status)}>
                      {getReportStatusLayout(report.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(report.generationDate).toLocaleDateString(
                      'fr-FR'
                    )}
                  </TableCell>
                  <TableCell>
                    {/* Add action buttons here if needed, e.g., view details, download, delete */}
                  </TableCell>
                </TableRow>
              ))
              /* )} */
            }

            {/* Empty state */}
            {/* {!isPending &&
              !isRefetching &&
              (data?.reports?.length === 0 || !data?.reports) && ( */}
            {/* <TableRow>
                  <TableCell colSpan={4} className='text-center py-8'>
                    Aucun rapport trouvé.
                  </TableCell>
                </TableRow> */}
            {/* )} */}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className='p-4 border-t'>
          <p className='text-sm text-muted-foreground'>
            La pagination sera implémentée ici en fonction de la structure des
            données des rapports.
          </p>
        </div>
      </Card>
    </div>
  );
});

export default RepportsPage;
