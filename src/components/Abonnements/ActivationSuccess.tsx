import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Gift,
  Mail,
  Phone,
  Star,
  Users,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router';

interface ActivationSuccessProps {
  packageName: string;
  packageDescription: string;
  features: {
    name: string;
    value: string;
    enable: boolean;
  }[];
}

const ActivationSuccess = ({
  packageName,
  packageDescription,
  features,
}: ActivationSuccessProps) => {
  const navigate = useNavigate();

  return (
    <div className='max-w-4xl mx-auto'>
      {/* En-tête de succès */}
      <div className='text-center mb-8'>
        <div className='inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6'>
          <CheckCircle className='w-12 h-12 text-green-600' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Félicitations ! 🎉
        </h1>
        <p className='text-xl text-gray-600 mb-2'>
          Votre compte a été activé avec succès !
        </p>
        <p className='text-lg text-gray-500'>
          Bienvenue dans la communauté{' '}
          <span className='font-semibold text-green-600'>{packageName}</span>
        </p>
      </div>

      {/* Carte de confirmation */}
      <Card className='mb-8 border-2 border-green-200 bg-green-50'>
        <CardHeader className='text-center'>
          <CardTitle className='flex items-center justify-center gap-2 text-green-700 text-2xl'>
            <Star className='w-7 h-7' />
            {packageName}
            <Star className='w-7 h-7' />
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
              Fonctionnalités activées :
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
          <CardTitle className='text-blue-700'>Prochaines étapes</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0'></div>
            <div>
              <p className='text-blue-800 font-medium'>
                Email de confirmation envoyé
              </p>
              <p className='text-blue-600 text-sm'>
                Vérifiez votre boîte de réception pour vos identifiants
              </p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0'></div>
            <div>
              <p className='text-blue-800 font-medium'>
                Accès immédiat à la plateforme
              </p>
              <p className='text-blue-600 text-sm'>
                Connectez-vous et commencez à utiliser toutes les
                fonctionnalités
              </p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0'></div>
            <div>
              <p className='text-blue-800 font-medium'>Support disponible</p>
              <p className='text-blue-600 text-sm'>
                Notre équipe est là pour vous accompagner
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        <Button
          onClick={() => navigate('/dashboard')}
          className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg'
          size='lg'
        >
          <ArrowRight className='w-5 h-5 mr-2' />
          Accéder à mon dashboard
        </Button>

        <Button
          onClick={() => navigate('/')}
          variant='outline'
          className='border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg'
          size='lg'
        >
          Retour à l'accueil
        </Button>
      </div>

      {/* Support et contact */}
      <div className='mt-12 text-center'>
        <p className='text-gray-600 mb-4'>
          Besoin d'aide ? Notre équipe est là pour vous
        </p>
        <div className='flex justify-center gap-6'>
          <div className='flex items-center gap-2 text-blue-600'>
            <Mail className='w-4 h-4' />
            <span className='text-sm'>support@example.com</span>
          </div>
          <div className='flex items-center gap-2 text-blue-600'>
            <Phone className='w-4 h-4' />
            <span className='text-sm'>+225 0123456789</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationSuccess;
