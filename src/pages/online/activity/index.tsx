import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { withDashboard } from '@/hoc/withDashboard';
import { useGetActivities } from '@/hook/activity.hook';
import { IActivity, IActivityFilterForm } from '@/interface/activity';
import { Filter, Grid, List, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FilterActivityModal from './FilterActivityModal';

const ActivityPage = withDashboard(() => {
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState<IActivityFilterForm>({
    page: currentPage,
    limit: 10,
    search: '',
    status: undefined,
    entity_id: undefined,
    created_by: undefined,
    activity_type_id: undefined,
  });

  const { data, isLoading, isError, refetch } = useGetActivities(filters);

  const activities = data?.data || [];
  const totalPages = data?.metadata?.totalPages || 1;

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: currentPage,
    }));
  }, [currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 3 || value.length === 0) {
      setFilters((prevFilters) => ({ ...prevFilters, search: value, page: 1 }));
      setCurrentPage(1);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
      page: 1,
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      status: undefined,
      entity_id: undefined,
      created_by: undefined,
      activity_type_id: undefined,
    });
    setSearchQuery('');
    setCurrentPage(1);
    refetch();
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages as number));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  if (isError) {
    return <div>Error loading activities.</div>;
  }

  return (
    <div className='p-4'>
      {/* En-tête */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Activités</h1>
          <p className='text-muted-foreground'>
            Gestion des activités de l'espace administrateur
          </p>
        </div>
        <div className='flex gap-2'>
          <Link to='/activity/create'>
            <Button>Ajouter une activité</Button>
          </Link>
        </div>
      </div>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'></div>
      </div>

      <div className='flex gap-4 mb-4'>
        <Input
          className='flex-1'
          placeholder='Rechercher une activité par titre ou description...'
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button
          variant='outline'
          onClick={() => setIsFilterModalOpen(true)}
          className='relative'
        >
          <Filter className='h-4 w-4 mr-2' />
          Filtres
        </Button>
        <Button variant='outline' onClick={handleClearFilters}>
          <RefreshCcw className='h-4 w-4 mr-2' />
          Actualiser
        </Button>
        <ToggleGroup
          type='single'
          value={layout}
          onValueChange={(value: 'table' | 'grid') => value && setLayout(value)}
          aria-label='Toggle layout'
        >
          <ToggleGroupItem value='table' aria-label='Table view'>
            <List className='h-4 w-4' />
          </ToggleGroupItem>
          <ToggleGroupItem value='grid' aria-label='Grid view'>
            <Grid className='h-4 w-4' />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {layout === 'table' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length > 0 ? (
              activities.map((activity: IActivity) => (
                <TableRow key={activity.id}>
                  <TableCell className='font-medium'>
                    {activity.Title}
                  </TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>{activity.status}</TableCell>
                  <TableCell>
                    {new Date(activity.CreatedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Link to={`/activity/${activity.id}/edit`}>
                      <Button variant='outline' size='sm'>
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  No activities found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {activities.length > 0 ? (
            activities.map((activity: IActivity) => (
              <div key={activity.id} className='border p-4 mb-2 rounded-md'>
                <h2 className='text-xl font-semibold'>{activity.Title}</h2>
                <p>{activity.description}</p>
                <p>Status: {activity.status}</p>
                <p>
                  Created Date:{' '}
                  {new Date(activity.CreatedDate).toLocaleDateString()}
                </p>
                <Link to={`/activity/${activity.id}/edit`}>
                  <Button variant='outline' className='mt-2'>
                    Edit
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div>No activities found.</div>
          )}
        </div>
      )}

      <div className='mt-4'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                size='sm'
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href='#'
                  isActive={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                  size='sm'
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                size='sm'
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <FilterActivityModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
});

export default ActivityPage;
