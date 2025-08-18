import { IPackage } from '@/interface/package.interface';

export const plans: IPackage[] = [
  {
    title: 'Solidarité',
    description: 'Plan d’entrée, gratuit ou à bas prix',
    price: 'Gratuit',
    features: [
      'Accès aux contenus publics',
      'Suivi de base des activités',
      'Newsletter mensuelle',
    ],
  },
  {
    title: 'Participant',
    description: 'Plan avec plus de fonctionnalités',
    price: '5 900 FCFA/mois',
    features: [
      'Accès aux contenus exclusifs',
      'Outils d’analyse de performance',
      'Support prioritaire',
    ],
  },
  {
    title: 'Acteur Social',
    description: 'Plan premium, avec visibilité et actions renforcées',
    price: '19 000 FCFA/mois',
    features: [
      'Visibilité accrue sur la plateforme',
      'Outils avancés de gestion',
      'Accès à des événements spéciaux',
    ],
    highlight: true,
  },
  {
    title: 'Ambassadeur',
    description: 'Plan très haut de gamme, pour les partenaires ou sponsors',
    price: 'Sur devis',
    features: [
      'Accompagnement personnalisé',
      'Accès illimité à toutes les fonctionnalités',
      'Mise en avant premium sur la plateforme',
    ],
  },
];
