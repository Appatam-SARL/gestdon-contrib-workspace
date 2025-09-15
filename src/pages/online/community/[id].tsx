import countries from '@/assets/constants/country';
import imgArrayEmpty from '@/assets/img/activityempty.png';
import { UpdateRepresentantForm } from '@/components/community/UpdateRepresentantForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { withDashboard } from '@/hoc/withDashboard';
import {
  useAddRepresentantBeneficiary,
  useBeneficiary,
  useDeleteRepresentantBeneficiary,
  useUpdateBeneficiary,
  useUpdateRepresentantBeneficiary,
} from '@/hook/beneficiaire.hook';
import { useGetBeneficiaryType } from '@/hook/beneficiary-type.hook';
import { useDons } from '@/hook/don.hook';
import { usePromesse } from '@/hook/promesse.hook';
import { IRepresentantBeneficiaire } from '@/interface/beneficiaire';
import { IBeneficiaryType } from '@/interface/beneficiary-type';
import { IDon } from '@/interface/don';
import { tPromesse } from '@/interface/promesse';
import { cn } from '@/lib/utils';
import {
  formAddRepresentantBeneficiarySchema,
  FormAddRepresentantBeneficiarySchemaValue,
  formUpdateBeneficiarySchema,
  FormUpdateNameBeneficiarySchemaValue,
  formUpdateRepresentantBeneficiarySchema,
  FormUpdateRepresentantBeneficiarySchemaValue,
} from '@/schema/beneficiary.schema';
import useContributorStore from '@/store/contributor.store';
import {
  helperFullAddress,
  helperFullName,
  tAddress,
  validatePhoneNumber,
} from '@/utils';
import {
  displayStatusDon,
  displayStatusPromesse,
} from '@/utils/display-of-variable';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Loader2,
  PenIcon,
  Save,
  Trash,
  UserPlus,
} from 'lucide-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import PhoneInput from 'react-phone-number-input';
import { Link, useParams } from 'react-router-dom';

