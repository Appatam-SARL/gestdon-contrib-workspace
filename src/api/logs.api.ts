import { API_ROOT } from '@/config/app.config';
import { AxiosError } from 'axios';
import { Axios } from '../config/axiosInstance';

export const getLogs = async (
  entityId: string,
  entityType: string,
  filter: any
) => {
  try {
    if (!entityId || !entityType) {
      throw new Error('EntityId and entityType are required');
    }
    const response = await Axios.get(
      `${API_ROOT.logs}/entity/${entityType}/${entityId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        params: filter,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};
