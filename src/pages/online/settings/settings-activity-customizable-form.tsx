import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod'; // Import Zod

// Import Shadcn UI components (adjust paths based on your project structure)
// These imports are illustrative and might need adjustment based on your shadcn setup
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
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
import { Textarea } from '@/components/ui/textarea'; // For options
import { useGetActivityType } from '@/hook/activity-type.hook';
import {
  useCreateCustomField,
  useDeleteCustomField,
  useGetCustomFieldsFromForm,
  useUpdateCustomField,
} from '@/hook/custom-field.hook';
import useContributorStore from '@/store/contributor.store';
import Skeleton from 'react-loading-skeleton';

// Define the structure of a custom field, similar to your mongoose model snippet
interface CustomField {
  _id?: string; // Optional, as it will be assigned by the backend
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[]; // Used for select, radio, checkbox types
  activityTypeId?: string; // Add activityTypeId to the interface
}

const customFieldSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required.' }),
  label: z.string().min(1, { message: 'Label is required.' }),
  type: z.string().min(1, { message: 'Type is required.' }),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  activityTypeId: z.string().optional(), // Add activityTypeId to the schema
});

const SettingsActivityCustomizableForm = () => {
  const contributorId = useContributorStore((state) => state.contributor?._id);
  // State to hold the list of existing custom fields
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  // State for the form to add/edit a custom field
  const form = useForm<z.infer<typeof customFieldSchema>>({
    resolver: zodResolver(customFieldSchema),
    defaultValues: {
      name: '',
      label: '',
      type: 'text',
      required: false,
      options: [],
    },
  });
  const formData = form.watch(); // Get current form data for conditional rendering
  // State to track if we are editing an existing field
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  // State to manage the activity type/form name - will assume 'activity' for now
  const formName = 'activity';
  const { data: activityTypes, isLoading: isLoadingActivityTypes } =
    useGetActivityType();
  const { data: customFieldsData, isLoading: isLoadingCustomFields } =
    useGetCustomFieldsFromForm(formName);
  const mutationCreateCustomField = useCreateCustomField();
  const mutationUpdateCustomField = useUpdateCustomField();
  const mutationDeleteCustomField = useDeleteCustomField();

  // Fetch custom fields on component mount
  useEffect(() => {
    setCustomFields(customFieldsData?.data || []);
  }, [customFieldsData]); // Ensure component reacts to customFieldsData changes

  // Handle form submission (Add or Update)
  const onSubmit = async (values: z.infer<typeof customFieldSchema>) => {
    // Validate contributorId
    if (!contributorId) {
      console.error('Contributor ID is missing.');
      // Consider a toast or more user-friendly error display
      return;
    }

    // Prepare the inner field data for the 'fields' array in the Mongoose schema
    const innerFieldData = {
      name: values.name,
      label: values.label,
      type: values.type,
      required: values.required,
      options: values.options || [], // Ensure options is an array
    };

    try {
      if (editingFieldId) {
        // For updating an existing field: assumes `editingFieldId` is the _id of the specific field within the `fields` array.
        mutationUpdateCustomField.mutate({
          id: editingFieldId,
          data: innerFieldData, // Send only the inner field data
        });
        setEditingFieldId(null); // Exit editing mode
      } else {
        // For creating a new custom field: Construct the payload to match the Mongoose CustomFieldSchema
        const createPayload = {
          ownerId: contributorId,
          form: formName,
          entityType: 'ACTIVITY', // As per the context of this form
          entityId: values.activityTypeId, // Optional, can be undefined
          fields: [innerFieldData], // Wrap the new field in an array
        };
        mutationCreateCustomField.mutate(createPayload); // Pass the full document payload
      }
      form.reset(); // Clear the form
    } catch (error) {
      console.error('Error saving custom field:', error);
    }
  };

  // Handle editing a field
  const handleEdit = (field: CustomField) => {
    form.reset(field);
    setEditingFieldId(field._id || null);
  };

  // Handle removing a field
  const handleRemove = async (fieldId: string | undefined) => {
    if (!fieldId) return;
    if (window.confirm('Are you sure you want to remove this field?')) {
      mutationDeleteCustomField.mutate(fieldId);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    form.reset();
    setEditingFieldId(null);
  };

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold'>
        Gérer les champs personnalisés d'activité
      </h2>

      {/* Form to Add/Edit Custom Fields */}
      <div className='border rounded-md p-4'>
        <h3 className='text-xl font-semibold mb-4'>
          {editingFieldId
            ? 'Edit Custom Field'
            : 'Ajouter un nouveau champ personnalisé'}
        </h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select field type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='text'>Text</SelectItem>
                      <SelectItem value='number'>Number</SelectItem>
                      <SelectItem value='textarea'>Textarea</SelectItem>
                      <SelectItem value='date'>Date</SelectItem>
                      <SelectItem value='select'>Select (Dropdown)</SelectItem>
                      <SelectItem value='radio'>Radio Buttons</SelectItem>
                      <SelectItem value='checkbox'>Checkbox</SelectItem>
                      {/* Add other types as needed */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='required'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Required</FormLabel>
                    <FormDescription>
                      Check if this field is required.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {(formData.type === 'select' ||
              formData.type === 'radio' ||
              formData.type === 'checkbox') && (
              <FormField
                control={form.control}
                name='options'
                render={({ field }) => (
                  <FormItem className='col-span-1 md:col-span-2'>
                    <FormLabel>Options (comma-separated)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Option 1, Option 2, Option 3'
                        value={field.value ? field.value.join(', ') : ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(',').map((opt) => opt.trim())
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Enter options separated by commas for select, radio, or
                      checkbox types.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {isLoadingActivityTypes ? (
              <div className='col-span-1 md:col-span-2'>
                <Skeleton className='h-4 w-4' />
              </div>
            ) : (
              <FormField
                control={form.control}
                name='activityTypeId'
                render={({ field }) => (
                  <FormItem className='col-span-1 md:col-span-2'>
                    <FormLabel>Type d'activité</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selectionnez une activité' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activityTypes?.data?.map((activityType) => (
                          <SelectItem
                            key={activityType._id}
                            value={activityType._id}
                          >
                            {activityType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className='col-span-1 md:col-span-2 flex justify-end space-x-2'>
              <Button type='submit'>
                {editingFieldId ? 'Mettre à jour le champ' : 'Ajouter un champ'}
              </Button>
              {editingFieldId && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Table to List Custom Fields */}
      <div className='border rounded-md'>
        <h3 className='text-xl font-semibold mb-4 p-4'>
          Champs personnalisés existants
        </h3>
        {isLoadingCustomFields ? (
          <div className='flex justify-center items-center h-32'>
            <Skeleton className='h-full w-full' />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Required</TableHead>
                {customFields.some(
                  (field) => field.options && field.options.length > 0
                ) && <TableHead>Options</TableHead>}
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customFields.length > 0 ? (
                customFields.map((field) => (
                  <TableRow key={field._id || field.name}>
                    {' '}
                    {/* Use _id if available, fallback to name */}
                    <TableCell className='font-medium'>{field.name}</TableCell>
                    <TableCell>{field.label}</TableCell>
                    <TableCell>{field.type}</TableCell>
                    <TableCell>{field.required ? 'Yes' : 'No'}</TableCell>
                    {customFields.some(
                      (f) => f.options && f.options.length > 0
                    ) && (
                      <TableCell>
                        {field.options ? field.options.join(', ') : '-'}
                      </TableCell>
                    )}
                    <TableCell className='text-right'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEdit(field)}
                        className='mr-2'
                      >
                        Edit
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleRemove(field._id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={editingFieldId ? 6 : 5}
                    className='text-center'
                  >
                    Aucun champ personnalisé n'a encore été ajouté.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                size={'sm'}
                onClick={() => {
                  // setCurrentPage(
                  //   Math.max(Number(data?.metadata?.page), currentPage - 1)
                  // )
                }}
              />
            </PaginationItem>
            {/* {isPending ? (
                          <Skeleton className='h-4 w-4' />
                      ) : (
                          // INSERT_YOUR_REWRITE_HERE
                          <></>
                      )} */}
            {/* {Number(data?.metadata?.total) > 3 && ( */}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            {/* )} */}
            <PaginationItem>
              <PaginationNext
                href='#'
                size={'sm'}
                onClick={() => {
                  // setCurrentPage(
                  //   Math.min(Number(data?.metadata?.page), currentPage + 1)
                  // )
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default SettingsActivityCustomizableForm;
