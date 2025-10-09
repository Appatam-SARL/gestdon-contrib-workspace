import DonApi from '@/api/don.api';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Lottie from 'react-lottie';
import { User, Phone, Calendar, FileText, Hash, DollarSign } from 'lucide-react';

import animationData from '@/assets/svg/success.json';
import { useVerifyQrCode } from '@/hook/don.hook';
import { confirmDonSchema, FormConfirmDonSchema } from '@/schema/don.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const VerifyDon = () => {
  const token = new URLSearchParams(window.location.search).get('token');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoading, data } = useVerifyQrCode(token as string);

  const confirmDonForm = useForm<FormConfirmDonSchema>({
    resolver: zodResolver(confirmDonSchema),
    defaultValues: {
      observation: '',
    },
  });

  const handleConfirm = async (values: FormConfirmDonSchema) => {
    if (!token) {
      setError('Token manquant.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await DonApi.confirmDon(token, values);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Erreur lors de la confirmation du don.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-neutral-100 p-4'>
      <div className='bg-white border-2 border-gray-300 rounded-lg w-full max-w-4xl shadow-lg'>
        {success ? (
          <div className='p-10 text-center'>
            <div style={{ color: 'green', margin: '10px 0' }}>
              <Lottie
                style={{ width: 200, height: 200, margin: '0 auto' }}
                options={{
                  loop: true,
                  autoplay: true,
                  animationData,
                }}
              />
              <p className='text-xl font-semibold mt-4'>Merci, votre don a bien été confirmé !</p>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
            {/* Colonne 1: Informations du don */}
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                  Détails du don
                </h2>
                <p className='text-gray-600'>
                  Informations concernant le don que vous avez reçu
                </p>
              </div>

              {isLoading ? (
                <div className='space-y-4'>
                  <div className='animate-pulse'>
                    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                  </div>
                  <div className='animate-pulse'>
                    <div className='h-4 bg-gray-200 rounded w-2/3 mb-2'></div>
                    <div className='h-3 bg-gray-200 rounded w-3/4'></div>
                  </div>
                </div>
              ) : data?.data ? (
                <div className='space-y-4'>
                  {/* En-tête avec bénéficiaire */}
                  <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                    <div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg'>
                      {data.data.beneficiaire?.fullName?.[0] || 'B'}
                    </div>
                    <div>
                      <div className='text-sm text-gray-500'>Bénéficiaire</div>
                      <div className='text-lg font-semibold text-gray-900'>
                        {data.data.beneficiaire?.fullName || '—'}
                      </div>
                    </div>
                  </div>

                  {/* Informations principales */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='flex items-start gap-3 p-3 rounded-lg border bg-gray-50'>
                      <User className='h-4 w-4 text-gray-500 mt-0.5' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-gray-500'>Donateur</span>
                        <span className='text-sm font-medium text-gray-900'>
                          {data.data.donorFullname || '—'}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-start gap-3 p-3 rounded-lg border bg-gray-50'>
                      <Phone className='h-4 w-4 text-gray-500 mt-0.5' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-gray-500'>Téléphone</span>
                        {data.data.donorPhone ? (
                          <a href={`tel:${data.data.donorPhone}`} className='text-sm font-medium text-blue-700 hover:underline'>
                            {data.data.donorPhone}
                          </a>
                        ) : (
                          <span className='text-sm text-gray-700'>—</span>
                        )}
                      </div>
                    </div>
                    <div className='flex items-start gap-3 p-3 rounded-lg border bg-gray-50'>
                      <FileText className='h-4 w-4 text-gray-500 mt-0.5' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-gray-500'>Titre</span>
                        <span className='text-sm font-medium text-gray-900'>{data.data.title}</span>
                      </div>
                    </div>
                    <div className='flex items-start gap-3 p-3 rounded-lg border bg-gray-50'>
                      <Calendar className='h-4 w-4 text-gray-500 mt-0.5' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-gray-500'>Date du don</span>
                        <span className='text-sm font-medium text-gray-900'>
                          {new Date(data.data.createdAt).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-start gap-3 p-3 rounded-lg border bg-gray-50'>
                      <DollarSign className='h-4 w-4 text-gray-500 mt-0.5' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-gray-500'>Montant</span>
                        <span className='text-sm font-bold text-green-700'>
                          {new Intl.NumberFormat('fr-FR').format(data.data.montant.split(',')[0])} {data.data.devise}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-start gap-3 p-3 rounded-lg border bg-gray-50'>
                      <Hash className='h-4 w-4 text-gray-500 mt-0.5' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-gray-500'>Type</span>
                        <span className='text-sm font-medium text-gray-900'>{data.data.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description si disponible */}
                  {data.data.description && (
                    <div className='rounded-lg border bg-gray-50 p-4'>
                      <div className='text-xs font-semibold text-gray-600 uppercase mb-2'>Description</div>
                      <div className='text-sm text-gray-800 whitespace-pre-line'>{data.data.description}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className='text-center text-gray-500 py-8'>
                  <p>Aucune information de don disponible</p>
                </div>
              )}
            </div>

            {/* Colonne 2: Formulaire de confirmation */}
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                  Confirmation de réception
                </h2>
                <p className='text-gray-600'>
                  Veuillez confirmer que vous avez bien reçu le don en ajoutant vos observations.
                </p>
              </div>

              <Form {...confirmDonForm}>
                <form
                  className='space-y-6'
                  onSubmit={confirmDonForm.handleSubmit(handleConfirm)}
                >
                  <FormField
                    control={confirmDonForm.control}
                    name='observation'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='block text-sm font-medium'>
                          Observations
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Décrivez votre réception du don...'
                            {...field}
                            rows={8}
                            className='resize-none'
                          />
                        </FormControl>
                        <FormDescription className='text-sm text-muted-foreground'>
                          Vos observations après avoir reçu le don (optionnel).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type='submit'
                    disabled={loading}
                    className='w-full'
                    size='lg'
                  >
                    {loading ? 'Confirmation en cours...' : "J'ai bien reçu le don"}
                  </Button>
                </form>
              </Form>

              {error && (
                <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-red-700 text-sm'>{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyDon;
