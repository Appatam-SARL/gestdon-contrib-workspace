export interface ILog {
  _id: string; // ID du log
  entityType: string; // Type d'entité (Admin, User, etc.)
  entityId: string; // ID de l'entité concernée
  action: string; // Type d'action (login, mfa_setup, etc.)
  status: string; // Statut de l'action (success, failure)
  details?: string; // Détails supplémentaires (message d'erreur, etc.)
  ipAddress?: string; // Adresse IP de la requête
  userAgent?: string; // User-Agent du client
  createdAt: Date; // Date de création du log
}

export interface IlogFilter {
  entityId?: string;
  entityType?: string;
  startDate: string;
  endDate: string;
  page?: number;
  limit?: number;
}

export interface ILogsResponse {
  data: ILog[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type tLogType = 'LOGIN' | 'LOGOUT' | 'MFA_SETUP' | 'MFA_VERIFICATION' | 'MFA_VERIFICATION_FAILED' | 'MFA_VERIFICATION_SUCCESS' | 'MFA_VERIFICATION_FAILED' | 'MFA_VERIFICATION_SUCCESS' | 'MFA_VERIFICATION_FAILED' | 'MFA_VERIFICATION_SUCCESS';