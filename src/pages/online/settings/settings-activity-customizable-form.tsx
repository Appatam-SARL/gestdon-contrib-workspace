import ActivityCustomField from '@/components/custom-field/ActivityCustomField';
import { CustomFieldTable } from '@/components/custom-field/CustomFieldTable';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { useGetActivityType } from '@/hook/activity-type.hook';
import {
  useCreateCustomField,
  useDeleteCustomField,
  useGetCustomFieldsFromForm,
  useUpdateCustomField,
} from '@/hook/custom-field.hook';
import { ICustomFieldOption } from '@/interface/custom-field';
import useContributorStore from '@/store/contributor.store';
import { CustomFieldFormData } from '@/types/custom-field.types';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Search, Trash, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const FORM_NAME = 'activity';
const ITEMS_PER_PAGE = 5;

const SettingsActivityCustomizableForm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const contributorId = useContributorStore((state) => state.contributor?._id);
  const [customFields, setCustomFields] = useState<ICustomFieldOption[]>([]);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fieldToDelete, setFieldToDelete] = useState<ICustomFieldOption | null>(
    null
  );

  const { data: activityTypes, isLoading: isLoadingActivityTypes } =
    useGetActivityType({
      contributorId: contributorId as string,
    });
  const {
    data: customFieldsData,
    isLoading: isLoadingCustomFields,
    isRefetching: isRefetchingCustomFields,
  } = useGetCustomFieldsFromForm(
    FORM_NAME,
    contributorId as string,
    searchTerm,
    currentPage,
    ITEMS_PER_PAGE
  );

  const mutationCreateCustomField = useCreateCustomField();
  const mutationUpdateCustomField = useUpdateCustomField();
  const mutationDeleteCustomField = useDeleteCustomField();

  useEffect(() => {
    if (customFieldsData?.data) {
      setCustomFields(customFieldsData.data);
    }
  }, [customFieldsData]);

  const handleSubmit = async (values: CustomFieldFormData) => {
    if (!contributorId) {
      toast({
        title: 'Erreur',
        description: 'ID du contributeur manquant.',
      });
      return;
    }

    if (!values.activityTypeId) {
      toast({
        title: 'Erreur',
        description: "Veuillez sélectionner un type d'activité.",
      });
      return;
    }

    const innerFieldData = {
      name: values.name,
      label: values.label,
      type: values.type,
      required: values.required,
      options: values.options || [],
      activityTypeId: values.activityTypeId,
    };

    console.log('🚀 ~ handleSubmit ~ innerFieldData:', innerFieldData);

    try {
      if (editingFieldId) {
        const payload = {
          id: editingFieldId,
          data: {
            entityId: values.activityTypeId,
            entityType: 'ACTIVITY',
            form: FORM_NAME,
            ownerId: contributorId,
            fields: [innerFieldData],
          },
        };
        await mutationUpdateCustomField.mutateAsync(payload);
        toast({
          title: 'Succès',
          description: 'Champ mis à jour avec succès.',
        });
        setEditingFieldId(null);
      } else {
        const createPayload = {
          ownerId: contributorId,
          form: FORM_NAME,
          entityType: 'ACTIVITY',
          entityId: values.activityTypeId,
          fields: [innerFieldData],
        };
        console.log('🚀 ~ handleSubmit ~ createPayload:', createPayload);
        await mutationCreateCustomField.mutateAsync(createPayload);
        toast({
          title: 'Succès',
          description: 'Champ ajouté avec succès.',
        });
      }
      // Invalider le cache pour forcer un rechargement des données
      await queryClient.invalidateQueries({
        queryKey: [
          'custom-fields',
          FORM_NAME,
          searchTerm,
          currentPage,
          ITEMS_PER_PAGE,
        ],
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur est survenue';
      toast({
        title: 'Erreur',
        description: `Erreur lors de la sauvegarde du champ: ${errorMessage}`,
      });
      console.error('Error saving custom field:', error);
    }
  };

  const handleEdit = (field: ICustomFieldOption) => {
    setEditingFieldId(field._id);
  };

  const handleRemove = async (fieldId: string | undefined) => {
    if (!fieldId || !contributorId) return;

    const fieldToDelete = customFields.find((f) => f._id === fieldId);
    if (!fieldToDelete) {
      toast({
        title: 'Erreur',
        description: 'Impossible de trouver les informations du champ.',
      });
      return;
    }

    setFieldToDelete(fieldToDelete);
  };

  const handleConfirmDelete = async () => {
    if (!fieldToDelete || !contributorId) return;

    try {
      const deletePayload = {
        form: FORM_NAME,
        fieldId: fieldToDelete._id,
        data: {
          entityType: 'ACTIVITY',
          ownerId: contributorId,
        },
      };
      await mutationDeleteCustomField.mutateAsync(deletePayload);
      setFieldToDelete(null);
      // Invalider le cache pour forcer un rechargement des données
      await queryClient.invalidateQueries({
        queryKey: [
          'custom-fields',
          FORM_NAME,
          searchTerm,
          currentPage,
          ITEMS_PER_PAGE,
        ],
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur est survenue';
      toast({
        title: 'Erreur',
        description: `Erreur lors de la suppression du champ: ${errorMessage}`,
      });
      console.error('Error deleting custom field:', error);
    }
  };

  const handleCancelDelete = () => {
    setFieldToDelete(null);
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: [
        'custom-fields',
        FORM_NAME,
        searchTerm,
        currentPage,
        ITEMS_PER_PAGE,
      ],
    });
  };

  const totalPages = Number(customFieldsData?.metadata?.totalPages) || 1;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!contributorId) {
    return (
      <div className='p-6'>
        <p className='text-red-500'>
          Vous devez être connecté pour accéder à cette page.
        </p>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold'>
        Gérer les champs personnalisés d'activité
      </h2>

      <AlertDialog
        open={!!fieldToDelete}
        onOpenChange={() => setFieldToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer ce champ ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le champ sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              <XIcon className='h-4 w-4' />
              <span>Non, j'annule</span>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white'
            >
              <Trash className='h-4 w-4' />
              <span>Oui, je supprime</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className='border rounded-md p-4 bg-white'>
        <h3 className='text-xl font-semibold mb-4'>
          {editingFieldId
            ? 'Modifier le champ personnalisé'
            : 'Ajouter un nouveau champ personnalisé'}
        </h3>
        <ActivityCustomField
          onSubmit={handleSubmit}
          activityTypes={activityTypes?.data}
          isLoadingActivity={isLoadingActivityTypes}
          isEditing={!!editingFieldId}
          onCancel={handleCancelEdit}
          initialValues={
            editingFieldId
              ? customFields.find((f) => f._id === editingFieldId)
              : undefined
          }
        />
      </div>

      <div className='border rounded-md bg-white'>
        <div className='flex items-center justify-between p-4 mb-4'>
          <h3 className='text-xl font-semibold'>
            Champs personnalisés existants
          </h3>
          <div className='flex items-center space-x-2'>
            <div className='relative'>
              <Input
                type='text'
                placeholder='Rechercher un champ...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8'
              />
              <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
            </div>
            <Button onClick={handleRefresh} variant='outline' size='icon'>
              <RefreshCw className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <CustomFieldTable
          customFields={customFields}
          isLoading={isLoadingCustomFields}
          isRefetchingCustomFields={isRefetchingCustomFields}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className='p-4'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  size={'sm'}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href='#'
                    isActive={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
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
        )}
      </div>
    </div>
  );
};

export default SettingsActivityCustomizableForm;
