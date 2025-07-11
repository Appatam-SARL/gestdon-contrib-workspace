import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { AxiosError } from 'axios';

class ConversationApi {
  static BASE_URL = API_ROOT.chat;

  static async createConversation(data: any) {
    try {
      const response = await Axios.post(`${this.BASE_URL}/conversations`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
  static async getConversation(id: string) {
    try {
      const response = await Axios.get(`${this.BASE_URL}/conversations/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
  static async sendMessage(id: string, data: any) {
    try {
      const response = await Axios.post(
        `${this.BASE_URL}/conversations/${id}/messages`,
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
  static async closeConversation(id: string) {
    try {
      const response = await Axios.patch(
        `${this.BASE_URL}/conversations/${id}/closed`
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

export default ConversationApi;
