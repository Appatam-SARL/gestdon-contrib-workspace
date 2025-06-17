import { IDonFilterForm } from '@/interface/don';

// initial state
const INIT_DON = {
  beneficiaire: '',
  montant: 0,
  description: '',
  devise: 'FCFA',
  dateDon: new Date(),
  contributorId: '',
};

const INIT_DON_FILTER_FORM: IDonFilterForm = {
  limit: 10,
  page: 1,
  search: '',
  period: {
    from: '',
    to: '',
  },
  beneficiaire: '',
  contributorId: '',
};

export const DON_INITIAL_STATE = INIT_DON;
export const DON_FILTER_FORM_INITIAL_STATE = INIT_DON_FILTER_FORM;
