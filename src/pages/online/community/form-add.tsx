import { Badge } from '@/components/ui/badge';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { withDashboard } from '@/hoc/withDashboard';
import { useCreateBeneficiary } from '@/hook/beneficiaire.hook';
import { useGetBeneficiaryType } from '@/hook/beneficiary-type.hook';
import { IBeneficiaryType } from '@/interface/beneficiary-type';
import {
  formBeneficiarySchema,
  FormBeneficiaryValues,
} from '@/schema/beneficiary.schema';
import useContributorStore from '@/store/contributor.store';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const AddDonForm = withDashboard(() => {
  const contributorId = useContributorStore((state) => state.contributor?._id);
  console.log('🚀 ~ AddDonForm ~ contributorId:', contributorId);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { isLoading, data: beneficiaryType } = useGetBeneficiaryType({
    contributorId: contributorId as string,
  });
  const mutation = useCreateBeneficiary();
  const formAddBeneficiary = useForm<FormBeneficiaryValues>({
    resolver: zodResolver(formBeneficiarySchema),
    defaultValues: {
      fullName: '',
      type: '',
      description: '',
      representant: {
        firstName: '',
        lastName: '',
        phone: '',
        address: {
          country: '',
          street: '',
          postalCode: '',
          city: '',
        },
      },
    },
  });

  const handleSubmit = (data: FormBeneficiaryValues) => {
    const payload = {
      ...data,
      representant: [data.representant],
      contributorId: contributorId as string,
    };
    console.log('🚀 ~ handleSubmit ~ payload:', payload);
    mutation.mutate(payload);
  };

  return (
    <div>
      {/* En-tête */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link
            to='/community'
            className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10'
          >
            <ArrowLeft className='h-4 w-4' />
          </Link>
          <div>
            <h4 className='text-3xl font-bold'>Bénéficiaire</h4>
            <p className='text-muted-foreground'>Ajouter un bénéficiaire</p>
          </div>
        </div>
        <Badge variant='default' className='capitalize' color='green'>
          Ajouter un bénéficiaire
        </Badge>
      </div>

      <Card className='p-4 mt-5'>
        <CardHeader>
          <CardTitle className='mb-4'>Ajouter un bénéficiaire</CardTitle>
          <CardDescription>
            <div className='flex justify-between items-center mb-8'>
              <div className='flex items-center gap-2'>
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center ${
                      step !== 3 ? 'flex-1' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step <= currentStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted-foreground/20'
                      }`}
                    >
                      {step < currentStep ? (
                        <Check className='h-5 w-5' />
                      ) : (
                        step
                      )}
                    </div>
                    {step !== 3 && (
                      <div
                        className={`h-0.5 w-16 mx-2 ${
                          step < currentStep
                            ? 'bg-primary'
                            : 'bg-muted-foreground/20'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className='text-sm text-muted-foreground'>
                Étape {currentStep} sur 2
              </p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formAddBeneficiary}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === 3) {
                  formAddBeneficiary.handleSubmit(handleSubmit)(e);
                }
              }}
              className='space-y-4'
            >
              {currentStep === 1 && (
                <>
                  <FormField
                    control={formAddBeneficiary.control}
                    name='fullName'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>
                          Nom de la communauté
                        </label>
                        <FormControl>
                          <Input
                            id='fullName'
                            type='text'
                            placeholder='Nom'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formAddBeneficiary.control}
                    name='type'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Sélectionnez un type de bénéficiaire' />
                            </SelectTrigger>
                            <SelectContent>
                              {beneficiaryType?.data?.map(
                                (type: IBeneficiaryType) => (
                                  <SelectItem key={type._id} value={type._id}>
                                    {type.label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formAddBeneficiary.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>
                          Description
                        </label>
                        <FormControl>
                          <Textarea
                            id='description'
                            placeholder='Description'
                            rows={10}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 2 && (
                <>
                  <FormField
                    control={formAddBeneficiary.control}
                    name='representant.firstName'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>
                          Prénom
                        </label>
                        <FormControl>
                          <Input
                            id='representant.firstName'
                            type='text'
                            placeholder='Prénom'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formAddBeneficiary.control}
                    name='representant.lastName'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>Nom</label>
                        <FormControl>
                          <Input
                            id='representant.lastName'
                            type='text'
                            placeholder='Nom'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formAddBeneficiary.control}
                    name='representant.phone'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>
                          Téléphone
                        </label>
                        <FormControl>
                          <Input
                            id='representant.phone'
                            type='text'
                            placeholder='Téléphone'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {currentStep === 3 && (
                <>
                  <FormField
                    control={formAddBeneficiary.control}
                    name='representant.address.country'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>
                          Pays
                        </label>
                        <FormControl>
                          <Input {...field} placeholder='Pays' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formAddBeneficiary.control}
                    name='representant.address.street'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>Rue</label>
                        <FormControl>
                          <Input {...field} placeholder='Rue' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formAddBeneficiary.control}
                    name='representant.address.postalCode'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>
                          Code postal
                        </label>
                        <FormControl>
                          <Input {...field} placeholder='Code postal' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formAddBeneficiary.control}
                    name='representant.address.city'
                    render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>
                          Ville
                        </label>
                        <FormControl>
                          <Input {...field} placeholder='Ville' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <div className='flex justify-between p-4 border-t'>
                {currentStep > 1 && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                  >
                    Précédent
                  </Button>
                )}
                {currentStep === 3 ? (
                  <Button
                    type='submit'
                    className='ml-auto'
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'En cours...' : 'Créer la communauté'}
                  </Button>
                ) : (
                  <Button
                    type='button'
                    className='ml-auto'
                    onClick={async () => {
                      const isValid = await formAddBeneficiary.trigger(
                        currentStep === 1
                          ? ['fullName', 'type', 'description']
                          : currentStep === 2
                          ? [
                              'representant.firstName',
                              'representant.lastName',
                              'representant.phone',
                            ]
                          : [
                              'representant.address.city',
                              'representant.address.country',
                              'representant.address.postalCode',
                              'representant.address.street',
                            ]
                      );
                      if (isValid) {
                        setCurrentStep((prev) => prev + 1);
                      }
                    }}
                  >
                    Suivant
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p>
            <span className='text-sm text-muted-foreground'>
              Vous avez des questions ? Contactez-nous :{' '}
            </span>
            <a
              href='mailto:info@appatam.com'
              className='text-sm text-primary-foreground'
            >
              info@appatam.com
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
});

export default AddDonForm;
