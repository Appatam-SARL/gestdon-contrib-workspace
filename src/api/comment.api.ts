import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IComment } from '@/interface/comment.interafce';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class CommentApi {
  static BASE_URL = API_ROOT.comments;

  static async createComment(comment: Partial<IComment>) {
    try {
      if (!comment.post || !comment.author || !comment.content) {
        throw new Error('Comment is not valid');
      }
      const response = await Axios.post(`${CommentApi.BASE_URL}`, comment);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getComments() {
    try {
      const response = await Axios.get(`${CommentApi.BASE_URL}/comment`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getCommentsByPostId(postId: string) {
    try {
      const response = await Axios.get(
        `${CommentApi.BASE_URL}/comment?postId=${postId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async likesComment(commentId: string, likeId: string) {
    try {
      const response = await Axios.post(
        `${CommentApi.BASE_URL}/${commentId}/like`,
        { likeId }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async replyComment(
    commentId: string,
    data: Partial<IComment>
  ): APIResponse<IComment> {
    try {
      const response = await Axios.post(
        `${this.BASE_URL}/${commentId}/reply`,
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error liking post:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error liking post:', error);
        throw error;
      }
    }
  }
}

export default CommentApi;
