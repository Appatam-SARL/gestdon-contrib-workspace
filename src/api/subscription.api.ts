import { API_ROOT } from '@/config/app.config';
import { Axios } from '@/config/axiosInstance';
import { IContributor } from '@/interface/contributor';
import { APIResponse } from '@/types/generic.type';
import { tSubscription } from '@/types/souscription.type';
import { IUser } from '@/types/user';
import { AxiosError } from 'axios';

// Interface pour un abonnement actif
export interface ActiveSubscription {
  hasContributor: boolean;
  hasActiveSubscription: boolean;
  subscription: tSubscription;
  contributor: IContributor;
  user: IUser;
}

// Type union pour la réponse
export type SubscriptionStatusResponse = ActiveSubscription;

class SubscriptionApi {
  static BASE_URL = API_ROOT.subscriptions;

  /**
   * Vérifier le statut de l'abonnement du contributeur
   * Retourne soit un abonnement actif, soit une erreur de souscription requise
   */
  static async checkSubscriptionStatus(): APIResponse<SubscriptionStatusResponse> {
    try {
      const response = await Axios.get(
        `${SubscriptionApi.BASE_URL}/check-status`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // Si l'erreur indique qu'une souscription est requise, la retourner
        if (error.response?.data?.code === 'SUBSCRIPTION_REQUIRED') {
          return error.response.data;
        }
        throw new Error(
          error.response?.data?.message ||
            "Erreur lors de la vérification de l'abonnement"
        );
      }
      throw error;
    }
  }

  /**
   * Activer un essai gratuit
   */
  static async createFreeTrialSubscription(
    contributorId: string,
    packageId: string
  ): Promise<APIResponse<any>> {
    try {
      const response = await Axios.post(
        `${SubscriptionApi.BASE_URL}/free-trial`,
        {
          packageId,
          contributorId,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            "Erreur lors de l'activation de l'essai gratuit"
        );
      }
      throw error;
    }
  }

  /**
   * Soumettre une demande de contact pour un package
   */
  static async submitContactRequest(contactData: {
    packageId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    message?: string;
  }): Promise<APIResponse<any>> {
    try {
      const response = await Axios.post(
        `${SubscriptionApi.BASE_URL}/contact-request`,
        contactData
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            "Erreur lors de l'envoi de la demande de contact"
        );
      }
      throw error;
    }
  }

  /**
   * Reccupperer l'historique des abonnements
   */
  static async getSubscriptionHistory(contributorId: string): APIResponse<any> {
    try {
      const response = await Axios.get(
        `${SubscriptionApi.BASE_URL}/contributor/${contributorId}/history`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            "Erreur lors de la récupération de l'historique des abonnements"
        );
      }
      throw error;
    }
  }

  /**
   * Télécharger la facture d'un abonnement
   */
  static async downloadInvoice(
    subscriptionId: string
  ): Promise<{ downloadUrl: string; filename: string }> {
    try {
      const response = await Axios.post(
        `${SubscriptionApi.BASE_URL}/${subscriptionId}/invoice/download`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            'Erreur lors du téléchargement de la facture'
        );
      }
      throw error;
    }
  }
}

export default SubscriptionApi;
