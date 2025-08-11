import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { withDashboard } from '@/hoc/withDashboard';
import {
  useFollowContributor,
  useGetContributors,
} from '@/hook/contributors.hook';
import useContributorStore from '@/store/contributor.store';
import { SearchIcon, ThumbsUpIcon } from 'lucide-react';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

function FollowRequest() {
  const contributor = useContributorStore((s) => s.contributor);
  const {
    data: contributors,
    isLoading,
    isRefetching,
  } = useGetContributors({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const mutation = useFollowContributor();
  const handleFollowContributor = async (id: string) => {
    await mutation.mutateAsync({
      followerId: contributor?._id as string,
      followedId: id,
    });
  };

  // Filtrer les contributeurs qui n'existe pas parmis mes following
  const handleVerifyFollowing = (id: string) => {
    return contributor?.following?.some((followingId) => followingId === id);
  };

  const handleFilterIsNotInMyFollowing = (id: string) => {
    const followerId = contributor?._id as string;
    return !handleVerifyFollowing(id) && !handleVerifyFollowing(followerId);
  };

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold'>
          Liste des contributeurs à suivre
        </h2>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Input
              placeholder='Rechercher'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='flex-1 pl-10'
            />
            <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Tous' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tous</SelectItem>
              {/* Ajoutez d'autres filtres si besoin */}
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading || isRefetching ? (
        <Skeleton
          count={1}
          width='100%'
          height={'100vh'}
          style={{ width: '100%' }}
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
          {contributors?.data?.map((follower) => (
            <>
              {handleFilterIsNotInMyFollowing(follower._id) &&
              contributor?._id !== follower._id ? (
                <Card
                  key={follower._id}
                  className='flex flex-col items-center shadow-none'
                >
                  <Avatar className='w-16 h-16'>
                    <AvatarImage
                      src={follower.logo?.fileUrl}
                      alt={follower.name}
                    />
                    <AvatarFallback>{follower.name[0]}</AvatarFallback>
                  </Avatar>
                  <Link
                    to={'/social-contributor-profile/' + follower._id}
                    className='text-primary font-semibold text-lg hover:underline'
                  >
                    {follower.name}
                  </Link>
                  <Button
                    className='mt-0'
                    variant={'outline'}
                    onClick={() => handleFollowContributor(follower._id)}
                  >
                    <ThumbsUpIcon className='h-4 w-4' />
                    <span>Entrer en relation</span>
                  </Button>
                </Card>
              ) : null}
            </>
          ))}
        </div>
      )}
    </div>
  );
}

export default withDashboard(FollowRequest);
