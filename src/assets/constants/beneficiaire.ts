const INIT_BENEFICIARY = {
  fullName: '',
  address: '',
  representant: '',
  contributorId: '',
};

export const TYPE_BENEFICIAIRE = [
  'ORGANISATION MUTUELLE',
  'COMMUNAUTÉ RELIGIEUSE',
  'ASSOCIATION DE MUTUELLE',
  'ASSOCIATION DE SOLIDARITE',
  'ORGANISATION SPIRITUELLE',
  'ENTREPRISE COMMERCIALE',
  'ORGANISATION COMMERCIALE',
];

const INIT_BENEFICIARY_FILTER_FORM = {
  period: {
    from: '',
    to: '',
  },
  contributorId: '',
  limit: 10,
  page: 1,
};

export const BENEFICIAIRE_INITIAL_STATE = INIT_BENEFICIARY;
export const BENEFICIAIRE_FILTER_FORM_INITIAL_STATE =
  INIT_BENEFICIARY_FILTER_FORM;
