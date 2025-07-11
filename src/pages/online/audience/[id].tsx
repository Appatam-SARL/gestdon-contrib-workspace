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
import { useAudience } from '@/hook/audience.hook';
import { useReports } from '@/hook/report.hook';
import { IReport } from '@/interface/report';
import useContributorStore from '@/store/contributor.store';
import { displayStatusAudience } from '@/utils/display-of-variable';
import { Calendar1Icon, Eye, MapPin } from 'lucide-react';
import { FaExclamationCircle } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import MenuButtonAction from './components/MenuButtonAction';

export const AudienceDetailsPage = withDashboard(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const contributorId = useContributorStore(
    (s) => s.contributor?._id as string
  );
  const {
    data: reports,
    isLoading: isLoadingReports,
    isRefetching: isRefetchingReports,
  } = useReports({
    limit: 10,
    page: 1,
    entityType: 'AUDIENCE',
    entityId: id,
    contributorId: contributorId,
  });

  // hook de récupération de l'audience
  const {
    data: audienceResponse,
    isLoading,
    isError,
    error,
  } = useAudience(id as string);

  const audience = audienceResponse?.data;

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
        {error?.message || `Impossible de charger les détails de l\'audience.`}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='text-3xl font-bold'>Détails de l'audience</h4>
          <p className='text-muted-foreground'>
            Informations détaillées de l'audience
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => navigate(`/audiences`)} variant={'link'}>
            retour
          </Button>
        </div>
      </div>

      <MenuButtonAction
        id={id as string}
        reports={
          reports as {
            success?: boolean;
            data: IReport[];
            message?: string;
            metadata?: {
              total: Number;
              page: Number;
              limit: Number;
              totalPages: Number;
              hasNextPage: Boolean;
              hasPrevPage: Boolean;
            };
          }
        }
      />

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
          <CardTitle>{audience?.title}</CardTitle>
          <CardDescription>
            <div className='flex items-center gap-2'>
              <MapPin />
              <p>Lieu de l'audience : {audience?.locationOfActivity}</p>
            </div>

            <div>
              <p className='text-sm font-medium'>Status:</p>
              <Badge
                variant={
                  displayStatusAudience(audience?.status as string) === 'Validé'
                    ? 'success'
                    : displayStatusAudience(audience?.status as string) ===
                      'Archivé'
                    ? 'warning'
                    : displayStatusAudience(audience?.status as string) ===
                      'Brouillon'
                    ? 'default'
                    : displayStatusAudience(audience?.status as string) ===
                      'Refusé'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                <span
                  className={
                    displayStatusAudience(audience?.status as string) ===
                    'Validé'
                      ? 'text-success'
                      : displayStatusAudience(audience?.status as string) ===
                        'Archivé'
                      ? 'text-warning'
                      : displayStatusAudience(audience?.status as string) ===
                        'Brouillon'
                      ? 'text-default'
                      : displayStatusAudience(audience?.status as string) ===
                        'Refusé'
                      ? 'text-white'
                      : 'text-dark'
                  }
                >
                  {displayStatusAudience(audience?.status as string) ===
                  'Validé'
                    ? '✅ Validé'
                    : displayStatusAudience(audience?.status as string) ===
                      'Archivé'
                    ? '📦 Archivé'
                    : displayStatusAudience(audience?.status as string) ===
                      'Brouillon'
                    ? '📝 Brouillon'
                    : displayStatusAudience(audience?.status as string) ===
                      'Refusé'
                    ? '❌ Rejeté'
                    : '🕐 En attente'}
                </span>
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {audience?.assigneeId && (
            <div>
              <p className='text-sm font-medium'>Assigné à:</p>
              <p>
                {typeof audience?.assigneeId === 'object'
                  ? audience?.assigneeId.fullName
                  : 'N/A'}
              </p>
            </div>
          )}
          {audience?.representative && (
            <div className='space-y-2 border-t pt-4 mt-4'>
              <h3 className='font-semibold'>Informations du représentant</h3>
              <div className='flex justify-start items-center gap-4 border border-grey-400 p-4'>
                <Avatar>
                  <AvatarImage
                    // src={'https://github.com/shadcn.png'}
                    alt='avatar'
                  />
                  <AvatarFallback>J</AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-[12px]'>
                    {audience?.representative.firstName}
                  </p>
                  <p className='text-[12px]'>
                    {audience?.representative.lastName}
                  </p>
                  <p className='text-[12px]'>
                    {audience?.representative.email}
                  </p>
                  <p className='text-[12px]'>
                    {audience?.representative.phone}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className='space-y-2 border-t pt-4 mt-4'>
            <h3 className='font-semibold'>Informations du bénéficiaire</h3>
            <div className='flex flex-col justify-start gap-4 border border-grey-400 p-4'>
              <div>
                <p className='text-[16px] font-medium'>
                  {typeof audience?.beneficiaryId === 'object' &&
                    audience?.beneficiaryId.fullName}
                </p>
                <div className='flex items-center'>
                  {typeof audience?.beneficiaryId === 'object' &&
                    audience?.beneficiaryId.representant.map((rep) => (
                      <>
                        <Avatar>
                          <AvatarImage alt='avatar' />
                          <AvatarFallback>
                            {rep.firstName[0] + '' + rep.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </>
                    ))}
                </div>
              </div>
              <div>
                <Button
                  onClick={() =>
                    navigate(
                      `/community/${
                        typeof audience?.beneficiaryId === 'object' &&
                        audience?.beneficiaryId._id
                      }`
                    )
                  }
                  variant={'outline'}
                >
                  <Eye />
                  <span>Voir le profil</span>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <p className='text-sm font-medium text-muted-foreground mb-2.5'>
              Description:
            </p>
            <p className='text-sm text-justify'>{audience?.description}</p>
          </div>
          {audience?.motif && (
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-2.5'>
                Motif de rejet:
              </p>
              <p className='text-sm text-justify'>{audience?.motif}</p>
            </div>
          )}
          {audience?.startDate && audience?.endDate && (
            <div className='flex items-center justify-start gap-4'>
              <div className='flex-1 border border-grey-400 p-4 flex justify-start items-center gap-8'>
                <div>
                  <Calendar1Icon size={32} />
                </div>
                <div>
                  <p className='text-sm font-medium'>Date de début:</p>
                  <p>
                    {audience?.startDate
                      ? new Date(audience?.startDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className='flex-1 border border-grey-400 p-4 flex justify-start items-center gap-8'>
                <div>
                  <Calendar1Icon size={32} />
                </div>
                <div>
                  <p className='text-sm font-medium'>Date de fin:</p>
                  <p>
                    {audience?.endDate
                      ? new Date(audience?.endDate).toLocaleDateString()
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

export default AudienceDetailsPage;
