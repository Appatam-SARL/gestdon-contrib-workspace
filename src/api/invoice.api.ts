import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';

class InvoiceApi {
  static BASE_URL = API_ROOT.invoices;

  static async downloadInvoice(subscriptionId: string): Promise<Blob> {
    const response = await Axios.get(
      `${this.BASE_URL}/${subscriptionId}/download`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  static async getInvoices(contributorId: string) {
    const response = await Axios.get(
      `${this.BASE_URL}/contributor/${contributorId}`
    );
    return response.data;
  }
}

export default InvoiceApi;
