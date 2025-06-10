import animationData from '@/assets/svg/mailbox.json';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useForgotPassword } from '@/hook/admin.hook';
import {
  formForgetPasswordSchema,
  FormForgetPasswordValues,
} from '@/schema/admins.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [responseServerSuccess, setResponseServerSuccess] =
    useState<boolean>(false);
  const [responseServerMessage, setResponseServerMessage] =
    useState<string>('');

  const mutationForgetPassword = useForgotPassword();
  const formForgetPassword = useForm<FormForgetPasswordValues>({
    resolver: zodResolver(formForgetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    if (mutationForgetPassword.isSuccess) {
      setResponseServerSuccess(true);
      setResponseServerMessage(
        `
            <div class="flex items-center justify-center">
              <div class="w-full max-w-[400px] space-y-6">
                <div class="flex flex-col space-y-2 text-center">
                  <p class="text-sm text-muted-foreground">
                    Nous avons envoyé un email par mail à l'adresse suivante :
                     <span class="font-bold decoration-primary underline underline-offset-4">
                        ${formForgetPassword.getValues('email')}
                     </span>
                  </p>
                  
                   <a href="mailto:${formForgetPassword.getValues(
                     'email'
                   )}" class="text-sm text-muted-foreground">
                    <p>Cliquez ici pour ouvrir votre boite mail</p>
                  </a>
                </div>
              </div>
            </div>
         
          `
      );
      toast({
        title: 'Succès',
        description: 'Un email a été envoyé à votre adresse email.',
        variant: 'default',
      });
    }
    return () => {
      setResponseServerSuccess(false);
      setResponseServerMessage('');
    };
  }, [mutationForgetPassword.isSuccess]);

  const handleSubmit = (data: FormForgetPasswordValues) => {
    mutationForgetPassword.mutate(data);
    mutationForgetPassword.isPending
      ? toast({ title: 'Envoi en cours...' })
      : null;
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-[400px] space-y-6'>
        {!responseServerSuccess ? (
          <>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Mot de passe oublié
              </h1>
              <p className='text-sm text-muted-foreground'>
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Réinitialisation du mot de passe</CardTitle>
                <CardDescription>
                  Un email vous sera envoyé avec les instructions à suivre
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Form {...formForgetPassword}>
                  <form
                    onSubmit={formForgetPassword.handleSubmit(handleSubmit)}
                  >
                    <FormField
                      control={formForgetPassword.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor='email'>Email</Label>
                          <FormControl>
                            <Input
                              {...field}
                              type='email'
                              placeholder='Email'
                              disabled={mutationForgetPassword.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type='submit'
                      className='w-full mt-4'
                      disabled={mutationForgetPassword.isPending}
                    >
                      {mutationForgetPassword.isPending ? (
                        <>
                          <Loader2 className='animate-spin' />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        'Envoyer le lien'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className='flex flex-col space-y-4'>
                <div className='text-sm text-muted-foreground text-center'>
                  <Link
                    to='/'
                    className='underline underline-offset-4 hover:text-primary'
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Verifiez votre boite mail</CardTitle>
                <CardDescription>
                  Nous avons envoyé un email à votre boite mail
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Lottie
                  options={defaultOptions}
                  height={200}
                  width={200}
                  isStopped={false}
                  isPaused={false}
                />
                <div
                  dangerouslySetInnerHTML={{ __html: responseServerMessage }}
                />
              </CardContent>
              <CardFooter className='flex flex-col space-y-4'>
                <div className='text-sm text-muted-foreground text-center'>
                  <Link
                    to='/'
                    className='underline underline-offset-4 hover:text-primary'
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </>
        )}
        {mutationForgetPassword.isPending && (
          <div className='text-sm text-muted-foreground text-center'>
            <p>Envoi en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
}
