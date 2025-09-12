import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSubscriptionCheck } from '@/hook/subscription.hook';
import { AlertCircle, CheckCircle2, Package, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';

function SubscriptionStatus() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSubscriptionCheck();

  // Si en cours de chargement
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Vérification de votre abonnement...</p>
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
            <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
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

  // Si abonnement actif
  if (data?.data?.hasActiveSubscription) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Header de succès */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4'>
              <CheckCircle2 className='w-10 h-10 text-green-600' />
            </div>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              Abonnement actif
            </h1>
            <p className='text-xl text-gray-600'>
              Votre compte est entièrement fonctionnel
            </p>
          </div>

          {/* Détails de l'abonnement */}
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Package className='w-5 h-5' />
                Détails de votre abonnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Package</p>
                    <p className='text-lg font-semibold'>
                      {typeof data?.data?.subscription?.packageId === 'string'
                        ? data?.data?.subscription?.packageId
                        : data?.data?.subscription?.packageId?.name}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Prix</p>
                    <p className='text-lg font-semibold'>
                      {data?.data?.subscription?.amount !== 0
                        ? data?.data?.subscription?.amount + ' FCFA / '
                        : 'Gratuit'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Statut</p>
                    <Badge
                      variant={
                        data?.data?.subscription.status === 'active'
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        data?.data?.subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : ''
                      }
                    >
                      {data?.data?.subscription.status === 'active'
                        ? 'Actif'
                        : data?.data?.subscription.status}
                    </Badge>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Date de début
                    </p>
                    <p className='text-lg font-semibold'>
                      {new Date(
                        data?.data?.subscription.startDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Date de fin
                    </p>
                    <p className='text-lg font-semibold'>
                      {new Date(
                        data?.data?.subscription.endDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              onClick={() => navigate('/dashboard')}
              className='bg-purple-600 hover:bg-purple-700'
            >
              <TrendingUp className='w-4 h-4 mr-2' />
              Accéder au dashboard
            </Button>
            <Button variant='outline' onClick={() => navigate('/pricing')}>
              <Package className='w-4 h-4 mr-2' />
              Voir d'autres packages
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // État par défaut
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-6'>
      <Card className='w-full max-w-md text-center'>
        <CardHeader>
          <Package className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <CardTitle>Aucune information d'abonnement</CardTitle>
          <CardDescription>
            Impossible de récupérer les informations d'abonnement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/pricing')} className='w-full'>
            Voir les packages disponibles
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SubscriptionStatus;
