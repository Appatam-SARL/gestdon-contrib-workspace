import Post from '@/components/feeds/Post';
import { Button } from '@/components/ui/button';
import { withDashboard } from '@/hoc/withDashboard';
import {
  useCountContributorFollowers,
  useCountContributorFollowing,
  useFollowContributor,
  useGetContributorById,
  useUnfollowContributor,
} from '@/hook/contributors.hook';
import { usePosts } from '@/hook/post.hook';
import useContributorStore from '@/store/contributor.store';
import {
  helperFullAddress,
  verifyIfContributorExistsInFollowing,
} from '@/utils';
import { Loader2, MessageCircleMore, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useMemo } from 'react';
import {
  FaFacebook,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router';

// Types pour les props
interface ProfileCardProps {
  totalFollowers: number;
  totalFollowing: number;
  contributor: any;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  isFollowPending: boolean;
  isUnfollowPending: boolean;
}

interface IntroSectionProps {
  description?: string;
}

function ProfileCardLoader() {
  return (
    <div className='bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center'>
      <div className='flex-shrink-0'>
        <Skeleton circle height={128} width={128} />
      </div>
      <div className='flex-1 ml-0 md:ml-8 mt-4 md:mt-0'>
        <div className='flex items-center space-x-2'>
          <Skeleton width={180} height={28} />
          <Skeleton width={24} height={24} />
        </div>
        <div className='text-gray-600'>
          <Skeleton width={160} height={20} />
        </div>
        <div className='text-gray-400'>
          <Skeleton width={120} height={18} />
        </div>
        <div className='mt-4 flex space-x-2'>
          <Skeleton width={100} height={36} />
          <Skeleton width={100} height={36} />
        </div>
      </div>
    </div>
  );
}

function ProfileCard({
  totalFollowers,
  totalFollowing,
  contributor,
  isFollowing,
  onFollow,
  onUnfollow,
  isFollowPending,
  isUnfollowPending,
}: ProfileCardProps) {
  return (
    <div className='bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center'>
      {/* Avatar */}
      <div className='flex-shrink-0'>
        <img
          className='h-32 w-32 rounded-full border-4 border-white object-cover'
          src={
            contributor?.data.avatar ||
            'https://randomuser.me/api/portraits/men/32.jpg'
          }
          alt='Profile'
        />
      </div>
      {/* Main Info */}
      <div className='flex-1 ml-0 md:ml-8 mt-4 md:mt-0'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-2xl font-bold'>{contributor?.data.name}</h2>
          <span className='text-blue-500' title='Vérifié'>
            ✔️
          </span>
        </div>
        <div className='text-gray-600'>{contributor?.data.fieldOfActivity}</div>
        <div className='text-gray-400'>
          {helperFullAddress(contributor?.data.address as any)}
        </div>
        <div className='mt-4 flex space-x-2'>
          {!isFollowing ? (
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={onFollow}
              disabled={isFollowPending}
            >
              {isFollowPending ? (
                <Loader2 className='animate-spin text-gray-700' />
              ) : (
                <>
                  <ThumbsUp />
                  <span>Entrer en relation</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={onUnfollow}
              disabled={isUnfollowPending}
            >
              {isUnfollowPending ? (
                <Loader2 className='animate-spin text-gray-700' />
              ) : (
                <>
                  <ThumbsDown />
                  <span>Quitter en relation</span>
                </>
              )}
            </Button>
          )}
          <Button variant={'outline'} size={'sm'}>
            <MessageCircleMore />
            <span>Message</span>
          </Button>
        </div>
      </div>
      {/* Entreprises & Followers */}
      <div className='mt-6 md:mt-0 md:ml-8 flex flex-col items-center'>
        <div className='text-gray-600 mb-2'>
          {totalFollowers || 0} Abonné(s) . {totalFollowing || 0} Suivie(s)
        </div>
        <div className='flex flex-col space-x-2'>
          <p className='text-gray-400 text-sm'>Suivez-nous sur</p>
          <div className='flex space-x-2'>
            <Button variant={'ghost'} size={'icon'}>
              <FaFacebook className='h-6 text-blue-500' />
            </Button>
            <Button variant={'ghost'} size={'icon'}>
              <FaYoutube className='h-6 text-red-500' />
            </Button>
            <Button variant={'ghost'} size={'icon'}>
              <FaWhatsapp className='h-6 text-green-500' />
            </Button>
            <Button variant={'ghost'} size={'icon'}>
              <FaTiktok className='h-6 text-pink-500' />
            </Button>
            <Button variant={'ghost'} size={'icon'}>
              <FaLinkedin className='h-6 text-purple-500' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntroSection({ description }: IntroSectionProps) {
  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h3 className='font-semibold text-lg mb-2'>Intro</h3>
      <p className='text-gray-700 text-sm'>{description}</p>
    </div>
  );
}

function ExperienceSection() {
  // Pour l'instant, une seule expérience mockée
  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h3 className='font-semibold text-lg mb-2'>Experience</h3>
      <div className='flex items-center space-x-3 mb-2'>
        <img src='/public/payment/google.png' alt='Google' className='h-8' />
        <div>
          <div className='font-bold'>
            Big Data Engineer <span className='text-blue-500'>✔️</span>
          </div>
          <div className='text-gray-500 text-sm'>Google</div>
          <div className='text-gray-400 text-xs'>
            Apr 2012 - Present • 6 yrs 9 mos
          </div>
          <div className='text-gray-400 text-xs'>California, USA</div>
        </div>
      </div>
      {/* Ajoute d'autres expériences ici */}
    </div>
  );
}

function SocialContributorProfile() {
  const idContributor = useParams<{ id: string }>().id;
  const contributorConnected = useContributorStore((s) => s.contributor);
  const {
    data: contributor,
    isLoading,
    isRefetching,
  } = useGetContributorById(idContributor as string);
  // total followers
  const { data: followers } = useCountContributorFollowers(
    idContributor as string
  );
  // total following
  const { data: following } = useCountContributorFollowing(
    idContributor as string
  );
  const { data: posts, isLoading: isLoadingPost } = usePosts({
    author: idContributor as string,
  });

  const mutationUnfollow = useUnfollowContributor();
  const mutationFollow = useFollowContributor();

  const isFollowing = useMemo(() => {
    return verifyIfContributorExistsInFollowing(
      idContributor as string,
      contributorConnected?.following ?? []
    );
  }, [contributorConnected, idContributor]);

  return (
    <div className='bg-gray-100 min-h-screen'>
      {/* Banner */}
      <div
        className='h-48 w-full bg-cover bg-center'
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80')",
        }}
      ></div>

      <div className='max-w-4xl mx-auto -mt-20'>
        {/* Profile Card */}
        {isLoading || isRefetching ? (
          <ProfileCardLoader />
        ) : (
          <ProfileCard
            totalFollowers={followers?.data}
            totalFollowing={following?.data}
            contributor={contributor}
            isFollowing={isFollowing}
            onFollow={() =>
              mutationFollow.mutate({
                followerId: contributorConnected?._id as string,
                followedId: idContributor as string,
              })
            }
            onUnfollow={() =>
              mutationUnfollow.mutate({
                followerId: contributorConnected?._id as string,
                followedId: idContributor as string,
              })
            }
            isFollowPending={mutationFollow.isPending}
            isUnfollowPending={mutationUnfollow.isPending}
          />
        )}

        {/* Intro & Experience */}
        <div className='mt-8 grid grid-cols-1 md:grid-cols-1 gap-6 mb-4'>
          <IntroSection description={contributor?.data.description} />
          {/* <ExperienceSection /> */}
        </div>
        {posts?.data?.map((post, idx) => (
          <Post key={idx} {...post} />
        ))}
      </div>
    </div>
  );
}

export default withDashboard(SocialContributorProfile);
