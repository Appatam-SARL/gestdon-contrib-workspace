import { API_ROOT } from '@/config/app.config';

export class ShareService {
  private static baseUrl = API_ROOT.partages;

  static async enregistrerPartage(
    postId: string,
    plateforme: string
  ): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          plateforme,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement du partage");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du partage:", error);
      throw error;
    }
  }

  static async obtenirStatistiquesPartage(
    postId: string
  ): Promise<{ [key: string]: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/stats/${postId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}
