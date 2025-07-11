const INIT_BENEFICIARY = {
  fullName: '',
  address: '',
  representant: '',
  contributorId: '',
};

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
