import countries from '@/assets/constants/country';
import { TYPE_BENEFICIAIRE } from '@/assets/constants/beneficiaire';
import animationData from '@/assets/svg/stats.json';
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
  FormDescription,
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
import { useToast } from '@/components/ui/use-toast';
import WHeader from '@/components/welcome/WHeader';
import { useCreateContributor } from '@/hook/contributors.hook';
import { cn } from '@/lib/utils';
import { validatePhoneNumber } from '@/utils';
import { cleanEmail, validateEmailComplete } from '@/utils/emailValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  CheckIcon,
  ChevronsUpDown,
  ChevronsUpDownIcon,
  Loader2,
  Square,
  CheckSquare,
} from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import Lottie from 'react-lottie';
import PhoneInput from 'react-phone-number-input';
import { z } from 'zod';

const contributorSchema = z.object({
  name: z.string().nonempty('Le nom est requis'),
  description: z.string().nonempty('La description est requise'),
  email: z.string().nonempty('Email est requis').email('Email invalide'),
  phoneNumber: z.string().nonempty('Numéro de téléphone requis'),
  fieldOfActivity: z.string().optional(),
  typeBeneficiary: z.array(z.object({
    id: z.string(),
    label: z.string(),
    description: z.string()
  })).optional(),
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
  { value: 'communication', label: 'Communication'},
  { value: "technologie de l'information", label: "Technologie de l'information" },
  { value: 'batiment et btp', label: 'Bâtiment et BTP' },
  { value: 'evenementielle', label: 'Evénementielle' },
  { value: 'autre', label: 'Autre'}
];


const Register = () => {
  const { toast } = useToast();
  const mutation = useCreateContributor();
  const [files, setFiles] = React.useState<File[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [validationContributor, setValidationContributor] = React.useState<
    null | any
  >(null);
  const [validationOwner, setValidationOwner] = React.useState<null | any>(
    null
  );
  const [formattedNumberContributor, setFormattedNumberContributor] =
    React.useState<string>('');
  const [isValidNumberContributor, setIsValidNumberContributor] =
    React.useState<null | boolean>(null);
  const [formattedNumberOwner, setFormattedNumberOwner] =
    React.useState<string>('');
  const [isValidNumberOwner, setIsValidNumberOwner] = React.useState<
    null | boolean
  >(null);
  const [commanOpenCountryContrib, setOpenCountryContrib] =
    React.useState(false);
  const [openPays, setOpenPays] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState<string | null>(
    null
  );
  const [selectedCountryOwner, setSelectedCountryOwner] = React.useState<string | null>(
    null
  );
  const [selectedBeneficiaryTypes, setSelectedBeneficiaryTypes] = React.useState<string[]>([]);

  // Fonction pour obtenir la description des types de bénéficiaires
  const getBeneficiaryDescription = React.useCallback((type: string): string => {
    switch (type) {
      case 'ORGANISATION MUTUELLE':
        return 'Organisations qui proposent des services de mutualité et d\'entraide';
      case 'COMMUNAUTÉ RELIGIEUSE':
        return 'Communautés et organisations basées sur des croyances religieuses';
      case 'ASSOCIATION DE MUTUELLE':
        return 'Associations qui organisent des activités mutualistes et solidaires';
      case 'ASSOCIATION DE SOLIDARITE':
        return 'Associations axées sur l\'aide et la solidarité sociale';
      case 'ORGANISATION SPIRITUELLE':
        return 'Organisations basées sur des valeurs spirituelles et éthiques';
      case 'ENTREPRISE COMMERCIALE':
        return 'Entreprises avec des activités commerciales et lucratives';
      case 'ORGANISATION COMMERCIALE':
        return 'Organisations ayant des objectifs commerciaux et économiques';
      default:
        return '';
    }
  }, []);

  // Conversion des types de bénéficiaires en format plus convivial
  const beneficiaryTypes = React.useMemo(() => 
    TYPE_BENEFICIAIRE.map((type) => ({
      id: type,
      label: type,
      description: getBeneficiaryDescription(type)
    })), [getBeneficiaryDescription]);

  // Fonction pour gérer le toggle des types de bénéficiaires
  const handleBeneficiaryToggle = React.useCallback((typeId: string) => {
    setSelectedBeneficiaryTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  }, []);

  const form = useForm<ContributorFormValues>({
    resolver: zodResolver(contributorSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      phoneNumber: '',
      typeBeneficiary: [],
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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const onSubmit = (values: ContributorFormValues) => {
    const { isValidNumber } = validatePhoneNumber(values.phoneNumber);
    const isValidEmail = cleanEmail(values.email);
    const { isValidNumber: isValidNumberForOwner } = validatePhoneNumber(
      values.owner.phone
    );
    const isValidEmailForOwner = cleanEmail(values.owner.email);
    if (!isValidNumber && !isValidNumberForOwner) {
      toast({
        title: 'Numéro de téléphone invalide',
        description: 'Veuillez entrer un numéro de téléphone valide.',
        variant: 'destructive',
      });
      return;
    }
    if (!isValidEmail && !isValidEmailForOwner) {
      toast({
        title: 'Email invalide',
        description: 'Veuillez entrer une adresse email valide.',
        variant: 'destructive',
      });
      return;
    }
    if (files.length === 0) {
      toast({
        title: 'Attention',
        description: 'Vous devez ajouter un logo pour votre profil.',
        variant: 'destructive',
      });
      return;
    }
    if (
      !values.name ||
      !values.description ||
      !values.email ||
      !values.phoneNumber
    ) {
      toast({
        title: 'Attention',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive',
      });
      return;
    }
    if (
      !values.address.country ||
      !values.address.street ||
      !values.address.postalCode ||
      !values.address.city
    ) {
      toast({
        title: 'Attention',
        description: 'Veuillez remplir tous les champs.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedBeneficiaryTypes.length === 0) {
      toast({
        title: 'Attention',
        description: 'Veuillez sélectionner au moins un type de bénéficiaire.',
        variant: 'destructive',
      });
      return;
    }

    // delete selectedBeneficiaryTypes.id;

    values.fieldOfActivity = value;
    // Convertir les IDs sélectionnés en objets complets
    values.typeBeneficiary = selectedBeneficiaryTypes.map(typeId => {
      const type = beneficiaryTypes.find(t => t.id === typeId);
      return {
        id: typeId,
        label: type?.label || typeId,
        description: type?.description || ''
      };
    });
    mutation.mutate({ data: values, files });
    mutation.reset();
  };

  return (
    <div className='flex flex-col justify-between w-max-screen  bg-purple-100 relative overflow-hidden'>
      <WHeader />
      <main className='flex flex-col items-center px-4 py-8 pb-12  bg-white shadow-md w-full max-w-[1200px]  mx-auto my-24 rounded-2xl'>
        <div className='flex max-w-[1200px] w-full bg-white shadow-lg rounded-2xl overflow-hidden'>
          <div className='w-1/2 bg-purple-700 text-white p-8 flex flex-col justify-center items-center'>
            <Lottie
              options={defaultOptions}
              height={600}
              width={500}
              isStopped={false}
              isPaused={false}
            />
          </div>
          <div className='w-1/2 p-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 w-full'
              >
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
                    Étape {currentStep} sur 3
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
                          <FormItem className='mb-4'>
                            <FormLabel>Nom du l'organisation</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                          <PopoverTrigger asChild className='mb-4'>
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
                              <CommandList className="max-h-[200px] overflow-y-auto">
                                <CommandEmpty>
                                  Aucun résultat trouvé.
                                </CommandEmpty>
                                <CommandGroup>
                                  {domaineActivity.map((framework) => (
                                    <CommandItem
                                      key={framework.value}
                                      value={framework.value}
                                      onSelect={(currentValue) => {
                                        setValue(
                                          currentValue === value
                                            ? ''
                                            : currentValue
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
                          <FormItem className='mb-4'>
                            <FormLabel>Email de l'organisation</FormLabel>
                            <FormControl>
                              <Input
                                type='email'
                                onChange={(e) => {
                                  field.onChange(e);
                                  const result = validateEmailComplete(
                                    e.target.value
                                  );
                                  setValidationContributor(result);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              {validationContributor ? (
                                <div
                                  className={`p-3 rounded-md ${
                                    validationContributor.isValid
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {validationContributor.isValid ? (
                                    <div>
                                      <span className='font-medium'>
                                        ✓ Email valide
                                      </span>
                                      {validationContributor.info.provider && (
                                        <div className='mt-1 text-sm'>
                                          Fournisseur:{' '}
                                          {validationContributor.info.provider}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div>
                                      <span className='font-medium'>
                                        ✗ Email invalide
                                      </span>
                                      <div className='mt-1 text-sm'>
                                        {validationContributor.suggestion}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className='mt-1 text-sm text-gray-600'>
                                  <h3 className='font-medium mb-2'>
                                    Exemples valides :
                                  </h3>
                                  <ul className='space-y-1'>
                                    <li>• utilisateur@exemple.com</li>
                                    <li>• jean.dupont@gmail.com</li>
                                    <li>• contact+info@entreprise.fr</li>
                                    <li>• test_123@domaine.co.uk</li>
                                  </ul>
                                </div>
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='phoneNumber'
                        render={({ field }) => (
                          <FormItem className='mb-4'>
                            <FormLabel>Téléphone de l'organisation</FormLabel>
                            <FormControl>
                              <PhoneInput
                                international={false}
                                defaultCountry='CI'
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e);
                                  const { isValidNumber, formattedNumber } =
                                    validatePhoneNumber(e ? e : '');
                                  setIsValidNumberContributor(isValidNumber);
                                  setFormattedNumberContributor(
                                    formattedNumber
                                  );
                                }}
                                className={
                                  'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              {/* Exemples de formats acceptés */}
                              {form.watch('phoneNumber') &&
                              isValidNumberContributor ? (
                                <div
                                  className={`p-3 rounded-md ${
                                    isValidNumberContributor
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  <div>
                                    <span className='font-medium'>
                                      ✓ Numéro valide
                                    </span>
                                    {formattedNumberContributor && (
                                      <div className='mt-1 text-sm'>
                                        Format: {formattedNumberContributor}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className='mt-6 text-sm text-gray-600'>
                                  <h3 className='font-medium mb-2'>
                                    Formats acceptés :
                                  </h3>
                                  <ul className='space-y-1'>
                                    <li className='text-red'>
                                      • +2250123456789
                                    </li>
                                    <li className='text-red'>
                                      • Préfixes: 01, 05, 07 (mobile), 27 (fixe
                                      Abidjan)
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </FormDescription>
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
                          className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500 mb-4'
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
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <p className='mt-4 mb-4'>
                        Information sur le siège social
                      </p>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name='address.country'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pays</FormLabel>
                              <FormControl>
                                <Popover
                                  open={commanOpenCountryContrib}
                                  onOpenChange={setOpenCountryContrib}
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant='outline'
                                      role='combobox'
                                      aria-expanded={open}
                                      className='w-[100%] justify-between'
                                    >
                                      {selectedCountry
                                        ? countries.find(
                                            (country) =>
                                              country.value === selectedCountry
                                          )?.label
                                        : 'Choisir un pays'}
                                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className='w-[100%] p-0'>
                                    <Command>
                                      <CommandInput placeholder='Rechercher un pays...' />
                                      <CommandEmpty>
                                        Aucun pays trouvé.
                                      </CommandEmpty>
                                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                                        {countries.map((country) => (
                                          <CommandItem
                                            key={country.value}
                                            value={country.value}
                                            onSelect={() => {
                                              field.onChange(country.value);
                                              setSelectedCountry(country.value);
                                              setOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedCountry ===
                                                  country.value
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
                                              )}
                                            />
                                            {country.label}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
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
                                <Input {...field} />
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
                                <Input {...field} />
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
                                <Input {...field} />
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
                      <CardTitle>Types de bénéficiaires</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Sélectionnez les types de bénéficiaires que vous souhaitez gérer dans votre espace.
                        Vous pourrez modifier ces paramètres plus tard dans les réglages.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4">
                        {beneficiaryTypes.map((beneficiaryType) => {
                          const isSelected = selectedBeneficiaryTypes.includes(beneficiaryType.id);

                          return (
                            <div
                              key={beneficiaryType.id}
                              className={cn(
                                "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md",
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                              onClick={() => handleBeneficiaryToggle(beneficiaryType.id)}
                            >
                              <div className="mt-1 flex items-center justify-center w-5 h-5">
                                {isSelected ? (
                                  <CheckSquare className="w-5 h-5 text-primary" />
                                ) : (
                                  <Square className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <h3 className="font-medium text-sm leading-none">
                                  {beneficiaryType.label}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {beneficiaryType.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {selectedBeneficiaryTypes.length > 0 && (
                        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Types sélectionnés :</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedBeneficiaryTypes.map((typeId) => {
                              const type = beneficiaryTypes.find(t => t.id === typeId);
                              return (
                                <span
                                  key={typeId}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground"
                                >
                                  {type?.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {currentStep === 3 && (
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
                              <Input
                                placeholder='Email'
                                onChange={(e) => {
                                  field.onChange(e);
                                  const result = validateEmailComplete(
                                    e.target.value
                                  );
                                  setValidationOwner(result);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              {validationOwner ? (
                                <div
                                  className={`p-3 rounded-md ${
                                    validationOwner.isValid
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {validationOwner.isValid ? (
                                    <div>
                                      <span className='font-medium'>
                                        ✓ Email valide
                                      </span>
                                      {validationOwner.info.provider && (
                                        <div className='mt-1 text-sm'>
                                          Fournisseur:{' '}
                                          {validationOwner.info.provider}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div>
                                      <span className='font-medium'>
                                        ✗ Email invalide
                                      </span>
                                      <div className='mt-1 text-sm'>
                                        {validationOwner.suggestion}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className='mt-1 text-sm text-gray-600'>
                                  <h3 className='font-medium mb-2'>
                                    Exemples valides :
                                  </h3>
                                  <ul className='space-y-1'>
                                    <li>• utilisateur@exemple.com</li>
                                    <li>• jean.dupont@gmail.com</li>
                                    <li>• contact+info@entreprise.fr</li>
                                    <li>• test_123@domaine.co.uk</li>
                                  </ul>
                                </div>
                              )}
                            </FormDescription>
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
                              <PhoneInput
                                international={false}
                                defaultCountry='CI'
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e);
                                  const { isValidNumber, formattedNumber } =
                                    validatePhoneNumber(e ? e : '');
                                  setIsValidNumberOwner(isValidNumber);
                                  setFormattedNumberOwner(formattedNumber);
                                }}
                                className={
                                  'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              {/* Exemples de formats acceptés */}
                              {form.watch('phoneNumber') &&
                              isValidNumberOwner ? (
                                <div
                                  className={`p-3 rounded-md ${
                                    isValidNumberOwner
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  <div>
                                    <span className='font-medium'>
                                      ✓ Numéro valide
                                    </span>
                                    {formattedNumberOwner && (
                                      <div className='mt-1 text-sm'>
                                        Format: {formattedNumberOwner}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className='mt-6 text-sm text-gray-600'>
                                  <h3 className='font-medium mb-2'>
                                    Formats acceptés :
                                  </h3>
                                  <ul className='space-y-1'>
                                    <li className='text-red'>
                                      • +2250123456789
                                    </li>
                                    <li className='text-red'>
                                      • Préfixes: 01, 05, 07 (mobile), 27 (fixe
                                      Abidjan)
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </FormDescription>
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
                                <Popover
                                  open={openPays}
                                  onOpenChange={setOpenPays}
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant='outline'
                                      role='combobox'
                                      aria-expanded={open}
                                      className='w-[100%] justify-between'
                                    >
                                      {selectedCountryOwner
                                        ? countries.find(
                                            (country) =>
                                              country.value === selectedCountryOwner
                                          )?.label
                                        : 'Choisir un pays'}
                                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className='w-[100%] p-0'>
                                    <Command>
                                      <CommandInput placeholder='Rechercher un pays...' />
                                      <CommandEmpty>
                                        Aucun pays trouvé.
                                      </CommandEmpty>
                                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                                        {countries.map((country) => (
                                          <CommandItem
                                            key={country.value}
                                            value={country.value}
                                            onSelect={() => {
                                              field.onChange(country.value);
                                              setSelectedCountryOwner(country.value);
                                              setOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedCountryOwner ===
                                                  country.value
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
                                              )}
                                            />
                                            {country.label}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
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
                  {currentStep === 3 ? (
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
                        if (currentStep === 1) {
                          // Validation de l'étape 1 (Informations du contributeur)
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
                          const isValid = await form.trigger(step1Fields);
                          if (isValid) {
                            setCurrentStep((prev) => prev + 1);
                          }
                        } else if (currentStep === 2) {
                          // Validation de l'étape 2 (Types de bénéficiaires)
                          if (selectedBeneficiaryTypes.length === 0) {
                            toast({
                              title: 'Attention',
                              description: 'Veuillez sélectionner au moins un type de bénéficiaire.',
                              variant: 'destructive',
                            });
                            return;
                          }
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
