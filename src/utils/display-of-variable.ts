import { tLogType } from "@/types/log.type";

export const getRoleLayout = (role: string) => {
  switch (role) {
    case 'MANAGER':
      return 'Manageur';
    case 'COORDINATOR':
      return 'Coordinateur';
    case 'EDITOR':
      return 'Redacteur';
    default:
      return 'Agent';
  }
};

export const displayStatus = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'APPROVED':
      return 'Validé';
    case 'SUSPENDED':
      return 'Suspendu';
    case 'BLOCKED':
      return 'Bloqué';
    case 'REJECTED':
      return 'Rejeté';
    case 'EXPIRED':
      return 'Expiré';
    case 'ALL':
      return 'Tous';
    default:
      return '';
  }
};

export const displayStatusAudience = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'VALIDATED':
      return 'Validé';
    case 'REFUSED':
      return 'Refusé';
    case 'ARCHIVED':
      return 'Archivé';
    case 'DRAFT':
      return 'Brouillon';
    default:
      return '';
  }
};

export const displayStatusDon = (status: string) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'received':
    case 'validated':
      return 'Reçu';
    case 'refused':
      return 'Refusé';
    default:
      return '';
  }
};

export const displayStatusPromesse = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'APPROVED':
      return 'Validé';
    case 'REJECTED':
      return 'Rejeté';
    case 'RECEIVED':
      return 'Reçu';
    default:
      return '';
  }
};

export const displayStatusActivity = (status: string) => {
  switch (status) {
    case 'Archived':
      return 'Archivé';
    case 'Draft':
      return 'Brouillon';
    case 'Approved':
      return 'Validé';
    case 'Rejected':
      return 'Rejeté';
    case 'Waiting':
      return 'En attente';
    default:
      return '';
  }
};

export const displayStatusReport = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'VALIDATED':
      return 'Validé';
    case 'REFUSED':
      return 'Refusé';
    case 'ARCHIVED':
      return 'Archivé';
    default:
      return '';
  }
};

export const displayLogType = (type: tLogType) => {
  switch (type) {
    case 'LOGIN':
      return 'Connexion';
    case 'LOGOUT':
      return 'Déconnexion';
    case 'MFA_SETUP':
      return 'MFA Setup';
    case 'MFA_VERIFICATION':
      return 'MFA Verification';
    case 'MFA_VERIFICATION_FAILED':
      return 'MFA Verification Failed';
    case 'MFA_VERIFICATION_SUCCESS':
      return 'MFA Verification Success';
    default:
      return '';
  }
};