import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import {
  IBeneficiaire,
  IBeneficiaireFilterForm,
} from '@/interface/beneficiaire';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class BeneficiaireApi {
  static BASE_URL = API_ROOT.beneficiaire;
  static async getBeneficiaries(
    filter: IBeneficiaireFilterForm
  ): APIResponse<IBeneficiaire[]> {
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

  static async getBeneficiary(id: string): APIResponse<IBeneficiaire> {
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

  static async createBeneficiary(beneficiary: Partial<IBeneficiaire>) {
    try {
      const response = await Axios.post(`${this.BASE_URL}`, beneficiary);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async updateBeneficiary(id: string, beneficiary: IBeneficiaire) {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${id}`, beneficiary);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async deleteBeneficiary(id: string) {
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

export default BeneficiaireApi;
