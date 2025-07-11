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

  React.useEffect(() => {
    (async () => {
      if (!token) throw new Error('Token is not defined');
      mutation.mutate({ token });
    })();
  }, [token]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-[400px] space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-center'>Validation du compte</CardTitle>
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
                to='/'
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
