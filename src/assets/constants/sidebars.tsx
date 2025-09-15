import {
  Activity,
  Banknote,
  CalendarDays,
  FileText,
  Heart,
  HeartHandshakeIcon,
  LayoutDashboard,
  Rss,
  Users,
  Users2,
} from 'lucide-react';

interface SidebarLink {
  icon: React.ReactNode;
  label: string;
  href: string;
  submenu?: SidebarLink[];
}

const sidebarLinks: SidebarLink[] = [
  {
    icon: <LayoutDashboard className='h-5 w-5' />,
    label: 'Tableau de bord',
    href: '/dashboard',
  },
  {
    icon: <Rss className='h-5 w-5' />,
    label: 'Réseau social',
    href: '#',
    submenu: [
      {
        icon: <Rss className='h-5 w-5' />,
        label: "Fil d'actualités",
        href: '/feed',
      },
      {
        icon: <Users2 className='h-5 w-5' />,
        label: 'Mes followers',
        href: '/followers',
      },
      {
        icon: <Heart className='h-5 w-5' />,
        label: "Mes j'aime",
        href: '/following',
      },
    ],
  },
  {
    icon: <Activity className='h-5 w-5' />,
    label: 'Activités',
    href: '/activity',
  },
  {
    icon: <CalendarDays className='h-5 w-5' />,
    label: 'Agenda',
    href: '/agenda',
  },
  {
    icon: <Users className='h-5 w-5' />,
    label: 'Audiences',
    href: '/audiences',
  },
  {
    icon: <Banknote className='h-5 w-5' />,
    label: 'Don',
    href: '/don',
  },
  {
    icon: <HeartHandshakeIcon className='h-5 w-5' />,
    label: 'Promesses',
    href: '/promises',
  },
  {
    icon: <Users className='h-5 w-5' />,
    label: 'Bénéficiaires',
    href: '/community',
  },
  {
    icon: <FileText className='h-5 w-5' />,
    label: 'Rapports',
    href: '/repport',
  },
  {
    icon: <Users className='h-5 w-5' />,
    label: 'Staff',
    href: '/staff',
  },
  {
    icon: <Banknote className='h-5 w-5' />,
    label: 'Finances',
    href: '/mouvement-checkout',
  },
];

export default sidebarLinks;
