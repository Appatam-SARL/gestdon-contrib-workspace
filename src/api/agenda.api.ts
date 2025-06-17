import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
// import { Axios } from '@/config/axiosInstance';
import { AgendaEvent } from '@/interface/agenda';
import { APIResponse } from '@/types/generic.type';
import { AxiosError } from 'axios';

export class AgendaApi {
  static BASE_URL = API_ROOT.agendas;
  static async getEvents(filter: any): APIResponse<AgendaEvent[]> {
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
  static async createEvent(event: AgendaEvent): Promise<AgendaEvent> {
    try {
      const response = await Axios.post(`${this.BASE_URL}`, event);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
  static async updateEvent(
    id: string,
    event: AgendaEvent
  ): Promise<AgendaEvent> {
    try {
      const response = await Axios.put(`${this.BASE_URL}/${id}`, event);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
  static async deleteEvent(id: string): Promise<void> {
    try {
      await Axios.delete(`${this.BASE_URL}/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  }
}
