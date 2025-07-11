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

  static async getDashboardStats(filter: {
    period: string;
    contributorId: string;
  }): APIResponse<IDashboardStats> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/stats`, {
        params: { period: filter.period, contributorId: filter.contributorId },
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

  static async getDashboardsActivitiesByType(filter: {
    period: string;
    contributorId: string;
  }): APIResponse<IActivityTypeStats[]> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/activities-by-type`, {
        params: {
          period: filter.period,
          contributorId: filter.contributorId,
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

  static async getDashboardsByBeneficiary(filter: {
    period: string;
    contributorId: string;
  }): APIResponse<IBeneficiaryDistributionStats[]> {
    try {
      const response = await Axios.get(
        `${this.BASE_URL}/beneficiary-distribution`,
        {
          params: {
            period: filter.period,
            contributorId: filter.contributorId,
          },
        }
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
