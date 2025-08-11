import CreatePost from '@/components/feeds/CreatePost';
import EventCard from '@/components/feeds/EventCard';
import Post from '@/components/feeds/Post';
import SuggestionUser from '@/components/feeds/SuggestionUser';
import { Button } from '@/components/ui/button';
import { withDashboard } from '@/hoc/withDashboard';
import {
  useFollowContributor,
  useGetContributors,
} from '@/hook/contributors.hook';
import { usePosts } from '@/hook/post.hook';
import { IContributor } from '@/interface/contributor';
import useContributorStore from '@/store/contributor.store';
import { verifyIfContributorExistsInFollowing } from '@/utils';
import { EyeIcon } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

function Feeds() {
  const navigate = useNavigate();
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const contributor = useContributorStore((s) => s.contributor);
  const { data: contributors, isLoading: isLoadingContributorData } =
    useGetContributors({
      search: '',
      limit: 10,
      page: 1,
    });
  const { data: posts, isLoading: isLoadingPost } = usePosts({});
  const mututaionFollow = useFollowContributor();
  console.log('🚀 ~ Feeds ~ contributors:', contributors);

  // On filtre la liste des contributeurs pour afficher seulement les contributeurs qui ne sont pas le contributeur connecté
  const filterDataContributor = contributors?.data?.filter(
    (contributor) => contributor._id !== contributorId
  );

  const events = [
    {
      month: 'Feb',
      day: '21',
      title: 'Newmarket Nights',
      organizer: 'University of Oxford',
      time: '6:00AM',
      duration: '6:00AM - 5:00PM',
      place: 'Cambridge Boat Club, Cambridge',
    },
    {
      month: 'Dec',
      day: '31',
      title: '31st Night Celebration',
      organizer: 'Chamber Music Society',
      time: '11:00PM',
      interested: '280 people interested',
      place: 'Tavern on the Green, New York',
    },
  ];

  return (
    <div className='flex gap-6 min-h-screen p-4'>
      {/* Main Feed */}
      <div className='flex-1 max-w-2xl mx-auto'>
        <CreatePost />
        {isLoadingPost ? (
          <Skeleton
            count={1}
            width='100%'
            height={300}
            style={{ width: '100%' }}
          />
        ) : (
          <>
            {posts?.data?.map((post, idx) => (
              <Post key={post._id} {...post} />
            ))}
          </>
        )}
      </div>
      {/* Right Sidebar */}
      <div className='w-[340px] flex-shrink-0 space-y-6'>
        {/* Birthday */}
        {/* Suggestions */}
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='font-semibold text-lg mb-3'>
            Suivre des contributeurs
          </div>
          <div className='space-y-3'>
            {isLoadingContributorData ? (
              <Skeleton
                count={1}
                width='100%'
                height={300}
                style={{ width: '100%' }}
              />
            ) : (
              <>
                {filterDataContributor?.map(
                  (
                    user: Pick<IContributor, 'name' | 'phoneNumber' | '_id'>
                  ) => (
                    <SuggestionUser
                      key={user.name as string}
                      {...user}
                      id={user._id as string}
                      mutation={mututaionFollow}
                      contributorId={contributorId as string}
                      isFollowing={verifyIfContributorExistsInFollowing(
                        user._id as string,
                        (contributor?.following as string[]) ?? []
                      )}
                    />
                  )
                )}
              </>
            )}
          </div>
          <Button
            variant={'outline'}
            className='text-xs mt-4'
            onClick={() => navigate('/follow-request')}
          >
            <EyeIcon className='h-4 w-4' />
            <span>Voir plus</span>
          </Button>
        </div>
        {/* Events */}
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='font-semibold text-lg mb-3'>Événements à venir</div>
          <div className='space-y-4'>
            {events.map((event, idx) => (
              <EventCard key={idx} {...event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withDashboard(Feeds);
