import {
  Building2,
  File,
  LayoutDashboard,
  Package,
  Truck,
  Users,
} from 'lucide-react';

interface SidebarLink {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const sidebarLinks: SidebarLink[] = [
  {
    icon: <LayoutDashboard className='h-5 w-5' />,
    label: 'Tableau de bord',
    href: '/dashboard',
  },
  {
    icon: <Users className='h-5 w-5' />,
    label: 'Activités',
    href: '/activity',
  },
  {
    icon: <Building2 className='h-5 w-5' />,
    label: 'Agenda',
    href: '/agenda',
  },
  {
    icon: <Users className='h-5 w-5' />,
    label: 'Audiences',
    href: '/audiences',
  },
  {
    icon: <Package className='h-5 w-5' />,
    label: 'Don',
    href: '/don',
  },
  {
    icon: <Truck className='h-5 w-5' />,
    label: 'Promesses',
    href: '/promises',
  },
  {
    icon: <Users className='h-5 w-5' />,
    label: 'Communauté',
    href: '/community',
  },
  {
    icon: <File />,
    label: 'Rapports',
    href: '/repport',
  },
  {
    icon: <Users className='h-5 w-5' />,
    label: 'Staff',
    href: '/staff',
  },
];

export default sidebarLinks;
