import { API_ROOT } from "@/config/app.config";
import { ITypeMouvementCheckout } from "@/interface/activity";
import { Axios } from "@/config/axiosInstance";
import { AxiosError } from "axios";
import { APIResponse } from "@/types/generic.type";

class MouvementCheckoutTypeApi {
  private static baseUrl: string = API_ROOT.typesMouvementCheckout;
  static async getTypesMouvementCheckoutsByContributorId(contributorId: string): APIResponse<ITypeMouvementCheckout[]> {
    try {
      const response = await Axios.get(`${this.baseUrl}`, {
        params: {
          contributorId: contributorId,
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
  static async createTypeMouvementCheckout(data: ITypeMouvementCheckout): APIResponse<ITypeMouvementCheckout> {
    try {
      const response = await Axios.post(`${this.baseUrl}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
  } 
  static async updateTypeMouvementCheckout(id: string, data: ITypeMouvementCheckout): APIResponse<ITypeMouvementCheckout> {
    try {
      const response = await Axios.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error(error as string);
      }
    }
    }
  static async deleteTypeMouvementCheckout(id: string): APIResponse<ITypeMouvementCheckout> {
    try {
      const response = await Axios.delete(`${this.baseUrl}/${id}`);
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

export default MouvementCheckoutTypeApi;