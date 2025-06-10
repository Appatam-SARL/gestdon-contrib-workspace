import React,{useState} from 'react'
import PlanCard from '../../../components/Abonnements/PlanCard'
import { Button } from "flowbite-react";
import WHeader from '../../../components/welcome/WHeader';
import { useNavigate } from 'react-router';
const plans = [
    {
      title: "Solidarité",
      description: "Plan d’entrée, gratuit ou à bas prix",
      price: "Gratuit",
      avantages: [
        "Accès aux contenus publics",
        "Suivi de base des activités",
        "Newsletter mensuelle",
      ],
    },
    {
      title: "Participant",
      description: "Plan avec plus de fonctionnalités",
      price: "5 900 FCFA/mois",
      avantages: [
        "Accès aux contenus exclusifs",
        "Outils d’analyse de performance",
        "Support prioritaire",
      ],
    },
    {
      title: "Acteur Social",
      description: "Plan premium, avec visibilité et actions renforcées",
      price: "19 000 FCFA/mois",
      avantages: [
        "Visibilité accrue sur la plateforme",
        "Outils avancés de gestion",
        "Accès à des événements spéciaux",
      ],
      highlight: true,
    },
    {
      title: "Ambassadeur",
      description: "Plan très haut de gamme, pour les partenaires ou sponsors",
      price: "Sur devis",
      avantages: [
        "Accompagnement personnalisé",
        "Accès illimité à toutes les fonctionnalités",
        "Mise en avant premium sur la plateforme",
      ],
    },
  ];
const ChoixPlan = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between w-max-screen  bg-purple-100 relative overflow-hidden">
        <WHeader />
    <main className="min-h-screen bg-white px-4 py-8 flex flex-col items-center rounded-md shadow-md w-full  mt-24">
    <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
      Choisissez votre plan d’abonnement
    </h1>
    <p className="text-gray-600 mb-8 text-center max-w-xl">
      Sélectionnez un plan adapté à votre profil et à vos ambitions sur la plateforme.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
      {plans.map((plan) => (
        <PlanCard
          key={plan.title}
          title={plan.title}
          description={plan.description}
          price={plan.price}
          avantages={plan.avantages}
          selected={selectedPlan === plan.title}
          onClick={() => setSelectedPlan(plan.title)}
        />
      ))}
    </div>

    <div className="flex gap-4 mt-10">
        <Button
          onClick={() => navigate.back()}
          variant="outline"
          className="border bg-white cursor-pointer border-purple-700 text-purple-700 hover:bg-purple-50"
        >
          Retour
        </Button>

        <Button
          className="bg-purple-700 cursor-pointer text-white hover:bg-purple-800 px-8 py-3"
          disabled={!selectedPlan}
        >
          Continuer avec le plan {selectedPlan || "..."}
        </Button>
      </div>
  </main>
  </div>
  )
}

export default ChoixPlan
