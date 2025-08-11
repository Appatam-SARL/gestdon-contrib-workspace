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
import { Switch } from '@/components/ui/switch';
import {
  useCreateActivityType,
  useDeleteActivityType,
  useGetActivityType,
  useToggleMenu,
  useUpdateActivityType,
} from '@/hook/activity-type.hook';
import useContributorStore from '@/store/contributor.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface IActivityType {
  _id: string;
  label: string;
  createdAt: string;
  addToMenu: boolean;
  // contributorId: string;
  // Ajoutez d'autres propriétés si votre type d'activité en a
}

// Zod schema for activity validation
const activitySchema = z.object({
  _id: z.string().optional(), // Added _id as optional for creation, required for update
  label: z.string().min(1, "Le nom de l'activité est requis"),
  addToMenu: z.boolean().default(false).optional(),
});

// Zod schema for filter form
const filterSchema = z.object({
  search: z.string().optional(),
});

export type ActivityFormValues = z.infer<typeof activitySchema>;
type FilterFormValues = z.infer<typeof filterSchema>;

const SettingActivity = () => {
  const [openDialogTriggerMenu, setOpenDialogTriggerMenu] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  );
  const [activityToDeleteId, setActivityToDeleteId] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState<string | null>('createdAt'); // Changé à createdAt
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    'asc'
  );
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this value
  // Toggle menu
  const [activitySelected, setActivitySelected] =
    useState<IActivityType | null>(null);

  // store
  const contributorId = useContributorStore((state) => state.contributor?._id);

  // hook react query
  const {
    data: activityTypes,
    isLoading,
    isRefetching,
    refetch: refetchActivityTypes,
  } = useGetActivityType({
    contributorId: contributorId,
  });
  const mutationCreateActivityType = useCreateActivityType(
    setIsAddDialogOpen,
    refetchActivityTypes
  );
  // Supposons que vous avez des hooks de mutation pour la mise à jour et la suppression
  // Vous devrez implémenter useUpdateActivityType et useDeleteActivityType dans activity-type.hook.ts
  const mutationUpdateActivityType = useUpdateActivityType(
    setIsEditDialogOpen,
    setEditingActivityId,
    refetchActivityTypes
  );
  const mutationDeleteActivityType = useDeleteActivityType();
  const mutationToggleMenu = useToggleMenu();

  // React Hook Form setup for Add Dialog
  const addForm = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      label: '',
      addToMenu: false,
    },
  });

  // React Hook Form setup for Edit Dialog
  const editForm = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      label: '',
      addToMenu: false,
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
        (activity: IActivityType) => activity._id === editingActivityId
      );
      if (activityToEdit) {
        editForm.reset({ label: activityToEdit.label }); // Réinitialiser avec le label de l'activité
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
    mutationCreateActivityType.mutate(payload);
  };

  const handleEditClick = (activity: IActivityType) => {
    setEditingActivityId(activity._id);
  };

  const handleSaveEditedActivity = (values: ActivityFormValues) => {
    if (editingActivityId !== null) {
      mutationUpdateActivityType.mutate({
        id: editingActivityId,
        label: values.label,
      });
    }
  };

  const handleDeleteActivity = () => {
    if (activityToDeleteId !== null) {
      mutationDeleteActivityType.mutate(activityToDeleteId, {
        onSuccess: () => {
          setActivityToDeleteId(null);
          refetchActivityTypes(); // Refetch data after successful deletion
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

  // Utiliser activityTypes?.data pour le filtrage et le tri
  const filteredActivities = useMemo(() => {
    const search = filterForm?.watch('search', '')?.toLowerCase();
    const data = activityTypes?.data || [];
    if (!search) return data;

    return data.filter((activity: IActivityType) =>
      activity.label.toLowerCase().includes(search)
    );
  }, [activityTypes?.data, filterForm.watch('search')]);

  const sortedAndFilteredActivities = useMemo(() => {
    if (!sortBy) return filteredActivities;

    return [...filteredActivities].sort(
      (a: IActivityType, b: IActivityType) => {
        let valueA, valueB;

        if (sortBy === 'createdAt') {
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
        } else {
          valueA = a[sortBy as keyof IActivityType];
          valueB = b[sortBy as keyof IActivityType];
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

  const handleAddToMenu = (activity: IActivityType) => {
    console.log('activitySelected', activitySelected);
    mutationToggleMenu.mutate(activity._id);
  };

  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-2xl font-bold'>Paramétrage des activités</h2>

      <div className='flex justify-end'>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddActivityClick}>
              Ajouter une activité
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle activité</DialogTitle>
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
                  name='label'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-right'>
                        Nom du type d'activité
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='label'
                          {...field}
                          disabled={mutationCreateActivityType.isPending}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 offset-col-span-1' />
                    </FormItem>
                  )}
                />
                {/* Radio ajouter aux menus */}
                <FormField
                  control={addForm.control}
                  name='addToMenu'
                  render={({ field }) => (
                    <FormItem className='flex gap-4 cursor-pointer'>
                      <FormLabel className='text-right'>
                        Ajouter au menu de navigation
                      </FormLabel>
                      <FormControl>
                        <Switch
                          className='animate-bounce'
                          checked={field.value}
                          onCheckedChange={field.onChange}
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
              <DialogTitle>Modifier l'activité</DialogTitle>
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
                  name='label'
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
                      placeholder='Rechercher une activité ...'
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
              <TableHead>Menu item</TableHead>
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
                    Chargement des activités...
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedAndFilteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='h-24 text-center'>
                  Aucune activité trouvée.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((activity: IActivityType) => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.label}</TableCell>
                  <TableCell>
                    {new Date(activity.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={activity.addToMenu}
                      onCheckedChange={(checked) => {
                        setActivitySelected(activity);

                        setOpenDialogTriggerMenu(true);
                      }}
                    />
                  </TableCell>
                  <AlertDialog
                    open={openDialogTriggerMenu}
                    onOpenChange={setOpenDialogTriggerMenu}
                  >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Êtes-vous absolument sûr ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {activitySelected?.addToMenu
                            ? "De retirer ce type d'activité du menu?"
                            : 'De vouloir ajouter ce type activité au menu?'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setActivityToDeleteId(null)}
                          disabled={mutationDeleteActivityType.isPending}
                        >
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleAddToMenu(activitySelected as IActivityType)
                          }
                          disabled={mutationDeleteActivityType.isPending}
                        >
                          {mutationDeleteActivityType.isPending ? (
                            <>
                              <Loader2 className='animate-spin mr-2' />
                              Suppression...
                            </>
                          ) : (
                            <>
                              {activitySelected?.addToMenu
                                ? 'Retirer'
                                : 'Ajouter'}
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <TableCell className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleEditClick(activity)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        asChild
                        onClick={() => setActivityToDeleteId(activity._id)}
                      >
                        <Button
                          variant='destructive'
                          size='icon'
                          disabled={mutationDeleteActivityType.isPending}
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
                            définitivement cette activité.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setActivityToDeleteId(null)}
                            disabled={mutationDeleteActivityType.isPending}
                          >
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            style={{
                              backgroundColor: 'oklch(0.577 0.245 27.325)',
                            }}
                            onClick={handleDeleteActivity}
                            disabled={mutationDeleteActivityType.isPending}
                          >
                            {mutationDeleteActivityType.isPending ? (
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

export default SettingActivity;
