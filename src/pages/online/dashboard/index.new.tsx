// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
// import { withDashboard } from '@/hoc/withDashboard.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { withDashboard } from '@/hoc/withDashboard';
import {
  Activity,
  ArrowUpRight,
  Calendar,
  Eye,
  Filter,
  Heart,
  Search,
  Users,
} from 'lucide-react';
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

// Sample data for Staff Overview
const staffData = [
  { role: 'Administrateurs', count: 5 },
  { role: 'Coordinateurs', count: 12 },
  { role: 'Bénévoles', count: 45 },
  { role: 'Support', count: 8 },
];

// Sample data for Activities Overview
const activitiesData = [
  { type: 'Dons', count: 150 },
  { type: 'Promesses', count: 75 },
  { type: 'Audiences', count: 45 },
  { type: 'Événements', count: 30 },
];

// Sample data for Beneficiaries Overview
const beneficiariesData = [
  { category: 'Enfants', count: 120 },
  { category: 'Familles', count: 85 },
  { category: 'Communautés', count: 15 },
];

const chartConfig = {
  deliveries: {
    label: 'Nombre',
    color: 'hsl(var(--chart-1))',
  },
};

const Dashboard = withDashboard(() => {
  return (
    <div className='space-y-6'>
      {/* En-tête */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Tableau de bord</h1>
          <p className='text-muted-foreground'>
            Vue d'ensemble des activités et statistiques
          </p>
        </div>
        <div className='flex gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-2'>
              <Filter className='h-4 w-4 mr-2' />
              Filtres
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem textValue='day'>Jours</DropdownMenuItem>
              <DropdownMenuItem textValue='week'>Semaines</DropdownMenuItem>
              <DropdownMenuItem textValue='month'>Mois</DropdownMenuItem>=
              <DropdownMenuItem textValue='year'>Année</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Équipe Totale</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold'>70</div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  <ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
                  +5 ce mois
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <span className='text-xs font-medium text-blue-500'>85%</span>
                <span className='text-xs text-muted-foreground'>Actifs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Activités du Mois
            </CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold'>300</div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  <ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
                  +15% ce mois
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <span className='text-xs font-medium text-purple-500'>4</span>
                <span className='text-xs text-muted-foreground'>Types</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Bénéficiaires</CardTitle>
            <Heart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold'>220</div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  <ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
                  +25 ce mois
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <span className='text-xs font-medium text-green-500'>3</span>
                <span className='text-xs text-muted-foreground'>
                  Catégories
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Événements à Venir
            </CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold'>12</div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  <ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
                  +3 cette semaine
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <span className='text-xs font-medium text-orange-500'>5</span>
                <span className='text-xs text-muted-foreground'>
                  Cette semaine
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et Tableaux */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        {/* Graphique des activités */}
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Activités par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] flex items-center justify-center bg-muted/50 rounded-md'>
              <ChartContainer
                config={chartConfig}
                className='min-h-[300px] w-full'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={activitiesData}>
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
                      fill='var(--color-deliveries)'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique des bénéficiaires */}
        <Card className='lg:col-span-3'>
          <CardHeader>
            <CardTitle>Répartition des Bénéficiaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] flex items-center justify-center bg-muted/50 rounded-md'>
              <ChartContainer
                config={chartConfig}
                className='min-h-[300px] w-full'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={beneficiariesData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='category' />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='count'
                      stroke='#8884d8'
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des rapports récents */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Rapports Récents</CardTitle>
          <div className='flex items-center space-x-2'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <input
                type='search'
                placeholder='Rechercher...'
                className='pl-8 h-9 w-[150px] lg:w-[250px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              />
            </div>
            <Button variant='outline' size='sm'>
              <Filter className='h-4 w-4 mr-2' />
              Filtrer
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
                <tr className='border-b'>
                  <td className='py-3 px-4 text-sm font-medium'>Don</td>
                  <td className='py-3 px-4 text-sm'>15/03/2024</td>
                  <td className='py-3 px-4 text-sm'>Jean Dupont</td>
                  <td className='py-3 px-4 text-sm max-w-[200px] truncate'>
                    Don de matériel scolaire
                  </td>
                  <td className='py-3 px-4'>
                    <span className='inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700'>
                      Complété
                    </span>
                  </td>
                  <td className='py-3 px-4'>
                    <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                      <Eye className='h-4 w-4' />
                      <span className='sr-only'>Voir détails</span>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default Dashboard;
