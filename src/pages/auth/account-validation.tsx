import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useVerifyAccount } from '@/hook/admin.hook';
import { Check, MessageCircleX } from 'lucide-react';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function AccountValidation() {
  const [messageConfirmation, setMessageConfirmation] =
    React.useState<string>('');
  const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);
  const token = useSearchParams()[0].get('token') as string;
  const mutation = useVerifyAccount(setMessageConfirmation, setIsConfirmed);

  // Use a ref to track if the component has mounted
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    // Set isMounted to true after the first render
    isMounted.current = true;
  }, []);

  React.useEffect(() => {
    // Only run the effect if the component has mounted and token is available
    if (isMounted.current && token) {
      mutation.mutate({ token });
    }
  }, [token, isMounted]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-[400px] space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-center'>Validation du compte</CardTitle>
            {/* <CardTitle>Code de validation</CardTitle> */}
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col justify-center items-center space-y-2'>
              {mutation.isPending ? (
                <span>Validation en cours...</span>
              ) : (
                <>
                  {isConfirmed ? (
                    <>
                      <Check size={62} color='green' />
                      <span className='text-green-500'>
                        {messageConfirmation}
                      </span>
                    </>
                  ) : (
                    <>
                      <MessageCircleX size={62} color='red' />
                      <span className='text-red-500'>
                        {messageConfirmation}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <div className='text-sm text-muted-foreground text-center space-y-2'>
              <Link
                to='/login'
                className='underline underline-offset-4 hover:text-primary'
              >
                Retour à la connexion
              </Link>
            </div>
          </CardFooter>
          {/* </form> */}
        </Card>
      </div>
    </div>
  );
}
