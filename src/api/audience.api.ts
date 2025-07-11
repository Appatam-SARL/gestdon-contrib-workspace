// TODO: Import your API client (e.g., axios, fetch wrapper)
// import api from './api';

import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import {
  IAudience,
  IAudienceFilterForm,
  IAudienceForm,
} from '@/interface/audience';
import {
  FormAssignAudienceSchema,
  FormRejectedAudienceSchema,
  FormReportAudienceSchema,
  FormRepresentantAudienceSchema,
  FormValidateAudienceSchema,
} from '@/schema/audience.schema';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class AudienceApi {
  static BASE_URL = API_ROOT.audiences;

  static async getAudiences(
    filter: IAudienceFilterForm
  ): APIResponse<IAudience[]> {
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

  static async getAudience(id: string): APIResponse<IAudience> {
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

  static async createAudience(audience: IAudienceForm): APIResponse<IAudience> {
    try {
      const response = await Axios.post(`${this.BASE_URL}`, audience);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async updateAudience(
    id: string,
    audience: Partial<IAudienceForm>
  ): APIResponse<IAudience> {
    try {
      const response = await Axios.patch(`${this.BASE_URL}/${id}`, audience);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async deleteAudience(id: string): Promise<any> {
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

  static async validateAudience(
    id: string,
    data: FormValidateAudienceSchema
  ): APIResponse<IAudience> {
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

  static async assignAudience(
    id: string,
    data: FormAssignAudienceSchema
  ): APIResponse<IAudience> {
    try {
      const response = await Axios.patch(`${this.BASE_URL}/${id}/assign`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async updateRepresentant(
    id: string,
    data: FormRepresentantAudienceSchema
  ): APIResponse<IAudience> {
    try {
      const response = await Axios.put(
        `${this.BASE_URL}/${id}/representative`,
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

  static async rejectedAudience(
    id: string,
    data: FormRejectedAudienceSchema
  ): APIResponse<IAudience> {
    try {
      const response = await Axios.patch(
        `${this.BASE_URL}/${id}/refused`,
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

  static async archiveAudience(id: string): APIResponse<IAudience> {
    try {
      const response = await Axios.patch(`${this.BASE_URL}/${id}`, {
        status: 'ARCHIVED',
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

  static async brouillonAudience(id: string): APIResponse<IAudience> {
    try {
      const response = await Axios.patch(`${this.BASE_URL}/${id}/brouillon`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }

  static async reportAudience(
    id: string,
    audience: FormReportAudienceSchema
  ): APIResponse<IAudience> {
    try {
      const response = await Axios.patch(
        `${this.BASE_URL}/${id}/report`,
        audience
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

  static async getStatsAudience(filter: {
    contributorId: string;
  }): APIResponse<{
    PENDING: number;
    DRAFT: number;
    VALIDATED: number;
    REFUSED: number;
    ARCHIVED: number;
  }> {
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
}

export default AudienceApi;
