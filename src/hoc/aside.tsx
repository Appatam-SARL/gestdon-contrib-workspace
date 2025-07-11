import sidebarLinks from '@/assets/constants/sidebars';
import LogoImgPurple from '@/assets/logo.png';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLogout } from '@/hook/admin.hook';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Settings,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Aside() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const location = useLocation();
  const mutation = useLogout();
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
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.href;
          // Liens normaux
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 group',
                isActive
                  ? 'bg-[#fff] text-[#6c2bd9] font-semibold'
                  : 'text-white',
                'hover:bg-[#fff] hover:text-[#6c2bd9]',
                isCollapsed && 'justify-center'
              )}
            >
              <span
                className={cn(
                  'h-5 w-5 transition-colors duration-200',
                  isActive ? 'text-[#000]' : 'text-white',
                  'group-hover:text-[#000]'
                )}
              >
                {link.icon}
              </span>
              {!isCollapsed && (
                <span
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'text-[#000]' : 'text-white',
                    'group-hover:text-[#000]'
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
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
          {/* </button> */}
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCollapsed ? 'Ouvrir' : 'Fermer'} le menu</p>
        </TooltipContent>
      </Tooltip>
    </aside>
  );
}

export default React.memo(Aside);
