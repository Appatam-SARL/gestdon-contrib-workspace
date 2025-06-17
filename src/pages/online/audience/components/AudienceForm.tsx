import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IAudienceForm } from '@/interface/audience';
import { IBeneficiaire } from '@/interface/beneficiaire';
import {
  FormCreateAudienceSchema,
  FormUpdateAudienceSchema,
  createAudienceSchema,
  updateAudienceSchema,
} from '@/schema/audience.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AudienceFormProps {
  onSubmit: (
    values: FormCreateAudienceSchema | FormUpdateAudienceSchema
  ) => void;
  initialValues?: Partial<IAudienceForm>;
  isEditing?: boolean;
  isLoading?: boolean;
  beneficiaries?: IBeneficiaire[];
}

export const AudienceForm: React.FC<AudienceFormProps> = ({
  onSubmit,
  initialValues,
  isEditing = false,
  isLoading = false,
  beneficiaries = [],
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const formSchema = isEditing ? updateAudienceSchema : createAudienceSchema;

  const form = useForm<FormCreateAudienceSchema | FormUpdateAudienceSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      beneficiaryId: initialValues?.beneficiaryId || '',
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      type: initialValues?.type || 'representative',
      startDate: initialValues?.startDate || '',
      endDate: initialValues?.endDate || '',
      representative: {
        firstName: initialValues?.representative?.firstName || '',
        lastName: initialValues?.representative?.lastName || '',
        email: initialValues?.representative?.email || '',
        phone: initialValues?.representative?.phone || '',
      },
    } as FormCreateAudienceSchema,
  });

  const audienceType = form.watch('type');

  return (
    <Form {...form}>
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
                    step < currentStep ? 'bg-primary' : 'bg-muted-foreground/20'
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === 2) {
            form.handleSubmit(onSubmit)(e);
          }
        }}
        className='space-y-4'
      >
        {currentStep === 1 && (
          <>
            <FormField
              control={form.control}
              name='beneficiaryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bénéficiaire</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={field.value as string}
                      onValueChange={field.onChange}
                      defaultValue={initialValues?.beneficiaryId}
                      disabled={beneficiaries.length === 0 || isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Sélectionnez un bénéficiaire' />
                      </SelectTrigger>
                      <SelectContent>
                        {beneficiaries?.map((beneficiary) => (
                          <SelectItem
                            key={beneficiary._id}
                            value={beneficiary._id}
                          >
                            {beneficiary.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l'audience</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Titre de l'audience"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de l'audience"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Type d'audience</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className='flex flex-col space-y-1'
                      disabled={isLoading}
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='normal' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          Audience normale
                        </FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='representative' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          Assisté par un représentant
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {audienceType === 'representative' && (
              <div className='space-y-4 border p-4 rounded-md'>
                <h3 className='text-lg font-semibold'>
                  Informations du représentant
                </h3>
                <FormField
                  control={form.control}
                  name='representative.firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom du représentant</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Prénom du représentant'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='representative.lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du représentant</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nom du représentant'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='representative.email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email du représentant</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='email.representant@example.com'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='representative.phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone du représentant</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='+225 00 00 00 00'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
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
          {currentStep === 2 ? (
            <Button type='submit' className='ml-auto' disabled={isLoading}>
              {isLoading ? (
                <div className='flex items-center'>
                  <Loader2 className='animate-spin h-4 w-4 mr-2' />
                  <span>Chargement...</span>
                </div>
              ) : isEditing ? (
                `Modifier l\'audience`
              ) : (
                `Ajouter l\'audience`
              )}
            </Button>
          ) : (
            <Button
              type='button'
              className='ml-auto'
              // onClick={async () => {
              //   const isValid = await form.trigger([
              //     'beneficiaryId',
              //     'title',
              //     'description',
              //     'startDate',
              //     'endDate',
              //   ]);
              //   if (isValid) {
              //     setCurrentStep((prev) => prev + 1);
              //   }
              // }}
              onClick={async () => {
                const fieldsToTrigger =
                  currentStep === 1
                    ? [
                        'beneficiaryId',
                        'title',
                        'description',
                        'startDate',
                        'endDate',
                      ]
                    : currentStep === 2 &&
                      form.getValues('type') === 'representative'
                    ? [
                        'representative.firstName',
                        'representative.lastName',
                        'representative.email',
                        'representative.phone',
                      ]
                    : [];
                if (fieldsToTrigger.length > 0) {
                  const isValid = await form.trigger(fieldsToTrigger);
                  if (isValid) {
                    setCurrentStep((prev) => prev + 1);
                  }
                }
              }}
            >
              Suivant
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
