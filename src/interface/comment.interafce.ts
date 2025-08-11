import { IContributor } from './contributor';
import { IPost } from './post.interface';

export interface IComment {
  _id: string;
  post: string | IPost;
  author: IContributor | string;
  authorType: 'Contributor' | 'Fan';
  content: String;
  likes: [
    {
      user: string | IContributor;
      createdAt: Date;
    }
  ];
  replies: string[] | IComment[];
  parentComment: string | IComment;
  mentions: string;
  isEdited: Boolean;
  editedAt: Date;
  createdAt: string;
}

export interface ICommentForm {
  post: string | IPost;
  author: string | IContributor;
  content: string;
  mentions?: string;
  parentComment?: string | IComment;
}

export interface ICommentStore {
  comments: IComment[] | [];
  commentForm: ICommentForm | null;
  setCommentStore: <K extends keyof ICommentStore>(
    key: K,
    value: ICommentStore[K]
  ) => void;
}
