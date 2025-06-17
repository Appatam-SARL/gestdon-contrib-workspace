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
import { useToast } from '@/components/ui/use-toast';
import { withDashboard } from '@/hoc/withDashboard';
import { useCreateAudience } from '@/hook/audience.hook';
import { useBeneficiaries } from '@/hook/beneficiaire.hook';
import {
  FormCreateAudienceSchema,
  FormUpdateAudienceSchema,
} from '@/schema/audience.schema';
import useContributorStore from '@/store/contributor.store';
import { useNavigate } from 'react-router';
import { AudienceForm } from './components/AudienceForm';

export const AddAudiencePage = withDashboard(() => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const createMutation = useCreateAudience(() => {
    navigate('/audiences');
  });
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const { data: beneficiaries } = useBeneficiaries({
    limit: 100,
    page: 1,
    search: '',
  });

  const handleSubmit = (
    values: FormCreateAudienceSchema | FormUpdateAudienceSchema
  ) => {
    // verification si la date de fin est après la date de début
    if (values.startDate && values.endDate) {
      if (values.endDate < values.startDate) {
        toast({
          title: 'Erreur',
          description:
            "La date de debut de l'audience doit être inférieure à la date de fin.",
          type: 'background',
          variant: 'destructive',
        });
        return;
      }
    }
    createMutation.mutate({
      beneficiaryId: values.beneficiaryId as string,
      title: values.title as string,
      description: values.description as string,
      type: values.type as 'normal' | 'representative',
      startDate: values.startDate,
      endDate: values.endDate,
      representative: {
        firstName: values.representative?.firstName,
        lastName: values.representative?.lastName,
        email: values.representative?.email,
        phone: values.representative?.phone,
      },
      contributorId: contributorId as string,
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>
            Enregistrer une nouvelle audience
          </h1>
          <p className='text-muted-foreground'>
            Saisissez les informations pour ajouter une audience.
          </p>
        </div>
        <CardAction>
          <Button variant='link' size={'icon'} onClick={() => navigate(-1)}>
            Annuler
          </Button>
        </CardAction>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une audience</CardTitle>
          <CardDescription>
            Saisissez les informations pour ajouter une audience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AudienceForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            isEditing={false}
            beneficiaries={beneficiaries?.data}
          />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
});

export default AddAudiencePage;
