export const constants = {
  // Document
  DOC_OWNER_TYPE: {
    PARTNER: 'PARTNER',
    DRIVER: 'DRIVER',
    VEHICLE: 'VEHICLE',
    ADMIN: 'ADMIN',
    COMPANY: 'COMPANY',
  },

  DOC_STATUS: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
  },
};

export const DOC_TYPES: string[] = [
  'DRIVER_LICENSE',
  'VEHICLE_INSURANCE',
  'VEHICLE_REGISTRATION',
  'OTHER',
  'ID_CARD',
  'PASSPORT',
  'RESIDENCE_PERMIT',
  'NATIONAL_ID',
];
