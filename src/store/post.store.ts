import { IPotsStore } from '@/interface/post.interface';
import { create } from 'zustand';

const usePostsStore = create<IPotsStore>((set) => ({
  posts: [],
  postForm: {
    author: '',
    content: {
      text: '',
      images: null,
      videos: [],
    },
    visibility: 'public',
  },

  setPostsStore: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
}));

export default usePostsStore;
