import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IBeneficiaryTypeFilters } from '@/interface/beneficiary-type';
import { AxiosError } from 'axios';

class BeneficiaryTypeApi {
  private static baseUrl: string = API_ROOT.beneficiaryTypes;
  static async getBeneficiaryTypes(
    filter: IBeneficiaryTypeFilters
  ): Promise<any> {
    try {
      const response = await Axios.get(`${this.baseUrl}`, {
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
  static async createBeneficiaryType(data: any): Promise<any> {
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

  static async updateBeneficiaryType(data: any): Promise<any> {
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

  static async deleteBeneficiaryType(id: string): Promise<any> {
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

export default BeneficiaryTypeApi;
