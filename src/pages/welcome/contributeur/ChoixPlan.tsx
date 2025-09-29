import PricingItemCard from '@/components/Abonnements/PlanCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import WHeader from '@/components/welcome/WHeader';
import { usePackages } from '@/hook/package.hook';
import { IPackage } from '@/interface/package.interface';
import usePackageStore from '@/store/package.store';
import { Banknote, Gift, Phone, Star, Undo2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const ChoixPlan = () => {
  const navigate = useNavigate();
  const {toast} = useToast()
  const [selectedPlan, setSelectedPlan] = useState<IPackage | null>(null);
  const { setPackageStore, packages } = usePackageStore((state) => state);
  const { isLoading, error } = usePackages();

  // useEffect(() => {
  //   if (packages && packages.length > 0) {
  //     setSelectedPlan(packages[0]);
  //   }
  // }, [packages]);

  const getPackageType = (packageName: string) => {
    if (!packageName) return 'UNKNOWN';

    const name = packageName.toLowerCase();
    if (name.includes('solidarité') || name.includes('SOLIDARITÉ'))
      return 'FREE';
    if (name.includes('ambassadeur')) return 'CONTACT_REQUIRED';
    return 'PAID';
  };

  const getPackageBadge = (packageName: string) => {
    const type = getPackageType(packageName);

    switch (type) {
      case 'FREE':
        return (
          <Badge className='bg-green-100 text-green-800 border-green-200'>
            <Gift className='w-3 h-3 mr-1' />
            Gratuit
          </Badge>
        );
      case 'CONTACT_REQUIRED':
        return (
          <Badge className='bg-blue-100 text-blue-800 border-blue-200'>
            <Phone className='w-3 h-3 mr-1' />
            Contact Requis
          </Badge>
        );
      case 'PAID':
        return (
          <Badge className='bg-purple-100 text-purple-800 border-purple-200'>
            <Banknote className='w-3 h-3 mr-1' />
            Payant
          </Badge>
        );
      default:
        return null;
    }
  };

  const getButtonText = (packageName: string) => {
    const type = getPackageType(packageName);

    switch (type) {
      case 'FREE':
        return 'Activer gratuitement';
      case 'CONTACT_REQUIRED':
        return 'Nous contacter';
      case 'PAID':
        return 'Continuer avec ce plan';
      default:
        return 'Continuer';
    }
  };

  const handleContinue = () => {
    if (!selectedPlan) return;

    const packageType = getPackageType(selectedPlan.name);

    if (packageType === 'FREE') {
      navigate('/paiement/' + selectedPlan._id);
    } else if (packageType === 'CONTACT_REQUIRED') {
      navigate('/paiement/' + selectedPlan._id);
    } else {
      navigate('/paiement/' + selectedPlan._id);
    }
  };

  return (
    <div className='flex flex-col justify-between w-max-screen  bg-purple-100 relative overflow-hidden'>
      <WHeader />
      <main className='min-h-screen px-4 py-8 flex flex-col items-center w-full  mt-24'>
        <div className='mb-8'>
          <h1 className='font-bold text-purple-700 mb-4 text-4xl'>
            Choisissez votre plan d'abonnement
          </h1>
          <p className='text-gray-600 mb-4 text-lg max-w-2xl mx-auto text-center'>
            Sélectionnez un plan adapté à votre profil et à vos ambitions sur la
            plateforme.
          </p>

          <div className='flex flex-wrap justify-center gap-4 mt-6'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Gift className='w-4 h-4 text-green-600' />
              <span>Package gratuit avec période d'essai</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Phone className='w-4 h-4 text-blue-600' />
              <span>Contact direct avec notre équipe</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Banknote className='w-4 h-4 text-purple-600' />
              <span>Paiement en ligne sécurisé</span>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className='flex items-center justify-center w-full py-12'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
              <p className='text-gray-600'>
                Chargement des plans d'abonnement...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 w-full max-w-2xl'>
            <div className='text-center'>
              <div className='text-red-600 mb-2'>
                <Undo2 className='w-8 h-8 mx-auto' />
              </div>
              <h3 className='text-lg font-semibold text-red-800 mb-2'>
                Erreur de chargement
              </h3>
              <p className='text-red-600 mb-4'>
                Impossible de charger les plans d'abonnement. Veuillez
                réessayer.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant='outline'
                className='border-red-300 text-red-700 hover:bg-red-50'
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !error && packages && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl'>
            {packages?.map((plan) => {
              const isSelected = selectedPlan?._id === plan._id;
              return (
                <div key={plan._id} className='relative'>
                  <div className='absolute top-3 right-3 z-10'>
                    {getPackageBadge(plan.name)}
                  </div>

                  <PricingItemCard
                    selected={isSelected}
                    onClick={() => {
                      toast({
                        title: 'Plan sélectionné',
                        description: plan.name,
                        duration: 5000,
                      });
                      setSelectedPlan(plan);
                      setPackageStore('package', plan);
                    }}
                    {...plan}
                  />

                  {isSelected && (
                    <div className='absolute -top-2 -left-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center'>
                      <Star className='w-5 h-5 text-white' />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className='flex flex-col items-center gap-6 mt-12'>
          {selectedPlan && (
            <div className='bg-white rounded-lg shadow-lg p-6 border-2 border-purple-200 max-w-2xl w-full'>
              <div className='text-center'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  Plan sélectionné :{' '}
                  <span className='text-purple-700'>{selectedPlan.name}</span>
                </h3>
                <p className='text-gray-600 mb-4'>{selectedPlan.description}</p>

                {getPackageType(selectedPlan.name) === 'FREE' && (
                  <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-4'>
                    <div className='flex items-center gap-2 text-green-700'>
                      <Gift className='w-5 h-5' />
                      <span className='font-semibold'>
                        Package gratuit - 1 mois d'essai
                      </span>
                    </div>
                    <p className='text-green-600 text-sm mt-1'>
                      Aucun paiement requis. Votre compte sera activé
                      immédiatement.
                    </p>
                  </div>
                )}

                {getPackageType(selectedPlan.name) === 'CONTACT_REQUIRED' && (
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
                    <div className='flex items-center gap-2 text-blue-700'>
                      <Phone className='w-5 h-5' />
                      <span className='font-semibold'>
                        Contact direct avec notre équipe
                      </span>
                    </div>
                    <p className='text-blue-600 text-sm mt-1'>
                      Nous vous contacterons pour discuter de vos besoins
                      spécifiques.
                    </p>
                  </div>
                )}

                {getPackageType(selectedPlan.name) === 'PAID' && (
                  <div className='bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4'>
                    <div className='flex items-center gap-2 text-purple-700'>
                      <Banknote className='w-5 h-5' />
                      <span className='font-semibold'>
                        Paiement en ligne sécurisé
                      </span>
                    </div>
                    <p className='text-purple-600 text-sm mt-1'>
                      Choisissez votre durée d'abonnement et effectuez le
                      paiement.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className='flex gap-4'>
            <Button
              onClick={() => navigate(-1)}
              variant='outline'
              className='border bg-white cursor-pointer border-purple-700 text-purple-700 hover:bg-purple-50 px-8 py-3'
            >
              <Undo2 className='w-5 h-5 mr-2' />
              <span>Retour</span>
            </Button>

            <Button
              className='bg-purple-700 cursor-pointer text-white hover:bg-purple-800 px-8 py-3'
              disabled={!selectedPlan}
              onClick={handleContinue}
            >
              {selectedPlan && (
                <>
                  {getPackageType(selectedPlan.name) === 'FREE' && (
                    <Gift className='w-5 h-5 mr-2' />
                  )}
                  {getPackageType(selectedPlan.name) === 'CONTACT_REQUIRED' && (
                    <Phone className='w-5 h-5 mr-2' />
                  )}
                  {getPackageType(selectedPlan.name) === 'PAID' && (
                    <Banknote className='w-5 h-5 mr-2' />
                  )}
                </>
              )}
              <span>
                {selectedPlan
                  ? getButtonText(selectedPlan.name)
                  : 'Choisir un plan'}
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChoixPlan;
