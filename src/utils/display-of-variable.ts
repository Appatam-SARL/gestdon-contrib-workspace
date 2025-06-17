export const displayTypeDocumentPartner = (type: string) => {
  switch (type) {
    case 'DRIVER_LICENSE':
      return 'Permis de conduire';
    case 'VEHICLE_INSURANCE':
      return 'Assurance';
    case 'VEHICLE_REGISTRATION':
      return 'Enregistrement Véhicule';
    case 'OTHER':
      return 'Autre';
    case 'ID_CARD':
      return "Carte d'identité";
    case 'PASSPORT':
      return 'Passeport';
    case 'RESIDENCE_PERMIT':
      return 'Permis de résidence';
    case 'NATIONAL_ID':
      return "Numéro d'identification";
    default:
      return 'Autre';
  }
};

export const displayStatusDocumentPartner = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'APPROVED':
      return 'Validé';
    case 'BLOCKED':
      return 'Bloqué';
    case 'REJECTED':
      return 'Rejeté';
    case 'EXPIRED':
      return 'Expiré';
    case 'ALL':
      return 'Tous';
    default:
      return 'Non uploader';
  }
};

export const displayStatusRelayPoint = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Actif';
    case 'INACTIVE':
      return 'Inactif';
    case 'PENDING':
      return 'En attente';
    case 'SUSPENDED':
      return 'Suspendu';
    case 'CLOSED':
      return 'Fermé';
    default:
      return 'Non uploader';
  }
};

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
    default:
      return '';
  }
};
