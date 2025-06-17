import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IActivity, IActivityFilterForm } from '@/interface/activity';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class ActivityApi {
  static BASE_URL = API_ROOT.activities;

  static async getActivities(
    filter: IActivityFilterForm
  ): APIResponse<IActivity[]> {
    try {
      const response = await Axios.get(`${this.BASE_URL}`, {
        params: filter,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async getActivity(id: string): APIResponse<IActivity> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async createActivity(activity: any): Promise<any> {
    try {
      const response = await Axios.post(`${this.BASE_URL}`, activity);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async updateActivity(id: string, activity: any): Promise<any> {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${id}`, activity);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async deleteActivity(id: string): Promise<any> {
    try {
      const response = await Axios.delete(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
}

export default ActivityApi;
