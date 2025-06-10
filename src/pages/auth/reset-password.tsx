import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useResetPassword } from '@/hook/admin.hook';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const token = useParams<{ token: string }>().token;
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const mutation = useResetPassword();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      toast({
        title: 'Erreur',
        description: 'Veuillez renseigner un token valide.',
        variant: 'destructive',
      });
      return;
    }

    if (!resetPasswordForm.password) {
      toast({
        title: 'Erreur',
        description: 'Veuillez renseigner un nouveau mot de passe.',
        variant: 'destructive',
      });
      return;
    }

    if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive',
      });
      return;
    }

    // regex password vérifier que le nouveau mot de passe est composé de lettres, chiffres et caractères spéciaux
    if (
      !resetPasswordForm.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      toast({
        title: 'Erreur',
        description:
          'Le nouveau mot de passe doit contenir au moins 8 caractères et contenir au moins un chiffre, une lettre majuscule et une lettre minuscule.',
        variant: 'destructive',
      });
      return;
    }

    // Simuler la réinitialisation du mot de passe
    mutation.mutate({
      token: token as string,
      password: resetPasswordForm.password,
    });
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-[400px] space-y-6'>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Réinitialisation du mot de passe
          </h1>
          <p className='text-sm text-muted-foreground'>
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

        <Card>
          <form onSubmit={onSubmit}>
            <CardHeader>
              <CardTitle>Nouveau mot de passe</CardTitle>
              <CardDescription className='mb-4'>
                Votre mot de passe doit contenir au moins 8 caractères
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='password'>Nouveau mot de passe</Label>
                <div className='relative mt-2'>
                  <Lock className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    disabled={mutation.isPending}
                    value={resetPasswordForm.password}
                    onChange={(e) =>
                      setResetPasswordForm({
                        ...resetPasswordForm,
                        password: e.target.value,
                      })
                    }
                    className='pl-10'
                    required
                    minLength={8}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-2 top-2 h-5 w-5 text-muted-foreground hover:text-foreground'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>
                  Confirmer le mot de passe
                </Label>
                <div className='relative mt-2'>
                  <Lock className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    disabled={mutation.isPending}
                    className='pl-10'
                    value={resetPasswordForm.confirmPassword}
                    onChange={(e) =>
                      setResetPasswordForm({
                        ...resetPasswordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    minLength={8}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-2 top-2 h-5 w-5 text-muted-foreground hover:text-foreground'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col space-y-4 mt-4'>
              <Button
                type='submit'
                className='w-full'
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className='animate-spin' />
                    <span>Réinitialisation en cours...</span>
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>
              <div className='text-sm text-muted-foreground text-center'>
                <Link
                  to='/'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Retour à la connexion
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
