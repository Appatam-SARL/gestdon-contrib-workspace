import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateFreeTrialSubscription } from '@/hook/subscription.hook';
import usePackageStore from '@/store/package.store';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Banknote,
  Calendar1,
  CheckCircle,
  CreditCard,
  Undo2,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PhoneNumber from 'react-phone-number-input';
import { z } from 'zod';
import ActivationSuccess from '../../../components/Abonnements/ActivationSuccess';
import ContactForm from '../../../components/Abonnements/ContactForm';
import FreePackageActivation from '../../../components/Abonnements/FreePackageActivation';
import WHeader from '../../../components/welcome/WHeader';

const durations = [1, 6, 12, 24, 36];
const tv = 0;

const paymentMethods = {
  MOBILE_MONEY: {
    name: 'Orange Money',
    logo: ['orange.png', 'mtn.png', 'moov.png'],
  },
  CREDIT_CARD: {
    name: 'Carte Credit',
    logo: 'visa.png',
  },
  WAVE: {
    name: 'Wave',
    logo: 'wave.png',
  },
};

const paymentSchema = z.object({
  contributorId: z.string(),
  packageId: z.string(),
  method: z.enum(['MOBILE_MONEY', 'STRIPE', 'CREDIT_CARD', 'PAYPAL']),
  amount: z.number(),
  currency: z.string(),
});

