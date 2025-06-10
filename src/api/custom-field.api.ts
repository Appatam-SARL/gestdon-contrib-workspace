import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { AxiosError } from 'axios';

class CustomFieldApi {
  private static baseUrl: string = API_ROOT.customFields;
  static async getCustomFields(form: string): Promise<any> {
    try {
      const response = await Axios.get(`${this.baseUrl}/${form}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
  static async createCustomField(data: any): Promise<any> {
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

  static async updateCustomField(data: any): Promise<any> {
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

  static async deleteCustomField(id: string): Promise<any> {
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

export default CustomFieldApi;
