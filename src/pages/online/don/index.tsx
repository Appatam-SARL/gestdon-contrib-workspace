import { DON_FILTER_FORM_INITIAL_STATE } from '@/assets/constants/don';
import imgArrayEmpty from '@/assets/img/activityempty.png';
// import StatsDons from '@/components/Dons/Stats';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { withDashboard } from '@/hoc/withDashboard';
import { useBeneficiaries } from '@/hook/beneficiaire.hook';
import { useCreateDon, useDons, useStatsDon } from '@/hook/don.hook';
import { usePackagePermissions } from '@/hook/packagePermissions.hook';
import { IDon, IDonFilterForm } from '@/interface/don';
import { createDonSchema, FormCreateDonSchema } from '@/schema/don.schema';
import useContributorStore from '@/store/contributor.store';
import { useDonStore } from '@/store/don.store';
import { helperUserPermission } from '@/utils';
import { displayStatusDon } from '@/utils/display-of-variable';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import fr from 'date-fns/locale/fr';
import {
  AlertTriangle,
  Info,
  Eye,
  Filter,
  Loader2,
  Package,
  RefreshCcw,
  Search,
  UserPlus,
} from 'lucide-react';
import React, { Suspense, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
const StatsDons = React.lazy(() => import('@/components/Dons/Stats'));

const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: IDonFilterForm;
  onFilterChange: (key: keyof IDonFilterForm, value: any) => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className='sm:max-w-[630px]'>
      <DialogHeader>
        <DialogTitle>Filtres des dons</DialogTitle>
        <DialogDescription>
          Appliquer des filtres pour affiner la liste des dons.
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Période d'inscription</label>
            <DateRangePicker
              locale={fr}
              ranges={[
                {
                  startDate: filters.period?.from
                    ? new Date(filters.period.from)
                    : new Date(),
                  endDate: filters.period?.to
                    ? new Date(filters.period.to)
                    : addDays(new Date(), 7),
                  key: 'selection',
                },
              ]}
              onChange={(item) => {
                onFilterChange('period', {
                  from: item.selection.startDate?.toISOString() || '',
                  to: item.selection.endDate?.toISOString() || '',
                });
              }}
            />
          </div>
          {/* Add more filter options as needed */}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export const DonPage = withDashboard(() => {
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { donFilterForm, setDonStore } = useDonStore((s) => s);
  const [isCreateDonOpen, setIsCreateDonOpen] = useState<boolean>(false);
  const [isDonLimitAlertOpen, setIsDonLimitAlertOpen] = useState<boolean>(false);
  const { isLoading: isLoadingBeneficiaries, data: beneficiaries } =
    useBeneficiaries({
      limit: 100000,
      page: 1,
      contributorId,
    });
  const { data, isLoading, refetch, isRefetching } = useDons({
    ...donFilterForm,
    contributorId: contributorId as string,
  } as IDonFilterForm);

  const { data: statsDon, isLoading: isLoadingStatsDon } = useStatsDon({
    contributorId: contributorId as string,
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const mutation = useCreateDon(setIsCreateDonOpen);

  const formAddDon = useForm<FormCreateDonSchema>({
    resolver: zodResolver(createDonSchema),
    defaultValues: {
      beneficiaire: '',
      montant: '0',
      title: '',
      devise: 'FCFA',
      startDate: '',
      endDate: '',
    },
  });

  const activeFiltersCount = Object.values(
    donFilterForm as IDonFilterForm
  ).filter(Boolean).length;

  // Limites de dons via package
  const {
    hasReachedDonationLimit,
    getDonationLimit,
    getRemainingDonationsCount,
  } = usePackagePermissions();
  const currentDonationCount = data?.totalData || 0;
  const donationLimit = getDonationLimit();
  const donationLimitReached = hasReachedDonationLimit(currentDonationCount);
  const remainingDonations = getRemainingDonationsCount(currentDonationCount);

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

  const [selectedDon, setSelectedDon] = useState<IDon | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleFilterChange = (key: keyof IDonFilterForm, value: any) => {
    setDonStore('donFilterForm', {
      ...donFilterForm,
      [key]: value,
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between mt-4'>
        <div>
          <h4 className='text-3xl font-bold'>Dons</h4>
          <p className='text-muted-foreground'>Gestion des dons</p>

          {donationLimit && donationLimit > 0 && (
            <div className='mt-3 flex items-center gap-3'>
              <div className='flex items-center gap-2 text-sm'>
                <span className='text-gray-600'>
                  {currentDonationCount} / {donationLimit} dons
                </span>
              </div>
              <div className='w-32 bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    donationLimitReached
                      ? 'bg-red-500'
                      : currentDonationCount / donationLimit > 0.8
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      (currentDonationCount / donationLimit) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              {/* Badge d'alerte si proche de la limite */}
              {!donationLimitReached &&
                remainingDonations !== null &&
                remainingDonations <= 2 && (
                  <Badge
                    variant='secondary'
                    className='bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  >
                    <AlertTriangle className='h-3 w-3 mr-1' />
                    {remainingDonations === 1
                      ? '1 don restant'
                      : `${remainingDonations} dons restants`}
                  </Badge>
                )}

              {donationLimitReached && (
                <Badge variant='destructive' className='hover:bg-red-200'>
                  <AlertTriangle className='h-3 w-3 mr-1' />
                  Limite atteinte
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className='flex gap-2'>
          {helperUserPermission('don', 'create') && (
            <Button
              onClick={() => {
                if (donationLimitReached) {
                  setIsDonLimitAlertOpen(true);
                  return;
                }
                setIsCreateDonOpen(true);
              }}
              // disabled={donationLimitReached}
              // className={
              //   donationLimitReached ? 'opacity-50 cursor-not-allowed' : ''
              // }
            >
              <UserPlus className='h-4 w-4 mr-2' />
              Enregistrer un don
              {donationLimitReached && (
                <span className='ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full'>
                  Limite atteinte
                </span>
              )}
            </Button>
          )}
           {/* Modal d'alerte pour limite d'utilisateurs */}
           <Dialog
            open={isDonLimitAlertOpen}
            onOpenChange={setIsDonLimitAlertOpen}
          >
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-red-100 rounded-full'>
                    <AlertTriangle className='h-6 w-6 text-red-600' />
                  </div>
                  <div>
                    <DialogTitle className='text-red-800'>
                      Limite d'dons atteinte
                    </DialogTitle>
                    <DialogDescription className='text-red-600'>
                      Vous avez atteint le nombre maximal de dons
                      autorisés par votre package.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className='space-y-4'>
                {/* Informations sur la limite */}
                <div className='p-4 bg-gray-50 rounded-lg'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label className='text-sm font-medium text-gray-600'>
                        Dons actuels
                      </Label>
                      <p className='text-lg font-semibold text-gray-900'>
                        {currentDonationCount}
                      </p>
                    </div>
                    <div>
                      <Label className='text-sm font-medium text-gray-600'>
                        Limite maximale
                      </Label>
                      <p className='text-lg font-semibold text-gray-900'>
                        {donationLimit || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  {donationLimit && donationLimit > 0 && (
                    <div className='mt-4'>
                      <div className='flex justify-between text-sm text-gray-600 mb-2'>
                        <span>Utilisation</span>
                        <span>
                          {Math.round((currentDonationCount / donationLimit) * 100)}%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='h-2 bg-red-500 rounded-full transition-all duration-300'
                          style={{
                            width: `${Math.min(
                              (currentDonationCount / donationLimit) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Message d'information */}
                <div className='flex items-start gap-3 p-3 bg-blue-50 rounded-lg'>
                  <Info className='h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0' />
                  <div className='text-sm text-blue-800'>
                    <p className='font-medium mb-1'>Pourquoi cette limite ?</p>
                    <p>
                      Votre package d'abonnement actuel limite le nombre de
                      dons que vous pouvez ajouter. Pour ajouter
                      plus de dons, vous devez mettre à niveau votre package.
                    </p>
                  </div>
                </div>

                {/* Actions suggérées */}
                <div className='space-y-3'>
                  <h4 className='font-medium text-gray-900'>
                    Que pouvez-vous faire ?
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                      <span>
                        Gérer les dons existants (modifier, désactiver)
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                      <span>
                        Mettre à niveau votre package pour plus d'dons
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                      <span>
                        Contacter le support pour des options personnalisées
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setIsDonLimitAlertOpen(false)}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setIsDonLimitAlertOpen(false);
                    navigate('/pricing');
                  }}
                  className='bg-blue-600 hover:bg-blue-700'
                >
                  <Package className='h-4 w-4 mr-2' />
                  Voir les packages
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Dialog create don */}
          <Dialog open={isCreateDonOpen} onOpenChange={setIsCreateDonOpen}>
            <DialogContent className='sm:max-w-[630px] sm:max-h-[700px] overflow-auto'>
              <DialogHeader>
                <DialogTitle>Créer un don</DialogTitle>
                <DialogDescription>
                  Saisissez les informations pour créer un don.
                </DialogDescription>
              </DialogHeader>
              <div>
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
                    <FormField
                      control={formAddDon.control}
                      name='montant'
                      render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
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
                    <FormField
                      control={formAddDon.control}
                      name='startDate'
                      render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
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
                    <DialogFooter>
                      <Button
                        variant='outline'
                        onClick={() => setIsCreateDonOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button type='submit' disabled={mutation.isPending}>
                        {mutation.isPending ? (
                          <>
                            <Loader2 className='animate-spin' />
                            <span>En cours de création...</span>
                          </>
                        ) : (
                          'Créer'
                        )}
                      </Button>
                      {/* TODO: Implémenter la redirection vers la page de création */}
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Suspense fallback={<div>Chargement des stats...</div>}>
        {helperUserPermission('don', 'read_stats') ? (
          <StatsDons
            handleFilterChange={handleFilterChange}
            data={statsDon?.data}
            isLoadingStats={isLoadingStatsDon}
            // isRefetchingStats={isRefecthingStatsDon}
          />
        ) : (
          <div className='text-muted-foreground'>
            Vous n'avez pas les permissions pour accéder aux statistiques des
            dons.
          </div>
        )}
      </Suspense>
      {/* <Card className='p-4'> */}
      <div className='flex justify-end gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='flex-1 pl-10'
            placeholder='Rechercher un don par la devise ou un montant...'
            value={searchQuery}
            onChange={(e) => {
              const searchValue = e.target.value;
              setSearchQuery(searchValue);
              if (searchValue.length >= 3 || searchValue.length === 0) {
                setDonStore('donFilterForm', {
                  ...donFilterForm,
                  search: searchValue,
                });
              }
            }}
          />
        </div>
        <Button
          variant='outline'
          onClick={() => setIsFilterModalOpen(true)}
          className='relative'
        >
          <Filter className='h-4 w-4 mr-2' />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center'
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            setDonStore('donFilterForm', {
              ...DON_FILTER_FORM_INITIAL_STATE,
              contributorId: contributorId as string,
            });
            refetch();
            setSearchQuery('');
          }}
          className='relative'
        >
          <RefreshCcw className='h-4 w-4 mr-2' />
          Refresh
        </Button>
      </div>
      {/* </Card> */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={donFilterForm as IDonFilterForm}
        onFilterChange={(key: string, value: {}) => {
          setDonStore('donFilterForm', {
            ...donFilterForm,
            [key]: value,
          });
        }}
      />
      {/* <Card> */}
      {helperUserPermission('don', 'read') ? (
        <>
          <Table className='bg-white border rounded-2xl'>
            <TableHeader>
              <TableRow>
                <TableHead>Bénéficiaire</TableHead>
                <TableHead>Type de don</TableHead>
                <TableHead>Montant</TableHead>
                {/* <TableHead>Devise</TableHead> */}
                <TableHead>Statut</TableHead>
                <TableHead>Date du don</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isRefetching ? (
                <TableRow className='p-8'>
                  <TableCell colSpan={7}>
                    <Skeleton
                      count={1}
                      width='100%'
                      height={300}
                      style={{ width: '100%' }}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className='flex flex-col items-center justify-center'>
                        <img src={imgArrayEmpty} alt='empty' className='w-1/4 h-1/2' />
                        <p className='text-gray-500'>Aucun don trouvé.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((donation: IDon) => (
                  <TableRow
                    key={donation._id}
                    className='cursor-pointer hover:bg-gray-100'
                  >
                    <TableCell className='font-medium'>
                      {donation.beneficiaire.fullName}
                    </TableCell>
                    <TableCell>
                      {donation.type === 'Par nature' ? 'Nature' : 'En espèces'}
                    </TableCell>
                    <TableCell>{`${donation.montant} ${donation.devise}`}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          displayStatusDon(donation.status) === 'En attente'
                            ? 'secondary'
                            : 'success'
                        }
                      >
                        {displayStatusDon(donation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(donation.createdAt).toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='secondary'
                          size='icon'
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDon(donation);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye className='h-4 w-4' color='white' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )))
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          {isLoading || isRefetching ? (
            <Skeleton
              count={1}
              width='100%'
              height={50}
              style={{ width: '100%' }}
            />
          ) : (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    disabled={donFilterForm?.page === 1}
                    className={
                      donFilterForm?.page === 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                    onClick={() => {
                      setDonStore('donFilterForm', {
                        ...donFilterForm,
                        page: Number(donFilterForm?.page) - 1,
                      });
                    }}
                    size='sm'
                  />
                </PaginationItem>
                {isLoading || isRefetching ? (
                  <Skeleton className='h-4 w-4' count={1} />
                ) : (
                  [...Array(Math.min(Number(data?.metadata?.totalPages)))].map(
                    (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => {
                            setDonStore('donFilterForm', {
                              ...donFilterForm,
                              page: i + 1,
                            });
                          }}
                          isActive={donFilterForm?.page === i + 1}
                          size='sm'
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )
                )}
                {Number(data?.metadata?.totalPages) > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    size={'sm'}
                    onClick={() =>
                      setDonStore('donFilterForm', {
                        ...donFilterForm,
                        page: Number(donFilterForm?.page) + 1,
                      })
                    }
                    className={
                      donFilterForm?.page === Number(data?.metadata?.totalPages)
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className='text-muted-foreground'>
          Vous n'avez pas les permissions pour accéder à la liste des dons.
        </div>
      )}
      <DonDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        don={selectedDon}
      />
    </div>
  );
});

const DonDetailModal = ({
  isOpen,
  onClose,
  don,
}: {
  isOpen: boolean;
  onClose: () => void;
  don: IDon | null;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Détail du don</DialogTitle>
        <DialogDescription>Détail du don sélectionné</DialogDescription>
      </DialogHeader>
      {don ? (
        <div className='bg-white rounded-xl shadow-md border p-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Bénéficiaire
            </span>
            <span className='text-base font-semibold text-gray-800'>
              {don.beneficiaire?.fullName}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Montant
            </span>
            <span className='text-lg font-bold text-green-600'>
              {don.montant} {don.devise}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Titre
            </span>
            <span className='text-base text-gray-700'>{don.title}</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Date du don
            </span>
            <span className='text-base text-gray-700'>
              {new Date(don.createdAt).toLocaleString('fr-FR')}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Devise
            </span>
            <span className='text-base text-gray-700'>{don.devise}</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 font-medium uppercase mb-1'>
              Statut
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                displayStatusDon(don.status as string) === 'Reçu'
                  ? 'bg-green-100 text-green-700'
                  : displayStatusDon(don.status as string) === 'En attente'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {displayStatusDon(don.status as string)}
            </span>
          </div>
        </div>
      ) : (
        <div>Chargement...</div>
      )}
    </DialogContent>
  </Dialog>
);
