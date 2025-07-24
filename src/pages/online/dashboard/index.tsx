import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { withDashboard } from '@/hoc/withDashboard.tsx';
import { useBeneficiaries } from '@/hook/beneficiaire.hook';
import {
  useDashboard,
  useDashboardActivitiesByType,
  useDashboardBeneficiaryDistribution,
} from '@/hook/dashboard.hook';
import { useReports } from '@/hook/report.hook';
import { IBeneficiaire } from '@/interface/beneficiaire';
import { IReport } from '@/interface/report';
import useContributorStore from '@/store/contributor.store';
import { helperUserPermission } from '@/utils';
import { displayStatusReport } from '@/utils/display-of-variable';
import {
  Activity,
  ArrowUpRight,
  Calendar,
  Eye,
  Filter,
  Heart,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const chartConfig = {
  deliveries: {
    label: 'Nombre',
    color: 'hsl(var(--chart-1))',
  },
};

const Dashboard = withDashboard(() => {
  const navigate = useNavigate();
  const contributorId = useContributorStore((state) => state.contributor?._id);
  const [selectedFilter, setSelectedFilter] = useState<{
    period: string;
    contributorId: string;
  }>({ period: 'month', contributorId: '' }); // Default to month
  const { data: stats, isLoading, refetch } = useDashboard(selectedFilter);
  const {
    data: activitiesByType,
    isLoading: isLoadingActivityByType,
    refetch: refetchActivitiesByType,
  } = useDashboardActivitiesByType(selectedFilter);
  const {
    data: beneficiaryDistribution,
    refetch: refetchBeneficiaryDistribution,
  } = useDashboardBeneficiaryDistribution(selectedFilter);
  const { data: reports, isLoading: isLoadingReports } = useReports({
    contributorId: contributorId,
    limit: 15,
    page: 1,
  });
  const { data: beneficiaries, isLoading: isLoadingBeneficiary } =
    useBeneficiaries({
      limit: 6,
      page: 1,
      contributorId: contributorId,
    });

  React.useEffect(() => {
    if (!contributorId) return;
    setSelectedFilter({
      ...selectedFilter,
      contributorId: contributorId as string,
    });
  }, [contributorId]);

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter({ ...selectedFilter, period: filter });
    refetch();
    refetchActivitiesByType();
    refetchBeneficiaryDistribution();
  };

  console.log(contributorId);
  console.log(selectedFilter);

  return (
    <div className='space-y-6'>
      {/* En-tête */}
      <div className='flex justify-between items-center'>
        <div>
          <h4 className='text-3xl font-bold'>Tableau de bord</h4>
          <p className='text-muted-foreground'>
            Vue d'ensemble des activités et statistiques
          </p>
        </div>
        <div className='flex gap-4'>
          {helperUserPermission('dashboard', 'filter') && (
            <DropdownMenu>
              <DropdownMenuTrigger className='flex items-center gap-2'>
                <Filter className='h-4 w-4 mr-2' />
                Filtres
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  textValue='day'
                  onClick={() => handleFilterSelect('day')}
                >
                  Jours
                </DropdownMenuItem>
                <DropdownMenuItem
                  textValue='week'
                  onClick={() => handleFilterSelect('week')}
                >
                  Semaines
                </DropdownMenuItem>
                <DropdownMenuItem
                  textValue='month'
                  onClick={() => handleFilterSelect('month')}
                >
                  Mois
                </DropdownMenuItem>
                <DropdownMenuItem
                  textValue='year'
                  onClick={() => handleFilterSelect('year')}
                >
                  Année
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Statistiques principales */}
      {helperUserPermission('dashboard', 'read_stats') && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {isLoading ? (
            <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
          ) : (
            <Card className=' bg-green-500 p-4 rounded-md hover:bg-green-300 hover:text-white'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Équipe Totale
                </CardTitle>
                <Users className='h-4 w-4 text-white hover:text-white' />
              </CardHeader>
              <CardContent>
                <div className='flex items-center'>
                  <div className='flex-1'>
                    <div className='text-2xl font-bold text-white'>
                      {stats?.data?.totalStaff}
                    </div>
                    <div className='flex items-center text-xs text-white'>
                      <ArrowUpRight className='h-3 w-3 text-white mr-1' />
                      +5 ce mois
                    </div>
                  </div>
                  <div className='ml-2 flex flex-col text-right'>
                    <span className='text-xs font-medium text-white hover:text-white'>
                      {stats?.data?.activeStaffPercentage}%
                    </span>
                    <span className='text-xs text-white'>Actifs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
          ) : (
            <Card className='bg-purple-500 text-white'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Activités du Mois
                </CardTitle>
                <Activity className='h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='flex items-center'>
                  <div className='flex-1'>
                    <div className='text-2xl font-bold text-white'>
                      {stats?.data?.monthlyActivities}
                    </div>
                    <div className='flex items-center text-xs'>
                      <ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
                      +15% ce mois
                    </div>
                  </div>
                  <div className='ml-2 flex flex-col text-right'>
                    <span className='text-xs font-medium text-white'>
                      {stats?.data?.monthlyActivityTypes}
                    </span>
                    <span className='text-xs'>Types</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
          ) : (
            <Card className='bg-green-500 text-white'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white'>
                  Bénéficiaires
                </CardTitle>
                <Heart className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='flex items-center'>
                  <div className='flex-1'>
                    <div className='text-2xl font-bold text-white'>
                      {stats?.data?.totalBeneficiaries}
                    </div>
                    <div className='flex items-center text-xs text-white'>
                      <ArrowUpRight className='h-3 w-3 text-white mr-1' />
                      +25 ce mois
                    </div>
                  </div>
                  <div className='ml-2 flex flex-col text-right'>
                    <span className='text-xs font-medium text-white'>
                      {stats?.data?.beneficiaryCategories}
                    </span>
                    <span className='text-xs text-white'>Catégories</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
          ) : (
            <Card className='bg-orange-500 text-white'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Événements à Venir
                </CardTitle>
                <Calendar className='h-4 w-4 text-white' />
              </CardHeader>
              <CardContent>
                <div className='flex items-center'>
                  <div className='flex-1'>
                    <div className='text-2xl font-bold text-white'>
                      {stats?.data?.upcomingEvents}
                    </div>
                    <div className='flex items-center text-xs text-white'>
                      <ArrowUpRight className='h-3 w-3 text-white mr-1' />
                      +3 cette semaine
                    </div>
                  </div>
                  <div className='ml-2 flex flex-col text-right'>
                    <span className='text-xs font-medium text-white'>
                      {stats?.data?.upcomingEventsThisWeek}
                    </span>
                    <span className='text-xs text-white'>Cette semaine</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Graphiques et Tableaux */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        {/* Graphique des activités */}
        {helperUserPermission('dashboard', 'read_activity_graph') ? (
          <>
            {isLoadingActivityByType ? (
              <div className='lg:col-span-4'>
                <Skeleton className='h-[400px] w-full' count={1} />
              </div>
            ) : (
              <Card className='lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Activités par Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-center bg-muted/50 rounded-md'>
                    <ChartContainer
                      config={chartConfig}
                      className='min-h-[300px] w-full'
                    >
                      <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={activitiesByType?.data}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey='type'
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <YAxis
                            stroke='#888888'
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: any) => `${value}`}
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar
                            dataKey='count'
                            className='bg-green-600'
                            fill='oklch(0.6 0.118 184.704)'
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className='col-span-4 text-muted-foreground'>
            Vous n'avez pas les permissions pour accéder aux activités.
          </div>
        )}

        {/* Graphique des bénéficiaires */}
        {helperUserPermission('dashboard', 'read_beneficiaries') ? (
          <>
            {isLoadingBeneficiary ? (
              <div className='lg:col-span-3'>
                <Skeleton className='h-[400px] w-full' count={1} />
              </div>
            ) : (
              <Card className='lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Liste des Bénéficiaires</CardTitle>
                </CardHeader>
                <CardContent>
                  {beneficiaries?.data.map((beneficiary: IBeneficiaire) => (
                    <div
                      key={beneficiary._id}
                      className='group flex items-center gap-4 mb-4 rounded-lg bg-white dark:bg-muted/60 transition-all duration-300 shadow-sm hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-950 hover:scale-[1.025] cursor-pointer relative overflow-hidden'
                    >
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center gap-2'>
                          <div className='relative'>
                            <Avatar className='transition-transform duration-300 group-hover:scale-110 group-hover:ring-2 group-hover:ring-blue-400'>
                              <AvatarImage src={''} />
                              <AvatarFallback>
                                {beneficiary.fullName.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            {/* Action icon appears on hover */}
                            <button
                              className='absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-2 transition-all duration-300 bg-blue-500 text-white rounded-full p-1 shadow-lg z-10'
                              title='Voir le profil'
                              onClick={() => {
                                /* TODO: navigate to profile or show modal */
                                navigate(`/community/${beneficiary._id}`);
                              }}
                            >
                              <Eye className='h-4 w-4' />
                            </button>
                          </div>
                          <div className='flex-1'>
                            <div className='font-bold'>
                              {beneficiary.fullName}
                            </div>
                            <div className='flex items-center text-muted-foreground'>
                              <ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
                              {beneficiary.representant[0].firstName +
                                ' ' +
                                beneficiary.representant[0].lastName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className='col-span-3 text-muted-foreground'>
            Vous n'avez pas les permissions pour accéder aux bénéficiaires.
          </div>
        )}
      </div>

      {/* Tableau des rapports récents */}
      {helperUserPermission('dashboard', 'read_reports') ? (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Rapports Récents</CardTitle>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate('/repport')}
              >
                <Eye className='h-4 w-4 mr-2' />
                Voir plus
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b bg-muted/50'>
                    <th className='py-3 px-4 text-left text-sm font-medium'>
                      Type
                    </th>
                    <th className='py-3 px-4 text-left text-sm font-medium'>
                      Date
                    </th>
                    <th className='py-3 px-4 text-left text-sm font-medium'>
                      Responsable
                    </th>
                    <th className='py-3 px-4 text-left text-sm font-medium'>
                      Description
                    </th>
                    <th className='py-3 px-4 text-left text-sm font-medium'>
                      Statut
                    </th>
                    <th className='py-3 px-4 text-left text-sm font-medium'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingReports ? (
                    <tr style={{ height: '100px' }}>
                      <td colSpan={6}>
                        <Skeleton count={1} style={{ height: '100px' }} />
                      </td>
                    </tr>
                  ) : (
                    reports?.data?.map((report: IReport) => (
                      <tr className='border-b' key={report._id}>
                        <td className='py-3 px-4 text-sm font-medium'>
                          {report.entityType === 'ACTIVITY'
                            ? 'ACTIVITE'
                            : report.entityType}
                        </td>
                        <td className='py-3 px-4 text-sm'>
                          {report.createdAt as string}
                        </td>
                        <td className='py-3 px-4 text-sm'>
                          {report?.createdBy?.firstName +
                            ' ' +
                            report?.createdBy?.lastName}
                        </td>
                        <td className='py-3 px-4 text-sm max-w-[200px] truncate'>
                          {report.description}
                        </td>
                        <td className='py-3 px-4'>
                          <Badge
                            variant={
                              displayStatusReport(report?.status as string) ===
                              'Validé'
                                ? 'success'
                                : displayStatusReport(
                                    report?.status as string
                                  ) === 'Archivé'
                                ? 'warning'
                                : displayStatusReport(
                                    report?.status as string
                                  ) === 'Refusé'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            <span
                              className={
                                displayStatusReport(
                                  report?.status as string
                                ) === 'Validé'
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
                                : displayStatusReport(
                                    report?.status as string
                                  ) === 'Archivé'
                                ? '📦 Archivé'
                                : displayStatusReport(
                                    report?.status as string
                                  ) === 'Refusé'
                                ? '❌ Rejeté'
                                : '🕐 En attente'}
                            </span>
                          </Badge>
                        </td>
                        <td className='py-3 px-4'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                            onClick={() => navigate(`/repport/${report._id}`)}
                          >
                            <Eye className='h-4 w-4' />
                            <span className='sr-only'>Voir détails</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='text-muted-foreground'>
          Vous n'avez pas les permissions pour accéder à la liste des rapports.
        </div>
      )}
    </div>
  );
});

export default Dashboard;
