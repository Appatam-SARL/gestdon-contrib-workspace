import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IFilterOrderState, IOrder } from '@/types/order';
import { AxiosError } from 'axios';

export const getOrders = async (
  filters: IFilterOrderState
): Promise<{
  data: IOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}> => {
  try {
    const response = await Axios.get(`${API_ROOT.orders}/all`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const getOrder = async (id: string) => {
  try {
    if (!id) {
      throw new Error('Id is required');
    }
    const response = await Axios.get(`${API_ROOT.orders}/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const createOrder = async (data: unknown) => {
  try {
    const response = await Axios.post(`${API_ROOT.orders}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const updateOrder = async (id: string, data: unknown) => {
  try {
    if (!id) {
      throw new Error('Id is required');
    }
    const response = await Axios.put(`${API_ROOT.orders}/${id}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const cancelOrder = async (id: string) => {
  try {
    if (!id) {
      throw new Error('Id is required');
    }
    const response = await Axios.put(`${API_ROOT.orders}/${id}/cancel`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const deleteOrder = async (id: string) => {
  try {
    if (!id) {
      throw new Error('Id is required');
    }
    const response = await Axios.delete(`${API_ROOT.orders}/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};
