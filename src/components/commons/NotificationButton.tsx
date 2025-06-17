import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BellRingIcon } from 'lucide-react';

export function NotificationButton() {
  const handleNotificationClick = () => {
    // Implement notification functionality here (e.g., open a notification dialog)
    console.log('Notification button clicked');
    alert('Notification functionality not yet implemented.');
  };

  return (
    <Button variant='outline' onClick={handleNotificationClick}>
      <BellRingIcon className='h-[1.2rem] w-[1.2rem]' />
      <Badge
        className='h-5 min-w-5 rounded-full px-1 font-mono tabular-nums'
        variant='destructive'
      >
        99
      </Badge>
    </Button>
  );
}
