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
import { Button } from '@/components/ui/button'; // Assuming the button component path
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Assuming the table component path
import { ArrowUpDown, Loader2, Pencil, RefreshCcw, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  useCreateBeneficiaryType,
  useDeleteBeneficiaryType,
  useGetBeneficiaryType,
  useUpdateBeneficiaryType,
} from '@/hook/beneficiary-type.hook';
import useContributorStore from '@/store/contributor.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface IBeneficiaryType {
  _id: string;
  label: string;
  createdAt: string;
}

// Zod schema for beneficiary validation
const beneficiarySchema = z.object({
  _id: z.string().optional(), // Added _id as optional for creation, required for update
  label: z.string().min(1, 'Le nom du bénéficiaire est requis'),
});

// Zod schema for filter form
const filterSchema = z.object({
  search: z.string().optional(),
});

export type BeneficiaryFormValues = z.infer<typeof beneficiarySchema>;
type FilterFormValues = z.infer<typeof filterSchema>;

const SettingBeneficiary = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );

  const [activityToDeleteId, setActivityToDeleteId] = useState<string | null>(
    null
  );

  const [sortBy, setSortBy] = useState<string | null>('createdAt'); // Changed to createdAt
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    'asc'
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this value

  // store zustand
  const contributorId = useContributorStore((state) => state.contributor?._id);

  // hook react query
  const {
    data: beneficiaryTypes,
    isLoading,
    isRefetching,
    refetch: refetchBeneficiaryTypes,
  } = useGetBeneficiaryType(); // Added refetch
  const mutationCreateBeneficiaryType = useCreateBeneficiaryType();
  const mutationUpdateBeneficiaryType = useUpdateBeneficiaryType();
  const mutationDeleteBeneficiaryType = useDeleteBeneficiaryType();

  // React Hook Form setup for Add Dialog
  const addForm = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      label: '',
    },
  });

  // React Hook Form setup for Edit Dialog
  const editForm = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      label: '',
    },
  });

  // React Hook Form setup for Filter
  const filterForm = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: '',
    },
  });

  // Effect to populate the edit form when editingActivityId changes
  useEffect(() => {
    if (editingActivityId !== null && beneficiaryTypes?.data) {
      const beneficiaryToEdit = beneficiaryTypes.data.find(
        (beneficiary: IBeneficiaryType) => beneficiary._id === editingActivityId
      );
      if (beneficiaryToEdit) {
        editForm.reset({ label: beneficiaryToEdit.label });
      }
    } else {
      editForm.reset(); // Reset form when not editing
    }
  }, [editingActivityId, beneficiaryTypes?.data, editForm]);

  // Effect to close edit dialog when editingActivityId is null
  useEffect(() => {
    if (editingActivityId !== null) {
      setIsEditDialogOpen(true);
    } else {
      setIsEditDialogOpen(false);
    }
  }, [editingActivityId]);

  const handleAddBeneficiaryClick = () => {
    addForm.reset(); // Reset form when opening add dialog
    setIsAddDialogOpen(true);
  };

  const handleSaveNewBeneficiary = (values: BeneficiaryFormValues) => {
    const payload = {
      ...values,
      contributorId: contributorId as string,
    };
    mutationCreateBeneficiaryType.mutate(payload, {
      onSuccess: () => {
        setIsAddDialogOpen(false); // Close the dialog on success
        refetchBeneficiaryTypes(); // Refetch data after successful creation
      },
    });
  };

  const handleEditClick = (beneficiary: IBeneficiaryType) => {
    setEditingActivityId(beneficiary._id);
  };

  const handleSaveEditedBeneficiary = (values: BeneficiaryFormValues) => {
    if (editingActivityId !== null) {
      mutationUpdateBeneficiaryType.mutate(
        { id: editingActivityId, label: values.label },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
            setEditingActivityId(null);
            refetchBeneficiaryTypes(); // Refetch data after successful update
          },
        }
      );
    }
  };

  const handleDeleteBeneficiary = () => {
    if (activityToDeleteId !== null) {
      mutationDeleteBeneficiaryType.mutate(activityToDeleteId, {
        onSuccess: () => {
          setActivityToDeleteId(null);
          refetchBeneficiaryTypes(); // Refetch data after successful deletion
        },
      });
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredBeneficiaries = useMemo(() => {
    const search = filterForm?.watch('search', '')?.toLowerCase();
    const data = beneficiaryTypes?.data || [];
    if (!search) return data;

    return data.filter((beneficiary: IBeneficiaryType) =>
      beneficiary.label.toLowerCase().includes(search)
    );
  }, [beneficiaryTypes?.data, filterForm.watch('search')]);

  const sortedAndFilteredBeneficiaries = useMemo(() => {
    if (!sortBy)
      return Array.isArray(filteredBeneficiaries) ? filteredBeneficiaries : [];

    return [
      ...(Array.isArray(filteredBeneficiaries) ? filteredBeneficiaries : []),
    ].sort((a: any, b: any) => {
      let valueA, valueB;

      if (sortBy === 'createdAt') {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      } else {
        valueA = a[sortBy];
        valueB = b[sortBy];
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredBeneficiaries, sortBy, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(
    sortedAndFilteredBeneficiaries.length / itemsPerPage
  );
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAndFilteredBeneficiaries.slice(startIndex, endIndex);
  }, [sortedAndFilteredBeneficiaries, currentPage, itemsPerPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-2xl font-bold'>Paramétrage des bénéficiaires</h2>

      <div className='flex justify-end'>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddBeneficiaryClick}>
              Ajouter un bénéficiaire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle bénéficiaire</DialogTitle>
              <DialogDescription>
                Entrez les détails de la nouvelle bénéficiaire.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(handleSaveNewBeneficiary)}
                className='grid gap-4 py-4'
              >
                <FormField
                  control={addForm.control}
                  name='label'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-right'>Nom</FormLabel>
                      <FormControl>
                        <Input
                          id='label'
                          {...field}
                          disabled={mutationCreateBeneficiaryType.isPending}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 offset-col-span-1' />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type='button'
                      variant='secondary'
                      disabled={mutationCreateBeneficiaryType.isPending}
                    >
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button
                    type='submit'
                    disabled={mutationCreateBeneficiaryType.isPending}
                  >
                    {mutationCreateBeneficiaryType.isPending ? (
                      <>
                        <Loader2 className='animate-spin mr-2' />
                        Ajout en cours
                      </>
                    ) : (
                      'Ajouter'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Activity Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier bénéficiaire</DialogTitle>
              <DialogDescription>
                Modifiez les détails du bénéficiaire.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleSaveEditedBeneficiary)}
                className='grid gap-4 py-4'
              >
                <FormField
                  control={editForm.control}
                  name='label'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-4 items-center gap-4'>
                      <FormLabel className='text-right'>Nom</FormLabel>
                      <FormControl>
                        <Input
                          id='edit-label'
                          className='col-span-3'
                          {...field}
                          disabled={mutationUpdateBeneficiaryType.isPending}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 offset-col-span-1' />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type='button'
                      variant='secondary'
                      disabled={mutationUpdateBeneficiaryType.isPending}
                    >
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button
                    type='submit'
                    disabled={mutationUpdateBeneficiaryType.isPending}
                  >
                    {mutationUpdateBeneficiaryType.isPending ? (
                      <>
                        <Loader2 className='animate-spin mr-2' />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <Card className='p-4'>
        <Form {...filterForm}>
          <form className='flex gap-4'>
            <FormField
              control={filterForm.control}
              name='search'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input
                      placeholder='Rechercher un bénéficiaire ...'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant='outline'
              onClick={() => {
                filterForm.reset();
                refetchBeneficiaryTypes(); // Refetch data on refresh
              }}
              className='relative'
              type='button'
            >
              <RefreshCcw className='h-4 w-4 mr-2' />
              Actualiser {isRefetching && '(Actualisation...)'}
            </Button>
          </form>
        </Form>
      </Card>

      {/* Placeholder for the Shadcn Table component */}
      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead
                onClick={() => handleSort('createdAt')}
                className='cursor-pointer'
              >
                Date de création
                {sortBy === 'createdAt' && (
                  <ArrowUpDown
                    className={`ml-2 h-4 w-4 ${
                      sortDirection === 'desc' ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </TableHead>
              <TableHead className='flex justify-end items-center'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isRefetching ? (
              <TableRow>
                <TableCell colSpan={3} className='h-24 text-center'>
                  <div className='flex items-center justify-center text-gray-500'>
                    <Loader2 className='animate-spin h-5 w-5 mr-3' />
                    Chargement des bénéficiaires...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='h-24 text-center'>
                  Aucun bénéficiaire trouvé.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((beneficiary: IBeneficiaryType) => (
                <TableRow key={beneficiary._id}>
                  <TableCell>{beneficiary.label}</TableCell>
                  <TableCell>
                    {new Date(beneficiary.createdAt).toLocaleDateString(
                      'fr-FR'
                    )}
                  </TableCell>
                  <TableCell className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleEditClick(beneficiary)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        asChild
                        onClick={() => setActivityToDeleteId(beneficiary._id)}
                      >
                        <Button
                          variant='destructive'
                          size='icon'
                          disabled={mutationDeleteBeneficiaryType.isPending}
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Êtes-vous absolument sûr ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Elle supprimera
                            définitivement ce bénéficiaire.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setActivityToDeleteId(null)}
                            disabled={mutationDeleteBeneficiaryType.isPending}
                          >
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            style={{
                              backgroundColor: 'oklch(0.577 0.245 27.325)',
                            }}
                            onClick={handleDeleteBeneficiary}
                            disabled={mutationDeleteBeneficiaryType.isPending}
                          >
                            {mutationDeleteBeneficiaryType.isPending ? (
                              <>
                                <Loader2 className='animate-spin mr-2' />
                                Suppression...
                              </>
                            ) : (
                              'Confirmer'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                size={'sm'}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href='#'
                  isActive={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                  size={'sm'}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href='#'
                size={'sm'}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default SettingBeneficiary;
