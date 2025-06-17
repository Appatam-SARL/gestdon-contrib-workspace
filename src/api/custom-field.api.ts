import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { ICustomFieldOption } from '@/interface/custom-field';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class CustomFieldApi {
  private static baseUrl: string = API_ROOT.customFields;
  static async getCustomFields(
    form: string,
    ownerId: string,
    searchQuery?: string,
    page?: number,
    limit?: number
  ): APIResponse<ICustomFieldOption[]> {
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (page) {
        params.append('page', page.toString());
      }
      if (limit) {
        params.append('limit', limit.toString());
      }
      const response = await Axios.get(`${this.baseUrl}/${form}/${ownerId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error(error as string);
    }
  }
  static async createCustomField(data: any): Promise<any> {
    try {
      const response = await Axios.post(`${this.baseUrl}/${data.form}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error(error as string);
    }
  }

  static async updateCustomField(data: any): Promise<any> {
    try {
      const payload = {
        entityId: data.data.entityId,
        entityType: data.data.entityType,
        form: data.data.form,
        ownerId: data.data.ownerId,
        fields: data.data.fields,
      };
      const response = await Axios.put(
        `${this.baseUrl}/${data.data.form}/${data.id}`,
        payload
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error(error as string);
    }
  }

  static async deleteCustomField(
    form: string,
    fieldId: string,
    data: { entityType: string; ownerId: string }
  ): Promise<any> {
    try {
      const response = await Axios.delete(
        `${this.baseUrl}/${form}/${fieldId}`,
        { data }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error(error as string);
    }
  }
}

export default CustomFieldApi;
