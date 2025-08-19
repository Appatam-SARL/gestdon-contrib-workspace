import Stats from '@/components/online/Activity/Stats';
import { Badge } from '@/components/ui/badge';
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
import { useGetActivityType } from '@/hook/activity-type.hook';
import { useGetActivities, useGetActivityStats } from '@/hook/activity.hook';
import { usePackagePermissions } from '@/hook/packagePermissions.hook';
import { IActivity, IActivityFilterForm } from '@/interface/activity';
import useContributorStore from '@/store/contributor.store';
import useUserStore from '@/store/user.store';
import { helperUserPermission } from '@/utils';
import { displayStatusActivity } from '@/utils/display-of-variable';
import {
  Activity,
  AlertTriangle,
  Edit,
  EyeIcon,
  Filter,
  Grid,
  List,
  PencilIcon,
  RefreshCcw,
  Search,
  Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FilterActivityModal from './FilterActivityModal';

const ActivityPage = withDashboard(() => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activityType = searchParams.get('type');
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const { user } = useUserStore((s) => s);

  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isActivityLimitAlertOpen, setIsActivityLimitAlertOpen] =
    useState(false);

  const [filters, setFilters] = useState<IActivityFilterForm>({
    search: '',
    status: '',
    contributorId: '',
    activityTypeId: '',
    page: 1,
    limit: 10,
    period: {
      from: '',
      to: '',
    },
  });

  const { data, isLoading, isError, refetch } = useGetActivities(filters);
  const { data: stats, isLoading: isLoadingStats } = useGetActivityStats(
    contributorId as string
  );
  const { data: activityTypes, isLoading: isLoadingActivityTypes } =
    useGetActivityType({
      contributorId: contributorId as string,
      activityTypeId: activityType as string,
    });
  // find type activity
  const typeActivityLabel = activityTypes?.data.find(
    (typeActivity) => (typeActivity._id as string) === activityType?.toString()
  )?.label;

  const activities = data?.data || [];
  const totalPages = data?.metadata?.totalPages || 1;

  // Limites d'activités via package
  const {
    hasReachedActivityLimit,
    getActivityLimit,
    getRemainingActivitiesCount,
  } = usePackagePermissions();
  const currentActivityCount = data?.totalData || 0;
  const activityLimit = getActivityLimit();
  const activityLimitReached = hasReachedActivityLimit(currentActivityCount);
  const remainingActivities = getRemainingActivitiesCount(currentActivityCount);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: currentPage,
      contributorId,
      activityTypeId: activityType ? activityType : undefined,
    }));
  }, [currentPage, contributorId, activityType]);

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
      contributorId,
      activityTypeId: undefined,
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

  if (isError) {
    return <div>Error loading activities.</div>;
  }

  return (
    <div className=''>
      {/* En-tête */}
      <div className='flex items-start justify-between  mt-4'>
        <div>
          <h4 className='text-3xl font-bold bg-yellow-100 text-white px-2.5 py-1 rounded-md'>
            {typeActivityLabel
              ? `Activités de type ${typeActivityLabel}`
              : 'Activités'}
          </h4>
          <p className='text-muted-foreground'>
            Gestion des activités de l'espace administrateur
          </p>

          {activityLimit && activityLimit > 0 && (
            <div className='mt-3 flex items-center gap-3'>
              <div className='flex items-center gap-2 text-sm'>
                <span className='text-gray-600'>
                  {currentActivityCount} / {activityLimit} activités
                </span>
              </div>
              <div className='w-32 bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activityLimitReached
                      ? 'bg-red-500'
                      : currentActivityCount / activityLimit > 0.8
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      (currentActivityCount / activityLimit) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              {/* Badge d'alerte si proche de la limite */}
              {!activityLimitReached &&
                remainingActivities !== null &&
                remainingActivities <= 2 && (
                  <Badge
                    variant='secondary'
                    className='bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  >
                    <AlertTriangle className='h-3 w-3 mr-1' />
                    {remainingActivities === 1
                      ? '1 activité restante'
                      : `${remainingActivities} activités restantes`}
                  </Badge>
                )}

              {activityLimitReached && (
                <Badge variant='destructive'>
                  <AlertTriangle className='h-3 w-3 mr-1' />
                  Limite atteinte
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className='flex gap-2'>
          {(user?.role === 'AGENT' ||
            user?.role === 'EDITOR' ||
            user?.role === 'MANAGER') &&
            helperUserPermission('Activités', 'create') && (
              <>
                <Button
                  onClick={() => {
                    if (activityLimitReached) {
                      setIsActivityLimitAlertOpen(true);
                      return;
                    }
                    navigate(
                      `/activity/create${
                        activityType ? '?type=' + activityType : ''
                      }`
                    );
                  }}
                  disabled={activityLimitReached}
                  className={
                    activityLimitReached ? 'opacity-50 cursor-not-allowed' : ''
                  }
                >
                  <Activity />
                  <span>Ajouter une activité</span>
                  {activityLimitReached && (
                    <span className='ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full'>
                      Limite atteinte
                    </span>
                  )}
                </Button>
              </>
            )}
        </div>
      </div>

      <Stats
        data={stats?.data}
        isLoadingStats={isLoadingStats}
        handleFilterChange={handleFilterChange}
      />

      <div className='flex gap-4 mb-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='flex-1 pl-10'
            placeholder='Rechercher une activité par titre ou description...'
            value={searchQuery}
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
              <TableHead>Titre</TableHead>
              <TableHead>Type d'activité</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date de debut</TableHead>
              <TableHead>Date de fin</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Skeleton
                    width='100%'
                    style={{
                      height: '300px',
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : Number(data?.data?.length) > 0 ? (
              data?.data?.map((activity: IActivity) => (
                <TableRow key={activity._id}>
                  <TableCell className='font-medium'>
                    {activity.title}
                  </TableCell>
                  <TableCell>
                    {typeof activity.activityTypeId === 'object' ? (
                      <span className='text-sm font-medium bg-destructive text-white px-2 rounded-md'>
                        {activity.activityTypeId.label}
                      </span>
                    ) : (
                      activity.activityTypeId
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        displayStatusActivity(activity.status) === 'Validé'
                          ? 'success'
                          : displayStatusActivity(activity.status) === 'Archivé'
                          ? 'warning'
                          : displayStatusActivity(activity.status) ===
                            'Brouillon'
                          ? 'default'
                          : displayStatusActivity(activity.status) === 'Rejeté'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {displayStatusActivity(activity.status) === 'Validé'
                        ? '✅ Validé'
                        : displayStatusActivity(activity.status) === 'Archivé'
                        ? '📦 Archivé'
                        : displayStatusActivity(activity.status) === 'Brouillon'
                        ? '📝 Brouillon'
                        : displayStatusActivity(activity.status) === 'Rejeté'
                        ? '❌ Rejeté'
                        : '🕐 En attente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {activity.startDate
                      ? new Date(activity.startDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {activity.endDate
                      ? new Date(activity.endDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Link to={`/activity/${activity._id}`}>
                      <Button variant='secondary' size='sm' className='mr-2'>
                        <EyeIcon color='white' />
                      </Button>
                    </Link>
                    {(user?.role === 'MANAGER' || user?.role === 'EDITOR') && (
                      <Link to={`/activity/${activity._id}/edit`}>
                        <Button variant='default' size='sm'>
                          <Edit />
                        </Button>
                      </Link>
                    )}
                    <Button variant='destructive' size='sm' className='ml-2'>
                      <Trash />
                    </Button>
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
              <div
                key={activity._id}
                className='border p-4 mb-2 rounded-md bg-white'
              >
                <h2 className='text-xl font-semibold'>{activity.title}</h2>
                <p>{activity.description}</p>
                <p>
                  Status:{' '}
                  <Badge
                    variant={
                      displayStatusActivity(activity.status) === 'Validé'
                        ? 'success'
                        : displayStatusActivity(activity.status) === 'Rejeté'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {displayStatusActivity(activity.status)}
                  </Badge>
                </p>
                <p>
                  Crée le: {new Date(activity.createdAt).toLocaleDateString()}
                </p>
                <Link to={`/activity/${activity._id}`}>
                  <Button variant='default' className='mt-2'>
                    <EyeIcon />
                    <span>Détail</span>
                  </Button>
                </Link>
                <Link to={`/activity/${activity._id}/edit`}>
                  <Button variant='secondary' className='ml-2 mt-2 text-white'>
                    <PencilIcon />
                    <span>Modifier</span>
                  </Button>
                </Link>
                <Button variant='destructive' className='ml-2 mt-2'>
                  <Trash />
                  <span>Supprimer</span>
                </Button>
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
