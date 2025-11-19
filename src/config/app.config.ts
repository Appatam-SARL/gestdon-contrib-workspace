// 'development' | 'production' | 'preprod'

export const workSpaceEnvironnement: 'dev' | 'preprod' | 'prod' = 'prod';

const BASE_URL: Record<'prod' | 'dev' | 'preprod', string> = {
  preprod: 'https://2c6bbe3e8ce3.ngrok-free.app/',
  prod: 'https://contrib-api.appatam.com/',
  dev: `https://unfragrantly-unharsh-jameson.ngrok-free.dev/`,
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
  media: 'media',
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
  mouvementCheckout: 'mouvements',
  typesMouvementCheckout: 'type-mouvement-checkouts',
  categoriesMouvementCheckout: 'category-mouvement-checkouts',
};
