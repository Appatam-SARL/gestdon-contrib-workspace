import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { AxiosError } from 'axios';

class MenuApi {
  static BASE_URL = API_ROOT.menus;
  static async getMenus(filter: { contributorId: string }) {
    try {
      if (!filter.contributorId) throw new Error('contributorId is required');
      const response = await Axios.get(this.BASE_URL, {
        params: {
          contributorId: filter.contributorId,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof AxiosError ? error.response?.data.message : error
      );
    }
  }
}

export default MenuApi;
