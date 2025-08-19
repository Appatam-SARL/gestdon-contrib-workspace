import sidebarLinks from '@/assets/constants/sidebars';
import LogoImgPurple from '@/assets/logo.png';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLogout } from '@/hook/admin.hook';
import { usePackagePermissions } from '@/hook/packagePermissions.hook';
import { cn } from '@/lib/utils';
import {
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Settings,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface IProps {
  menus?: {
    _id: string;
    label: string;
    href: string;
    contributorId: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

function Aside({ menus }: IProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [expandedMenus, setExpandedMenus] = React.useState<Set<string>>(
    new Set()
  );

  const location = useLocation();
  const mutation = useLogout();

  // Vérifier les permissions des packages
  const { hasAccess, isLoading } = usePackagePermissions();

  const toggleSubmenu = (href: string) => {
    const newExpandedMenus = new Set(expandedMenus);
    if (newExpandedMenus.has(href)) {
      newExpandedMenus.delete(href);
    } else {
      newExpandedMenus.add(href);
    }
    setExpandedMenus(newExpandedMenus);
  };

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + '/')
    );
  };

  const renderMenuItem = (link: any, level: number = 0) => {
    // Vérifier si l'utilisateur a accès au menu "Réseau social"
    if (link.label === 'Réseau social' && !hasAccess('Accès réseau social')) {
      return null; // Masquer complètement le menu si pas de permission
    }

    if (link.label === 'Agenda' && !hasAccess("Accéder à l'agenda")) {
      return null;
    }

    const hasSubmenu = link.submenu && link.submenu.length > 0;
    const isExpanded = expandedMenus.has(link.href);
    const isLinkActive = isActive(link.href);
    const hasActiveChild =
      hasSubmenu && link.submenu.some((subLink: any) => isActive(subLink.href));

    return (
      <div key={link.href} className='space-y-1'>
        <div className='flex items-center'>
          {hasSubmenu ? (
            <button
              onClick={() => toggleSubmenu(link.href)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 group w-full',
                isLinkActive || hasActiveChild
                  ? 'bg-[#fff] text-[#6c2bd9] font-semibold'
                  : 'text-white',
                'hover:bg-[#fff] hover:text-[#6c2bd9]',
                isCollapsed && 'justify-center'
              )}
            >
              <span
                className={cn(
                  'h-5 w-5 transition-colors duration-200',
                  isLinkActive || hasActiveChild ? 'text-[#000]' : 'text-white',
                  'group-hover:text-[#000]'
                )}
              >
                {link.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span
                    className={cn(
                      'transition-colors duration-200 flex-1 text-left',
                      isLinkActive || hasActiveChild
                        ? 'text-[#000]'
                        : 'text-white',
                      'group-hover:text-[#000]'
                    )}
                  >
                    {link.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isExpanded ? 'rotate-180' : '',
                      isLinkActive || hasActiveChild
                        ? 'text-[#000]'
                        : 'text-white',
                      'group-hover:text-[#000]'
                    )}
                  />
                </>
              )}
            </button>
          ) : (
            <Link
              to={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 group',
                isLinkActive
                  ? 'bg-[#fff] text-[#6c2bd9] font-semibold'
                  : 'text-white',
                'hover:bg-[#fff] hover:text-[#6c2bd9]',
                isCollapsed && 'justify-center'
              )}
            >
              <span
                className={cn(
                  'h-5 w-5 transition-colors duration-200',
                  isLinkActive ? 'text-[#000]' : 'text-white',
                  'group-hover:text-[#000]'
                )}
              >
                {link.icon ? link.icon : <Activity className='h-5 w-5' />}
              </span>
              {!isCollapsed && (
                <span
                  className={cn(
                    'transition-colors duration-200',
                    isLinkActive ? 'text-[#000]' : 'text-white',
                    'group-hover:text-[#000]'
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Sous-menus */}
        {hasSubmenu && isExpanded && !isCollapsed && (
          <div className='ml-6 space-y-1'>
            {link.submenu.map((subLink: any) => {
              const isSubLinkActive = isActive(subLink.href);
              return (
                <Link
                  key={subLink.href}
                  to={subLink.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 group',
                    isSubLinkActive
                      ? 'bg-[#fff] text-[#6c2bd9] font-semibold'
                      : 'text-white',
                    'hover:bg-[#fff] hover:text-[#6c2bd9]'
                  )}
                >
                  <span
                    className={cn(
                      'h-4 w-4 transition-colors duration-200',
                      isSubLinkActive ? 'text-[#000]' : 'text-white',
                      'group-hover:text-[#000]'
                    )}
                  >
                    {subLink.icon}
                  </span>
                  <span
                    className={cn(
                      'transition-colors duration-200',
                      isSubLinkActive ? 'text-[#000]' : 'text-white',
                      'group-hover:text-[#000]'
                    )}
                  >
                    {subLink.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Afficher un indicateur de chargement si les permissions sont en cours de chargement
  if (isLoading) {
    return (
      <aside className='bg-[#6c2bd9] border-r border-border h-screen sticky top-0 flex flex-col transition-all duration-300 shadow-md w-[280px]'>
        <div className='h-20 flex items-center justify-center px-6'>
          <div className='animate-pulse bg-white/20 rounded-lg w-32 h-8'></div>
        </div>
        <div className='flex-1 pt-4 p-4 space-y-2'>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='animate-pulse bg-white/20 rounded-lg h-10'
            ></div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'bg-[#6c2bd9] border-r border-border h-screen sticky top-0 flex flex-col transition-all duration-300 shadow-md',
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      )}
    >
      {/* Logo */}
      <div className='h-20 flex items-center justify-center px-6'>
        <h1
          className={cn(
            'font-semibold transition-all duration-300',
            isCollapsed ? 'text-xl' : 'text-2xl'
          )}
        >
          {isCollapsed ? (
            <img
              src={LogoImgPurple}
              alt='Logo'
              className='w-14 h-14 object-contain mx-auto'
              loading='lazy'
            />
          ) : (
            <img
              src={LogoImgPurple}
              alt='Logo'
              className='w-24 h-18 object-contain mx-auto'
            />
          )}
        </h1>
      </div>

      {/* Navigation */}
      <nav className='flex-1 pt-4 p-4 space-y-2 overflow-y-auto'>
        {[...sidebarLinks, ...(menus ?? [])].map((link) =>
          renderMenuItem(link)
        )}
      </nav>

      {/* Footer */}
      <div className='border-t border-white/10 p-4 space-y-2'>
        <Link
          to='/settings'
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200',
            'hover:bg-[#000] hover:text-white text-white/80',
            isCollapsed && 'justify-center'
          )}
        >
          <Settings className='h-5 w-5 text-white' />
          {!isCollapsed && <span className='text-white'>Paramètres</span>}
        </Link>
        <button
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 w-full',
            'hover:bg-[#000] hover:text-white text-white/80',
            isCollapsed && 'justify-center'
          )}
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className='animate-spin text-white' />
              {!isCollapsed && <span>Déconnexion en cours</span>}
            </>
          ) : (
            <>
              <LogOut className='h-5 w-5 text-white' />
              {!isCollapsed && <span>Déconnexion</span>}
            </>
          )}
        </button>
      </div>

      {/* Collapse Button */}
      <Tooltip>
        <TooltipTrigger
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='absolute -right-4 top-8 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors'
        >
          {isCollapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCollapsed ? 'Ouvrir' : 'Fermer'} le menu</p>
        </TooltipContent>
      </Tooltip>
    </aside>
  );
}

export default React.memo(Aside);
