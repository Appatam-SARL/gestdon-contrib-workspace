interface Permission {
  menu: string;
  label: string;
  actions: { name: string; value: string; enabled: boolean }[];
}

export const PERMISSION: Permission[] = [
  {
    menu: 'admin',
    label: 'Gestion des administrateurs',
    actions: [
      {
        name: 'Créer un nouvel administrateur',
        value: 'create',
        enabled: false,
      },
      {
        name: 'Lire la liste des administrateurs',
        value: 'read',
        enabled: false,
      },
      { name: 'Modifier un administrateur', value: 'update', enabled: false },
      { name: 'Supprimer un administrateur', value: 'delete', enabled: false },
      { name: 'Exporter les administrateurs', value: 'export', enabled: false },
      { name: 'Importer des administrateurs', value: 'import', enabled: false },
      { name: 'Valider un administrateur', value: 'validate', enabled: false },
    ],
  },
  {
    menu: 'user',
    label: 'Gestion des utilisateurs',
    actions: [
      { name: 'Créer un nouvel utilisateur', value: 'create', enabled: false },
      { name: 'Lire la liste des utilisateurs', value: 'read', enabled: false },
      { name: 'Modifier un utilisateur', value: 'update', enabled: false },
      { name: 'Supprimer un utilisateur', value: 'delete', enabled: false },
    ],
  },
  {
    menu: 'staff',
    label: 'Gestion des membres',
    actions: [
      { name: 'Créer un nouveau membre', value: 'create', enabled: false },
      { name: 'Lire la liste des membres', value: 'read', enabled: false },
      { name: 'Modifier un membre', value: 'update', enabled: false },
      { name: 'Supprimer un membre', value: 'delete', enabled: false },
      { name: 'Exporter les membres', value: 'export', enabled: false },
      { name: 'Importer des membres', value: 'import', enabled: false },
      { name: 'Valider un membre', value: 'validate', enabled: false },
      { name: 'Gérer les permissions', value: 'permissions', enabled: false },
    ],
  },
  {
    menu: 'station',
    label: 'Gestion des gares',
    actions: [
      { name: 'Créer une nouvelle gare', value: 'create', enabled: false },
      { name: 'Lire la liste des gares', value: 'read', enabled: false },
      { name: 'Modifier une gare', value: 'update', enabled: false },
      { name: 'Supprimer une gare', value: 'delete', enabled: false },
      { name: 'Exporter les gares', value: 'export', enabled: false },
      { name: 'Importer des gares', value: 'import', enabled: false },
      { name: 'Valider une gare', value: 'validate', enabled: false },
    ],
  },
  {
    menu: 'care',
    label: 'Gestion des véhicules',
    actions: [
      { name: 'Créer un nouveau véhicule', value: 'create', enabled: false },
      { name: 'Lire la liste des véhicules', value: 'read', enabled: false },
      { name: 'Modifier un véhicule', value: 'update', enabled: false },
      { name: 'Supprimer un véhicule', value: 'delete', enabled: false },
      { name: 'Exporter les véhicules', value: 'export', enabled: false },
      { name: 'Importer des véhicules', value: 'import', enabled: false },
      { name: 'Valider un véhicule', value: 'validate', enabled: false },
    ],
  },
  {
    menu: 'checkout',
    label: 'Gestion des caisses',
    actions: [
      {
        name: 'Créer une nouvelle caisse',
        value: 'create',
        enabled: false,
      },
      { name: 'Lire la liste des caisses', value: 'read', enabled: false },
      { name: 'Modifier une caisse', value: 'update', enabled: false },
      { name: 'Supprimer une caisse', value: 'delete', enabled: false },
    ],
  },
  {
    menu: 'trajectory',
    label: 'Gestion des trajets',
    actions: [
      { name: 'Créer un nouveau trajet', value: 'create', enabled: false },
      { name: 'Lire la liste des trajets', value: 'read', enabled: false },
      { name: 'Modifier un trajet', value: 'update', enabled: false },
      { name: 'Supprimer un trajet', value: 'delete', enabled: false },
      { name: 'Exporter les trajets', value: 'export', enabled: false },
      { name: 'Importer des trajets', value: 'import', enabled: false },
      { name: 'Valider un trajet', value: 'validate', enabled: false },
    ],
  },
  {
    menu: 'log',
    label: "Gestion des historiques d'actions",
    actions: [
      { name: 'Créer un nouveau log', value: 'create', enabled: true },
      { name: 'Lire la liste des logs', value: 'read', enabled: true },
      { name: 'Modifier un log', value: 'update', enabled: true },
      { name: 'Supprimer un log', value: 'delete', enabled: true },
      { name: 'Exporter les logs', value: 'export', enabled: true },
      { name: 'Importer des logs', value: 'import', enabled: true },
    ],
  },
  {
    menu: 'trips',
    label: 'Gestion des départs',
    actions: [
      { name: 'Créer un nouveau départ', value: 'create', enabled: true },
      { name: 'Lire la liste des départs', value: 'read', enabled: true },
      { name: 'Modifier un départ', value: 'update', enabled: true },
      { name: 'Supprimer un départ', value: 'delete', enabled: true },
      { name: 'Exporter les départs', value: 'export', enabled: true },
      { name: 'Importer des départs', value: 'import', enabled: true },
    ],
  },
];
