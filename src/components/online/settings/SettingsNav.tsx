import { usePackagePermissions } from '@/hook/packagePermissions.hook';
import { cn } from '@/lib/utils';
import { Activity, Banknote, Loader2, NotebookPen, Settings2, Users } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  label: string | React.ReactNode;
  isActive?: boolean;
  badge?: 'NEW' | 'Alpha';
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive, badge }) => (
  <Link
    to={href}
    className={cn(
      'flex items-center px-3 py-2 rounded-md text-sm font-medium',
      isActive
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    )}
    aria-current={isActive ? 'page' : undefined}
  >
    {label}
    {badge && (
      <span
        className={cn(
          'ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold',
          badge === 'NEW'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        )}
      >
        {badge}
      </span>
    )}
  </Link>
);

const SettingsNav = () => {
  // Vérifier les permissions des packages
  const { hasAccess, isLoading } = usePackagePermissions();

  // Afficher un indicateur de chargement si les permissions sont en cours de chargement
  if (isLoading) {
    return (
      <nav className='space-y-1 border-r border-t border-border bg-white'>
        <div className='p-4'>
          <div className='flex items-center justify-center'>
            <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
            <span className='ml-2 text-sm text-gray-500'>
              Chargement des permissions...
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className='space-y-1 border-r border-t border-border bg-white'>
      <h3 className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2.5'>
        Paramètres du compte
      </h3>
      <NavLink
        href='/settings'
        label={
          <>
            <Settings2 className='mr-2 h-4 w-4' />
            General
          </>
        }
        isActive={true}
      />

      {/* Section Configuration - Conditionnée par les permissions */}
      {hasAccess("Ajout de type d'activité et bénéficiaire") && (
        <>
          <h3 className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8'>
            Configuration
          </h3>
          <NavLink
            href='activity'
            label={
              <>
                <Activity className='mr-2 h-4 w-4' />
                Type d'activités
              </>
            }
          />
          <NavLink
            href='beneficiary'
            label={
              <>
                <Users className='mr-2 h-4 w-4' />
                Type Bénéficiaires
              </>
            }
          />
          <NavLink
            href='type-mouvement-checkout'
            label={
              <>
                <Banknote className='mr-2 h-4 w-4' />
                Type opération de caisse
              </>
            }
          />
          <NavLink
            href='categorie-mouvement-checkout'
            label={
              <>
                <Banknote className='mr-2 h-4 w-4' />
                Catégorie de mouvement
              </>
            }
          />
        </>
      )}

      {/* Section Personnalisations des formulaires - Conditionnée par les permissions */}
      {hasAccess(
        'Personnalisation des champs formulaire (activité, bénéficiaire)'
      ) && (
        <>
          <h3 className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8'>
            Personnalisations des formulaires
          </h3>
          <NavLink
            href='activity-customizable-form'
            label={
              <>
                <NotebookPen className='mr-2 h-4 w-4' />
                Activités
              </>
            }
          />
          <NavLink
            href='beneficiary-customizable-form'
            label={
              <>
                <NotebookPen className='mr-2 h-4 w-4' />
                Bénéficiaires
              </>
            }
          />
        </>
      )}

      <h3 className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8'>
        Abonnement
      </h3>
      <NavLink
        href='subscription/status'
        label={<>Statut de l'abonnement</>}
        isActive={false}
      />
    </nav>
  );
};

export default SettingsNav;
