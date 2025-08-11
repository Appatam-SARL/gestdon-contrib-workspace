import { useCreateComment, useLikeComment } from '@/hook/comment.hook';
import { useDeletePost, useLikePost } from '@/hook/post.hook';
import { IPost } from '@/interface/post.interface';
import useContributorStore from '@/store/contributor.store';
import {
  helperFullAddress,
  verifyIfContributorLikeTheComment,
  verifyIfContributorLikeThePost,
} from '@/utils';
import { formatDate } from '@/utils/helperDate';
import {
  EllipsisVertical,
  Loader2Icon,
  MessageCircleMoreIcon,
  PencilIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ShareEmail } from '../email-shar';
import ShareFacebook from '../facebook-share';
import ShareLinkedIn from '../linkedin-share';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ShareWhatsapp } from '../whatsapp-share';
import EditPost from './EditPost';
import ReplyForm from './ReplyForm';

const Post: React.FC<IPost> = ({
  author,
  comments,
  content,
  likes,
  ...props
}) => {
  // contributeur Id
  const contributorId = useContributorStore((state) => state.contributor?._id);
  // Gérer le cas où author peut être un objet ou une chaîne
  const authorName =
    typeof author === 'object' && author !== null && 'name' in author
      ? author.name
      : author;
  const authorId =
    typeof author === 'object' && author !== null && '_id' in author
      ? author._id
      : author;

  const mutationLikePost = useLikePost();
  const mutationLikeComment = useLikeComment();
  const mutationCreateComment = useCreateComment();
  const mutationDeletePost = useDeletePost();

  const isLiked = verifyIfContributorLikeThePost(
    contributorId as string,
    likes
  );

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openAlertDialogDeletePost, setOpenAlertDialogDeletePost] =
    React.useState(false);
  const [comment, setComment] = React.useState<string | null>(null);
  const [replyStates, setReplyStates] = React.useState<{
    [key: string]: boolean;
  }>({});

  const handleCreateComment = () => {
    mutationCreateComment.mutate({
      post: props._id,
      author: contributorId as string,
      content: comment as string,
    });
    setComment(null);
  };

  const toggleReply = (commentId: string) => {
    setReplyStates((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    mutationDeletePost.mutate(id);
    setOpenAlertDialogDeletePost(false);
  };

  return (
    <div className='bg-white rounded-lg shadow p-4 mb-6'>
      <div className='flex items-center justify-between gap-3 mb-2'>
        <div className='flex items-center gap-3'>
          <img
            src={'https://randomuser.me/api/portraits/men/32.jpg'}
            alt={authorName}
            className='w-10 h-10 rounded-full'
          />
          <div>
            <Link
              to={`/social-contributor-profile/${authorId}`}
              className='font-semibold text-blue-700'
            >
              {authorName}
            </Link>
            <div className='text-xs text-gray-500'>
              {formatDate(props.createdAt)} •{' '}
              {typeof author === 'object' &&
              author !== null &&
              'address' in author
                ? helperFullAddress(author.address)
                : ''}{' '}
              •{' '}
              <span className='inline-block w-2 h-2 bg-green-500 rounded-full'></span>
            </div>
          </div>
        </div>
        {contributorId === authorId && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className='text-sm'
                onClick={() => setOpenEditDialog(true)}
              >
                <PencilIcon size={16} />
                <span className='text-sm ml-2.5'>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-sm text-red-500'
                onClick={() => setOpenAlertDialogDeletePost(true)}
              >
                <Trash2Icon size={16} />
                <span className='ml-2.5'>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* Dialogue de suppression */}
        <AlertDialog
          open={openAlertDialogDeletePost}
          onOpenChange={setOpenAlertDialogDeletePost}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Si vous êtes sûr, cliquez sur "Oui, je supprime"
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={mutationDeletePost.isPending}>
                Non, j'annule
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={mutationDeletePost.isPending}
                onClick={() => handleDelete(props._id)}
              >
                {mutationDeletePost.isPending ? (
                  <>
                    <Loader2Icon size={16} className='animate-spin' />
                    <span>Suppression en cours...</span>
                  </>
                ) : (
                  <>
                    <Trash2Icon size={16} />
                    <span>Oui, je supprime</span>
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <EditPost
          post={{
            ...props,
            content: {
              ...content,
              text: content.text,
              images: content.images,
              videos: content.videos,
            },
            likes: likes,
            author: author,
          }}
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
        />
      </div>
      <div className='mb-2'>{content.text}</div>
      {content.images.length > 0 && (
        <div
          className={`grid gap-2 mb-2 ${
            content.images.length > 1 ? 'grid-cols-2' : ''
          }`}
        >
          {content.images.map((img, idx) => (
            <img
              key={idx}
              src={
                // img ??
                'https://images.pexels.com/photos/6192015/pexels-photo-6192015.jpeg'
              }
              alt=''
              className='rounded-lg object-cover h-40 w-full'
            />
          ))}
        </div>
      )}
      <div className='flex items-center gap-6 text-sm text-gray-500 mb-2'>
        <span>{likes.length} J'aime</span>
        <span>{comments.length} Commentaires</span>
      </div>
      <div className='flex items-center justify-between gap-6 border-t pt-2 text-blue-600 text-sm'>
        <div className='flex items-center gap-6'>
          <Button
            variant={'ghost'}
            size={'sm'}
            className='flex items-center gap-1'
            onClick={() =>
              mutationLikePost.mutate({
                postId: props._id,
                data: { userId: contributorId as string },
              })
            }
          >
            {isLiked ? (
              <>
                <ThumbsDownIcon className='text-green-500' />
                <span>J'aime pas</span>
              </>
            ) : (
              <>
                <ThumbsUpIcon />
                <span>J'aime</span>
              </>
            )}
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className='flex items-center gap-1'
          >
            <MessageCircleMoreIcon />
            <span>Commenter</span>
          </Button>
        </div>
        <div className='flex items-center gap-6'>
          <ShareEmail
            url={window.location.href}
            subject={'Partager le post'}
            body={content.text}
          />
          <ShareFacebook
            title='Partager sur Facebook'
            text='Partager sur Facebook'
            image='https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'
          />
          <ShareLinkedIn
            title={content.text}
            text={content.text}
            image={content.images[0]}
          />
          <ShareWhatsapp
            url={window.location.href}
            title={content.text}
            separator=':: '
          />
        </div>
      </div>
      {/* Comments */}
      <div className='mt-3'>
        <div className='flex items-center gap-2 mb-2'>
          <img
            src='https://randomuser.me/api/portraits/women/44.jpg'
            alt='user'
            className='w-8 h-8 rounded-full'
          />
          <input
            className='flex-1 bg-[#f3f7fc] rounded-full px-3 py-1 text-sm outline-none'
            placeholder='Ecris un commentaire...'
            value={comment as string}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateComment();
              }
            }}
          />
        </div>
        {comments.map((c, idx) => (
          <>
            <div className='flex items-start gap-2 mb-0' key={idx}>
              <img
                src={'https://randomuser.me/api/portraits/women/44.jpg'}
                alt={
                  typeof c === 'object' &&
                  c.author &&
                  typeof c.author === 'object'
                    ? c.author.name
                    : 'Utilisateur'
                }
                className='w-8 h-8 rounded-full'
              />
              <div>
                <div className='bg-[#f3f7fc] rounded-lg px-3 py-2 text-sm'>
                  <span className='font-semibold text-blue-700'>
                    {typeof c === 'object' &&
                    c.author &&
                    typeof c.author === 'object'
                      ? c.author.name
                      : 'Utilisateur'}
                  </span>{' '}
                  {typeof c === 'object' ? c.content : c}
                </div>
                <div className='text-xs text-gray-400 mt-1'>
                  {formatDate(
                    typeof c === 'object' ? c.createdAt : c,
                    'DD/MM/YYYY HH:mm'
                  )}
                </div>
              </div>
            </div>
            {/* <div className='flex items-center gap-6 text-sm text-gray-500 mb-2'>
              <span>{comments.length} Commentaires</span>
            </div> */}
            <div className='flex items-center gap-6  text-blue-600 text-sm ml-9'>
              <span>{typeof c === 'object' ? c.likes.length : 0} J'aime</span>
              <Button
                variant={'link'}
                size={'sm'}
                className='flex items-center gap-1 no-underline cursor-pointer'
                onClick={() =>
                  mutationLikeComment.mutate({
                    commentId: typeof c === 'object' ? c._id : c,
                    likeId: contributorId as string,
                  })
                }
              >
                {verifyIfContributorLikeTheComment(
                  contributorId as string,
                  typeof c === 'object' ? c.likes || [] : []
                ) ? (
                  <>
                    <ThumbsDownIcon className='w-4 h-4 text-green-500' />
                    <span>J'aime pas</span>
                  </>
                ) : (
                  <>
                    <ThumbsUpIcon className='w-4 h-4' />
                    <span>J'aime</span>
                  </>
                )}
              </Button>
              <Button
                variant={'link'}
                size={'sm'}
                className='flex items-center gap-1 decoration-none'
                onClick={() => toggleReply(typeof c === 'object' ? c._id : c)}
              >
                <span>Répondre</span>
              </Button>
            </div>
            {replyStates[typeof c === 'object' ? c._id : c] && (
              <ReplyForm commentId={typeof c === 'object' ? c._id : c} />
            )}
            {typeof c === 'object'
              ? c?.replies?.map((c, idx) => (
                  <>
                    <div className='flex items-start gap-2 mb-0 ml-8' key={idx}>
                      <img
                        src={'https://randomuser.me/api/portraits/women/44.jpg'}
                        alt={
                          typeof c === 'object' &&
                          c.author &&
                          typeof c.author === 'object'
                            ? c.author.name
                            : 'Utilisateur'
                        }
                        className='w-8 h-8 rounded-full'
                      />
                      <div>
                        <div className='bg-[#f3f7fc] rounded-lg px-3 py-2 text-sm'>
                          <span className='font-semibold text-blue-700'>
                            {typeof c === 'object' &&
                            c.author &&
                            typeof c.author === 'object'
                              ? c.author.name
                              : 'Utilisateur'}
                          </span>{' '}
                          {typeof c === 'object' ? c.content : c}
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>
                          {formatDate(
                            typeof c === 'object' ? c.createdAt : c,
                            'DD/MM/YYYY HH:mm'
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-6  text-blue-600 text-sm ml-9'>
                      <span>
                        {typeof c === 'object' ? c.likes.length : 0} J'aime
                      </span>
                      <Button
                        variant={'link'}
                        size={'sm'}
                        className='flex items-center gap-1 no-underline cursor-pointer'
                        onClick={() =>
                          mutationLikeComment.mutate({
                            commentId: typeof c === 'object' ? c._id : c,
                            likeId: authorId,
                          })
                        }
                      >
                        {verifyIfContributorLikeTheComment(
                          authorId as string,
                          typeof c === 'object' ? c.likes || [] : []
                        ) ? (
                          <>
                            <ThumbsDownIcon className='w-4 h-4 text-green-500' />
                            <span>J'aime pas</span>
                          </>
                        ) : (
                          <>
                            <ThumbsUpIcon className='w-4 h-4' />
                            <span>J'aime</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant={'link'}
                        size={'sm'}
                        className='flex items-center gap-1 decoration-none'
                        onClick={() =>
                          toggleReply(typeof c === 'object' ? c._id : c)
                        }
                      >
                        <span>Répondre</span>
                      </Button>
                    </div>
                  </>
                ))
              : null}
          </>
        ))}
      </div>
    </div>
  );
};

export default Post;
