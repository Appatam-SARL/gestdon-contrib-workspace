import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IPermission } from '@/interface/permission';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

class PermissionApi {
  private static BASE_URL = `${API_ROOT.permissions}`;
  static async createPermissionByadminId(
    adminId: string,
    data: IPermission
  ): Promise<APIResponse<IPermission>> {
    try {
      const response = await Axios.post(
        `${this.BASE_URL}/create/${adminId}`,
        data
      );
      return await response.data;
    } catch (error) {
      throw new Error(
        error instanceof AxiosError ? error.response?.data.message : error
      );
    }
  }
  static async getPermissionByadminId(
    adminId: string
  ): Promise<APIResponse<IPermission>> {
    try {
      const response = await Axios.get(`${this.BASE_URL}/get/${adminId}`);
      return await response.data;
    } catch (error) {
      throw new Error(
        error instanceof AxiosError ? error.response?.data.message : error
      );
    }
  }

  static async updatePermissionByadminId(
    adminId: string,
    data: IPermission[]
  ): Promise<APIResponse<IPermission>> {
    try {
      const response = await Axios.put(
        `${this.BASE_URL}/update/${adminId}`,
        data
      );
      return await response.data;
    } catch (error) {
      throw new Error(
        error instanceof AxiosError ? error.response?.data.message : error
      );
    }
  }
}

export default PermissionApi;
