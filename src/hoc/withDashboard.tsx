// import { useLogout } from '@/hook/admin.hook';
import sidebarLinks from '@/assets/constants/sidebars';
import { useFindByToken, useLogout } from '@/hook/admin.hook';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import LogoImgPurple from '@/assets/logo_icon.png';
import { HelpButton } from '@/components/commons/HelpButton';
import { NotificationButton } from '@/components/commons/NotificationButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function withDashboard<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithDashboardComponent(props: P) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const mutation = useLogout();

    useFindByToken();

    return (
      <div className='min-h-screen bg-background flex'>
        {/* Sidebar */}
        <aside
          className={cn(
            'bg-card border-r border-border h-screen sticky top-0 flex flex-col transition-all duration-300',
            isCollapsed ? 'w-[80px]' : 'w-[280px]'
          )}
        >
          {/* Logo */}
          <div className='h-16 border-b border-border flex items-center px-6'>
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
                  className='w-24 h-15 object-contain'
                />
              ) : (
                <img
                  src={LogoImgPurple}
                  alt='Logo'
                  className='w-24 h-15 object-contain'
                />
              )}
            </h1>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-4 space-y-2'>
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  location.pathname === link.href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground',
                  isCollapsed && 'justify-center'
                )}
              >
                {link.icon}
                {!isCollapsed && <span>{link.label}</span>}
              </Link>
            ))}
          </nav>
          {/* Footer */}
          <div className='border-t border-border p-4 space-y-2'>
            <Link
              to='/settings'
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground text-muted-foreground',
                isCollapsed && 'justify-center'
              )}
            >
              <Settings className='h-5 w-5' />
              {!isCollapsed && <span>Paramètres</span>}
            </Link>
            <button
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full',
                'hover:bg-destructive hover:text-destructive-foreground text-muted-foreground',
                isCollapsed && 'justify-center'
              )}
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className='animate-spin' />
                  {!isCollapsed && <span>Déconnexion en cours</span>}
                </>
              ) : (
                <>
                  <LogOut className='h-5 w-5' />
                  {!isCollapsed && <span>Déconnexion</span>}
                </>
              )}
            </button>
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='absolute -right-4 top-8 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors'
          >
            {isCollapsed ? (
              <ChevronRight className='h-4 w-4' />
            ) : (
              <ChevronLeft className='h-4 w-4' />
            )}
          </button>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-8'>
          <div className='flex justify-end items-center mb-4 gap-2'>
            <HelpButton />
            <NotificationButton />
            <Avatar>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <WrappedComponent {...props} />
        </main>
      </div>
    );
  };
}
