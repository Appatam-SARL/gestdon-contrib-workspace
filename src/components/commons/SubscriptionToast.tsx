import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSubscriptionCheck } from '@/hook/subscription.hook';
import { AlertTriangle, CheckCircle2, Info, Star } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

/**
 * Composant de toast pour les notifications d'abonnement
 * S'affiche automatiquement lors des changements de statut
 */
const SubscriptionToast = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscriptionStatus, isLoading } = useSubscriptionCheck();

  useEffect(() => {
    // Ne pas afficher de toast pendant le chargement
    if (isLoading) return;

    // Si abonnement requis, afficher un toast d'alerte
    if (subscriptionStatus?.code === 'SUBSCRIPTION_REQUIRED') {
      toast({
        title: (
          <div className='flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-orange-600' />
            <span>Abonnement requis</span>
          </div>
        ),
        description: (
          <div className='space-y-3'>
            <p className='text-sm'>{subscriptionStatus.message}</p>
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                onClick={() => navigate('/pricing')}
                className='bg-orange-600 hover:bg-orange-700 text-white'
              >
                <Star className='w-4 h-4 mr-2' />
                Voir les packages
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate('/settings/subscription-status')}
                className='border-orange-300 text-orange-700'
              >
                <Info className='w-4 h-4 mr-2' />
                Détails
              </Button>
            </div>
          </div>
        ),
        duration: 10000, // 10 secondes
        className: 'border-orange-200 bg-orange-50',
      });
    }

    // Si abonnement actif, afficher un toast de succès
    if (subscriptionStatus?.isSubscribed) {
      toast({
        title: (
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='w-5 h-5 text-green-600' />
            <span>Abonnement actif</span>
          </div>
        ),
        description: (
          <div className='space-y-3'>
            <p className='text-sm'>
              Votre abonnement{' '}
              <strong>{subscriptionStatus.subscription.packageName}</strong> est
              actif
            </p>
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                onClick={() => navigate('/dashboard')}
                className='bg-green-600 hover:bg-green-700 text-white'
              >
                <Star className='w-4 h-4 mr-2' />
                Accéder au dashboard
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigate('/settings/subscription-management')}
                className='border-green-300 text-green-700'
              >
                <Info className='w-4 h-4 mr-2' />
                Gérer
              </Button>
            </div>
          </div>
        ),
        duration: 8000, // 8 secondes
        className: 'border-green-200 bg-green-50',
      });
    }
  }, [subscriptionStatus, isLoading, toast, navigate]);

  // Ce composant ne rend rien visuellement
  // Il utilise useEffect pour déclencher les toasts
  return null;
};

export default SubscriptionToast;
