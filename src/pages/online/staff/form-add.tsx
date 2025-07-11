import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { withDashboard } from '@/hoc/withDashboard';
import { useCreateUser } from '@/hook/admin.hook';
import { formAdminSchema, FormAdminValues } from '@/schema/admins.schema';
import useContributorStore from '@/store/contributor.store';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Path, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

type FieldName =
  | keyof FormAdminValues
  | 'address.country'
  | 'address.street'
  | 'address.postalCode'
  | 'address.city';

const step1Fields: FieldName[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'role',
];
const step2Fields: FieldName[] = [
  'address.country',
  'address.street',
  'address.postalCode',
  'address.city',
];

type FormFields = Path<FormAdminValues>[] | readonly Path<FormAdminValues>[];

const AddStaffForm = withDashboard(() => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const contributorId = useContributorStore((s) => s.contributor?._id);
  console.log('🚀 ~ AddStaffForm ~ contributorId:', contributorId);

  const mutation = useCreateUser();
  const formAddStaff = useForm<FormAdminValues>({
    resolver: zodResolver(formAdminSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'COORDINATOR',
      address: {
        country: '',
        street: '',
        postalCode: '',
        city: '',
      },
    },
  });

  const handleSubmit = (data: FormAdminValues) => {
    // setStaffMemberStore('staffMemberForm', data);
    const payload = {
      ...data,
      contributorId: contributorId as string,
    };
    mutation.mutate(payload);
  };

  return (
    <div>
      {/* En-tête */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link
            to='/staff'
            className='inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10'
          >
            <ArrowLeft className='h-4 w-4' />
          </Link>
          <div>
            <h4 className='text-3xl font-bold'>Staff</h4>
            <p className='text-muted-foreground'>Ajouter un member du staff</p>
          </div>
        </div>
        <Badge variant='default' className='capitalize' color='green'>
          Ajouter un member du staff
        </Badge>
      </div>

      <Card className='p-4 mt-5'>
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center gap-2'>
            {[1, 2].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step !== 2 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted-foreground/20'
                  }`}
                >
                  {step < currentStep ? <Check className='h-5 w-5' /> : step}
                </div>
                {step !== 2 && (
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
        <Form {...formAddStaff}>
          <form
            onSubmit={formAddStaff.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            {currentStep === 1 && (
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={formAddStaff.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>Nom</label>
                      <FormControl>
                        <Input
                          id='firstName'
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
                  control={formAddStaff.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>
                        Prénom
                      </label>
                      <FormControl>
                        <Input
                          id='lastName'
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
                  control={formAddStaff.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>Email</label>
                      <FormControl>
                        <Input
                          id='email'
                          type='email'
                          placeholder='Email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAddStaff.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>
                        Téléphone
                      </label>
                      <FormControl>
                        <Input
                          id='phone'
                          type='text'
                          placeholder='+2250000000000'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAddStaff.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>Rôle</label>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Sélectionner un rôle' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='MANAGER'>Manager</SelectItem>
                            <SelectItem value='COORDINATOR'>
                              Coordinateur
                            </SelectItem>
                            <SelectItem value='EDITOR'>Redacteur</SelectItem>
                            <SelectItem value='AGENT'>Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {currentStep === 2 && (
              //addresse
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={formAddStaff.control}
                  name='address.country'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>Pays</label>
                      <FormControl>
                        <Input {...field} placeholder='Pays' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAddStaff.control}
                  name='address.street'
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
                  control={formAddStaff.control}
                  name='address.postalCode'
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
                  control={formAddStaff.control}
                  name='address.city'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>Ville</label>
                      <FormControl>
                        <Input {...field} placeholder='Ville' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className='flex justify-end p-4 border-t'>
              {currentStep > 1 && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  Précédent
                </Button>
              )}
              {currentStep === 2 ? (
                <Button
                  type='submit'
                  className='ml-auto'
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className='animate-spin' />
                      <span>En cours...</span>
                    </>
                  ) : (
                    "Créer l'utilisateur"
                  )}
                </Button>
              ) : (
                <Button
                  type='button'
                  className='ml-auto'
                  onClick={async () => {
                    const step1Fields: FormFields = [
                      'firstName',
                      'lastName',
                      'email',
                      'phone',
                      'role',
                    ] as const;
                    const step2Fields: FormFields = [
                      'address.country',
                      'address.street',
                      'address.postalCode',
                      'address.city',
                    ] as const;

                    const fieldsToValidate =
                      currentStep === 1 ? step1Fields : step2Fields;
                    const isValid = await formAddStaff.trigger(
                      fieldsToValidate
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
      </Card>
    </div>
  );
});

export default AddStaffForm;
