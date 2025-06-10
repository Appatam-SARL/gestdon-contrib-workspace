// 'development' | 'production' | 'preprod'

export const workSpaceEnvironnement: 'dev' | 'preprod' | 'prod' = 'dev';

const BASE_URL: Record<'prod' | 'dev' | 'preprod', string> = {
  preprod: 'https://api-pp.valdeli.com/',
  prod: 'https://api.valdeli.com/',
  dev: `http://localhost:5000/`,
};

export const env = {
  BASE_URL: BASE_URL[workSpaceEnvironnement],
  VERSION: 'v1/api',
};

export const API_ROOT = {
  documents: 'documents',
  files: 'files',
  logs: 'logs',
  staff: 'admins',
  users: 'users',
  contributors: 'contributors',
  permissions: 'permissions',
  dons: 'dons',
  beneficiaire: 'beneficiaires',
  promesses: 'promesses',
  activityTypes: 'activity-types',
  beneficiaryTypes: 'beneficiaire-types',
  customFields: 'custom-fields',
};
