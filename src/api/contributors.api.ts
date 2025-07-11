import { API_ROOT } from '@/config/app.config';
import { Axios, AxiosOffline } from '@/config/axiosInstance';
import { IContributor } from '@/interface/contributor';
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

  static async getContributors(): Promise<IContributor[]> {
    console.log('API: Getting all contributors');
    // TODO: Implement actual API call
    return Promise.resolve([]);
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
}
