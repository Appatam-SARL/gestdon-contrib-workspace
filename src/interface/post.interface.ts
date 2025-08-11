import { IComment } from './comment.interafce';

export interface IPost {
  _id: string;
  author: string | { _id: string; name: string; address?: any };
  content: {
    text: string;
    images: string[];
    videos: string[];
  };
  likes: [
    {
      user: string;
      createdAt: Date;
    }
  ];
  comments: IComment[] | string[] | [];
  shares: [
    {
      user: string;
      createdAt: Date;
    }
  ];
  visibility: string;
  isEdited: boolean;
  editedAt: Date;
  hashtags: string[];
  mentions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IPostForm {
  author: string;
  content: {
    text: string;
    images: File[] | null;
    videos: File[];
  };
  visibility: string;
}

export interface IPostFilters {
  page?: number;
  limit?: number;
  visibility?: string;
  author?: string;
}

export interface IPotsStore {
  posts: IPost[];
  postForm: IPostForm;

  setPostsStore: <K extends keyof Omit<IPotsStore, 'setPostsStore'>>(
    key: K,
    value: IPotsStore[K]
  ) => void;
}
