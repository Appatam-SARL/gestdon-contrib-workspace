import ButtonGroupActionActivity from '@/components/online/Activity/ButtonGroupActionActivity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { withDashboard } from '@/hoc/withDashboard';
import { useActivity } from '@/hook/activity.hook';
import { useReports } from '@/hook/report.hook';
import { IActivity } from '@/interface/activity';
import useContributorStore from '@/store/contributor.store';
import { displayStatusActivity } from '@/utils/display-of-variable';
import { Calendar1Icon } from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';

const ActivityDetailsPage = withDashboard(() => {
  const { id } = useParams<{ id: string }>();

  const contributorId = useContributorStore((s) => s.contributor?._id);

  const navigate = useNavigate();
  const [activity, setActivity] = useState<IActivity>();

  const {
    data: activityResponse,
    isLoading,
    isError,
    error,
  } = useActivity(id as string);
  const {
    data: reports,
    isLoading: isLoadingReports,
    isRefetching: isRefetchingReports,
  } = useReports({
    limit: 10,
    page: 1,
    entityType: 'ACTIVITY',
    entityId: id,
    contributorId: contributorId,
  });

  useLayoutEffect(() => {
    if (activityResponse?.data) {
      setActivity(activityResponse.data);
    }
  }, [activityResponse]);

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton height={50} width='100%' />
        <Card>
          <CardHeader>
            <Skeleton height={30} width='60%' />
            <Skeleton height={20} width='80%' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton height={20} width='100%' count={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-red-500'>
        Erreur:{' '}
        {error?.message || `Impossible de charger les détails de l'activité.`}
      </div>
    );
  }

  if (!activity) {
    return <div className='text-muted-foreground'>Activité non trouvée.</div>;
  }

  return (
    <div className='space-y-4 w-full'>
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='text-3xl font-bold'>Détails de l'activité</h4>
          <p className='text-muted-foreground'>
            Informations détaillées de l'activité
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => navigate(`/activity`)} variant={'link'}>
            retour
          </Button>
        </div>
      </div>
      <ButtonGroupActionActivity id={id as string} reports={reports} />
      <Card>
        {reports?.metadata?.total === 1 &&
        reports.data[0].status === 'REFUSED' ? (
          <div className='bg-red-400'>
            <div className='flex items-center justify-center gap-4 p-4'>
              <FaExclamationCircle className='h-6 w-6' />
              <p className='text-sm font-medium'>
                Le rapport cette audience a été refusé par un agent de l'espace
                administrateur. Cliquez sur le bouton voir le rapport pour le
                modifier.
              </p>
            </div>
          </div>
        ) : reports?.metadata?.total === 1 &&
          reports.data[0].status === 'VALIDATED' ? (
          <div className='bg-green-400'>
            <div className='flex items-center justify-center gap-4 p-4'>
              <FaExclamationCircle className='h-6 w-6' />
              <p className='text-sm font-medium'>
                Le rapport cette audience a été validé par un agent de l'espace
                administrateur. Cliquez sur le bouton voir le rapport pour les
                détails.
              </p>
            </div>
          </div>
        ) : reports?.metadata?.total === 1 &&
          reports.data[0].status === 'ARCHIVED' ? (
          <div className='bg-yellow-400'>
            <div className='flex items-center justify-center gap-4 p-4'>
              <FaExclamationCircle className='h-6 w-6' />
              <p className='text-sm font-medium'>
                Le rapport cette audience a été archivé par un agent de l'espace
                administrateur. Cliquez sur le bouton voir le rapport pour les
                détails.
              </p>
            </div>
          </div>
        ) : (
          <div className='bg-gray-200'>
            <div className='flex items-center justify-center gap-4 p-4'>
              <FaExclamationCircle className='h-6 w-6' />
              <p className='text-sm font-medium'>
                Vous n'avez pas encore créer de rapport pour cette audience.
                Cliquez sur le bouton pour en créer un rapport.
              </p>
            </div>
          </div>
        )}
        <CardHeader>
          <CardTitle>{activity.title}</CardTitle>
          <CardDescription>
            Type:{' '}
            <span className='text-sm font-medium bg-destructive text-white px-2 rounded-md'>
              {typeof activity.activityTypeId === 'object'
                ? activity.activityTypeId.label
                : activity.activityTypeId || 'N/A'}
            </span>
            <div className='flex items-center justify-start gap-2 mt-4'>
              <p className='text-sm font-medium'>Statut:</p>
              <Badge
                variant={
                  displayStatusActivity(activity.status) === 'Validé'
                    ? 'success'
                    : displayStatusActivity(activity.status) === 'Archivé'
                    ? 'warning'
                    : displayStatusActivity(activity.status) === 'Brouillon'
                    ? 'default'
                    : displayStatusActivity(activity.status) === 'Rejeté'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                <span
                  className={
                    displayStatusActivity(activity.status) === 'Validé'
                      ? 'text-success'
                      : displayStatusActivity(activity.status) === 'Archivé'
                      ? 'text-warning'
                      : displayStatusActivity(activity.status) === 'Brouillon'
                      ? 'text-default'
                      : displayStatusActivity(activity.status) === 'Rejeté'
                      ? 'text-white'
                      : 'text-dark'
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
                </span>
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {activity.assigneeId && (
            <div>
              <p className='text-sm font-medium'>Assigné à:</p>
              <p>
                {typeof activity.assigneeId === 'object'
                  ? activity.assigneeId.fullName
                  : 'N/A'}
              </p>
            </div>
          )}
          {activity.representative && (
            <div className='space-y-2 border-t pt-4 mt-4'>
              <h3 className='font-semibold'>Informations du représentant</h3>
              <div className='flex justify-start items-center gap-4 border border-grey-400 p-4'>
                <Avatar>
                  <AvatarImage
                    src={'https://github.com/shadcn.png'}
                    alt='avatar'
                  />
                  <AvatarFallback>J</AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-[12px]'>
                    {activity?.representative.firstName}
                  </p>
                  <p className='text-[12px]'>
                    {activity?.representative.lastName}
                  </p>
                  <p className='text-[12px]'>
                    {activity?.representative.email}
                  </p>
                  <p className='text-[12px]'>
                    {activity?.representative.phone}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div>
            <p className='text-sm font-medium text-muted-foreground mb-2.5'>
              Description:
            </p>
            <p className='text-sm text-justify'>{activity.description}</p>
          </div>
          {activity.customFields &&
            Object.entries(activity.customFields).map(([key, value]) => (
              <div key={key} className='flex flex-col justify-start'>
                <p className='text-sm font-medium text-muted-foreground mb-2.5'>
                  {key}:
                </p>
                <p className='text-sm text-justify'>{value}</p>
              </div>
            ))}

          {activity.customFields.size === 0 && (
            <div className='flex items-center justify-start gap-4'>
              <p className='text-sm font-medium text-muted-foreground mb-2.5'>
                Custom Fields:
              </p>
              <p className='text-sm text-justify'>
                {JSON.stringify(activity.customFields)}
              </p>
            </div>
          )}
          {activity.startDate && activity.endDate && (
            <div className='flex items-center justify-start gap-4'>
              <div className='flex-1 border border-amber-400 p-4 flex justify-start items-center gap-8'>
                <div>
                  <Calendar1Icon size={32} />
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-2.5'>
                    Date de début:
                  </p>
                  <p>
                    {activity.startDate
                      ? new Date(activity.startDate).toLocaleDateString('fr-FR')
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex-1 border border-amber-400 p-4 flex justify-start items-center gap-8'>
                <div>
                  <Calendar1Icon size={32} />
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-2.5'>
                    Date de fin:
                  </p>
                  <p>
                    {activity.endDate
                      ? new Date(activity.endDate).toLocaleDateString('fr-FR')
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

export default ActivityDetailsPage;
