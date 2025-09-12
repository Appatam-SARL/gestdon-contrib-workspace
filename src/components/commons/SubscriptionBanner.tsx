import { Button } from '@/components/ui/button';
import { useSubscriptionCheck } from '@/hook/subscription.hook';
import { formatDaysRemaining, getDaysRemaining } from '@/utils/helperDate';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Gift,
  Info,
  Star,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface SubscriptionBannerProps {
  className?: string;
  dismissible?: boolean;
}

/**
 * Bannière d'abonnement qui affiche le statut et les actions disponibles
 * Peut être affichée sur toutes les pages protégées
 *
 * Fonctionnalités ajoutées :
 * - Affichage de la date d'échéance de l'abonnement
 * - Calcul et affichage du nombre de jours restants
 * - Badge visuel pour le statut temporel (jours restants, expiré, etc.)
 */
const SubscriptionBanner = ({
  className = '',
  dismissible = true,
}: SubscriptionBannerProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useSubscriptionCheck();
  const [isDismissed, setIsDismissed] = useState(false);

  // Si en cours de chargement ou déjà fermée, ne rien afficher
  if (isLoading || isDismissed) {
    return null;
  }

  // Si abonnement actif, afficher une bannière de succès
  if (data?.data?.hasActiveSubscription) {
    const endDate = data?.data?.subscription?.endDate;
    const daysRemaining = endDate ? getDaysRemaining(endDate) : null;
    const formattedEndDate = endDate
      ? new Date(endDate).toLocaleDateString('fr-FR')
      : 'N/A';

    return (
      <div
        className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <CheckCircle2 className='w-5 h-5 text-green-600' />
            <div>
              <p className='text-sm font-medium text-green-800'>
                Abonnement actif -{' '}
                {typeof data?.data?.subscription?.packageId === 'string'
                  ? data?.data?.subscription?.packageId
                  : data?.data?.subscription?.packageId?.name}
              </p>
              <div className='flex items-center gap-4 mt-1'>
                <div className='flex items-center gap-1 text-xs text-green-600'>
                  <Calendar className='w-3 h-3' />
                  <span>Expire le {formattedEndDate}</span>
                </div>
                {daysRemaining !== null && (
                  <div className='text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full'>
                    {formatDaysRemaining(daysRemaining)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate('/settings/subscription/management')}
              className='border-green-300 text-green-700 hover:bg-green-100'
            >
              Gérer
            </Button>
            {dismissible && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsDismissed(true)}
                className='text-green-600 hover:text-green-800 hover:bg-green-100'
              >
                <X className='w-4 h-4' />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Si abonnement requis, afficher une bannière d'alerte
  if (data?.data?.hasActiveSubscription === false) {
    const endDate = data?.data?.subscription?.endDate;
    const daysRemaining = endDate ? getDaysRemaining(endDate) : null;
    const formattedEndDate = endDate
      ? new Date(endDate).toLocaleDateString('fr-FR')
      : 'N/A';

    return (
      <div
        className={`bg-orange-50 border border-orange-200 rounded-lg p-4 ${className}`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <AlertTriangle className='w-5 h-5 text-orange-600' />
            <div>
              <p className='text-sm font-medium text-orange-800'>
                Abonnement requis
              </p>
              <div className='flex items-center gap-4 mt-1'>
                <div className='flex items-center gap-1 text-xs text-orange-600'>
                  <Calendar className='w-3 h-3' />
                  <span>Expire le {formattedEndDate}</span>
                </div>
                {daysRemaining !== null && (
                  <div className='text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full'>
                    {formatDaysRemaining(daysRemaining)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              onClick={() => navigate('/pricing')}
              className='bg-orange-600 hover:bg-orange-700'
            >
              <Star className='w-4 h-4 mr-2' />
              Voir les packages
            </Button>
            {dismissible && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsDismissed(true)}
                className='text-orange-600 hover:text-orange-800 hover:bg-orange-100'
              >
                <X className='w-4 h-4' />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Si aucune information d'abonnement, afficher une bannière d'information
  return (
    <div
      className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Info className='w-5 h-5 text-blue-600' />
          <div>
            <p className='text-sm font-medium text-blue-800'>
              Vérification de l'abonnement
            </p>
            <p className='text-xs text-blue-600'>
              Vérification en cours de votre statut d'abonnement
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate('/pricing')}
            className='border-blue-300 text-blue-700 hover:bg-blue-100'
          >
            <Gift className='w-4 h-4 mr-2' />
            Packages
          </Button>
          {dismissible && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsDismissed(true)}
              className='text-blue-600 hover:text-blue-800 hover:bg-blue-100'
            >
              <X className='w-4 h-4' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
