export type tDocOwnerType = 'Contributor' | 'User' | 'Admin' | 'Report';

export type tDocType =
  | 'OTHER'
  | 'ID_CARD'
  | 'PASSPORT'
  | 'RESIDENCE_PERMIT'
  | 'NATIONAL_ID'
  | 'CARD_CMU';

export type tDocStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface IDocument {
  _id?: string;
  owner?: string; // Peut référencer un Driver ou un Vehicle
  ownerType?: tDocOwnerType;
  type?: tDocType; // Type de document (permis de conduire, assurance, etc.)
  number?: string; // Numéro ou identifiant du document
  verified?: boolean; // Si le document a été vérifié par l'administration
  verifiedAt?: Date; // Date de vérification
  verifiedBy?: string; // ID de l'administrateur qui a vérifié le document
  status?: tDocStatus;
  fileUrl: string; // URL vers le fichier stocké (image ou PDF)
  mimeType?: string; // Type de média
  fileId: string; // Taille en octets
  rejectionReason?: string; // Raison du rejet si applicable
  expiryDate?: Date; // Date d'expiration
  createdAt?: Date;
  updatedAt?: Date;
}
