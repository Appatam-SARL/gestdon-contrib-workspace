import { API_ROOT } from "@/config/app.config";
import { Axios } from "@/config/axiosInstance";
import { IMouvementCheckout, ISummaryMouvementCheckout, ITypeMouvementCheckout } from "@/interface/activity";
import { APIResponse } from "@/types/generic.type";

class MouvementCheckoutApi {
  static BASE_URL = API_ROOT.mouvementCheckout;
  static BASE_URL_TYPES = API_ROOT.typesMouvementCheckout;

  static async getMouvementCheckouts(filter: {
    contributorId: string;
    activityId?: string;
  }): APIResponse<IMouvementCheckout[]> {
    const response = await Axios.get(`${this.BASE_URL}`, {
      params: filter,
    });
    return response.data;
  }
  static async getTypesMouvementCheckouts(filter: {contributorId: string}): APIResponse<ITypeMouvementCheckout[]> {
    const response = await Axios.get(`${this.BASE_URL_TYPES}`, {
      params: filter,
    });
    return response.data;
  }
  static async createMouvementCheckout(data: IMouvementCheckout): APIResponse<IMouvementCheckout> {
    const response = await Axios.post(`${this.BASE_URL}`, data);
    return response.data;
  }
  static async createTypeMouvementCheckout(data: ITypeMouvementCheckout): APIResponse<ITypeMouvementCheckout> {
    const response = await Axios.post(`${this.BASE_URL_TYPES}`, data);
    return response.data;
  }
  static async getSummaryMouvementCheckouts(filter: {contributorId: string, activityId?: string}): APIResponse<ISummaryMouvementCheckout> {
    const response = await Axios.get(`${this.BASE_URL}/summary`, {
      params: filter,
    });
    return response.data;
  }
  static async deleteMouvementCheckout(id: string): APIResponse<IMouvementCheckout> {
    const response = await Axios.delete(`${this.BASE_URL}/${id}`);
    return response.data;
  }
}

export default MouvementCheckoutApi;