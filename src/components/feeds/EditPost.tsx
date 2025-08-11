import { useUpdatePost } from '@/hook/post.hook';
import { IPost, IPostForm } from '@/interface/post.interface';
import { Loader2, Send } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';

interface IEditPostProps {
  post: Partial<IPost>;
  openEditDialog: boolean;
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPost: React.FC<IEditPostProps> = ({
  post,
  openEditDialog,
  setOpenEditDialog,
}) => {
  const [postForm, setPostForm] = React.useState<IPostForm>({
    author: '',
    content: {
      text: '',
      images: [],
      videos: [],
    },
    visibility: 'public',
  });

  const mutationEditPost = useUpdatePost(setOpenEditDialog);

  React.useEffect(() => {
    if (!post) return;
    setPostForm({
      author: post.author as string,
      content: {
        text: post?.content?.text as string,
        images: post?.content?.images as File[] | [],
        videos: post?.content?.videos as [],
      },
      visibility: post?.visibility as string,
    });
  }, [post]);

  const isSendButtonActive = React.useMemo(() => {
    return postForm.content.text.length > 0;
  }, [postForm.content.text]);

  const handleSubmit = () => {
    const payload: unknown = {
      ...post,
      content: postForm.content,
      author: typeof post.author === 'string' ? post.author : post?.author?._id,
    };
    mutationEditPost.mutate(payload as unknown as IPost);
  };

  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le post</DialogTitle>
          <DialogDescription>
            <div className='flex items-center gap-3 mb-2'>
              <img
                src='https://randomuser.me/api/portraits/women/44.jpg'
                alt='user'
                className='w-10 h-10 rounded-full'
              />
              <textarea
                className='flex-1 bg-[#f3f7fc] px-4 py-2 outline-none'
                placeholder='De quoi veux-tu parler ?'
                rows={4}
                value={postForm.content.text as string}
                onChange={(e) =>
                  setPostForm((prev) => ({
                    ...prev,
                    content: { ...prev.content, text: e.target.value },
                  }))
                }
              />
            </div>
            <div className='flex items-center gap-3 mt-2'>
              <button className='text-blue-600 flex items-center gap-1 text-sm'>
                <span>+ Add hashtag</span>
              </button>
              <div className='flex-1' />
              {isSendButtonActive && (
                <Button
                  disabled={mutationEditPost.isPending}
                  onClick={handleSubmit}
                >
                  {mutationEditPost.isPending ? (
                    <Loader2 className='animate-spin text-gray-700' />
                  ) : (
                    <>
                      <Send className='mr-1' />
                      <span>Publier</span>
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className='flex gap-3 mt-3'>
              <Input
                type='file'
                id='file'
                style={{ display: 'none' }}
                value={postForm.content.images as unknown as string[]}
                onChange={(e) =>
                  setPostForm((prev) => ({
                    ...prev,
                    content: {
                      ...prev.content,
                      images: e.target.files
                        ? Array.from(e.target.files)
                        : null,
                    },
                  }))
                }
              />
              <label htmlFor='file' className='flex items-center gap-1 text-sm'>
                <span role='img' aria-label='image'>
                  🖼️
                </span>{' '}
                Image
              </label>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditPost;
