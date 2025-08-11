import { useCreatePost } from '@/hook/post.hook';
import { IPostForm } from '@/interface/post.interface';
import useContributorStore from '@/store/contributor.store';
import { Loader2, Send } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

const CreatePost = () => {
  const contibutorId = useContributorStore((s) => s.contributor?._id);
  const [postForm, setPostForm] = React.useState<IPostForm>({
    author: '',
    content: {
      text: '',
      images: [],
      videos: [],
    },
    visibility: 'public',
  });

  const mutationCreatePost = useCreatePost();

  const isSendButtonActive = React.useMemo(() => {
    return postForm.content.text.length > 0;
  }, [postForm.content.text]);

  const handleSubmit = () => {
    const payload = {
      author: contibutorId as string,
      content: postForm.content,
      visibility: postForm.visibility,
    };
    mutationCreatePost.mutate(payload);
    setPostForm({
      author: '',
      content: {
        text: '',
        images: [],
        videos: [],
      },
      visibility: 'public',
    });
  };

  return (
    <Card className='mb-6'>
      <CardContent>
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
            value={postForm.content.text}
            onChange={(e) =>
              setPostForm((prev) => ({
                ...prev,
                content: { ...prev.content, text: e.target.value },
              }))
            }
          />
        </div>
        <div className='flex items-center gap-3 mt-2'>
          {/* <button className='text-blue-600 flex items-center gap-1 text-sm'>
            <span>+ Add hashtag</span>
          </button> */}
          <div className='flex-1' />
          {isSendButtonActive && (
            <Button
              disabled={mutationCreatePost.isPending}
              onClick={handleSubmit}
            >
              {mutationCreatePost.isPending ? (
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
            onChange={(e) =>
              setPostForm((prev) => ({
                ...prev,
                content: {
                  ...prev.content,
                  images: e.target.files ? Array.from(e.target.files) : null,
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
          {/* <button className='flex items-center gap-1 text-sm'>
            <span role='img' aria-label='event'>
              📅
            </span>{' '}
            Event
          </button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
