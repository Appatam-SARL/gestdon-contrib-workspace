import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { withDashboard } from '@/hoc/withDashboard';
import { useAudience, useUpdateAudience } from '@/hook/audience.hook';
import { useBeneficiaries } from '@/hook/beneficiaire.hook';
import { IAudienceForm } from '@/interface/audience';
import { FormUpdateAudienceSchema } from '@/schema/audience.schema';
import useContributorStore from '@/store/contributor.store';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { AudienceForm } from './components/AudienceForm';

export const EditAudiencePage = withDashboard(() => {
  const { id } = useParams<{ id: string }>();
  const contributorId = useContributorStore((s) => s.contributor?._id);

  const navigate = useNavigate();
  const {
    data: audienceResponse,
    isLoading,
    isError,
    error,
  } = useAudience(id as string);
  const updateMutation = useUpdateAudience(id as string);
  const { data: beneficiaries } = useBeneficiaries({
    limit: 100,
    page: 1,
    search: '',
    contributorId: contributorId as string,
  });

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton height={50} width='100%' />
        <Card>
          <CardHeader>
            <Skeleton height={30} width='60%' />
            <Skeleton height={20} width='80%' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton height={20} width='100%' count={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-red-500'>
        Erreur:{' '}
        {error?.message ||
          `Impossible de charger l\'audience pour modification.`}
      </div>
    );
  }

  const audience = audienceResponse?.data;

  if (!audience) {
    return <div className='text-muted-foreground'>Audience non trouvée.</div>;
  }

  const initialFormValues: Partial<IAudienceForm> = {
    beneficiaryId:
      typeof audience.beneficiaryId === 'object'
        ? (audience.beneficiaryId._id as string)
        : audience.beneficiaryId,
    title: audience.title,
    locationOfActivity: audience.locationOfActivity,
    description: audience.description,
    contributorId: audience.contributorId,
  };

  const handleSubmit = (values: FormUpdateAudienceSchema) => {
    const payload: Partial<IAudienceForm> = {
      title: values.title,
      locationOfActivity: values.locationOfActivity,
      description: values.description,
      beneficiaryId: values.beneficiaryId,
    };
    updateMutation.mutate(payload);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Modifier l'audience</h1>
          <p className='text-muted-foreground'>
            Mettez à jour les informations de l'audience
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
          <CardTitle>Modifier l'audience</CardTitle>
          <CardDescription>
            Mettez à jour les informations de l'audience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AudienceForm
            onSubmit={handleSubmit}
            initialValues={initialFormValues}
            isEditing={true}
            isLoading={updateMutation.isPending}
            beneficiaries={beneficiaries?.data}
          />
        </CardContent>
      </Card>
    </div>
  );
});

export default EditAudiencePage;
