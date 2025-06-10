import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import {
  IPromesseFilters,
  tPromesse,
  tPromesseForm,
} from '@/interface/promesse';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class PromesseApi {
  private readonly API_URL = API_ROOT.promesses;

  async createPromesse(promesse: tPromesseForm) {
    try {
      const response = await Axios.post(`${this.API_URL}`, promesse);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      } else {
        throw new Error('Something went wrong');
      }
    }
  }

  async getPromesses(filters: IPromesseFilters): APIResponse<tPromesse[]> {
    try {
      const response = await Axios.get(`${this.API_URL}`, {
        params: filters,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      } else {
        throw new Error('Something went wrong');
      }
    }
  }

  async updatePromesse(id: string, data: tPromesseForm) {
    try {
      const response = await Axios.put(`${this.API_URL}/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      } else {
        throw new Error('Something went wrong');
      }
    }
  }

  async deletePromesse(id: string) {
    try {
      const response = await Axios.delete(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      } else {
        throw new Error('Something went wrong');
      }
    }
  }
}

export default new PromesseApi();
