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

  static async getStatsDon(filter: { contributorId: string }) {
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

  static async confirmDon(token: string, data: { observation: string }) {
    console.log("🚀 ~ DonApi ~ confirmDon ~ data:", data)
    try {
      const response = await Axios.put(`${this.BASE_URL}/confirm-don/${token}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async downloadPdf(id: string) {
    try {
      const response = await Axios.get(`${this.BASE_URL}/${id}/pdf`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async verifyQRCode(token: string) {
    try {
      const response = await Axios.get(`${this.BASE_URL}/verify/${token}`);
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
