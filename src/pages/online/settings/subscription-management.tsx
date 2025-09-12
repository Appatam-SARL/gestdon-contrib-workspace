import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDownloadInvoice } from '@/hook/invoices.hook';
import {
  useGetSubscriptionHistory,
  useSubscriptionCheck,
} from '@/hook/subscription.hook';
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  Edit,
  Eye,
  FileText,
  History,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Star,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

function SubscriptionManagement() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSubscriptionCheck();
  const downloadInvoiceMutation = useDownloadInvoice();

  const {
    data: subscriptionHistory,
    isLoading: isSubscriptionHistoryLoading,
    error: subscriptionHistoryError,
  } = useGetSubscriptionHistory(data?.data?.contributor?._id || '');
  const [activeTab, setActiveTab] = useState('overview');

  // Si en cours de chargement
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>
            Chargement des informations d'abonnement...
          </p>
        </div>
      </div>
    );
  }

  // Si erreur
  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <AlertTriangle className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <CardTitle className='text-red-600'>Erreur de chargement</CardTitle>
            <CardDescription>
              Impossible de récupérer les informations d'abonnement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.reload()}
              className='w-full'
              variant='outline'
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Gestion des abonnements
              </h1>
              <p className='text-gray-600 mt-2'>
                Gérez vos abonnements et suivez votre utilisation
              </p>
            </div>
            <div className='flex gap-3'>
              <Button variant='outline' onClick={() => navigate('/pricing')}>
                <Plus className='w-4 h-4 mr-2' />
                Nouvel abonnement
              </Button>
              <Button>
                <RefreshCw className='w-4 h-4 mr-2' />
                Actualiser
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='overview'>Vue d'ensemble</TabsTrigger>
            <TabsTrigger value='current'>Abonnement actuel</TabsTrigger>
            <TabsTrigger value='history'>Historique</TabsTrigger>
            <TabsTrigger value='billing'>Facturation</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Statut de l'abonnement */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Statut</CardTitle>
                  <Package className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data?.hasActiveSubscription ? 'Actif' : 'Inactif'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {data?.data?.hasActiveSubscription
                      ? 'Votre abonnement est actif'
                      : 'Aucun abonnement actif'}
                  </p>
                </CardContent>
              </Card>

              {/* Package actuel */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Package</CardTitle>
                  <Star className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {typeof data?.data?.subscription?.packageId === 'string'
                      ? data?.data?.subscription?.packageId
                      : data?.data?.subscription?.packageId?.name}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Package actuellement souscrit
                  </p>
                </CardContent>
              </Card>

              {/* Prochaine facturation */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Prochaine facturation
                  </CardTitle>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {data?.data?.subscription?.endDate
                      ? new Date(
                          data?.data?.subscription.endDate
                        ).toLocaleDateString()
                      : 'N/A'}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Date de fin d'abonnement
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Accédez rapidement aux fonctionnalités principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <Button
                    variant='outline'
                    className='h-20 flex-col'
                    onClick={() => navigate('/pricing')}
                  >
                    <Plus className='w-6 h-6 mb-2' />
                    <span className='text-sm'>Nouvel abonnement</span>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex-col'
                    onClick={() => setActiveTab('current')}
                  >
                    <Eye className='w-6 h-6 mb-2' />
                    <span className='text-sm'>Voir détails</span>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex-col'
                    onClick={() => setActiveTab('billing')}
                  >
                    <CreditCard className='w-6 h-6 mb-2' />
                    <span className='text-sm'>Facturation</span>
                  </Button>
                  <Button
                    variant='outline'
                    className='h-20 flex-col'
                    onClick={() => setActiveTab('history')}
                  >
                    <History className='w-6 h-6 mb-2' />
                    <span className='text-sm'>Historique</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Abonnement actuel */}
          <TabsContent value='current' className='space-y-6'>
            {data?.data?.hasActiveSubscription ? (
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle className='text-2xl'>
                        {typeof data?.data?.subscription?.packageId === 'string'
                          ? data?.data?.subscription?.packageId
                          : data?.data?.subscription?.packageId?.name}
                      </CardTitle>
                      <CardDescription>
                        Détails de votre abonnement actuel
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        data?.data?.subscription?.status === 'active'
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        data?.data?.subscription?.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : ''
                      }
                    >
                      {data?.data?.subscription?.status === 'active'
                        ? 'Actif'
                        : data?.data?.subscription?.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-4'>
                      <div>
                        <p className='text-sm font-medium text-gray-500'>
                          ID de l'abonnement
                        </p>
                        <p className='text-lg font-mono'>
                          {data?.data?.subscription?._id}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-500'>
                          Package ID
                        </p>
                        <p className='text-lg font-mono'>
                          {typeof data?.data?.subscription?.packageId ===
                          'string'
                            ? data?.data?.subscription?.packageId
                            : data?.data?.subscription?.packageId._id}
                        </p>
                      </div>
                    </div>
                    <div className='space-y-4'>
                      <div>
                        <p className='text-sm font-medium text-gray-500'>
                          Date de début
                        </p>
                        <p className='text-lg'>
                          {new Date(
                            data?.data?.subscription?.startDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-500'>
                          Date de fin
                        </p>
                        <p className='text-lg'>
                          {new Date(
                            data?.data?.subscription?.endDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className='flex gap-3'>
                    <Button variant='outline'>
                      <Edit className='w-4 h-4 mr-2' />
                      Modifier
                    </Button>
                    <Button
                      variant='outline'
                      disabled={downloadInvoiceMutation.isPending}
                      onClick={() => {
                        downloadInvoiceMutation.mutate(
                          data?.data?.subscription?._id as string
                        );
                      }}
                    >
                      {downloadInvoiceMutation.isPending ? (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      ) : (
                        <FileText className='w-4 h-4 mr-2' />
                      )}
                      Télécharger la facture
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          className='text-red-600 border-red-200 hover:bg-red-50'
                        >
                          <XCircle className='w-4 h-4 mr-2' />
                          Annuler
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Annuler l'abonnement</DialogTitle>
                          <DialogDescription>
                            Êtes-vous sûr de vouloir annuler votre abonnement ?
                            Cette action ne peut pas être annulée.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant='outline'>Non, garder</Button>
                          <Button variant='destructive'>Oui, annuler</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className='text-center'>
                  <Package className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                  <CardTitle>Aucun abonnement actif</CardTitle>
                  <CardDescription>
                    Vous n'avez actuellement aucun abonnement actif
                  </CardDescription>
                </CardHeader>
                <CardContent className='text-center'>
                  <Button
                    onClick={() => navigate('/pricing')}
                    className='bg-purple-600 hover:bg-purple-700'
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    Souscrire à un package
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Historique */}
          <TabsContent value='history' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <History className='w-5 h-5' />
                  Historique des abonnements
                </CardTitle>
                <CardDescription>
                  Consultez l'historique de tous vos abonnements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubscriptionHistoryLoading ? (
                  <div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4'></div>
                    <p className='text-gray-600'>
                      Chargement de l'historique...
                    </p>
                  </div>
                ) : subscriptionHistoryError ? (
                  <div className='text-center py-8 text-red-500'>
                    <AlertTriangle className='w-12 h-12 mx-auto mb-4' />
                    <p>Erreur lors du chargement de l'historique</p>
                    <p className='text-sm mt-2'>
                      {subscriptionHistoryError.message ||
                        'Veuillez réessayer plus tard'}
                    </p>
                  </div>
                ) : subscriptionHistory?.data?.subscriptions?.length > 0 ? (
                  <div className='space-y-6'>
                    {/* Statistiques */}
                    {subscriptionHistory?.data.statistics && (
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                        <div className='bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200'>
                          <div className='flex items-center gap-2'>
                            <Package className='w-5 h-5 text-purple-600' />
                            <div>
                              <p className='text-sm text-gray-600'>Total</p>
                              <p className='text-xl font-bold text-purple-700'>
                                {subscriptionHistory?.data?.statistics.total}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200'>
                          <div className='flex items-center gap-2'>
                            <Star className='w-5 h-5 text-green-600' />
                            <div>
                              <p className='text-sm text-gray-600'>Actifs</p>
                              <p className='text-xl font-bold text-green-700'>
                                {subscriptionHistory.data.statistics.active}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200'>
                          <div className='flex items-center gap-2'>
                            <RefreshCw className='w-5 h-5 text-orange-600' />
                            <div>
                              <p className='text-sm text-gray-600'>
                                Essais gratuits
                              </p>
                              <p className='text-xl font-bold text-orange-700'>
                                {subscriptionHistory.data.statistics.freeTrials}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
                          <div className='flex items-center gap-2'>
                            <CreditCard className='w-5 h-5 text-blue-600' />
                            <div>
                              <p className='text-sm text-gray-600'>
                                Total dépensé
                              </p>
                              <p className='text-xl font-bold text-blue-700'>
                                {subscriptionHistory.data.statistics
                                  .totalSpent > 0
                                  ? `${subscriptionHistory.data.statistics.totalSpent} XOF`
                                  : 'Gratuit'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Liste des abonnements */}
                    <div className='space-y-4'>
                      {subscriptionHistory?.data.subscriptions.map(
                        (subscription: any, index: number) => (
                          <div
                            key={subscription.id || subscription._id || index}
                            className='border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white'
                          >
                            <div className='flex items-start justify-between'>
                              <div className='flex-1'>
                                <div className='flex items-center gap-3 mb-3'>
                                  <div className='flex items-center gap-2'>
                                    <Package className='w-5 h-5 text-purple-600' />
                                    <h4 className='font-semibold text-gray-900'>
                                      {subscription.package?.name ||
                                        'Package inconnu'}
                                    </h4>
                                  </div>
                                  <Badge
                                    variant={
                                      subscription.status === 'active'
                                        ? 'default'
                                        : subscription.status === 'expired'
                                        ? 'secondary'
                                        : subscription.status === 'cancelled'
                                        ? 'destructive'
                                        : 'outline'
                                    }
                                    className='text-xs'
                                  >
                                    {subscription.status === 'active' &&
                                      'Actif'}
                                    {subscription.status === 'expired' &&
                                      'Expiré'}
                                    {subscription.status === 'cancelled' &&
                                      'Annulé'}
                                    {subscription.status === 'pending' &&
                                      'En attente'}
                                    {subscription.status === 'trial' &&
                                      'Essai gratuit'}
                                    {!subscription.status && 'Inconnu'}
                                  </Badge>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
                                  <div className='flex items-center gap-2'>
                                    <Calendar className='w-4 h-4 text-gray-400' />
                                    <span>
                                      <span className='font-medium'>
                                        Début:
                                      </span>{' '}
                                      {subscription.startDate
                                        ? new Date(
                                            subscription.startDate
                                          ).toLocaleDateString('fr-FR')
                                        : 'N/A'}
                                    </span>
                                  </div>

                                  <div className='flex items-center gap-2'>
                                    <Calendar className='w-4 h-4 text-gray-400' />
                                    <span>
                                      <span className='font-medium'>Fin:</span>{' '}
                                      {subscription.endDate
                                        ? new Date(
                                            subscription.endDate
                                          ).toLocaleDateString('fr-FR')
                                        : 'N/A'}
                                    </span>
                                  </div>

                                  <div className='flex items-center gap-2'>
                                    <CreditCard className='w-4 h-4 text-gray-400' />
                                    <span>
                                      <span className='font-medium'>Prix:</span>{' '}
                                      {subscription.package?.price ||
                                      subscription.amount > 0
                                        ? `${
                                            subscription.package?.price ||
                                            subscription.amount
                                          } ${subscription.currency || 'XOF'}`
                                        : 'Gratuit'}
                                    </span>
                                  </div>
                                </div>

                                {subscription.package?.description && (
                                  <p className='text-gray-600 mt-2 text-sm'>
                                    {subscription.package.description}
                                  </p>
                                )}

                                {/* Informations supplémentaires */}
                                <div className='flex flex-wrap gap-2 mt-3'>
                                  {subscription.isFreeTrial && (
                                    <Badge
                                      variant='outline'
                                      className='text-xs'
                                    >
                                      Essai gratuit
                                    </Badge>
                                  )}
                                  {subscription.autoRenewal && (
                                    <Badge
                                      variant='outline'
                                      className='text-xs'
                                    >
                                      Renouvellement auto
                                    </Badge>
                                  )}
                                  {subscription.expiringSoon && (
                                    <Badge
                                      variant='secondary'
                                      className='text-xs'
                                    >
                                      Expire bientôt
                                    </Badge>
                                  )}
                                  {subscription.daysRemaining && (
                                    <Badge
                                      variant='outline'
                                      className='text-xs'
                                    >
                                      {subscription.daysRemaining} jours
                                      restants
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className='flex items-center gap-2 ml-4'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='text-xs'
                                  onClick={() => {
                                    // TODO: Implémenter la vue détaillée
                                    console.log(
                                      'Voir les détails:',
                                      subscription
                                    );
                                  }}
                                >
                                  <Eye className='w-4 h-4 mr-1' />
                                  Détails
                                </Button>

                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='text-xs'
                                  onClick={() => {
                                    downloadInvoiceMutation.mutate(
                                      subscription.id || subscription._id
                                    );
                                  }}
                                  disabled={downloadInvoiceMutation.isPending}
                                >
                                  <FileText className='w-4 h-4 mr-1' />
                                  {downloadInvoiceMutation.isPending
                                    ? 'Téléchargement...'
                                    : 'Facture'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-8 text-gray-500'>
                    <History className='w-16 h-16 mx-auto mb-4 text-gray-300' />
                    <p>Aucun historique d'abonnement disponible</p>
                    <p className='text-sm'>
                      Vos anciens abonnements apparaîtront ici
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facturation */}
          <TabsContent value='billing' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Informations de facturation</CardTitle>
                <CardDescription>
                  Gérez vos informations de facturation et consultez vos
                  factures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-center py-8 text-gray-500'>
                  <CreditCard className='w-16 h-16 mx-auto mb-4 text-gray-300' />
                  <p>Aucune information de facturation disponible</p>
                  <p className='text-sm'>
                    Configurez vos informations de facturation pour commencer
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SubscriptionManagement;
