import { useReplyComment } from '@/hook/comment.hook';
import useContributorStore from '@/store/contributor.store';
import React from 'react';
import { useToast } from '../ui/use-toast';

const ReplyForm = ({ commentId }: { commentId: string }) => {
  const contributorId = useContributorStore((state) => state.contributor?._id);
  const [replyTo, setReplyTo] = React.useState<string | null>(null);
  const { toast } = useToast();

  const mutationReplyComment = useReplyComment();

  const handleReplyComment = () => {
    if (!replyTo) {
      return toast({
        title: 'Erreur',
        description: 'Veuillez saisir un commentaire',
        duration: 5000,
        variant: 'destructive',
      });
    }
    if (!commentId) {
      return toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un commentaire',
        duration: 5000,
        variant: 'destructive',
      });
    }
    mutationReplyComment.mutate({
      commentId,
      data: {
        content: replyTo as string,
        author: contributorId,
        authorType: 'Contributor',
      },
    });
    setReplyTo(null);
  };

  return (
    <div className='flex items-center gap-2 mb-2 ml-8'>
      <img
        src='https://randomuser.me/api/portraits/women/44.jpg'
        alt='user'
        className='w-8 h-8 rounded-full'
      />
      <input
        className='flex-1 bg-[#f3f7fc] rounded-full px-3 py-1 text-sm outline-none'
        placeholder='Ecris un commentaire...'
        value={replyTo as string}
        onChange={(e) => setReplyTo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleReplyComment();
            console.log('replyTo', replyTo);
          }
        }}
      />
    </div>
  );
};

export default ReplyForm;
