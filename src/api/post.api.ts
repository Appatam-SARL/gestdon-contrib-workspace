import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IPost, IPostFilters, IPostForm } from '@/interface/post.interface';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class PostsAPI {
  static BASE_URL = `${API_ROOT.posts}`;
  static async getPosts(filters: IPostFilters): APIResponse<IPost[]> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/all`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error getting posts:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error getting posts:', error);
        throw error;
      }
    }
  }

  static async getPostById(id: string): APIResponse<IPost> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error getting post:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error getting post:', error);
        throw error;
      }
    }
  }

  static async createPost(post: IPostForm): APIResponse<IPost> {
    try {
      const response = await Axios.post(`${this.BASE_URL}/contributor`, post);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error creating post:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error creating post:', error);
        throw error;
      }
    }
  }

  static async updatePost(post: Partial<IPost>): APIResponse<IPost> {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${post._id}`, post);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error updating post:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error updating post:', error);
        throw error;
      }
    }
  }

  static async deletePost(id: string): Promise<{
    status: string;
    message: string;
  }> {
    try {
      const response = Axios.delete(`${this.BASE_URL}/${id}`);
      return (await response).data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error deleting post:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error deleting post:', error);
        throw error;
      }
    }
  }

  static async likePost(
    postId: string,
    data: { userId: string }
  ): APIResponse<IPost> {
    try {
      const response = await Axios.post(
        `${this.BASE_URL}/${postId}/like`,
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

export default PostsAPI;
