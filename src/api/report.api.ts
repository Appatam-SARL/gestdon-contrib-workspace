import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IReport, IReportFilterForm, tReportForm } from '@/interface/report';
import { FormRefusedReportSchema } from '@/schema/report.schema';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

export class ReportApi {
  static BASE_URL = API_ROOT.reports;

  static async getReports(filter: IReportFilterForm): APIResponse<IReport[]> {
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

  static async getReport(id: string): APIResponse<IReport> {
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

  static async getStatsReports(filter: { contributorId: string }): APIResponse<{
    PENDING: number;
    VALIDATED: number;
    REFUSED: number;
    ARCHIVED: number;
  }> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/stats-report`, {
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

  static async createReport(report: unknown): APIResponse<IReport> {
    try {
      const response = await Axios.post(`${this.BASE_URL}`, report);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async updateReport(id: string, report: tReportForm) {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${id}`, report);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async deleteReport(id: string) {
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

  static async validate(id: string, data: { validateBy: string }) {
    try {
      const response = await Axios.patch(
        `${this.BASE_URL}/${id}/validate`,
        data
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

  static async refuse(id: string, data: FormRefusedReportSchema) {
    try {
      const response = await Axios.patch(`${this.BASE_URL}/${id}/refuse`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async archiveReport(id: string): APIResponse<IReport> {
    try {
      const response = await Axios.patch(`${this.BASE_URL}/${id}/archive`);
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

export default ReportApi;