const DetailCommunity = withDashboard(() => {
  const { id } = useParams<{ id: string }>();

  // zustand store
  const contributorId = useContributorStore((s) => s.contributor?._id);

  // state local
  const [isOpenUpdateBeneficiary, setIsOpenUpdateBeneficiary] =
    useState<boolean>(false);
  const [
    isOpenUpdateRepresentantBeneficiary,
    setIsOpenUpdateRepresentantBeneficiary,
  ] = useState<boolean>(false);
  const [
    isOpenAddRepresentantBeneficiary,
    setIsOpenAddRepresentantBeneficiary,
  ] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<null | boolean>(null);
  const [formattedNumber, setFormattedNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const [representantBeneficiary, setRepresentantBeneficiary] =
    useState<IRepresentantBeneficiaire>({
      _id: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: {
        country: '',
        street: '',
        postalCode: '',
        city: '',
      },
    });

  const {
    data: beneficiary,
    isLoading,
    isRefetching,
  } = useBeneficiary(id as string);
  const {
    data: dons,
    isLoading: isLoadingDons,
    isRefetching: isRefetchingDons,
  } = useDons({
    limit: 10,
    page: 1,
    beneficiaire: id as string,
    contributorId: contributorId as string,
  });
  const {
    data: promesses,
    isLoading: isLoadingPromesses,
    isRefetching: isRefetchingPromesses,
  } = usePromesse({
    limit: 10,
    page: 1,
    beneficiaireId: id as string,
    contributorId: contributorId as string,
  });
  const { isLoading: isLoadingBeneficiaryType, data: beneficiaryType } =
    useGetBeneficiaryType({ contributorId: contributorId as string });

  const beneficiaryMutation = useUpdateBeneficiary(
    String(id),
    setIsOpenUpdateBeneficiary
  );
  const mutationAddRepresentantBeneficiary = useAddRepresentantBeneficiary(
    String(id),
    setIsOpenAddRepresentantBeneficiary
  );
  const mutationUpdateRepresentantBeneficiary =
    useUpdateRepresentantBeneficiary(
      String(id),
      setIsOpenUpdateRepresentantBeneficiary
    );
  const mutationDeleteRepresentantBeneficiary =
    useDeleteRepresentantBeneficiary(String(id));

  const formUpdateBeneficiary = useForm<FormUpdateNameBeneficiarySchemaValue>({
    resolver: zodResolver(formUpdateBeneficiarySchema),
    defaultValues: {
      fullName: beneficiary?.data.fullName,
      type: beneficiary?.data.type,
      description: beneficiary?.data.description,
      contributorId: beneficiary?.data.contributorId,
    },
  });

  const formAddRepresentantBeneficiary =
    useForm<FormAddRepresentantBeneficiarySchemaValue>({
      resolver: zodResolver(formAddRepresentantBeneficiarySchema),
      defaultValues: {
        firstName: beneficiary?.data.representant[0].firstName,
        lastName: beneficiary?.data.representant[0].lastName,
        phone: beneficiary?.data.representant[0].phone,
        address: {
          country: beneficiary?.data.representant[0].address.country,
          street: beneficiary?.data.representant[0].address.street,
          postalCode: beneficiary?.data.representant[0].address.postalCode,
          city: beneficiary?.data.representant[0].address.city,
        },
      },
    });

  const formUpdateRepresentantBeneficiary =
    useForm<FormUpdateRepresentantBeneficiarySchemaValue>({
      resolver: zodResolver(formUpdateRepresentantBeneficiarySchema),
      defaultValues: {
        firstName: representantBeneficiary.firstName,
        lastName: representantBeneficiary.lastName,
        phone: representantBeneficiary.phone,
        address: {
          country: representantBeneficiary.address.country,
          street: representantBeneficiary.address.street,
          postalCode: representantBeneficiary.address.postalCode,
          city: representantBeneficiary.address.city,
        },
      },
    });

  useLayoutEffect(() => {
    // initialisation du formulaire
    formUpdateBeneficiary.reset({
      fullName: beneficiary?.data.fullName,
      description: beneficiary?.data.description,
      contributorId: beneficiary?.data.contributorId,
    });
  }, [beneficiary?.data]);

  useEffect(() => {
    formUpdateRepresentantBeneficiary.reset({
      firstName: representantBeneficiary.firstName,
      lastName: representantBeneficiary.lastName,
      phone: representantBeneficiary.phone,
      address: {
        country: representantBeneficiary.address.country,
        street: representantBeneficiary.address.street,
        postalCode: representantBeneficiary.address.postalCode,
        city: representantBeneficiary.address.city,
      },
    });
  }, [representantBeneficiary]);

  const handleUpdateBeneficiary = async (
    data: FormUpdateNameBeneficiarySchemaValue
  ) => {
    beneficiaryMutation.mutate(data);
    formUpdateBeneficiary.reset({
      fullName: data.fullName,
      description: data.description,
      contributorId: data.contributorId,
    });
  };

  const handleAddRepresentantBeneficiary = async (
    data: FormAddRepresentantBeneficiarySchemaValue
  ) => {
    mutationAddRepresentantBeneficiary.mutate(data);
    formAddRepresentantBeneficiary.reset({
      firstName: '',
      lastName: '',
      phone: '',
      address: {
        country: '',
        street: '',
        postalCode: '',
        city: '',
      },
    });
  };

  const handleUpdateRepresentantBeneficiary = async (
    data: FormUpdateRepresentantBeneficiarySchemaValue
  ) => {
    mutationUpdateRepresentantBeneficiary.mutate(data);
  };

  return (
    <div className='space-y-6'>
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
            <h4 className='text-3xl font-bold'>
              {isLoading || isRefetching ? (
                <Skeleton className='h-4 w-4' />
              ) : (
                `${
                  typeof beneficiary?.data === 'string'
                    ? beneficiary?.data
                    : beneficiary?.data?.fullName ||
                      JSON.stringify(beneficiary?.data)
                }`
              )}
            </h4>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-12 gap-6'>
        {/* Colonne gauche - Informations personnelles */}
        <div className='col-span-4 space-y-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle>Informations du bénéficiaire</CardTitle>
              <Button
                variant='secondary'
                size='icon'
                onClick={() => setIsOpenUpdateBeneficiary(true)}
                className='h-8 w-8'
              >
                <PenIcon className='h-4 w-4' color='white' />
              </Button>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground'>ID</p>
                <p className='font-medium'>
                  {isLoading || isRefetching ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    (beneficiary?.data._id as string)
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Nom complet</p>
                <p className='font-medium'>
                  {isLoading || isRefetching ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    beneficiary?.data.fullName
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Description</p>
                <p className='font-medium'>
                  {isLoading || isRefetching ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    beneficiary?.data.description.substring(0, 100) + '...'
                  )}
                </p>
              </div>

              {/* Dialog update beneficiary */}
              <Dialog
                open={isOpenUpdateBeneficiary}
                onOpenChange={setIsOpenUpdateBeneficiary}
              >
                <DialogContent className='sm:max-w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>Modifier le bénéficiaire</DialogTitle>
                    <DialogDescription>
                      Modifiez les informations du bénéficiaire.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...formUpdateBeneficiary}>
                    <form
                      onSubmit={formUpdateBeneficiary.handleSubmit(
                        handleUpdateBeneficiary
                      )}
                      className='space-y-4'
                    >
                      <FormField
                        control={formUpdateBeneficiary.control}
                        name='fullName'
                        render={({ field }) => (
                          <FormItem>
                            <label className='block text-sm font-medium'>
                              Nom complet
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
                        control={formUpdateBeneficiary.control}
                        name='type'
                        render={({ field }) => (
                          <FormItem>
                            <label className='block text-sm font-medium'>
                              Description
                            </label>
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
                                      <SelectItem
                                        key={type._id}
                                        value={type._id}
                                      >
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
                        control={formUpdateBeneficiary.control}
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
                                rows={15}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* </div> */}
                      <DialogFooter>
                        <Button
                          variant='outline'
                          onClick={() => setIsOpenUpdateBeneficiary(false)}
                        >
                          Annuler
                        </Button>
                        <Button
                          type='submit'
                          disabled={beneficiaryMutation.isPending}
                        >
                          {beneficiaryMutation.isPending ? (
                            <>
                              <Loader2 className='animate-spin' />
                              <span>En cours de modification...</span>
                            </>
                          ) : (
                            <>
                              <Save />
                              <span>Enregistrer</span>
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='flex justify-between items-center gap-2'>
                <span>Information sur le chef ou représentant</span>
              </CardTitle>
              <Button
                variant='secondary'
                size='icon'
                onClick={() => setIsOpenAddRepresentantBeneficiary(true)}
                className='h-8 w-8'
              >
                <UserPlus className='h-4 w-4' color='white' />
              </Button>
            </CardHeader>
            <CardContent className='min-h-auto max-h-[400px] overflow-y-auto'>
              {beneficiary?.data.representant.map((representant) => (
                <div
                  key={representant._id}
                  className='flex justify-between items-center gap-4 mb-4 border-b border-gray-200 pb-4'
                >
                  <Avatar className='w-14 h-14'>
                    <AvatarImage />
                    <AvatarFallback>
                      {representant.firstName.slice(0, 1) +
                        '' +
                        representant.lastName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center items-start gap-2 w-[50%]'>
                    {isLoading || isRefetching ? (
                      <Skeleton className='h-4 w-4' />
                    ) : (
                      <p className='font-medium'>
                        {helperFullName(
                          representant.firstName as string,
                          representant.lastName as string
                        )}
                      </p>
                    )}
                    {isLoading || isRefetching ? (
                      <Skeleton className='h-4 w-4' />
                    ) : (
                      <p className='font-regular'>{representant.phone}</p>
                    )}
                    {isLoading || isRefetching ? (
                      <Skeleton className='h-4 w-4' />
                    ) : (
                      <p className='font-regular text-justify text-[12px]'>
                        {helperFullAddress(representant.address as tAddress)}
                      </p>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setRepresentantBeneficiary(representant);
                        setIsOpenUpdateRepresentantBeneficiary(true);
                      }}
                      className='h-8 w-8'
                    >
                      <PenIcon className='h-4 w-4' />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          variant='destructive'
                          size='icon'
                          className='h-8 w-8'
                        >
                          <Trash className='h-4 w-4' color='white' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Etre sûr de vouloir supprimer le représentant ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Non, annuler</AlertDialogCancel>
                          <AlertDialogAction
                            className='bg-red-500 hover:bg-red-700'
                            onClick={() =>
                              mutationDeleteRepresentantBeneficiary.mutate({
                                _id: representant._id as string,
                              })
                            }
                          >
                            <Trash className='h-4 w-4' color='white' />
                            <span>Oui je supprime</span>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Remove Password Card, MFA Card, Permissions Card, Logs Card */}
        </div>

        {/* Colonne droite - can be removed or adapted for beneficiary-specific content if any */}
        {/* Removing for now as per instruction to adapt to beneficiary details */}
        <div className='col-span-8'>
          <div className='space-y-6'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle>Don</CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <div className='rounded-md'>
                  <table className='w-full'>
                    <thead className='bg-primary text-white'>
                      <tr className='border-b'>
                        <th className='py-3 px-4 text-left text-sm font-medium'>
                          Titre
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-medium'>
                          Montant
                        </th>
                        <th className='py-3 px-4 text-right text-sm font-medium'>
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingDons || isRefetchingDons ? (
                        <tr className='border-b hover:bg-muted/50 transition-colors'>
                          <td colSpan={4}>
                            <Skeleton
                              count={1}
                              width='100%'
                              height={300}
                              style={{ width: '100%' }}
                            />
                          </td>
                        </tr>
                      ) : (
                        dons?.data.length === 0 ? (
                          <tr className='border-b hover:bg-muted/50 transition-colors'>
                            <td colSpan={4}>
                              <div className='flex flex-col items-center justify-center'>
                                <img src={imgArrayEmpty} alt='empty' className='w-1/4 h-1/2' />
                                <p className='text-gray-500'>Aucun don trouvé.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          dons?.data?.map((don: IDon) => (
                          <tr
                            className='border-b hover:bg-muted/50 transition-colors'
                            key={don._id}
                          >
                            <td className='py-3 px-4 text-left text-sm font-medium'>
                              {don.title}
                            </td>
                            <td className='py-3 px-4 text-left text-sm font-medium'>
                              {don.montant + ' FCFA'}
                            </td>
                            <td className='py-3 px-4 text-right text-sm font-medium'>
                              <Badge
                                variant={
                                  displayStatusDon(don.status ?? '') === 'Reçu'
                                    ? 'success'
                                    : 'secondary'
                                }
                              >
                                {displayStatusDon(don.status ?? '')}
                              </Badge>
                            </td>
                          </tr>
                        )))
                      )}
                      <tr className='border-b hover:bg-muted/50 transition-colors'></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle>Promesses</CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <div className='rounded-md'>
                  <table className='w-full'>
                    <thead className='bg-primary text-white'>
                      <tr className='border-b'>
                        <th className='py-3 px-4 text-left text-sm font-medium'>
                          Titre
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-medium'>
                          Montant
                        </th>
                        <th className='py-3 px-4 text-right text-sm font-medium'>
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingPromesses || isRefetchingPromesses ? (
                        <tr className='border-b hover:bg-muted/50 transition-colors'>
                          <td colSpan={4}>
                            <Skeleton
                              count={1}
                              width='100%'
                              height={300}
                              style={{ width: '100%' }}
                            />
                          </td>
                        </tr>
                      ) : (
                        promesses?.data.length === 0 ? (
                          <tr className='border-b hover:bg-muted/50 transition-colors'>
                            <td colSpan={4}>
                              <div className='flex flex-col items-center justify-center'>
                                <img src={imgArrayEmpty} alt='empty' className='w-1/4 h-1/2' />
                                <p className='text-gray-500'>Aucune promesse trouvée.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          promesses?.data?.map((promesse: tPromesse) => (
                          <tr
                            className='border-b hover:bg-muted/50 transition-colors'
                            key={promesse._id}
                          >
                            <td className='py-3 px-4 text-left text-sm font-medium'>
                              {promesse.title.substring(0, 25) + '...'}
                            </td>
                            <td className='py-3 px-4 text-left text-sm font-medium'>
                              {promesse.amount} FCFA
                            </td>
                            <td className='py-3 px-4 text-right text-sm font-medium'>
                              <Badge
                                variant={
                                  displayStatusPromesse(promesse.status) ===
                                  'Validé'
                                    ? 'success'
                                    : 'secondary'
                                }
                              >
                                {displayStatusPromesse(promesse.status)}
                              </Badge>
                            </td>
                          </tr>
                        )))
                      )}
                      <tr className='border-b hover:bg-muted/50 transition-colors'></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Remove all Modals (Password, MFA, Info) */}

      {/* Dialog add representant */}
      <Dialog
        open={isOpenAddRepresentantBeneficiary}
        onOpenChange={setIsOpenAddRepresentantBeneficiary}
      >
        <DialogContent className='sm:max-w-[500px] h-[600px] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Ajouter un représentant</DialogTitle>
            <DialogDescription>
              Ajoutez un représentant pour cette communauté.
            </DialogDescription>
          </DialogHeader>
          <Form {...formAddRepresentantBeneficiary}>
            <form
              onSubmit={formAddRepresentantBeneficiary.handleSubmit(
                handleAddRepresentantBeneficiary
              )}
              className='space-y-4'
            >
              <FormField
                control={formAddRepresentantBeneficiary.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <label className='block text-sm font-medium'>Prénom</label>
                    <FormControl>
                      <Input
                        id='firstName'
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
                control={formAddRepresentantBeneficiary.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <label className='block text-sm font-medium'>Nom</label>
                    <FormControl>
                      <Input
                        id='lastName'
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
                control={formAddRepresentantBeneficiary.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <label className='block text-sm font-medium'>
                      Téléphone
                    </label>
                    <FormControl>
                      <PhoneInput
                        international={false}
                        defaultCountry='CI'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          const { isValidNumber, formattedNumber } =
                            validatePhoneNumber(e ? e : '');
                          setIsValid(isValidNumber);
                          setFormattedNumber(formattedNumber);
                        }}
                        className={
                          'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {/* Exemples de formats acceptés */}
                      {formAddRepresentantBeneficiary.watch('phone') &&
                      isValid ? (
                        <div
                          className={`p-3 rounded-md ${
                            isValid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <div>
                            <span className='font-medium'>✓ Numéro valide</span>
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
                            <li className='text-red'>• +225 01 23 45 67 89</li>
                            <li className='text-red'>
                              • Préfixes: 01, 05, 07 (mobile), 27 (fixe Abidjan)
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
                control={formAddRepresentantBeneficiary.control}
                name='address.country'
                render={({ field }) => (
                  <FormItem>
                    <label className='block text-sm font-medium'>Pays</label>
                    <FormControl>
                      {/* <Input {...field} placeholder='Pays' /> */}
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={open}
                            className='w-[100%] justify-between'
                          >
                            {selectedCountry
                              ? countries.find(
                                  (country) => country.value === selectedCountry
                                )?.label
                              : 'Choisir un pays'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[100%] p-0'>
                          <Command>
                            <CommandInput placeholder='Rechercher un pays...' />
                            <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                            <CommandGroup>
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
                                      selectedCountry === country.value
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
                control={formAddRepresentantBeneficiary.control}
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
                control={formAddRepresentantBeneficiary.control}
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
                control={formAddRepresentantBeneficiary.control}
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
              <div className='flex justify-between p-4 border-t'>
                <Button
                  type='submit'
                  className='ml-auto'
                  disabled={mutationAddRepresentantBeneficiary.isPending}
                >
                  {mutationAddRepresentantBeneficiary.isPending ? (
                    <>
                      <Loader2 className='animate-spin' />
                      <span>En cours de modification...</span>
                    </>
                  ) : (
                    <>
                      <Save />
                      <span>Enregistrer</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog update representant */}
      <Dialog
        open={isOpenUpdateRepresentantBeneficiary}
        onOpenChange={setIsOpenUpdateRepresentantBeneficiary}
      >
        <DialogContent className='sm:max-w-[500px] h-[600px] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Modifier le représentant</DialogTitle>
            <DialogDescription>
              Modifiez les informations du représentant.
            </DialogDescription>
          </DialogHeader>
          <UpdateRepresentantForm
            representant={representantBeneficiary}
            onSubmit={handleUpdateRepresentantBeneficiary}
            onCancel={() => setIsOpenUpdateRepresentantBeneficiary(false)}
            isLoading={mutationUpdateRepresentantBeneficiary.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default DetailCommunity;
