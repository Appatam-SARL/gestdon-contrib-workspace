import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IUser } from '@/types/user';
import { Loader2, LogOut, Settings, UserIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';

function ProfilButton({
  mutation,
  user,
}: {
  mutation: any;
  user: Partial<IUser>;
}) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      {mutation.isPending ? (
        <Loader2 className='animate-spin text-white' />
      ) : (
        <>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={''} />
              <AvatarFallback>
                {user?.firstName?.[0] + '' + user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
        </>
      )}
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className='gap-2.5'
            onClick={() => navigate(`/staff/${user._id}`)}
          >
            <UserIcon color={'grey'} size={18} />
            <span className='text-sm font-light'>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='gap-2.5'
            onClick={() => navigate('/settings')}
          >
            <Settings color={'grey'} size={18} />
            <span className='text-sm font-light'>Paramètres</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='gap-2.5' onClick={() => mutation.mutate()}>
          <LogOut color={'red'} size={18} />
          <span className='text-sm font-light'>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default React.memo(ProfilButton);
