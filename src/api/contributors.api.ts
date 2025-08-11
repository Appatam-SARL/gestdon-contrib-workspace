import { API_ROOT } from '@/config/app.config';
import { Axios, AxiosOffline } from '@/config/axiosInstance';
import {
  IContributor,
  IContributorFilters,
  IFollow,
} from '@/interface/contributor';
import { ContributorFormValues } from '@/pages/auth/register';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

export class ContributorsAPI {
  static BASE_URL = `${API_ROOT.contributors}`;
  static async createContributor(
    contributor: ContributorFormValues
  ): APIResponse<IContributor> {
    try {
      const response = await AxiosOffline.post(`${this.BASE_URL}`, contributor);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error creating contributor:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error creating contributor:', error);
        throw error;
      }
    }
  }

  static async getContributors(
    filters: IContributorFilters
  ): APIResponse<IContributor[]> {
    try {
      const response = await Axios.get(`${this.BASE_URL}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error getting contributors:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error getting contributors:', error);
        throw error;
      }
    }
  }

  static async getContributorById(id: string): APIResponse<IContributor> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error getting contributor:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error getting contributor:', error);
        throw error;
      }
    }
  }

  static async updateContributor(
    id: string,
    contributor: Partial<IContributor>
  ): Promise<IContributor> {
    console.log('API: Updating contributor', id, contributor);
    // TODO: Implement actual API call
    return Promise.resolve({} as IContributor);
  }

  static async deleteContributor(id: string): Promise<{
    status: string;
    message: string;
  }> {
    try {
      const response = Axios.delete(`${this.BASE_URL}/${id}`);
      return (await response).data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error deleting contributor:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error deleting contributor:', error);
        throw error;
      }
    }
  }

  static async getContributorFollowers(id: string): APIResponse<IFollow[]> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/${id}/followers`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error getting followers:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error getting followers:', error);
        throw error;
      }
    }
  }

  static async getContributorFollowing(id: string): APIResponse<IFollow[]> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/${id}/following`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error getting following:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error getting following:', error);
        throw error;
      }
    }
  }

  // follow
  static async followContributor(data: {
    followerId: string;
    followedId: string;
  }): APIResponse<IContributor> {
    try {
      const response = await Axios.patch(`${this.BASE_URL}/follow`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error following contributor:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error following contributor:', error);
        throw error;
      }
    }
  }

  static async unfollowContributor(data: {
    followerId: string;
    followedId: string;
  }): APIResponse<IContributor> {
    try {
      const response = await Axios.patch(`${this.BASE_URL}/unfollow`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error unfollowing contributor:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error unfollowing contributor:', error);
        throw error;
      }
    }
  }

  static async countContributorFollowers(id: string) {
    try {
      const response = await Axios.get(
        `${this.BASE_URL}/${id}/followers-count`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error counting followers:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error counting followers:', error);
        throw error;
      }
    }
  }

  static async countContributorFollowing(id: string) {
    try {
      const response = await Axios.get(
        `${this.BASE_URL}/${id}/following-count`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error counting following:', error.response?.data);
        throw error.response?.data;
      } else {
        console.error('Error counting following:', error);
        throw error;
      }
    }
  }
}
