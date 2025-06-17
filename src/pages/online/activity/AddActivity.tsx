import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { withDashboard } from '@/hoc/withDashboard';
import { Link } from 'react-router-dom';

const AddActivity = withDashboard(() => {
  return (
    <div className='p-4'>
      {/* En-tête */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Activités</h1>
          <p className='text-muted-foreground'>
            Gestion des activités de l'espace administrateur
          </p>
        </div>
      </div>
      <Card className='space-y-4 mt-4'>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>
            Ajouter une nouvelle activité
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Saisissez les informations pour créer une nouvelle activité.
          </CardDescription>
          <CardAction>
            <Link to='/activity'>
              <Button variant={'link'}>Retour</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form className='space-y-4'>
            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea id='description' placeholder='Activity Description' />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant='outline'>Précédent</Button>
          <Button type='submit'>Suivant</Button>
        </CardFooter>
      </Card>
    </div>
  );
});

export default AddActivity;
