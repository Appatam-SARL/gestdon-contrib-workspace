import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IReportFilterForm, IReportState } from '@/interface/report';
import { Archive, CheckCircle, Clock, EyeIcon } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';

export default function StatsReport({
  handleFilterChange,
  data,
  isLoadingStats,
  isRefetchingStats,
}: {
  data: IReportState;
  isLoadingStats: boolean;
  isRefetchingStats: boolean;
  handleFilterChange(key: keyof IReportFilterForm, value: any): void;
}) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-4'>
      {isLoadingStats || isRefetchingStats ? (
        <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
      ) : (
        <Card className='p-4 rounded-md hover:bg-primary group'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium group-hover:text-white'>
              En attente
            </CardTitle>
            <Clock className='h-4 w-4 text-orange-500 group-hover:text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold group-hover:text-white'>
                  {data?.PENDING}
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
                  onClick={() => handleFilterChange('status', 'PENDING')}
                >
                  <EyeIcon className='h-4 w-4 group-hover:text-foreground' />
                  <span className='group-hover:text-foreground'>Voir plus</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoadingStats || isRefetchingStats ? (
        <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
      ) : (
        <Card className='p-4 rounded-md hover:bg-primary group'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium group-hover:text-white'>
              Validée
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-green-500 group-hover:text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold group-hover:text-white'>
                  {data?.VALIDATED}
                </div>
                <div className='flex items-center text-xs group-hover:text-white'>
                  <CheckCircle className='h-3 w-3 mr-1 text-green-500 group-hover:text-white' />
                  Tous
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <Button
                  variant='outline'
                  size='sm'
                  className='group-hover:text-white'
                  onClick={() => handleFilterChange('status', 'VALIDATED')}
                >
                  <EyeIcon className='h-4 w-4 group-hover:text-foreground' />
                  <span className='group-hover:text-foreground'>Voir plus</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {isLoadingStats || isRefetchingStats ? (
        <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
      ) : (
        <Card className='p-4 rounded-md hover:bg-primary group'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium group-hover:text-white'>
              Archivée
            </CardTitle>
            <Archive className='h-4 w-4 text-slate-500 group-hover:text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold group-hover:text-white'>
                  {data?.ARCHIVED}
                </div>
                <div className='flex items-center text-xs group-hover:text-white'>
                  <Archive className='h-3 w-3 mr-1 group-hover:text-white' />
                  Tous
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <Button
                  variant='outline'
                  size='sm'
                  className='group-hover:text-white'
                  onClick={() => handleFilterChange('status', 'ARCHIVED')}
                >
                  <EyeIcon className='h-4 w-4 group-hover:text-foreground' />
                  <span className='group-hover:text-foreground'>Voir plus</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {isLoadingStats || isRefetchingStats ? (
        <Skeleton className='h-4 w-4' style={{ height: '147px' }} />
      ) : (
        <Card className='p-4 rounded-md hover:bg-primary group'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium group-hover:text-white'>
              Rejetée
            </CardTitle>
            <Archive className='h-4 w-4 text-slate-500 group-hover:text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center'>
              <div className='flex-1'>
                <div className='text-2xl font-bold group-hover:text-white'>
                  {data?.REFUSED}
                </div>
                <div className='flex items-center text-xs group-hover:text-white'>
                  <Archive className='h-3 w-3 mr-1 group-hover:text-white' />
                  Tous
                </div>
              </div>
              <div className='ml-2 flex flex-col text-right'>
                <Button
                  variant='outline'
                  size='sm'
                  className='group-hover:text-white'
                  onClick={() => handleFilterChange('status', 'REFUSED')}
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
