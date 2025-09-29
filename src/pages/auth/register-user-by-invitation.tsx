import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { useRegisterUserByInvite } from '@/hook/admin.hook';
import {
  formInviteRegisterUserSchema,
  FormInviteRegisterUserValues,
} from '@/schema/admins.schema';
import { validatePhoneNumber } from '@/utils';
import { validateEmailComplete } from '@/utils/emailValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import PhoneInput from 'react-phone-number-input';

const RegisterInvited = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  // state local
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formattedNumber, setFormattedNumber] = useState<string>('');
  const [isValidNumber, setIsValidNumber] = useState<null | boolean>(null);
  const [validationEmail, setValidationEmail] = useState<null | any>(null);

  const mutation = useRegisterUserByInvite(token as string);
  const formAddStaff = useForm<FormInviteRegisterUserValues>({
    resolver: zodResolver(formInviteRegisterUserSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      address: {
        country: '',
        street: '',
        postalCode: '',
        city: '',
      },
    },
  });

  const handleSubmit = (data: FormInviteRegisterUserValues) => {
    // setStaffMemberStore('staffMemberForm', data);
    const payload = {
      ...data,
    };
    mutation.mutate(payload);
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <Card className='p-4 mt-5 w-[800px]'>
        {/* <div className='flex justify-between items-center mb-10'> */}
        <h4 className='text-2xl font-bold text-[#6c2bd9!important]'>
          Création d'un utilisateur par invitation
        </h4>
        {/* </div> */}
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
              <>
                <FormField
                  control={formAddStaff.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='block text-sm font-medium'>
                        Nom
                      </FormLabel>
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
                      <FormLabel className='block text-sm font-medium'>
                        Prénom
                      </FormLabel>
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
                      <FormLabel className='block text-sm font-medium'>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          onChange={(e) => {
                            field.onChange(e);
                            const result = validateEmailComplete(
                              e.target.value
                            );
                            setValidationEmail(result);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {validationEmail ? (
                          <div
                            className={`p-3 rounded-md ${
                              validationEmail.isValid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {validationEmail.isValid ? (
                              <div>
                                <span className='font-medium'>
                                  ✓ Email valide
                                </span>
                                {validationEmail.info.provider && (
                                  <div className='mt-1 text-sm'>
                                    Fournisseur:{' '}
                                    {validationEmail.info.provider}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <span className='font-medium'>
                                  ✗ Email invalide
                                </span>
                                <div className='mt-1 text-sm'>
                                  {validationEmail.suggestion}
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
                  control={formAddStaff.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='block text-sm font-medium'>
                        Téléphone
                      </FormLabel>
                      <FormControl>
                      <PhoneInput
                        international={false}
                        defaultCountry='CI'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          const { isValidNumber, formattedNumber } =
                            validatePhoneNumber(e ? e : '');
                          setIsValidNumber(isValidNumber);
                          setFormattedNumber(
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
                        {formAddStaff.watch('phone') &&
                        isValidNumber ? (
                          <div
                            className={`p-3 rounded-md ${
                              isValidNumber
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <div>
                              <span className='font-medium'>
                                ✓ Numéro valide
                              </span>
                              {formattedNumber && (
                                <div className='mt-1 text-sm'>
                                  Format: {formattedNumber}
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
                <FormField
                  control={formAddStaff.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='block text-sm font-medium'>
                        Mot de passe
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                          <Input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Mot de passe'
                            className='pl-10'
                            disabled={mutation.isPending}
                            {...field}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {currentStep === 2 && (
              //addresse
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={formAddStaff.control}
                  name='address.country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='block text-sm font-medium'>
                        Pays
                      </FormLabel>
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
                      <FormLabel className='block text-sm font-medium'>
                        Rue
                      </FormLabel>
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
                      <FormLabel className='block text-sm font-medium'>
                        Code postal
                      </FormLabel>
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
                      <FormLabel className='block text-sm font-medium'>
                        Ville
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Ville' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                <Button
                  type='submit'
                  className='ml-auto'
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className='animate-spin' />
                      En cours...
                    </>
                  ) : (
                    "Créer l'utilisateur"
                  )}
                </Button>
              ) : (
                <Button
                  type='button'
                  className='ml-auto'
                  onClick={() => setCurrentStep((prev) => prev + 1)}
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
};

export default RegisterInvited;
