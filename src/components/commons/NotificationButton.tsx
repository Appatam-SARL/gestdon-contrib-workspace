import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMarkAsRead, useNotification } from '@/hook/notification.hook';
import { BellRingIcon, Loader2, MailOpen } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Exemple de notifications statiques (à remplacer par des props ou du state plus tard)
const notifications = [
  {
    id: 1,
    type: 'reply',
    user: {
      name: 'Emma Watson',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    content: 'replied to your comment : "Hello world 😍"',
    time: 'Just now',
    section: 'NEW',
  },
  {
    id: 2,
    type: 'reaction',
    user: { name: 'Albert Brooks', avatar: null, initials: 'AB' },
    content: "reacted to Mia Khalifa's status",
    time: '9hr',
    section: 'NEW',
    icon: '❤️',
  },
  {
    id: 3,
    type: 'info',
    content:
      "The forecast today shows a low of 20°C in California. See today's weather.",
    time: '1d',
    section: 'EARLIER',
    icon: '🌤️',
  },
];

function NotificationButton() {
  // const unreadCount = notifications.filter((n) => n.section === 'NEW').length;
  const token = localStorage.getItem('token') as string;
  const { data } = useNotification(token, 1, 20);

  const mutationmarkAsRead = useMarkAsRead(token as string);

  const unreadCount = React.useMemo(() => {
    return data?.notifications.filter((n) => n.read === false).length as number;
  }, [data]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='relative p-2'>
          <BellRingIcon className='h-[1.2rem] w-[1.2rem]' />
          {unreadCount > 0 && (
            <Badge
              className='absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs'
              variant='destructive'
            >
              <span className='text-white'>{unreadCount}</span>
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='p-0 w-96 max-w-[95vw]'>
        <div className='border-b px-4 py-3 flex items-center justify-between'>
          <span className='font-semibold text-base'>Notifications</span>
          {/* Popever filter */}
        </div>
        <div className='max-h-80 overflow-y-auto divide-y'>
          {/* Section NEW */}
          {data?.notifications.some((n) => n.read === false) && (
            <div>
              <div className='px-4 pt-3 pb-1 text-xs text-gray-500 font-semibold'>
                NOUVEAU
              </div>
              {data.notifications
                .filter((n) => n.read === false)
                .map((n) => (
                  <div
                    key={n._id}
                    className='flex items-start gap-3 px-4 py-2 hover:bg-gray-50 transition'
                  >
                    {/* Avatar ou Initiales */}
                    {n.userId && (
                      <Avatar>
                        <AvatarImage
                          src={''}
                          alt={n.userId.fullName.slice(0, 2)}
                        />
                        <AvatarFallback>
                          {n.userId.fullName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm'>
                        <span className='font-semibold'>
                          {n.userId?.fullName}
                        </span>{' '}
                        <span>{n.body}</span>
                      </div>
                      <div className='text-xs text-gray-400 mt-0.5'>
                        {n.createdAt}
                      </div>
                    </div>
                    <div>
                      <Button
                        variant='outline'
                        className='text-xs text-gray-500 hover:text-gray-700 transition'
                        onClick={() =>
                          mutationmarkAsRead.mutate({ notificationId: n._id })
                        }
                        disabled={mutationmarkAsRead.isPending}
                      >
                        {mutationmarkAsRead.isPending ? (
                          <Loader2 className='animate-spin text-gray-700' />
                        ) : (
                          <MailOpen className='mr-1' />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {/* Section EARLIER */}
          {data?.notifications.some((n) => n.read === true) && (
            <div>
              <div className='px-4 pt-3 pb-1 text-xs text-gray-500 font-semibold'>
                LU
              </div>
              {data?.notifications
                .filter((n) => n.read === true)
                .map((n) => (
                  <div
                    key={n._id}
                    className='flex items-start gap-3 px-4 py-2 hover:bg-gray-50 transition'
                  >
                    {n.userId && (
                      <Avatar>
                        <AvatarImage
                          src={''}
                          alt={n.userId.fullName.slice(0, 2)}
                        />
                        <AvatarFallback>
                          {n.userId.fullName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm'>
                        <span className='font-semibold'>
                          {n.userId?.fullName}
                        </span>{' '}
                        <span>{n.body}</span>
                      </div>
                      <div className='text-xs text-gray-400 mt-0.5'>
                        {n.createdAt}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className='border-t px-4 py-2 flex justify-center'>
          {/* <Link
            to={'notification'}
            className='text-blue-600 text-sm font-medium hover:underline flex items-center'
          >
            <EyeIcon className='mr-1' />
            <span>Voir plus</span>
          </Link> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default React.memo(NotificationButton);
