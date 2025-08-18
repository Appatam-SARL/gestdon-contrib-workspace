// 'development' | 'production' | 'preprod'

export const workSpaceEnvironnement: 'dev' | 'preprod' | 'prod' = 'dev';

const BASE_URL: Record<'prod' | 'dev' | 'preprod', string> = {
  preprod: 'https://b7ca112edc25.ngrok-free.app/',
  prod: 'https://api.contrib.com/',
  dev: `http://localhost:5000/`,
};

export const env = {
  BASE_URL: BASE_URL[workSpaceEnvironnement],
  VERSION: 'v1/api',
};

export const API_ROOT = {
  activities: 'activities',
  activityTypes: 'activity-types',
  agendas: 'agendas',
  audiences: 'audiences',
  beneficiaire: 'beneficiaires',
  beneficiaryTypes: 'beneficiaire-types',
  comments: 'comments',
  chat: 'chat',
  contributors: 'contributors',
  customFields: 'custom-fields',
  dashboard: 'dashboard',
  documents: 'documents',
  dons: 'dons',
  files: 'files',
  logs: 'logs',
  menus: 'menus',
  notifications: 'notifications',
  permissions: 'permissions',
  posts: 'posts',
  promesses: 'promesses',
  reports: 'reports',
  staff: 'admins',
  users: 'users',
  partages: 'partages',
  packages: 'packages',
  subscriptions: 'subscriptions',
  invoices: 'invoices',
};
