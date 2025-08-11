import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useGetContributorFollowers } from '@/hook/contributors.hook';
import useContributorStore from '@/store/contributor.store';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

function Followers() {
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const {
    data: followers,
    isLoading,
    isRefetching,
  } = useGetContributorFollowers(contributorId as string);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Filtrage simple
  const filteredFollowers = followers?.data?.filter((follower) =>
    follower.name.toLowerCase().includes(search.toLowerCase())
  );
  console.log('🚀 ~ Followers ~ filteredFollowers:', filteredFollowers);

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold'>
          ({followers?.data.length}) Abonné(s)
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
          {Number(filteredFollowers?.length) > 0 ? (
            filteredFollowers?.map((follower) => (
              <Card
                key={follower._id}
                className='flex flex-col items-center p-6 shadow-md'
              >
                <Avatar className='w-24 h-24 mb-3 bg-linear-0 bg-no-repeat bg-center'>
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
              </Card>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <h3 className='text-center text-xl font-semibold'>
                Aucun compte suivi
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default withDashboard(Followers);
