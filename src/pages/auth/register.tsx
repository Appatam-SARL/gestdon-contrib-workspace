import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import WHeader from '@/components/welcome/WHeader';
import { useCreateContributor } from '@/hook/contributors.hook';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CheckIcon, ChevronsUpDownIcon, Loader2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const contributorSchema = z.object({
  name: z.string().nonempty('Le nom est requis'),
  description: z.string().nonempty('La description est requise'),
  email: z.string().nonempty('Email est requis').email('Email invalide'),
  phoneNumber: z.string().nonempty('Numéro de téléphone requis'),
  fieldOfActivity: z.string().optional(),
  logo: z
    .object({
      fileId: z.string().optional(),
      fileUrl: z.string().optional(),
    })
    .optional(),
  address: z.object({
    country: z.string().min(2, 'Pays requis'),
    street: z.string().min(2, 'Rue requise'),
    postalCode: z.string().min(2, 'Code postal requis'),
    city: z.string().min(2, 'Ville requise'),
  }),
  owner: z.object({
    firstName: z.string().nonempty('Nom requis'),
    lastName: z.string().nonempty('Prénom requis'),
    email: z.string().nonempty('Email requis').email('Email invalide'),
    phone: z.string().nonempty('Téléphone requis'),
    role: z.enum(['MANAGER']),
    address: z.object({
      country: z.string().min(2, 'Pays requis'),
      street: z.string().nonempty('Rue requise'),
      postalCode: z.string().min(2, 'Le code pastal'),
      city: z.string().nonempty('Ville requise'),
    }),
  }),
});

export type ContributorFormValues = z.infer<typeof contributorSchema>;

const domaineActivity = [
  { value: 'sport', label: 'Sport' },
  { value: 'culture', label: 'Culture' },
  { value: 'sante', label: 'Santé' },
  { value: 'economie', label: 'Economie' },
  { value: 'environnement', label: 'Environnement' },
  { value: 'education', label: 'Education' },
  { value: 'logement', label: 'Logement' },
  { value: 'politique', label: 'Politique' },
];

const Register = () => {
  const mutation = useCreateContributor();
  const [files, setFiles] = React.useState<File[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const form = useForm<ContributorFormValues>({
    resolver: zodResolver(contributorSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      phoneNumber: '',
      logo: {
        fileId: '',
        fileUrl: '',
      },
      address: {
        country: '',
        street: '',
        postalCode: '',
        city: '',
      },
      owner: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
          country: '',
          street: '',
          postalCode: '',
          city: '',
        },
        role: 'MANAGER',
      },
    },
  });

  const onSubmit = (values: ContributorFormValues) => {
    values.fieldOfActivity = value;
    mutation.mutate({ data: values, files });
    mutation.reset();
  };

  return (
    <div className='flex flex-col justify-between w-max-screen  bg-purple-100 relative overflow-hidden'>
      <WHeader />
      <main className='flex flex-col items-center px-4 py-8 pb-12  bg-white shadow-md w-full max-w-4xl mx-auto my-24 rounded-2xl'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 w-full'
          >
            <div className='flex justify-between items-center mb-8'>
              <div className='flex items-center gap-2'>
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center ${
                      step !== 2 ? 'flex-1' : ''
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
            {currentStep === 1 && (
              <Card className='bg-white'>
                <CardHeader>
                  <CardTitle>Informations sur votre organisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du l'organisation</FormLabel>
                        <FormControl>
                          <Input placeholder='Nom' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Domaine d'activité
                    </label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={open}
                          className='w-[100%] justify-between'
                        >
                          {value
                            ? domaineActivity.find(
                                (framework) => framework.value === value
                              )?.label
                            : 'Selectionner une activité...'}
                          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-[100%] p-0'>
                        <Command>
                          <CommandInput placeholder='Rechercher une activité...' />
                          <CommandList>
                            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                            <CommandGroup>
                              {domaineActivity.map((framework) => (
                                <CommandItem
                                  key={framework.value}
                                  value={framework.value}
                                  onSelect={(currentValue) => {
                                    setValue(
                                      currentValue === value ? '' : currentValue
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      value === framework.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {framework.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de l'organisation</FormLabel>
                        <FormControl>
                          <Input type='email' placeholder='Email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone de l'organisation</FormLabel>
                        <FormControl>
                          <Input
                            type='tel'
                            placeholder='Exemple : +2250000000000'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* File logo */}
                  <div className='flex flex-col'>
                    <label className='block text-sm font-medium mb-2'>
                      Logo
                    </label>
                    <input
                      type='file'
                      accept='image/*'
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // TODO: Upload file and set URL
                          setFiles((prev) => [...prev, file]);
                        }
                      }}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio / Présentation</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Description' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className='mt-4 mb-4'>Information sur le siège social</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='address.country'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <FormControl>
                            <Input placeholder='Pays' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address.city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder='Ville' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address.street'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rue</FormLabel>
                          <FormControl>
                            <Input placeholder='Rue' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address.postalCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <Input placeholder='Code postal' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Information sur le manageur</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='owner.firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder='Nom du manageur' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='owner.lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom du manageur</FormLabel>
                        <FormControl>
                          <Input placeholder='Prénom' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='owner.email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='Email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='owner.phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Exemple : +2250000000000'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='owner.address.street'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rue</FormLabel>
                          <FormControl>
                            <Input placeholder='Rue' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='owner.address.postalCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal</FormLabel>
                          <FormControl>
                            <Input placeholder='Code postal' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='owner.address.country'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <FormControl>
                            <Input placeholder='Pays' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='owner.address.city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder='Ville' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
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
                    'Créer le contributeur'
                  )}
                </Button>
              ) : (
                <Button
                  type='button'
                  className='ml-auto'
                  onClick={async () => {
                    const step1Fields = [
                      'name',
                      'description',
                      'email',
                      'phoneNumber',
                      'address.country',
                      'address.street',
                      'address.postalCode',
                      'address.city',
                    ] as const;
                    const step2Fields = [
                      'owner.firstName',
                      'owner.lastName',
                      'owner.email',
                      'owner.phone',
                      'owner.address.country',
                      'owner.address.street',
                      'owner.address.postalCode',
                      'owner.address.city',
                    ] as const;

                    const fieldsToValidate =
                      currentStep === 1 ? step1Fields : step2Fields;
                    const isValid = await form.trigger(fieldsToValidate);
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
      </main>
    </div>
  );
};

export default Register;
