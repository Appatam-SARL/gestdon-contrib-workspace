import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { withDashboard } from '@/hoc/withDashboard'
import { useBeneficiaries } from '@/hook/beneficiaire.hook';
import { useCreateDon } from '@/hook/don.hook';
import { IDon } from '@/interface/don';
import { createDonSchema, FormCreateDonSchema } from '@/schema/don.schema';
import useContributorStore from '@/store/contributor.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Undo2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

const AddDonation = withDashboard(() => {
  const { toast } = useToast();
  const contributorId = useContributorStore((s) => s.contributor?._id);
  // HOOK QUERY
  const { isLoading: isLoadingBeneficiaries, data: beneficiaries } =
  useBeneficiaries({
    limit: 100000,
    page: 1,
    contributorId,
  });
  // HOOK MUTATION
  const mutation = useCreateDon();

  const formAddDon = useForm<FormCreateDonSchema>({
    resolver: zodResolver(createDonSchema),
    defaultValues: {
      beneficiaire: '',
      donorFullname: '',
      donorPhone: '',
      description: '',
      montant: '0',
      title: '',
      devise: 'FCFA',
      startDate: '',
      endDate: '',
    },
  });

  const onSubmit = async (data: FormCreateDonSchema) => {
    if (data.title === '' || data.beneficiaire === '' || data.montant === '0') {
      toast({
        title: 'Erreur',
        description: 'Le titre et le bénéficiaire et le montant sont requis',
        variant: 'destructive',
      });
      return;
    }
    const payload = {
      ...data,
      contributorId: contributorId as string,
    };
    mutation.mutateAsync(payload as unknown as Partial<IDon>);
    if (mutation.isSuccess) {
      formAddDon.reset();
    }
  };


  return (
    <Card className='mt-4'>
      <CardHeader>
        <h4 className='text-3xl font-bold'>Créer un don</h4>
        <p className='text-muted-foreground'>Saisissez les informations pour créer un don.</p>
      </CardHeader>
      <CardContent>
     <Form {...formAddDon}>
                  <form
                    className='grid gap-4 py-4'
                    onSubmit={formAddDon.handleSubmit(onSubmit)}
                  >
                    {isLoadingBeneficiaries ? (
                      <Skeleton
                        count={1}
                        width='100%'
                        height={300}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      <FormField
                        control={formAddDon.control}
                        name='beneficiaire'
                        render={({ field }) => (
                          <FormItem>
                            <label className='block text-sm font-medium'>
                              Bénéficiaire
                            </label>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Sélectionnez un beneficiaire' />
                                </SelectTrigger>
                                <SelectContent>
                                  {beneficiaries?.data?.map((beneficiaire) => (
                                    <SelectItem
                                      key={beneficiaire._id}
                                      value={beneficiaire._id}
                                    >
                                      {beneficiaire.fullName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <div className='flex w-full justify-between gap-4'>
                      <FormField control={formAddDon.control} name='donorFullname' render={({ field }) => (
                        <FormItem className='w-full'>
                          <label className='block text-sm font-medium'>Nom complet du donateur</label>
                          <FormControl>
                            <Input placeholder='Nom complet du donateur' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                      />
                      <FormField control={formAddDon.control} name='donorPhone' render={({ field }) => (
                        <FormItem className='w-full'>
                          <label className='block text-sm font-medium'>Téléphone du donateur</label>
                          <FormControl>
                            <Input placeholder='Téléphone du donateur' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                      />
                    </div>
                    <FormField
                      control={formAddDon.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Titre
                          </label>
                          <FormControl>
                            <Input placeholder='Titre' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAddDon.control}
                      name='type'
                      render={({ field }) => (
                        <FormItem>
                          <label className='block text-sm font-medium'>
                            Type de don
                          </label>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Sélectionnez un type de don' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={'Nature'}>
                                  Par nature
                                </SelectItem>
                                <SelectItem value={'Espèces'}>
                                  En espèces
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='flex w-full justify-between gap-4'>
                    <FormField
                      control={formAddDon.control}
                      name='montant'
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <label className='block text-sm font-medium'>
                            Valeur estimée
                          </label>
                          <FormControl>
                            <Input
                              placeholder='Montant'
                              {...field}
                              value={field.value
                                // On affiche la valeur formatée avec des espaces tous les 3 chiffres avant la virgule
                                ? (() => {
                                    const [entier, decimal] = field.value.split(',');
                                    // On enlève les espaces existants pour éviter les doublons
                                    const entierNettoye = entier.replace(/\s/g, '');
                                    // On ajoute un espace tous les 3 chiffres en partant de la droite
                                    const entierFormate = entierNettoye.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                                    return decimal !== undefined
                                      ? `${entierFormate},${decimal}`
                                      : entierFormate;
                                  })()
                                : ''}
                              onBlur={e => {
                                let value = e.target.value.replace(/\s/g, '');
                                // Si la valeur ne contient pas déjà une virgule, on ajoute ",00" à la fin
                                if (value && !value.includes(',')) {
                                  field.onChange(value + ',00');
                                } else {
                                  field.onChange(value);
                                }
                              }}
                              onChange={e => {
                                // On enlève les espaces pour garder la valeur brute dans le state
                                const value = e.target.value.replace(/\s/g, '');
                                // On autorise uniquement les chiffres et la virgule
                                if (/^\d*(,\d{0,2})?$/.test(value)) {
                                  field.onChange(value);
                                }
                              }}
                              inputMode="numeric"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAddDon.control}
                      name='devise'
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <label className='block text-sm font-medium'>
                            Devise
                          </label>
                          <FormControl>
                            <Select
                              {...field}
                              value={field.value as string}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Sélectionnez une devise' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='FCFA'>FCFA</SelectItem>
                                <SelectItem value='EUR'>EUR</SelectItem>
                                <SelectItem value='GBP'>GBP</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                    <div className='flex w-full justify-between gap-4'>
                    <FormField
                      control={formAddDon.control}
                      name='startDate'
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <label className='block text-sm font-medium'>
                            Date de début
                          </label>
                          <FormControl>
                            <Input
                              type='datetime-local'
                              placeholder='Date de début'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formAddDon.control}
                      name='endDate'
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <label className='block text-sm font-medium'>
                            Date de fin
                          </label>
                          <FormControl>
                            <Input
                              type='datetime-local'
                              placeholder='Date de fin'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                    <FormField control={formAddDon.control} name='description' render={({ field }) => (
                      <FormItem>
                        <label className='block text-sm font-medium'>Description</label>
                        <FormControl>
                          <Textarea placeholder='Description' {...field} rows={10} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                    <div className='flex w-full justify-end gap-4 py-4'>
                      <Button
                        variant='outline'
                        onClick={() => {}}
                      >
                        <Undo2 className='h-4 w-4 mr-' />
                        <span>Annuler</span>
                      </Button>
                      <Button type='submit' disabled={mutation.isPending}>
                        {mutation.isPending ? (
                          <>
                            <Loader2 className='animate-spin' />
                            <span>En cours de création...</span>
                          </>
                        ) : (
                          
                          <>
                            <Save className='h-4 w-4 mr-' />
                          <span>Créer</span>
                          </>
                        )}
                      </Button>
                      </div>
                  </form>
                </Form>
      </CardContent>
    </Card>
  )
});

export default AddDonation