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
import { useVerifyMfa } from '@/hook/admin.hook';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MFA() {
  const [code, setCode] = useState('');
  const mutation = useVerifyMfa(sessionStorage.getItem('adminId') as string);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ mfaToken: code });
  }

  // Formater le code en groupes de 3 chiffres
  const formatCode = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    const groups = numbers.match(/.{1,3}/g) || [];
    return groups.join(' ');
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 6) {
      setCode(value);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-[400px] space-y-6'>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Authentification à deux facteurs
          </h1>
          <p className='text-sm text-muted-foreground'>
            Entrez le code généré par votre application d'authentification
          </p>
        </div>

        <Card>
          <form onSubmit={onSubmit}>
            <CardHeader>
              <CardTitle>Code de sécurité</CardTitle>
              <CardDescription>
                Ouvrez votre application d'authentification pour voir le code
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='code'>Code à 6 chiffres</Label>
                <div className='relative'>
                  <Shield className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                  <Input
                    id='code'
                    placeholder='000 000'
                    type='text'
                    inputMode='numeric'
                    value={formatCode(code)}
                    onChange={handleCodeChange}
                    disabled={mutation.isPending}
                    className='pl-10 text-center text-lg tracking-widest'
                    required
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Le code change toutes les 30 secondes
                </p>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col space-y-4'>
              <Button
                type='submit'
                className='w-full'
                disabled={mutation.isPending || code.length !== 6}
              >
                {mutation.isPending ? 'Vérification en cours...' : 'Vérifier'}
              </Button>
              <div className='text-sm text-muted-foreground text-center space-y-2'>
                <Link
                  to='/login'
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
