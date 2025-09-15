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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Assuming the table component path
import { ArrowUpDown, Loader2, RefreshCcw, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';

// import img empty 
import imgEmpty from '@/assets/img/activityempty.png';

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
import { ICategorieMouvementCheckout } from '@/interface/activity';
import {
  useCreateCategorieMouvementCheckout,
  useGetCategoriesMouvementCheckouts,
} from '@/hook/categorie-mouvement-checkout';
import { useDeleteCategorieMouvementCheckout } from '@/hook/categorie-mouvement-checkout';

// Zod schema for activity validation
const categorieMouvementCheckoutSchema = z.object({
  _id: z.string().optional(), // Added _id as optional for creation, required for update
  name: z.string().min(1, "Le nom de la catégorie est requis"),
});

// Zod schema for filter form
const filterSchema = z.object({
  search: z.string().optional(),
});

export type CategorieFormValues = z.infer<typeof categorieMouvementCheckoutSchema>;
type FilterFormValues = z.infer<typeof filterSchema>;

const SettingCategorieMouvementCheckout = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>('createdAt'); // Changé à createdAt
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    'asc'
  );
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categorieToDelete, setCategorieToDelete] = useState<ICategorieMouvementCheckout | null>(null);
  const itemsPerPage = 10; // You can adjust this value

  // store
  const contributorId = useContributorStore((state) => state.contributor?._id);

  // hook react query
  const {
    data: categories,
    isLoading,
    isRefetching,
    refetch: refetchCategories,
    } = useGetCategoriesMouvementCheckouts(contributorId as string);
  const mutationCreateCategorie = useCreateCategorieMouvementCheckout(setIsAddDialogOpen);
    const mutationDeleteCategorie = useDeleteCategorieMouvementCheckout();

  const askDeleteCategorie = (categorie: ICategorieMouvementCheckout) => {
    setCategorieToDelete(categorie);
    setIsConfirmOpen(true);
  };

  const confirmDeleteCategorie = () => {
    if (!categorieToDelete?._id) return;
    mutationDeleteCategorie.mutate(categorieToDelete._id, {
      onSettled: () => {
        setIsConfirmOpen(false);
        setCategorieToDelete(null);
      },
    });
  };

  // React Hook Form setup for Add Dialog
  const addForm = useForm<CategorieFormValues>({
    resolver: zodResolver(categorieMouvementCheckoutSchema),
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


  const handleAddActivityClick = () => {
    addForm.reset(); // Reset form when opening add dialog
    setIsAddDialogOpen(true);
  };

  const handleSaveNewCategorie = (values: CategorieFormValues) => {
    const payload = {
      ...values,
      contributorId: contributorId as string,
    };
    mutationCreateCategorie.mutate(payload as unknown as ICategorieMouvementCheckout);
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
  const filteredCategories = useMemo(() => {
    const search = filterForm?.watch('search', '')?.toLowerCase();
    const data = categories?.data || [];
    if (!search) return data;

    return data.filter((categorie: ICategorieMouvementCheckout) =>
      categorie.name.toLowerCase().includes(search)
    );
  }, [categories?.data, filterForm.watch('search')]);

  const sortedAndFilteredCategories = useMemo(() => {
    if (!sortBy) return filteredCategories;

    return [...filteredCategories].sort(
      (a: ICategorieMouvementCheckout, b: ICategorieMouvementCheckout) => {
        if (sortBy === 'createdAt') {
          const valueANum = new Date(a.createdAt).getTime() || 0;
          const valueBNum = new Date(b.createdAt).getTime() || 0;
          if (valueANum < valueBNum) return sortDirection === 'asc' ? -1 : 1;
          if (valueANum > valueBNum) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        }

        const valueAStr = String(
          a[sortBy as keyof ICategorieMouvementCheckout] ?? ''
        ).toLowerCase();
        const valueBStr = String(
          b[sortBy as keyof ICategorieMouvementCheckout] ?? ''
        ).toLowerCase();

        if (valueAStr < valueBStr) return sortDirection === 'asc' ? -1 : 1;
        if (valueAStr > valueBStr) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
    );
  }, [filteredCategories, sortBy, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedAndFilteredCategories.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAndFilteredCategories.slice(startIndex, endIndex);
  }, [sortedAndFilteredCategories, currentPage, itemsPerPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-2xl font-bold'>Paramétrage des catégories de mouvements</h2>

      <div className='flex justify-end'>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddActivityClick}>
              Ajouter une catégorie de mouvement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle catégorie de mouvement</DialogTitle>
              <DialogDescription>
                Entrez les détails de la nouvelle catégorie.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(handleSaveNewCategorie)}
                className='grid gap-4 py-4'
              >
                <FormField
                  control={addForm.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-right mb-4'>
                        Nom de la catégorie
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='name'
                          {...field}
                          disabled={mutationCreateCategorie.isPending}
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
                      disabled={mutationCreateCategorie.isPending}
                    >
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button
                    type='submit'
                      disabled={mutationCreateCategorie.isPending}
                  >
                    {mutationCreateCategorie.isPending ? (
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
                      placeholder='Rechercher une catégorie de mouvement ...'
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
                refetchCategories(); // Refetch data on refresh
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
                    Chargement des catégories de mouvements...
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedAndFilteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='h-24 text-center'>
                  <div className='flex flex-col items-center justify-center'>
                    <img src={imgEmpty} alt='empty' className='w-1/4 h-1/2' />
                    <p className='text-gray-500'>Aucune catégorie de mouvement trouvée.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((categorie: ICategorieMouvementCheckout) => (
                <TableRow key={categorie._id}>
                  <TableCell>{categorie.name}</TableCell>
                  <TableCell>
                    {new Date(categorie.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className='w-full flex justify-end'>
                      {(categorie.usagesCount ?? 0) > 0 || categorie.isDeletable === false ? (
                        <Button size={'sm'} variant={'secondary'} disabled title={
                          (categorie.usagesCount ?? 0) > 0
                            ? `Impossible: utilisée ${categorie.usagesCount} fois`
                            : 'Suppression désactivée'
                        }>
                          <Trash className='h-4 w-4 opacity-50' />
                        </Button>
                      ) : (
                        <Button
                          size={'sm'}
                          variant={'destructive'}
                          onClick={() => askDeleteCategorie(categorie)}
                          aria-label={`Supprimer ${categorie.name}`}
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
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
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie « {categorieToDelete?.name} » ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutationDeleteCategorie.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategorie} disabled={mutationDeleteCategorie.isPending}>
              {mutationDeleteCategorie.isPending ? (
                <span className='inline-flex items-center'><Loader2 className='h-4 w-4 animate-spin mr-2' />Suppression...</span>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingCategorieMouvementCheckout;
