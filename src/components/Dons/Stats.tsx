import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IDonFilterForm } from '@/interface/don';
import { Banknote, Clock, EyeIcon } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

export default function StatsDons({
  handleFilterChange,
  data,
  isLoadingStats,
}: {
  data: { Nature: string; Espèces: string };
  isLoadingStats: boolean;
  handleFilterChange(key: keyof IDonFilterForm, value: any): void;
}) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2 my-4'>
      {isLoadingStats ? (
        <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
      ) : (
        <Card className='p-4 rounded-md hover:bg-primary group'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium group-hover:text-white'>
              Totale don par nature
            </CardTitle>
            <Banknote className='h-4 w-4 text-orange-500 group-hover:text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold group-hover:text-white'>
                  {data['Nature']}
                </div>
                <div className='flex items-center text-xs group-hover:text-white'>
                  <Clock className='h-3 w-3 mr-1 text-orange-500 group-hover:text-white' />
                  Tous
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <Button
                  variant='outline'
                  size='sm'
                  className='group-hover:text-white'
                  onClick={() => handleFilterChange('type', 'Nature')}
                >
                  <Banknote className='h-4 w-4 group-hover:text-foreground' />
                  <span className='group-hover:text-foreground'>Voir plus</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {isLoadingStats ? (
        <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
      ) : (
        <Card className='p-4 rounded-md hover:bg-primary group'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium group-hover:text-white'>
              Totale don en espèces
            </CardTitle>
            <Banknote className='h-4 w-4 text-gray-500 group-hover:text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold group-hover:text-white'>
                  {data['Espèces']}
                </div>
                <div className='flex items-center text-xs group-hover:text-white'>
                  <Banknote className='h-3 w-3 mr-1 group-hover:text-white' />
                  Tous
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <Button
                  variant='outline'
                  size='sm'
                  className='group-hover:text-white'
                  onClick={() => handleFilterChange('type', 'Espèces')}
                >
                  <EyeIcon className='h-4 w-4 group-hover:text-foreground' />
                  <span className='group-hover:text-foreground'>Voir plus</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
