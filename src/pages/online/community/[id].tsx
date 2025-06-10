import { withDashboard } from '@/hoc/withDashboard';
import { useBeneficiary } from '@/hook/beneficiaire.hook';
// import useBeneficiary from '@/hook/beneficiary.hook';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Textarea } from '@/components/ui/textarea';
import {
  formUpdateBeneficiarySchema,
  FormUpdateNameBeneficiarySchemaValue,
  formUpdateRepresentantBeneficiarySchema,
  FormUpdateRepresentantBeneficiarySchemaValue,
} from '@/schema/beneficiary.schema';
import { helperFullAddress, helperFullName, tAddress } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Pencil, PenIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { Link, useParams } from 'react-router-dom';

const DetailCommunity = withDashboard(() => {
  const { id } = useParams<{ id: string }>();

  const [isOpenUpdateBeneficiary, setIsOpenUpdateBeneficiary] =
    useState<boolean>(true);
  const [
    isOpenUpdateRepresentantBeneficiary,
    setIsOpenUpdateRepresentantBeneficiary,
  ] = useState<boolean>(false);

  const { data: beneficiary, isLoading } = useBeneficiary(id as string);

  const formUpdateBeneficiary = useForm<FormUpdateNameBeneficiarySchemaValue>({
    resolver: zodResolver(formUpdateBeneficiarySchema),
    defaultValues: {
      fullName: beneficiary?.data.fullName,
      description: beneficiary?.data.description,
    },
  });

  const formUpdateRepresentantBeneficiary =
    useForm<FormUpdateRepresentantBeneficiarySchemaValue>({
      resolver: zodResolver(formUpdateRepresentantBeneficiarySchema),
      defaultValues: {
        firstName: beneficiary?.data.representant.firstName,
        lastName: beneficiary?.data.representant.lastName,
        phone: beneficiary?.data.representant.phone,
        address: beneficiary?.data.representant.address,
      },
    });

  // const beneficiaryMutation = useUpdateBeneficiary(id as string, setIsOpenUpdateBeneficiary);
  // const representantMutation = useUpdateRepresentantBeneficiary(id as string, setIsOpenUpdateRepresentantBeneficiary);

  const handleUpdateBeneficiary = async (
    data: FormUpdateNameBeneficiarySchemaValue
  ) => {
    if (
      formUpdateBeneficiary.getValues().fullName !== beneficiary?.data.fullName
    ) {
      // beneficiaryMutation.mutate(formUpdateBeneficiary.getValues());
    }
  };

  const handleUpdateRepresentant = async (
    data: FormUpdateRepresentantBeneficiarySchemaValue
  ) => {
    if (
      formUpdateRepresentantBeneficiary.getValues().firstName !==
      beneficiary?.data.representant.firstName
    ) {
      // representantMutation.mutate(formUpdateRepresentantBeneficiary.getValues());
    }
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
            <h1 className='text-3xl font-bold'>
              {isLoading ? (
                <Skeleton className='h-4 w-4' />
              ) : (
                `${beneficiary?.data.fullName}`
              )}
            </h1>
            {/* <p className="text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-4" /> : beneficiary?.role}
            </p> */}
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
                variant='ghost'
                size='icon'
                onClick={() => setIsOpenUpdateBeneficiary(true)}
                className='h-8 w-8'
              >
                <PenIcon className='h-4 w-4' />
              </Button>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground'>ID</p>
                <p className='font-medium'>
                  {isLoading ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    (beneficiary?.data._id as string)
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Nom complet</p>
                <p className='font-medium'>
                  {isLoading ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    beneficiary?.data.fullName
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Description</p>
                <p className='font-medium'>
                  {isLoading ? (
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
                      {/* <div className='grid grid-cols-2 gap-4'> */}
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
                          //   disabled={beneficiaryMutation.isPending}
                          onClick={handleUpdateBeneficiary}
                        >
                          {/* {beneficiaryMutation.isPending
                    ? 'En cours de modification...'
                    : 'Enregistrer'} */}
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
              <CardTitle className='flex items-center gap-2'>
                <span>Information sur le chef ou représentant</span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsOpenUpdateRepresentantBeneficiary(true)}
                  className='h-8 w-8'
                >
                  <Pencil className='h-4 w-4' />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className='text-sm text-muted-foreground'>Nom complet</p>
                <p className='font-medium'>
                  {isLoading ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    helperFullName(
                      beneficiary?.data.representant.firstName as string,
                      beneficiary?.data.representant.lastName as string
                    )
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>
                  Numéro de téléphone
                </p>
                <p className='font-medium'>
                  {isLoading ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    beneficiary?.data.representant.phone
                  )}
                </p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Adresse</p>
                <p className='font-medium'>
                  {isLoading ? (
                    <Skeleton className='h-4 w-4' />
                  ) : (
                    helperFullAddress(
                      beneficiary?.data.representant.address as tAddress
                    )
                  )}
                </p>
              </div>
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
                    <thead>
                      <tr className='border-b bg-muted/50'>
                        <th className='py-3 px-4 text-left text-sm font-medium'>
                          Date & Heure
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-medium'>
                          Description
                        </th>
                        <th className='py-3 px-4 text-right text-sm font-medium'>
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-b hover:bg-muted/50 transition-colors'></tr>
                    </tbody>
                  </table>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href='#'
                          // onClick={() =>
                          //     setFilterLogs((prev) => ({
                          //         ...prev,
                          //         page: Number(prev?.page) - 1,
                          //     }))
                          // }
                          // className={
                          //     currentPage === 1
                          //         ? 'pointer-events-none opacity-50'
                          //         : ''
                          // }
                          size='default'
                        />
                      </PaginationItem>
                      {isLoading ? (
                        <Skeleton className='h-4 w-4' />
                      ) : Number(7) > 3 ? (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                href='#'
                                //   isActive={currentPage === i + 1}
                                //   onClick={() => setCurrentPage(i + 1)}
                                size='default'
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        </>
                      ) : (
                        [...Array(2)].map((_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              href='#'
                              //   isActive={currentPage === i + 1}
                              //   onClick={() => setCurrentPage(i + 1)}
                              size='default'
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href='#'
                          //   onClick={() =>
                          //       setFilterLogs((prev) => ({
                          //           ...prev,
                          //           page: Number(prev?.page) + 1,
                          //       }))
                          //   }
                          //   className={
                          //       currentPage === logs?.metadata?.totalPages
                          //           ? 'pointer-events-none opacity-50'
                          //           : ''
                          //   }
                          size='default'
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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
                    <thead>
                      <tr className='border-b bg-muted/50'>
                        <th className='py-3 px-4 text-left text-sm font-medium'>
                          Date & Heure
                        </th>
                        <th className='py-3 px-4 text-left text-sm font-medium'>
                          Description
                        </th>
                        <th className='py-3 px-4 text-right text-sm font-medium'>
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-b hover:bg-muted/50 transition-colors'></tr>
                    </tbody>
                  </table>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href='#'
                          // onClick={() =>
                          //     setFilterLogs((prev) => ({
                          //         ...prev,
                          //         page: Number(prev?.page) - 1,
                          //     }))
                          // }
                          // className={
                          //     currentPage === 1
                          //         ? 'pointer-events-none opacity-50'
                          //         : ''
                          // }
                          size='default'
                        />
                      </PaginationItem>
                      {isLoading ? (
                        <Skeleton className='h-4 w-4' />
                      ) : Number(7) > 3 ? (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                href='#'
                                //   isActive={currentPage === i + 1}
                                //   onClick={() => setCurrentPage(i + 1)}
                                size='default'
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        </>
                      ) : (
                        [...Array(2)].map((_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              href='#'
                              //   isActive={currentPage === i + 1}
                              //   onClick={() => setCurrentPage(i + 1)}
                              size='default'
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href='#'
                          //   onClick={() =>
                          //       setFilterLogs((prev) => ({
                          //           ...prev,
                          //           page: Number(prev?.page) + 1,
                          //       }))
                          //   }
                          //   className={
                          //       currentPage === logs?.metadata?.totalPages
                          //           ? 'pointer-events-none opacity-50'
                          //           : ''
                          //   }
                          size='default'
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Remove all Modals (Password, MFA, Info) */}

      {/* Dialog update representant */}
      <Dialog
        open={isOpenUpdateRepresentantBeneficiary}
        onOpenChange={setIsOpenUpdateRepresentantBeneficiary}
      >
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Modifier le représentant</DialogTitle>
            <DialogDescription>
              Modifiez les informations du représentant.
            </DialogDescription>
          </DialogHeader>
          <Form {...formUpdateRepresentantBeneficiary}>
            <form
              onSubmit={formUpdateRepresentantBeneficiary.handleSubmit(
                handleUpdateRepresentant
              )}
              className='space-y-4'
            >
              <FormField
                control={formUpdateRepresentantBeneficiary.control}
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
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={formUpdateRepresentantBeneficiary.control}
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
                  control={formUpdateRepresentantBeneficiary.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>
                        Téléphone
                      </label>
                      <FormControl>
                        <Input
                          id='phone'
                          type='text'
                          placeholder='Téléphone'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUpdateRepresentantBeneficiary.control}
                  name='address.country'
                  render={({ field }) => (
                    <FormItem>
                      <label className='block text-sm font-medium'>Pays</label>
                      <FormControl>
                        <Input {...field} placeholder='Pays' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formUpdateRepresentantBeneficiary.control}
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
                  control={formUpdateRepresentantBeneficiary.control}
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
                  control={formUpdateRepresentantBeneficiary.control}
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
              </div>
            </form>
          </Form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsOpenUpdateRepresentantBeneficiary(false)}
            >
              Annuler
            </Button>
            <Button
            //   disabled={representantMutation.isPending}
            //   onClick={handleUpdateRepresentant}
            >
              {/* {representantMutation.isPending
                ? 'En cours de modification...'
                : 'Enregistrer'} */}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* </div> */}
    </div>
  );
});

export default DetailCommunity;
