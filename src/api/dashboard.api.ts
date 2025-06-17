import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import {
  IActivityTypeStats,
  IBeneficiaryDistributionStats,
  IDashboardStats,
} from '@/interface/dashboard.interface';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class DashboardApi {
  static BASE_URL = API_ROOT.dashboard;

  static async getDashboardStats(
    filter: string = 'month'
  ): APIResponse<IDashboardStats> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/stats`, {
        params: { period: filter },
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

  static async getDashboardsActivitiesByType(
    filter: string = 'month'
  ): APIResponse<IActivityTypeStats[]> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/activities-by-type`, {
        params: { filter },
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

  static async getDashboardsByBeneficiary(
    filter: string = 'month'
  ): APIResponse<IBeneficiaryDistributionStats[]> {
    try {
      const response = await Axios.get(
        `${this.BASE_URL}//beneficiary-distribution`,
        { params: { filter } }
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
}

export default DashboardApi;
