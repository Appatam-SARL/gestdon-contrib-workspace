import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { withDashboard } from '@/hoc/withDashboard.tsx';
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Download,
  Eye,
  Filter,
  MapPin,
  Package,
  Search,
  Truck,
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

interface DeliveryRow {
  ref: string;
  date: string;
  client: string;
  livreur: string;
  priseEnCharge: string;
  destination: string;
  montant: number;
  statut: 'en cours' | 'livré' | 'annulé';
}

const recentDeliveries: DeliveryRow[] = [
  {
    ref: 'VAL-2024-001',
    date: '15/03/2024',
    client: 'Kouamé Adjoua',
    livreur: 'Konan K.',
    priseEnCharge: 'Restaurant La Paix, Plateau',
    destination: 'Rue des Jardins, Cocody',
    montant: 15000,
    statut: 'en cours',
  },
  {
    ref: 'VAL-2024-002',
    date: '15/03/2024',
    client: 'Bakayoko Siaka',
    livreur: 'Touré S.',
    priseEnCharge: 'Pharmacie des II Plateaux',
    destination: 'Boulevard Latrille, Deux-Plateaux',
    montant: 8500,
    statut: 'livré',
  },
  {
    ref: 'VAL-2024-003',
    date: '15/03/2024',
    client: 'Diabaté Mariam',
    livreur: 'Koné M.',
    priseEnCharge: 'Marché de Treichville',
    destination: "Avenue Franchet d'Esperey, Plateau",
    montant: 12000,
    statut: 'annulé',
  },
];

// Sample data for Performance Chart
const performanceData = [
  { month: 'Jan', deliveries: 150 },
  { month: 'Feb', deliveries: 200 },
  { month: 'Mar', deliveries: 180 },
  { month: 'Apr', deliveries: 250 },
  { month: 'May', deliveries: 220 },
  { month: 'Jun', deliveries: 280 },
];

// Sample data for Hourly Activity Chart
const hourlyActivityData = [
  { hour: '08h', deliveries: 15 },
  { hour: '09h', deliveries: 25 },
  { hour: '10h', deliveries: 30 },
  { hour: '11h', deliveries: 40 },
  { hour: '12h', deliveries: 35 },
  { hour: '13h', deliveries: 28 },
  { hour: '14h', deliveries: 20 },
  { hour: '15h', deliveries: 22 },
  { hour: '16h', deliveries: 30 },
  { hour: '17h', deliveries: 38 },
  { hour: '18h', deliveries: 45 },
  { hour: '19h', deliveries: 50 },
];

const chartConfig = {
  deliveries: {
    label: 'Nombre de livraisons',
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
            Vue d'ensemble des activités de livraison
          </p>
        </div>
        <div className='flex gap-4'>
          <Button variant='outline' size='sm'>
            <Filter className='h-4 w-4 mr-2' />
            Filtres
          </Button>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Livraisons
            </CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold'>2,345</div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  <ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
                  +20.1% ce mois
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <span className='text-xs font-medium text-green-500'>
                  1,890
                </span>
                <span className='text-xs text-muted-foreground'>Livrées</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Livreurs Actifs
            </CardTitle>
            <Truck className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold'>48</div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  <ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
                  +12 cette semaine
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <span className='text-xs font-medium text-blue-500'>85%</span>
                <span className='text-xs text-muted-foreground'>
                  En tournée
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Temps Moyen</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold'>35 min</div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  <ArrowDownRight className='h-3 w-3 text-green-500 mr-1' />
                  -4.3% ce mois
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <span className='text-xs font-medium text-yellow-500'>
                  40 min
                </span>
                <span className='text-xs text-muted-foreground'>Objectif</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Zone Couverte</CardTitle>
            <MapPin className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold'>45 km²</div>
                <div className='flex items-center text-xs text-muted-foreground'>
                  <ArrowUpRight className='h-3 w-3 text-green-500 mr-1' />
                  +5.2% ce mois
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <span className='text-xs font-medium text-purple-500'>8</span>
                <span className='text-xs text-muted-foreground'>Communes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et Tableaux */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        {/* Graphique principal */}
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Performance des Livraisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] flex items-center justify-center bg-muted/50 rounded-md'>
              <ChartContainer
                config={chartConfig}
                className='min-h-[300px] w-full'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={performanceData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey='month'
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
                      dataKey='deliveries'
                      fill='var(--color-deliveries)'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique secondaire */}
        <Card className='lg:col-span-3'>
          <CardHeader>
            <CardTitle>Activité Horaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px] flex items-center justify-center bg-muted/50 rounded-md'>
              <ChartContainer
                config={chartConfig}
                className='min-h-[300px] w-full'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={hourlyActivityData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='hour' />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='deliveries'
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

      {/* Tableau des livraisons récentes */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Livraisons Récentes</CardTitle>
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
                    Ref
                  </th>
                  <th className='py-3 px-4 text-left text-sm font-medium'>
                    Date
                  </th>
                  <th className='py-3 px-4 text-left text-sm font-medium'>
                    Client
                  </th>
                  <th className='py-3 px-4 text-left text-sm font-medium'>
                    Livreur
                  </th>
                  <th className='py-3 px-4 text-left text-sm font-medium'>
                    Prise en charge
                  </th>
                  <th className='py-3 px-4 text-left text-sm font-medium'>
                    Destination
                  </th>
                  <th className='py-3 px-4 text-left text-sm font-medium'>
                    Montant
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
                {recentDeliveries.map((delivery) => (
                  <tr key={delivery.ref} className='border-b'>
                    <td className='py-3 px-4 text-sm font-medium'>
                      {delivery.ref}
                    </td>
                    <td className='py-3 px-4 text-sm'>{delivery.date}</td>
                    <td className='py-3 px-4 text-sm'>{delivery.client}</td>
                    <td className='py-3 px-4 text-sm'>{delivery.livreur}</td>
                    <td
                      className='py-3 px-4 text-sm max-w-[200px] truncate'
                      title={delivery.priseEnCharge}
                    >
                      {delivery.priseEnCharge}
                    </td>
                    <td
                      className='py-3 px-4 text-sm max-w-[200px] truncate'
                      title={delivery.destination}
                    >
                      {delivery.destination}
                    </td>
                    <td className='py-3 px-4 text-sm'>
                      {delivery.montant.toLocaleString()} FCFA
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          delivery.statut === 'en cours'
                            ? 'bg-yellow-100 text-yellow-700'
                            : delivery.statut === 'livré'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {delivery.statut}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0'
                        onClick={() => {
                          // TODO: Implémenter la vue détaillée
                          console.log('Voir détails:', delivery.ref);
                        }}
                      >
                        <Eye className='h-4 w-4' />
                        <span className='sr-only'>Voir détails</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default Dashboard;
