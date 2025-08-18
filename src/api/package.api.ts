import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IPackage } from '@/interface/package.interface';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class PackageApi {
  static BASE_URL = API_ROOT.packages;
  static async getPackages(): APIResponse<IPackage[]> {
    try {
      const response = await Axios.get(PackageApi.BASE_URL);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      }
      throw error;
    }
  }
  static async getPackage(id: string): APIResponse<IPackage> {
    try {
      const response = await Axios.get(`${PackageApi.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      }
      throw error;
    }
  }
}

export default PackageApi;
