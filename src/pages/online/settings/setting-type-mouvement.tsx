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
import { ArrowUpDown, Loader2, RefreshCcw } from 'lucide-react';
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

import useContributorStore from '@/store/contributor.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ITypeMouvementCheckout } from '@/interface/activity';
import { 
  useCreateMouvementCheckoutType, 
  useGetTypesMouvementCheckouts, 
  useUpdateMouvementCheckoutType 
} from '@/hook/mouvement-checkout-type.hook';

// Zod schema for activity validation
const typeMouvementCheckoutSchema = z.object({
  _id: z.string().optional(), // Added _id as optional for creation, required for update
  name: z.string().min(1, "Le nom de l'activité est requis"),
});

// Zod schema for filter form
const filterSchema = z.object({
  search: z.string().optional(),
});

export type ActivityFormValues = z.infer<typeof typeMouvementCheckoutSchema>;
type FilterFormValues = z.infer<typeof filterSchema>;

const SettingTypeMouvement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState<string | null>('createdAt'); // Changé à createdAt
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    'asc'
  );
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this value

  // store
  const contributorId = useContributorStore((state) => state.contributor?._id);

  // hook react query
  const {
    data: activityTypes,
    isLoading,
    isRefetching,
    refetch: refetchActivityTypes,
    } = useGetTypesMouvementCheckouts(contributorId as string);
  const mutationCreateActivityType = useCreateMouvementCheckoutType(
    setIsAddDialogOpen
  );
  // Supposons que vous avez des hooks de mutation pour la mise à jour et la suppression
  // Vous devrez implémenter useUpdateActivityType et useDeleteActivityType dans activity-type.hook.ts
  const mutationUpdateActivityType = useUpdateMouvementCheckoutType(
    setIsEditDialogOpen,
    setEditingActivityId,
    refetchActivityTypes
  );

  // React Hook Form setup for Add Dialog
  const addForm = useForm<ActivityFormValues>({
    resolver: zodResolver(typeMouvementCheckoutSchema),
    defaultValues: {
      name: '',
    },
  });

  // React Hook Form setup for Edit Dialog
  const editForm = useForm<ActivityFormValues>({
    resolver: zodResolver(typeMouvementCheckoutSchema),
    defaultValues: {
      name: '',
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
    if (editingActivityId !== null && activityTypes?.data) {
      const activityToEdit = activityTypes.data.find(
        (activity: ITypeMouvementCheckout) => activity._id === editingActivityId
      );
      if (activityToEdit) {
        editForm.reset({ name: activityToEdit.name }); // Réinitialiser avec le label de l'activité
      }
    } else {
      editForm.reset(); // Reset form when not editing
    }
  }, [editingActivityId, activityTypes?.data, editForm]);

  // Effect to close edit dialog when editingActivityId is null
  useEffect(() => {
    if (editingActivityId !== null) {
      setIsEditDialogOpen(true);
    } else {
      setIsEditDialogOpen(false);
    }
  }, [editingActivityId]);

  const handleAddActivityClick = () => {
    addForm.reset(); // Reset form when opening add dialog
    setIsAddDialogOpen(true);
  };

  const handleSaveNewActivity = (values: ActivityFormValues) => {
    const payload = {
      ...values,
      contributorId: contributorId as string,
    };
    mutationCreateActivityType.mutate(payload as unknown as ITypeMouvementCheckout);
  };

  const handleSaveEditedActivity = (values: ActivityFormValues) => {
    if (editingActivityId !== null) {
      mutationUpdateActivityType.mutate({
        // _id: editingActivityId,
          name: values.name,
      } as unknown as ITypeMouvementCheckout);
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

  // Utiliser activityTypes?.data pour le filtrage et le tri
  const filteredActivities = useMemo(() => {
    const search = filterForm?.watch('search', '')?.toLowerCase();
    const data = activityTypes?.data || [];
    if (!search) return data;

    return data.filter((activity: ITypeMouvementCheckout) =>
      activity.name.toLowerCase().includes(search)
    );
  }, [activityTypes?.data, filterForm.watch('search')]);

  const sortedAndFilteredActivities = useMemo(() => {
    if (!sortBy) return filteredActivities;

    return [...filteredActivities].sort(
      (a: ITypeMouvementCheckout, b: ITypeMouvementCheckout) => {
        let valueA, valueB;

        if (sortBy === 'createdAt') {
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
        } else {
          valueA = a[sortBy as keyof ITypeMouvementCheckout];
          valueB = b[sortBy as keyof ITypeMouvementCheckout];
        }

        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
    );
  }, [filteredActivities, sortBy, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(
    sortedAndFilteredActivities.length / itemsPerPage
  );
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAndFilteredActivities.slice(startIndex, endIndex);
  }, [sortedAndFilteredActivities, currentPage, itemsPerPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-2xl font-bold'>Paramétrage des types de mouvements</h2>

      <div className='flex justify-end'>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddActivityClick}>
              Ajouter un type de mouvement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau type de mouvement</DialogTitle>
              <DialogDescription>
                Entrez les détails de la nouvelle activité.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(handleSaveNewActivity)}
                className='grid gap-4 py-4'
              >
                <FormField
                  control={addForm.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-right mb-4'>
                        Nom du type de mouvement
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='name'
                          {...field}
                          disabled={mutationCreateActivityType.isPending}
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
                      variant='outline'
                      disabled={mutationCreateActivityType.isPending}
                    >
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button
                    type='submit'
                      disabled={mutationCreateActivityType.isPending}
                  >
                    {mutationCreateActivityType.isPending ? (
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
              <DialogTitle>Modifier le type de mouvement</DialogTitle>
              <DialogDescription>
                Modifiez les détails de l'activité.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(handleSaveEditedActivity)}
                className='grid gap-4 py-4'
              >
                <FormField
                  control={editForm.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-4 items-center gap-4'>
                      <FormLabel className='text-right'>Nom</FormLabel>
                      <FormControl>
                        <Input
                          id='edit-name'
                          className='col-span-3'
                          {...field}
                          disabled={mutationUpdateActivityType.isPending}
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
                      disabled={mutationUpdateActivityType.isPending}
                    >
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button
                    type='submit'
                    disabled={mutationUpdateActivityType.isPending}
                  >
                    {mutationUpdateActivityType.isPending ? (
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
      <Card className='p-4 bg-white'>
        <Form {...filterForm}>
          <form className='flex gap-4 bg-white'>
            <FormField
              control={filterForm.control}
              name='search'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input
                      placeholder='Rechercher un type de mouvement ...'
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
                refetchActivityTypes(); // Refetch data on refresh
              }}
              className='relative'
              type='button'
            >
              <RefreshCcw className='h-4 w-4 mr-2' />
              Actualiser
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
                Date
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
                    Chargement des types de mouvements...
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedAndFilteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='h-24 text-center'>
                  Aucun type de mouvement trouvé.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((activity: ITypeMouvementCheckout) => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>
                    {new Date(activity.createdAt).toLocaleDateString('fr-FR')}
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

export default SettingTypeMouvement;
