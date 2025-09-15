import { API_ROOT } from '@/config/app.config';
import { ICategorieMouvementCheckout } from '@/interface/activity'; 
import { APIResponse } from '@/types/generic.type';
import { Axios } from '@/config/axiosInstance';
import { AxiosError } from 'axios';


class MouvementCheckoutCategoryApi {
  static BASE_URL = API_ROOT.categoriesMouvementCheckout;
  static async getCategoriesMouvementCheckouts(contributorId: string): APIResponse<ICategorieMouvementCheckout[]> {
    try {
      const response = await Axios.get(`${this.BASE_URL}`, {
        params: {
          contributorId: contributorId,
        },
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
  static async createCategorieMouvementCheckout(data: ICategorieMouvementCheckout): APIResponse<ICategorieMouvementCheckout> {
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
  static async updateCategorieMouvementCheckout(id: string, data: ICategorieMouvementCheckout): APIResponse<ICategorieMouvementCheckout> {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
  static async deleteCategorieMouvementCheckout(id: string): APIResponse<ICategorieMouvementCheckout> {
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

export default MouvementCheckoutCategoryApi;