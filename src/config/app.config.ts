// 'development' | 'production' | 'preprod'

export const workSpaceEnvironnement: 'dev' | 'preprod' | 'prod' = 'preprod';

const BASE_URL: Record<'prod' | 'dev' | 'preprod', string> = {
  preprod: 'https://b7ca112edc25.ngrok-free.app',
  prod: 'https://api.valdeli.com/',
  dev: `http://localhost:5000/`,
};

export const env = {
  BASE_URL: BASE_URL[workSpaceEnvironnement],
  VERSION: 'v1/api',
};

export const API_ROOT = {
  agendas: 'agendas',
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
  activities: 'activities',
  activityTypes: 'activity-types',
  beneficiaryTypes: 'beneficiaire-types',
  customFields: 'custom-fields',
  audiences: 'audiences',
  reports: 'reports',
  dashboard: 'dashboard',
  chat: 'chat',
};
