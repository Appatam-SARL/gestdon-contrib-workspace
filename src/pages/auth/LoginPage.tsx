import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLogin } from '@/hook/admin.hook';
import { formLoginSchema, FormLoginValues } from '@/schema/admins.schema';
import { zodResolver } from '@hookform/resolvers/zod';
// import { Button } from 'flowbite-react';
import logo from '@/assets/logo.png';
import { Eye, EyeOff, Loader2, Lock, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const mutationLogin = useLogin();
  const formLogin = useForm<FormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      remember: false,
    },
  });

  const handleSubmit = (data: FormLoginValues) => {
    let loginData: { login: string; password: string };

    // Use a type guard to check if the data contains an email property
    if ('email' in data && data.email) {
      // If 'email' exists, it must be the email-based login data
      loginData = { login: data.email, password: data.password };
    } else if ('phone' in data && data.phone) {
      // If 'phone' exists, it must be the phone-based login data
      loginData = { login: data.phone, password: data.password };
    } else {
      // This case should ideally not happen if Zod validation is used correctly,
      // but it's good practice to handle unexpected data.
      console.error('Invalid login data structure');
      return; // Exit the function if data is invalid
    }

    mutationLogin.mutate(loginData);
  };

  return (
    <div className='flex items-center justify-center mb-5 min-w-screen'>
      <div className='flex max-w-4xl w-full bg-white shadow-lg rounded-2xl overflow-hidden'>
        {/* Section de présentation */}
        <div className='w-1/2 bg-purple-700 text-white p-8 flex flex-col justify-center items-center'>
          <img src={logo} alt='Logo' className='w-38 mb-4' />

          <h2 className='text-3xl font-bold mb-4'>Bienvenue !</h2>
          <p className='text-center'>
            {' '}
            Rejoignez notre communauté de contributeurs, mesurez votre
            reputation et suivez l'impact de vos actions dans la société
          </p>
        </div>

        {/* Section de connexion */}
        <div className='w-1/2 p-6'>
          <h1 className='text-3xl font-bold text-purple-700 text-center mb-6'>
            Connexion
          </h1>

          <FormProvider {...formLogin}>
            <form
              onSubmit={formLogin.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <Tabs defaultValue='byEmail' className='w-[400px]'>
                <TabsList>
                  <TabsTrigger value='byEmail'>Par email</TabsTrigger>
                  <TabsTrigger value='byPhoneNumber'>
                    Par numéro de téléphone
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='byEmail'>
                  <FormField
                    control={formLogin.control}
                    name='email'
                    disabled={mutationLogin.isPending}
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel className='text-gray-700'>Email</FormLabel>
                        <FormControl className='relative'>
                          <div className='relative'>
                            <Mail className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                            <Input {...field} type='email' className='pl-10' />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value='byPhoneNumber'>
                  <FormField
                    control={formLogin.control}
                    name='phone'
                    disabled={mutationLogin.isPending}
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel className='text-gray-700'>
                          Numéro de téléphone
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Phone className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                            <Input {...field} className='pl-10' />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <FormField
                control={formLogin.control}
                name='password'
                disabled={mutationLogin.isPending}
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='text-gray-700'>
                      Mot de passe
                    </FormLabel>
                    <FormControl className='relative'>
                      <div className='relative'>
                        <Lock className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          className='pl-10'
                        />
                        <Button
                          size='icon'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-2 top-2 h-5 w-5 text-muted-foreground hover:text-foreground'
                          type='button'
                          variant='ghost'
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

              <FormField
                control={formLogin.control}
                name='remember'
                disabled={mutationLogin.isPending}
                render={({ field }) => (
                  <FormItem>
                    <label className='text-gray-700'>
                      Se souvenir de moi
                      <span className='text-red-500'>*</span>
                    </label>
                    <FormControl>
                      <Checkbox
                        {...field}
                        value={field.value ? 'on' : undefined}
                        disabled={mutationLogin.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full bg-purple-700 text-white py-3 cursor-pointer rounded-lg hover:bg-purple-800'
                disabled={mutationLogin.isPending}
              >
                {mutationLogin.isPending ? (
                  <>
                    <Loader2 className='animate-spin' />
                    <span>En cours de connexion...</span>
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </FormProvider>

          <div className='text-center my-4'>
            <Link
              to='forgot-password'
              className='text-purple-600 hover:underline'
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* <div className='flex flex-col gap-3'>
            <Button className='w-full cursor-pointer flex items-center justify-center bg-red-500 text-white py-3 rounded-lg hover:bg-red-600'>
              <FcGoogle className='mr-2 text-xl' /> Se connecter avec Google
            </Button>
            <Button className='w-full cursor-pointer flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700'>
              <FaFacebook className='mr-2 text-xl' /> Se connecter avec Facebook
            </Button>
          </div> */}

          <div className='text-center mt-6'>
            <span>Vous n'avez pas de compte ? </span>
            <Link
              to='sign-up'
              className='text-purple-600 font-bold bg-transparent cursor-pointer'
            >
              Inscrivez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
