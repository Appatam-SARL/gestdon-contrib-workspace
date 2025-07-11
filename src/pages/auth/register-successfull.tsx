import animationData from '@/assets/svg/success.json';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Lottie from 'react-lottie';

function RegisterSuccessfull() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className='space-y-4 max-w-[100%] h-[100vh] flex flex-col justify-center items-center bg-gray-200'>
      <Card className='max-w-md'>
        <CardHeader>
          <CardTitle>Votre compte a été créé avec succès</CardTitle>
          <CardDescription>Merci</CardDescription>
        </CardHeader>
        <CardContent>
          <Lottie
            options={defaultOptions}
            height={400}
            width={400}
            isStopped={false}
            isPaused={false}
            style={{ width: '200px', height: '200px' }}
          />
          <p className='text-justify font-medium text-gray-700'>
            Votre compte a été créé avec succès, nous avons envoyé un email à
            l'adresse email manageur, vous trouverez votre mot de passe dans le
            mail que vous pouvez changer dans l'espace de gestion de votre
            compte.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant={'link'} onClick={() => (window.location.href = '/')}>
            Retour à la page de connexion
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterSuccessfull;
