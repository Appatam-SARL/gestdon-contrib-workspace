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

  static async createActivity(data: any): APIResponse<IActivity> {
    try {
      const response = await Axios.post(`${this.BASE_URL}`, data);
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

  static async validateActivity(id: string, data: any): Promise<any> {
    try {
      const response = await Axios.post(
        `${this.BASE_URL}/${id}/validate`,
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async archiveActivity(id: string): Promise<any> {
    try {
      const response = await Axios.post(`${this.BASE_URL}/${id}/archive`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async draftActivity(id: string): Promise<any> {
    try {
      const response = await Axios.post(`${this.BASE_URL}/${id}/draft`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async assignActivity(id: string, data: any): Promise<any> {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${id}/assign`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async reportActivity(id: string, data: any): Promise<any> {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${id}/report`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async representative(id: string, data: any): Promise<any> {
    try {
      const response = await Axios.put(
        `${this.BASE_URL}/${id}/assign-representative`,
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async rejectActivity(id: string, data: any): Promise<any> {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${id}/reject`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async getActivityStats(filter: { contributorId: string }) {
    try {
      const response = await Axios.get(`${this.BASE_URL}/stats`, {
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

  static async budgetActivity(id: string, data: any): APIResponse<IActivity> {
    try {
      const response = await Axios.patch(`${this.BASE_URL}/${id}/define-budget`, data);
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
