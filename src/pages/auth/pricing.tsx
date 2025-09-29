import { plans } from '@/assets/constants/pricing';
import PricingItemCard from '@/components/Abonnements/PlanCard';
import WHeader from '@/components/welcome/WHeader';
import { useState } from 'react';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  return (
    <div className='space-y-4'>
      <WHeader />
      <div className='flex flex-col justify-between items-center w-max-screen'>
        <div className='py-8 px-8 flex flex-col items-center justify-center rounded-md w-full h-[100vh]'>
          <h1 className='text-3xl font-bold text-purple-700 mb-6 text-center'>
            Nos plans d’abonnement
          </h1>
          <p className='text-gray-600 mb-8 text-center max-w-xl'>
            Sélectionnez un plan adapté à votre profil et à vos ambitions sur la
            Plateforme.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
            {plans.map((plan) => (
              <PricingItemCard
                key={plan.name}
                name={plan.name}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                selected={selectedPlan === plan.name}
                isPopular={plan.isPopular}
                maxUsers={plan.maxUsers}
                maxFollowing={plan.maxFollowing}
                onClick={() => setSelectedPlan(plan.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
