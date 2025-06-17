import { IUser } from '@/types/user';

// Types d'entités supportés
type tEntityType = 'AUDIENCE' | 'DON' | 'PROMESSE';
export type tReportStatus = 'PENDING' | 'VALIDATED' | 'REFUSED' | 'ARCHIVED';
type tStatusFollowUp = 'PENDING' | 'DO' | 'REFUSED';

export interface IReport {
  _id: number;
  name: string;
  description: string;
  entityType: tEntityType;
  entityId: string;
  contributorId: string;
  status: tReportStatus;
  commitments: ICommitment[]; // engagements
  followUps: IFollowUp[]; // suivis
  documents?: IDocument[]; // documents
  createdBy?: ICreatedBy; // ID du créateur
  validateBy?: string | IUser; // ID du validateur
  validateDate?: Date; // date de validation
  createdAt: Date | String;
  updatedAt: Date | String;
}

// Interface pour les engagements
export interface ICommitment {
  action: string;
  responsible: {
    firstName: string;
    lastName: string;
  }; // ID du responsable
  dueDate: Date | string; // date échéance
}

// Interface pour les suivis
export interface IFollowUp {
  status: tStatusFollowUp;
  nextReminder: Date | string; // date de la prochaine notification
}

// Interface pour les documents
export interface IDocument {
  fileId: string;
  type: string;
  fileUrl: string;
}

// Interface le redacteur du rapport
interface ICreatedBy {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface IReportFilterForm {
  search?: string;
  page?: number;
  limit?: number;
  contributorId?: string;
}

export type tReportForm = Partial<IReport>;

export type tStatusReport = 'PENDING' | 'VALIDATED' | 'REFUSED' | 'ARCHIVED';

export interface IReportStore {
  reports: IReport[];
  report: Partial<IReport> | null;
  reportForm: tReportForm;
  reportFilterForm: IReportFilterForm;
  setReportStore<K extends keyof Omit<IReportStore, 'setReportStore'>>(
    key: K,
    value: IReportStore[K]
  ): void;
}
