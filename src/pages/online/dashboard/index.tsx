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
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useGetMouvementCheckouts } from '@/hook/mouvement-checkout.hook';
import { IMouvementCheckout } from '@/interface/activity';
import imgArrayEmpty from '@/assets/img/activityempty.png';
import { IReport } from '@/interface/report';
import useUserStore from '@/store/user.store';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const chartConfig = {
  deliveries: {
    label: 'Nombre',
    color: 'hsl(var(--chart-1))',
  },
};

const CustomizedLabelLineChart = (props: any) => {
  const { x, y, value, stroke } = props;
  if (y == null || x == null) return null;
  return (
    <g>
      <text x={x} y={y - 8} textAnchor='middle' fill={stroke} fontSize={10}>
        {Number(value).toLocaleString('fr-FR')}
      </text>
    </g>
  );
};

const Dashboard = withDashboard(() => {
  const navigate = useNavigate();
  const contributorId = useContributorStore((state) => state.contributor?._id);
  const user = useUserStore((state) => state.user);
  const [selectedFilter, setSelectedFilter] = useState<{
    period: string;
    contributorId: string;
  }>({ period: 'month', contributorId: '' }); // Default to month
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const { data: stats, isLoading, refetch } = useDashboard(selectedFilter);
  const {
    data: activitiesByType,
    isLoading: isLoadingActivityByType,
    refetch: refetchActivitiesByType,
  } = useDashboardActivitiesByType(selectedFilter);
  const { refetch: refetchBeneficiaryDistribution } =
    useDashboardBeneficiaryDistribution(selectedFilter);
  const { data: reports, isLoading: isLoadingReports, isRefetching: isRefetchingReports } = useReports({
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

  // Données des mouvements pour le graphique ligne
  const { data: mouvementsData, isLoading: isLoadingMouvementsData, isRefetching: isRefetchingMouvementsData } = useGetMouvementCheckouts({
    contributorId: (contributorId as string) || '',
  });

  const lineChartData = React.useMemo(() => {
    const items: IMouvementCheckout[] = mouvementsData?.data || [];
    const period = selectedFilter.period; // 'day' | 'week' | 'month' | 'year'
    const now = new Date();

    type Bucket = { label: string; keyDate: Date; incomes: number; expenses: number };
    const buckets: Bucket[] = [];

    const seedDay = () => {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      for (let h = 0; h < 24; h++) {
        const d = new Date(start);
        d.setHours(h);
        buckets.push({ label: `${h.toString().padStart(2, '0')}h`, keyDate: d, incomes: 0, expenses: 0 });
      }
      return { start, end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59) };
    };
    const seedWeek = () => {
      const day = now.getDay() || 7; // Lundi=1
      const monday = new Date(now);
      monday.setDate(now.getDate() - (day - 1));
      monday.setHours(0, 0, 0, 0);
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        buckets.push({ label: d.toLocaleDateString('fr-FR', { weekday: 'short' }), keyDate: d, incomes: 0, expenses: 0 });
      }
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      return { start: monday, end: sunday };
    };
    const seedMonth = () => {
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      for (let d = 1; d <= end.getDate(); d++) {
        const dt = new Date(now.getFullYear(), now.getMonth(), d);
        buckets.push({ label: d.toString().padStart(2, '0'), keyDate: dt, incomes: 0, expenses: 0 });
      }
      return { start, end };
    };
    const seedYear = () => {
      const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      for (let m = 0; m < 12; m++) {
        const dt = new Date(now.getFullYear(), m, 1);
        buckets.push({ label: dt.toLocaleDateString('fr-FR', { month: 'short' }), keyDate: dt, incomes: 0, expenses: 0 });
      }
      return { start, end };
    };

    let range: { start: Date; end: Date };
    if (period === 'day') range = seedDay();
    else if (period === 'week') range = seedWeek();
    else if (period === 'month') range = seedMonth();
    else range = seedYear();

    const isIncome = (m: IMouvementCheckout) => {
      const label = typeof m.typeMouvementCheckout === 'object' ? m.typeMouvementCheckout.name : m.typeMouvementCheckout;
      return (label || '').toLowerCase().includes('recette') || (label || '').toLowerCase().includes('income');
    };

    items.forEach(m => {
      const d = new Date(m.createdAt);
      if (d < range.start || d > range.end) return;
      let idx = -1;
      if (period === 'day') {
        idx = d.getHours();
      } else if (period === 'week' || period === 'month') {
        idx = buckets.findIndex(b => b.keyDate.getFullYear() === d.getFullYear() && b.keyDate.getMonth() === d.getMonth() && b.keyDate.getDate() === d.getDate());
      } else {
        idx = d.getMonth();
      }
      if (idx >= 0) {
        if (isIncome(m)) buckets[idx].incomes += m.amount || 0; else buckets[idx].expenses += m.amount || 0;
      }
    });

    return buckets;
  }, [mouvementsData, selectedFilter.period]);

  React.useEffect(() => {
    if (!contributorId) return;
    setSelectedFilter({
      ...selectedFilter,
      contributorId: contributorId as string,
    });
  }, [contributorId]);

  React.useEffect(() => {
    if (user?.isFirstLogin) {
      setIsFirstLogin(true);
    }
  }, [user]);

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
                  {beneficiaries?.data.length === 0 ? (
                    <div className='flex flex-col items-center justify-center'>
                      <img src={imgArrayEmpty} alt='empty' className='w-full h-full object-cover' />
                      <p className='text-gray-500'>Aucun bénéficiaire trouvé.</p>
                    </div>
                  ) : (
                    beneficiaries?.data.map((beneficiary: IBeneficiaire) => (
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
                  )))}
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

      {/* Statistiques des mouvements de caisse */}
      {isLoadingMouvementsData || isRefetchingMouvementsData ? (
        <div className='h-[320px]'>
          <Skeleton className='h-[320px] w-full' count={1} />
        </div>
      ) : (
      <Card>
        <CardHeader className='flex items-center justify-between flex-row space-y-0'>
          <CardTitle>Statistiques des mouvements de caisse</CardTitle>
          <div className='text-sm text-muted-foreground'>
            Période: {selectedFilter.period === 'day' ? 'Jour' : selectedFilter.period === 'week' ? 'Semaine' : selectedFilter.period === 'month' ? 'Mois' : 'Année'}
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-[320px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={lineChartData} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='label' tickMargin={8} />
                <YAxis tickFormatter={(v: number) => `${v.toLocaleString('fr-FR')}`} width={80} />
                <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString('fr-FR')} FCFA`, '']} />
                <Legend />
                <Line type='monotone' dataKey='incomes' name='Recettes' stroke='#059669' strokeWidth={2} dot={{ r: 3 }} label={<CustomizedLabelLineChart stroke='#059669' />} />
                <Line type='monotone' dataKey='expenses' name='Dépenses' stroke='#dc2626' strokeWidth={2} dot={{ r: 3 }} label={<CustomizedLabelLineChart stroke='#dc2626' />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </CardContent>
        </Card>
      )}

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
                  {isLoadingReports || isRefetchingReports ? (
                    <tr style={{ height: '100px' }}>
                      <td colSpan={6}>
                        <Skeleton count={1} style={{ height: '100px' }} />
                      </td>
                    </tr>
                  ) : (
                    reports?.data.length === 0 ? (
                      <tr className='border-b'>
                        <td colSpan={6}>
                          <div className='flex flex-col items-center justify-center'>
                            <img src={imgArrayEmpty} alt='empty' className='w-1/4 h-1/2' />
                          <p className='text-gray-500'>Aucun rapport trouvé.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports?.data.map((report: IReport) => (
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
                  ))}
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

      {/* Modal de bienvenue pour la première connexion */}
      {isFirstLogin && (
        <Dialog
          open={isFirstLogin}
          onOpenChange={setIsFirstLogin}
        >
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icône de bienvenue */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              {/* Titre principal */}
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-bold text-foreground">
                  Bienvenue sur GestDon ! 🎉
                </DialogTitle>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Votre espace de gestion de dons est maintenant prêt à l'emploi.
                </p>
              </div>

              {/* Contenu informatif */}
              <div className="space-y-4 w-full">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      Explorez votre tableau de bord
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Gérez vos dons, bénéficiaires et rapports en toute simplicité
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      Collaborez avec votre équipe
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Invitez des membres de votre staff pour une gestion collaborative
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => setIsFirstLogin(false)}
                  className="flex-1"
                >
                  Commencer maintenant
                </Button>
                <Button
                  onClick={() => {
                    setIsFirstLogin(false);
                    navigate('/staff/create');
                  }}
                  className="flex-1"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Inviter du staff
                </Button>
              </div>

              {/* Note informative */}
              <p className="text-xs text-muted-foreground">
                Vous pourrez toujours accéder à ces fonctionnalités depuis votre tableau de bord
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
});

export default Dashboard;