const PaiementPage = () => {
  const contributorId = localStorage.getItem('contributorId');

  const [selectedDuration, setSelectedDuration] = useState(6);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);

  const { package: selectedPackage } = usePackageStore((state) => state);
  const mutationCreateFreeSubscription = useCreateFreeTrialSubscription();

  console.log('🚀 ~ PaiementPage ~ selectedPackage:', selectedPackage);

  // Déterminer le type de package et l'action à effectuer
  const getPackageType = (packageName) => {
    if (!packageName) return 'UNKNOWN';

    const name = packageName.toLowerCase();
    if (name.includes('solidarité') || name.includes('SOLIDARITÉ'))
      return 'FREE';
    if (name.includes('ambassadeur')) return 'CONTACT_REQUIRED';
    return 'PAID';
  };

  const packageType = getPackageType(selectedPackage?.name);

  const totalHT = selectedPackage?.price * selectedDuration;
  const totalTTC = totalHT + tv;

  const formPayment = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      contributorId: '',
      packageId: '',
      method: 'MOBILE_MONEY',
      amount: 0,
      currency: 'FCFA',
    },
  });

  // Gestion de l'activation du package gratuit
  const handleFreePackageActivation = async () => {
    mutationCreateFreeSubscription.mutate({
      contributorId: contributorId,
      packageId: selectedPackage._id,
    });
  };

  // Gestion de la soumission du formulaire de contact
  const handleContactSubmit = async (contactData) => {
    try {
      // Simulation d'une API call pour envoyer le formulaire
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Données de contact soumises:', contactData);
      console.log('Package sélectionné:', selectedPackage);

      setIsContactSubmitted(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
    }
  };

  // Rendu conditionnel selon le type de package
  if (packageType === 'FREE') {
    // Si l'activation a réussi, afficher la page de succès
    if (mutationCreateFreeSubscription.isSuccess) {
      return (
        <div className='flex flex-col justify-between w-max-screen bg-purple-100 relative overflow-hidden'>
          <WHeader />
          <main className='min-h-screen bg-white p-6 md:p-12 max-w-4xl mx-auto rounded-md shadow-md w-full mt-24'>
            <ActivationSuccess
              packageName={selectedPackage?.name || 'Package Gratuit'}
              packageDescription={
                selectedPackage?.description ||
                'Profitez de toutes les fonctionnalités gratuitement'
              }
              features={selectedPackage?.features || []}
            />
          </main>
        </div>
      );
    }

    // Sinon, afficher le formulaire d'activation
    return (
      <div className='flex flex-col justify-between w-max-screen bg-purple-100 relative overflow-hidden'>
        <WHeader />
        <main className='min-h-screen bg-white p-6 md:p-12 max-w-4xl mx-auto rounded-md shadow-md w-full mt-24'>
          <FreePackageActivation
            packageName={selectedPackage?.name || 'Package Gratuit'}
            packageDescription={
              selectedPackage?.description ||
              'Profitez de toutes les fonctionnalités gratuitement'
            }
            features={selectedPackage?.features || []}
            onActivate={handleFreePackageActivation}
            isActivating={mutationCreateFreeSubscription.isPending}
          />
        </main>
      </div>
    );
  }

  if (packageType === 'CONTACT_REQUIRED') {
    return (
      <div className='flex flex-col justify-between w-max-screen bg-purple-100 relative overflow-hidden'>
        <WHeader />
        <main className='min-h-screen bg-white p-6 md:p-12 max-w-4xl mx-auto rounded-md shadow-md w-full mt-24'>
          {!isContactSubmitted ? (
            <ContactForm
              packageName={selectedPackage?.name || 'Package Ambassadeur'}
              onSubmit={handleContactSubmit}
            />
          ) : (
            <div className='text-center max-w-2xl mx-auto'>
              <div className='inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4'>
                <CheckCircle className='w-10 h-10 text-blue-600' />
              </div>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                Demande envoyée avec succès ! 📧
              </h1>
              <p className='text-lg text-gray-600 mb-6'>
                Merci pour votre intérêt pour le package{' '}
                <span className='font-semibold text-blue-600'>
                  {selectedPackage?.name}
                </span>
                . Notre équipe vous contactera dans les plus brefs délais pour
                discuter de vos besoins.
              </p>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8'>
                <h3 className='font-semibold text-blue-800 mb-3'>
                  Prochaines étapes :
                </h3>
                <div className='space-y-2 text-left'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                    <span className='text-blue-700'>
                      Réception de votre demande (immédiat)
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                    <span className='text-blue-700'>
                      Analyse de vos besoins (24-48h)
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                    <span className='text-blue-700'>
                      Appel de notre équipe (2-3 jours ouvrés)
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => window.history.back()}
                variant='outline'
                className='border-gray-300 text-gray-700 hover:bg-gray-50'
              >
                <Undo2 className='w-4 h-4 mr-2' />
                Retour à la sélection
              </Button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Rendu pour les packages payants (Participant, Acteur social)
  return (
    <div className='flex flex-col justify-between w-max-screen bg-purple-100 relative overflow-hidden'>
      <WHeader />
      <main className='min-h-screen bg-white p-6 md:p-12 max-w-4xl mx-auto rounded-md shadow-md w-full  mt-24'>
        <h2 className='bg-gray-300 text-3xl font-bold text-purple-700 mb-6 p-4 rounded-md shadow-md w-full'>
          Paiement - {selectedPackage?.name}
        </h2>

        {/* Durée d'abonnement */}
        <div className='mb-8'>
          <Select onValueChange={setSelectedDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Choisissez la durée d'abonnement" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {durations.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d} mois
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Récapitulatif montant */}
        <div className='bg-primary text-white border rounded-md p-4 mb-8'>
          <div className='flex justify-between mb-2'>
            <span>Total HT</span>
            <span>{totalHT.toLocaleString()} FCFA</span>
          </div>
          <div className='flex justify-between mb-2'>
            <span>TVA</span>
            <span>{tv.toLocaleString()} FCFA</span>
          </div>
          <div className='flex justify-between font-bold text-lg'>
            <span>Total TTC</span>
            <span>{totalTTC.toLocaleString()} FCFA</span>
          </div>
        </div>

        {/* Moyens de paiement */}
        <div>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            Méthode de paiement :
          </h2>
          <div className='grid grid-cols-3 md:grid-cols-3 gap-4'>
            {paymentMethods &&
              Object.keys(paymentMethods).map((method) => (
                <label
                  key={method}
                  className={`border p-4 rounded flex flex-row items-center justify-center cursor-pointer hover:bg-purple-50 ${
                    selectedPayment === method ? 'ring-2 ring-purple-600' : ''
                  } gap-1 md:gap-4`}
                  onClick={() =>
                    setSelectedPayment((meth) =>
                      meth === method ? null : method
                    )
                  }
                >
                  {Array.isArray(paymentMethods[method].logo) ? (
                    paymentMethods[method].logo.map((logo) => (
                      <img
                        key={logo}
                        src={`/payment/${logo}`}
                        alt={method.name}
                        className='w-8 h-8 object-contain mb-2 rounded-full'
                      />
                    ))
                  ) : (
                    <img
                      src={`/payment/${paymentMethods[method].logo}`}
                      alt={method.name}
                      className='w-16 h-12 object-contain mb-2'
                    />
                  )}

                  <span className='text-sm text-center'>{method.name}</span>
                </label>
              ))}
          </div>
          <div className='mt-10'>
            <form
              onSubmit={formPayment.handleSubmit(() => console.log('submit'))}
            >
              <Form {...formPayment}>
                {selectedPayment === 'MOBILE_MONEY' && (
                  <FormField
                    name='n'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de téléphone</FormLabel>
                        <FormControl>
                          <PhoneNumber
                            country='CI'
                            defaultCountry='CI'
                            international={false}
                            value={field.value}
                            onChange={field.onChange}
                            className={
                              'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                {selectedPayment === 'CREDIT_CARD' && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      name='cardNumber'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de carte</FormLabel>
                          <FormControl className='relative'>
                            <div className='relative flex'>
                              <Input className='pr-10' {...field} />
                              <CreditCard className='absolute right-3 top-2.5 h-5 w-5 text-muted-foreground' />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='cardName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom sur la carte</FormLabel>
                          <FormControl>
                            <div className='relative flex'>
                              <Input className='pr-10' {...field} />
                              <Calendar1 className='absolute right-3 top-2.5 h-5 w-5 text-muted-foreground' />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='cardExpiry'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d'expiration</FormLabel>
                          <FormControl>
                            <div className='relative flex'>
                              <Input className='pr-10' {...field} />
                              <Calendar1 className='absolute right-3 top-2.5 h-5 w-5 text-muted-foreground' />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='cardSecurityCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code de sécurité</FormLabel>
                          <FormControl>
                            <input
                              type='text'
                              className='w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {selectedPayment === 'PAYPAL' && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      name='paypalEmail'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Paypal</FormLabel>
                          <FormControl>
                            <input
                              type='text'
                              className='w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='paypalPassword'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe Paypal</FormLabel>
                          <FormControl>
                            <input
                              type='text'
                              className='w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name='paypalSignature'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature Paypal</FormLabel>
                          <FormControl>
                            <input
                              type='text'
                              className='w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {selectedPayment === 'STRIPE' && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      name='stripePublishableKey'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clé publique Stripe</FormLabel>
                          <FormControl>
                            <input
                              type='text'
                              className='w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name='amount'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Montant</FormLabel>
                          <FormControl>
                            <input
                              type='number'
                              min='0'
                              step='0.01'
                              className='w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {selectedPayment === 'WAVE' && (
                  <FormField
                    name='n'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de téléphone</FormLabel>
                        <FormControl>
                          <PhoneNumber
                            country='CI'
                            defaultCountry='CI'
                            international={false}
                            value={field.value}
                            onChange={field.onChange}
                            className={
                              'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </Form>
            </form>
          </div>
        </div>

        {/* Actions */}
        <div className='mt-10 flex justify-between items-center'>
          <Button variant={'outline'} onClick={() => window.history.back()}>
            <Undo2 />
            <span>Retour</span>
          </Button>
          <Button disabled={!selectedPayment}>
            <Banknote />
            <span>Payer {totalTTC.toLocaleString()} FCFA</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PaiementPage;
