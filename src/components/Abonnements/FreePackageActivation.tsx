import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Calendar,
  CheckCircle,
  Gift,
  Star,
  Users,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router';

interface FreePackageActivationProps {
  packageName: string;
  packageDescription: string;
  features: {
    name: string;
    value: string;
    enable: boolean;
  }[];
  onActivate: () => void;
  isActivating?: boolean;
}

const FreePackageActivation = ({
  packageName,
  packageDescription,
  features,
  onActivate,
  isActivating = false,
}: FreePackageActivationProps) => {
  const navigate = useNavigate();

  return (
    <div className='max-w-4xl mx-auto'>
      {/* En-tête avec message de félicitations */}
      <div className='text-center mb-8'>
        <div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4'>
          <Gift className='w-10 h-10 text-green-600' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Félicitations ! 🎉
        </h1>
        <p className='text-xl text-gray-600'>
          Vous avez choisi le package{' '}
          <span className='font-semibold text-green-600'>{packageName}</span>
        </p>
        <p className='text-gray-500 mt-2'>
          Profitez de votre période d'essai gratuit d'un mois
        </p>
      </div>

      {/* Carte d'information du package */}
      <Card className='mb-8 border-2 border-green-200 bg-green-50'>
        <CardHeader className='text-center'>
          <CardTitle className='flex items-center justify-center gap-2 text-green-700'>
            <Star className='w-6 h-6' />
            {packageName}
            <Star className='w-6 h-6' />
          </CardTitle>
          <CardDescription className='text-green-600 text-lg'>
            {packageDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='text-center p-4 bg-white rounded-lg border border-green-200'>
              <Calendar className='w-8 h-8 text-green-600 mx-auto mb-2' />
              <p className='font-semibold text-green-700'>1 Mois</p>
              <p className='text-sm text-gray-600'>Période d'essai</p>
            </div>
            <div className='text-center p-4 bg-white rounded-lg border border-green-200'>
              <Gift className='w-8 h-8 text-green-600 mx-auto mb-2' />
              <p className='font-semibold text-green-700'>100% Gratuit</p>
              <p className='text-sm text-gray-600'>Aucun coût</p>
            </div>
            <div className='text-center p-4 bg-white rounded-lg border border-green-200'>
              <Users className='w-8 h-8 text-green-600 mx-auto mb-2' />
              <p className='font-semibold text-green-700'>Accès Complet</p>
              <p className='text-sm text-gray-600'>
                Toutes les fonctionnalités
              </p>
            </div>
          </div>

          {/* Liste des fonctionnalités */}
          <div className='bg-white rounded-lg p-4 border border-green-200'>
            <h4 className='font-semibold text-green-700 mb-3'>
              Fonctionnalités incluses :
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              {features.map((feature, index) => (
                <div key={index} className='flex items-center gap-2'>
                  {feature.enable && (
                    <CheckCircle className='w-4 h-4 text-green-600 flex-shrink-0' />
                  )}
                  {!feature.enable && (
                    <XCircle className='w-4 h-4 text-gray-600 flex-shrink-0' />
                  )}
                  <span className='text-gray-700 text-sm font-medium flex-1'>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations importantes */}
      <Card className='mb-8 border-2 border-blue-200 bg-blue-50'>
        <CardHeader>
          <CardTitle className='text-blue-700'>
            Informations importantes
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0'></div>
            <p className='text-blue-800'>
              Votre compte sera automatiquement activé pour une durée d'un mois
            </p>
          </div>
          <div className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0'></div>
            <p className='text-blue-800'>
              Vous recevrez un email de confirmation avec vos identifiants de
              connexion
            </p>
          </div>
          <div className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0'></div>
            <p className='text-blue-800'>
              À la fin de la période d'essai, vous pourrez choisir de continuer
              avec un package payant
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        <Button
          onClick={onActivate}
          disabled={isActivating}
          className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg'
          size='lg'
        >
          {isActivating ? (
            <div className='flex items-center gap-2'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
              Activation en cours...
            </div>
          ) : (
            <>
              <CheckCircle className='w-5 h-5 mr-2' />
              Activer mon compte gratuit
            </>
          )}
        </Button>

        <Button
          onClick={() => navigate(-1)}
          variant='outline'
          className='border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg'
          size='lg'
        >
          Retour à la sélection
        </Button>
      </div>
    </div>
  );
};

export default FreePackageActivation;
