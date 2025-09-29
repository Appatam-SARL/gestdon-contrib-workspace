import ButtonGroupActionActivity from '@/components/online/Activity/ButtonGroupActionActivity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { withDashboard } from '@/hoc/withDashboard';
import { useActivity } from '@/hook/activity.hook';
import { useDeleteMouvementCheckout, useGetMouvementCheckouts, useSummaryMouvementCheckouts } from '@/hook/mouvement-checkout.hook';
import { useReports } from '@/hook/report.hook';
import { IActivity, IMouvementCheckout } from '@/interface/activity';
import useContributorStore from '@/store/contributor.store';
import { displayStatusActivity } from '@/utils/display-of-variable';
import { Calendar1Icon } from 'lucide-react';
import { TrashIcon } from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';

import EmptyImg from '@/assets/img/activityempty.png';

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
    refetch
  } = useActivity(id as string);
  const {
    data: reports,
  } = useReports({
    limit: 10,
    page: 1,
    entityType: 'ACTIVITY',
    entityId: id,
    contributorId: contributorId,
  });
  const {
    data: mouvementCheckouts,
  } = useGetMouvementCheckouts({
    contributorId: contributorId as string,
    activityId: id,
  });

  const {
    data: summaryMouvementCheckouts,
  } = useSummaryMouvementCheckouts({
    contributorId: contributorId as string,
    activityId: id,
  });

  const { mutate: askDeleteMouvementCheckout, isPending: isPendingDeleteMouvementCheckout } = useDeleteMouvementCheckout();

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
    <div className='space-y-6 w-full'>
      {/* Header avec actions */}
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

      {/* Actions groupées */}
      <ButtonGroupActionActivity id={id as string} reports={reports} refetch={refetch} />

      {/* Layout en deux colonnes */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        {/* Colonne principale - Informations de l'activité */}
        <div className='xl:col-span-2 space-y-6'>
          {/* Bannière de statut du rapport */}
          <Card>
            {reports?.metadata?.total === 1 &&
            reports.data[0].status === 'REFUSED' ? (
              <div className='bg-red-50 border-l-4 border-red-400 p-4'>
                <div className='flex items-center gap-3'>
                  <FaExclamationCircle className='h-5 w-5 text-red-600' />
                  <p className='text-sm font-medium text-red-800'>
                    Le rapport de cette audience a été refusé par un agent de l'espace
                    administrateur. Cliquez sur « Voir le rapport » pour le modifier.
                  </p>
                </div>
              </div>
            ) : reports?.metadata?.total === 1 &&
              reports.data[0].status === 'VALIDATED' ? (
              <div className='bg-green-50 border-l-4 border-green-400 p-4'>
                <div className='flex items-center gap-3'>
                  <FaExclamationCircle className='h-5 w-5 text-green-600' />
                  <p className='text-sm font-medium text-green-800'>
                    Le rapport de cette audience a été validé par un agent de l'espace
                    administrateur. Cliquez sur « Voir le rapport » pour les détails.
                  </p>
                </div>
              </div>
            ) : reports?.metadata?.total === 1 &&
              reports.data[0].status === 'ARCHIVED' ? (
              <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4'>
                <div className='flex items-center gap-3'>
                  <FaExclamationCircle className='h-5 w-5 text-yellow-600' />
                  <p className='text-sm font-medium text-yellow-800'>
                    Le rapport de cette audience a été archivé par un agent de l'espace
                    administrateur. Cliquez sur « Voir le rapport » pour les détails.
                  </p>
                </div>
              </div>
            ) : (
              <div className='bg-gray-50 border-l-4 border-gray-400 p-4'>
                <div className='flex items-center gap-3'>
                  <FaExclamationCircle className='h-5 w-5 text-gray-600' />
                  <p className='text-sm font-medium text-gray-800'>
                    Vous n'avez pas encore créé de rapport pour cette audience.
                    Cliquez sur le bouton pour en créer un.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Informations principales de l'activité */}
          <Card>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <CardTitle className='text-2xl mb-2'>{activity.title}</CardTitle>
                  <div className='flex items-center gap-3 mb-4'>
                    <span className='text-sm font-medium text-gray-600'>Type:</span>
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                      {typeof activity.activityTypeId === 'object'
                        ? activity.activityTypeId.label
                        : activity.activityTypeId || 'N/A'}
                    </span>
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
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Description */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>Description</h3>
                <p className='text-gray-700 leading-relaxed'>{activity.description}</p>
              </div>

              {/* Informations d'assignation */}
              {activity.assigneeId && (
                <div className='border-t pt-4'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>Assigné à</h3>
                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                      <span className='text-blue-600 font-semibold'>
                        {typeof activity.assigneeId === 'object'
                          ? activity.assigneeId.fullName?.charAt(0)
                          : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>
                        {typeof activity.assigneeId === 'object'
                          ? activity.assigneeId.fullName
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Représentant */}
              {activity.representative && (
                <div className='border-t pt-4'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>Représentant</h3>
                  <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                    <Avatar>
                      <AvatarImage src={'https://github.com/shadcn.png'} alt='avatar' />
                      <AvatarFallback>
                        {activity?.representative.firstName?.charAt(0)}
                        {activity?.representative.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <p className='font-medium text-gray-900'>
                        {activity?.representative.firstName} {activity?.representative.lastName}
                      </p>
                      <p className='text-sm text-gray-600'>{activity?.representative.email}</p>
                      <p className='text-sm text-gray-600'>{activity?.representative.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates */}
              {activity.startDate && activity.endDate && (
                <div className='border-t pt-4'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>Période</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200'>
                      <Calendar1Icon className='h-6 w-6 text-amber-600' />
                      <div>
                        <p className='text-sm font-medium text-amber-800'>Date de début</p>
                        <p className='text-sm text-amber-700'>
                          {activity.startDate
                            ? new Date(activity.startDate).toLocaleDateString('fr-FR')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200'>
                      <Calendar1Icon className='h-6 w-6 text-amber-600' />
                      <div>
                        <p className='text-sm font-medium text-amber-800'>Date de fin</p>
                        <p className='text-sm text-amber-700'>
                          {activity.endDate
                            ? new Date(activity.endDate).toLocaleDateString('fr-FR')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Champs personnalisés */}
              {activity.customFields && Object.keys(activity.customFields).length > 0 && (
                <div className='border-t pt-4'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>Champs personnalisés</h3>
                  <div className='space-y-3'>
                    {Object.entries(activity.customFields).map(([key, value]) => (
                      <div key={key} className='flex justify-between items-start p-3 bg-gray-50 rounded-lg'>
                        <span className='font-medium text-gray-700'>{key}:</span>
                        <span className='text-gray-600 text-right'>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Table des mouvements de caisse */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Mouvements de caisse</CardTitle>
            </CardHeader>
            <CardContent>
              {mouvementCheckouts?.data && (
                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type de mouvement</TableHead>
                      <TableHead>Catégorie de mouvement</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mouvementCheckouts.data && mouvementCheckouts.data.length > 0 ? (
                      mouvementCheckouts?.data?.map((mouvement: IMouvementCheckout) => (
                        <TableRow key={mouvement._id}>
                          <TableCell className='font-medium'>
                            {typeof mouvement.typeMouvementCheckout === 'object' 
                              ? mouvement?.typeMouvementCheckout?.name 
                              : mouvement.typeMouvementCheckout}
                          </TableCell>
                          <TableCell className='font-semibold'>
                            {typeof mouvement.categoryMouvementCheckout === 'object' 
                              ? mouvement?.categoryMouvementCheckout?.name 
                              : mouvement.categoryMouvementCheckout}
                          </TableCell>
                          <TableCell className='font-semibold'>
                            {mouvement.amount?.toLocaleString('fr-FR')} FCFA
                          </TableCell>
                          <TableCell className='text-gray-600'>
                            {new Date(mouvement.createdAt).toLocaleDateString('fr-FR', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex justify-end gap-2'>
                              {/* <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
                                <EyeIcon className='h-4 w-4' />
                              </Button> */}
                              {/* <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
                                <EditIcon className='h-4 w-4' />
                              </Button> */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    className='h-8 w-8 p-0 bg-red-600 text-white hover:text-red-700'
                                    disabled={isPendingDeleteMouvementCheckout}
                                  >
                                    <TrashIcon className='h-4 w-4' />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cette action est irréversible. Voulez-vous vraiment supprimer cet enregistrement ?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isPendingDeleteMouvementCheckout}>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => askDeleteMouvementCheckout(mouvement._id)}
                                      disabled={isPendingDeleteMouvementCheckout}
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className='text-center py-12'>
                          <div className='flex flex-col items-center gap-4'>
                            <img src={EmptyImg} alt='Empty' className='w-24 h-24 opacity-50' />
                            <p className='text-sm font-medium text-gray-500'>Aucun mouvement de caisse trouvé</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale - Détails financiers */}
        <div className='space-y-6'>
          <Card className='sticky top-6'>
            <CardHeader>
              <CardTitle className='text-lg'>Résumé financier</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Budget alloué */}
              <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-blue-800'>Budget alloué</p>
                    <p className='text-2xl font-bold text-blue-900'>
                      {summaryMouvementCheckouts?.data?.budget?.toLocaleString('fr-FR') || 0} FCFA
                    </p>
                  </div>
                  <div className='p-2 bg-blue-100 rounded-full'>
                    <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Budget restant */}
              <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-green-800'>Budget restant</p>
                    <p className='text-2xl font-bold text-green-900'>
                      {summaryMouvementCheckouts?.data?.budgetRemaining?.toLocaleString('fr-FR') || 0} FCFA
                    </p>
                  </div>
                  <div className='p-2 bg-green-100 rounded-full'>
                    <svg className='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Dépenses */}
              <div className='p-4 bg-red-50 rounded-lg border border-red-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-red-800'>Total dépenses</p>
                    <p className='text-xl font-bold text-red-900'>
                      {summaryMouvementCheckouts?.data?.totalExpenses?.toLocaleString('fr-FR') || 0} FCFA
                    </p>
                  </div>
                  <div className='p-2 bg-red-100 rounded-full'>
                    <svg className='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4m16 0l-4-4m4 4l-4 4' />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Recettes */}
              <div className='p-4 bg-emerald-50 rounded-lg border border-emerald-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-emerald-800'>Total recettes</p>
                    <p className='text-xl font-bold text-emerald-900'>
                      {summaryMouvementCheckouts?.data?.totalIncomes?.toLocaleString('fr-FR') || 0} FCFA
                    </p>
                  </div>
                  <div className='p-2 bg-emerald-100 rounded-full'>
                    <svg className='w-5 h-5 text-emerald-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4m16 0l4-4m-4 4l4 4' />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Solde net */}
              <div className={`p-4 rounded-lg border ${
                (summaryMouvementCheckouts?.data?.balance || 0) >= 0 
                  ? 'bg-purple-50 border-purple-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className={`text-sm font-medium ${
                      (summaryMouvementCheckouts?.data?.balance || 0) >= 0 
                        ? 'text-purple-800' 
                        : 'text-red-800'
                    }`}>Solde net</p>
                    <p className={`text-xl font-bold ${
                      (summaryMouvementCheckouts?.data?.balance || 0) >= 0 
                        ? 'text-purple-900' 
                        : 'text-red-900'
                    }`}>
                      {summaryMouvementCheckouts?.data?.balance?.toLocaleString('fr-FR') || 0} FCFA
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${
                    (summaryMouvementCheckouts?.data?.balance || 0) >= 0 
                      ? 'bg-purple-100' 
                      : 'bg-red-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      (summaryMouvementCheckouts?.data?.balance || 0) >= 0 
                        ? 'text-purple-600' 
                        : 'text-red-600'
                    }`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Mouvements</p>
                    <p className='text-lg font-semibold text-gray-900'>
                      {summaryMouvementCheckouts?.data?.movementsCount || 0} opération(s)
                    </p>
                  </div>
                  <div className='p-2 bg-gray-200 rounded-full'>
                    <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default ActivityDetailsPage;
