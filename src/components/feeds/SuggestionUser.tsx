import { Avatar } from '@radix-ui/react-avatar';
import { Loader2, ThumbsUpIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

interface SuggestionUserProps {
  id: string;
  name: string;
  phoneNumber: string;
  mutation: any;
  contributorId: string;
  isFollowing: boolean;
}

const SuggestionUser: React.FC<SuggestionUserProps> = ({
  id,
  name,
  phoneNumber,
  mutation,
  contributorId,
  isFollowing,
}) => (
  <div className='flex items-center gap-3'>
    <Avatar className='w-10 h-10 rounded-full'>
      <AvatarImage src={''} alt={name} className='w-10 h-10 rounded-full' />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
    {/* <img src={img} alt={name} className='w-10 h-10 rounded-full' /> */}
    <div className='flex-1'>
      <Link
        to={`/social-contributor-profile/${id}`}
        className='font-semibold text-sm'
      >
        {name}
      </Link>
      <div className='text-xs text-gray-400 text-wrap'>{phoneNumber}</div>
    </div>
    {isFollowing ? (
      <span className='text-xs bg-gray-100 p-2 rounded-lg cursor-pointer'>
        Relation établie
      </span>
    ) : (
      <Button
        variant={'outline'}
        className='text-xs mt-4'
        disabled={mutation.isPending}
        onClick={() =>
          mutation.mutate({
            followerId: contributorId,
            followedId: id,
          })
        }
      >
        {mutation.isPending ? (
          <Loader2 className='animate-spin text-xs' />
        ) : (
          <>
            <ThumbsUpIcon className='h-4 w-4' />
            <span>Entrer en relation</span>
          </>
        )}
      </Button>
    )}
  </div>
);

export default SuggestionUser;
