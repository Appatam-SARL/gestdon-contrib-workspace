import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IDon, IDonFilterForm } from '@/interface/don';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

export class DonApi {
  static BASE_URL = API_ROOT.dons;

  static async getDons(filter: IDonFilterForm): APIResponse<IDon[]> {
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

  static async getDon(id: string): APIResponse<IDon> {
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

  static async createDon(don: any) {
    try {
      const response = await Axios.post(`${this.BASE_URL}`, don);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async updateDon(id: string, don: any) {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${id}`, don);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async deleteDon(id: string) {
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

export default DonApi;
