import { useRouteSubscriptionGuard } from '@/hook/subscription.hook';
import { Loader2 } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  redirectOnMissing?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Composant de garde qui vérifie l'abonnement de l'utilisateur
 * Redirige automatiquement vers /pricing si aucun abonnement actif
 */
const SubscriptionGuard = ({
  children,
  redirectOnMissing = true,
  fallback,
}: SubscriptionGuardProps) => {
  const { isLoading, shouldRedirect } =
    useRouteSubscriptionGuard(redirectOnMissing);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4 text-purple-600' />
          <p className='text-gray-600'>Vérification de votre abonnement...</p>
        </div>
      </div>
    );
  }

  // Si la redirection est en cours, afficher le fallback ou rien
  if (shouldRedirect) {
    return fallback || null;
  }

  // Si tout est OK, afficher le contenu protégé
  return <>{children}</>;
};

export default SubscriptionGuard;
