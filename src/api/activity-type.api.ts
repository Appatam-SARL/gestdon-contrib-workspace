import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IActivityType } from '@/interface/activity-type';
import { ActivityFormValues } from '@/pages/online/settings/setting-activity';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class ActivityTypeApi {
  private static baseUrl: string = API_ROOT.activityTypes;
  static async getActivityTypes(): APIResponse<IActivityType[]> {
    try {
      const response = await Axios.get(`${this.baseUrl}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
  static async createActivityType(
    data: ActivityFormValues
  ): APIResponse<IActivityType> {
    try {
      const response = await Axios.post(`${this.baseUrl}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
  static async updateActivityType(data: any): APIResponse<IActivityType> {
    try {
      const response = await Axios.put(`${this.baseUrl}/${data.id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
  static async deleteActivityType(id: string): APIResponse<IActivityType> {
    try {
      const response = await Axios.delete(`${this.baseUrl}/${id}`);
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

export default ActivityTypeApi;
