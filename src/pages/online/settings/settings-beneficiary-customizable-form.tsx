import axios from 'axios'; // Assuming axios is used for API calls
import React, { useEffect, useState } from 'react';

// Import Shadcn UI components (adjust paths based on your project structure)
// These imports are illustrative and might need adjustment based on your shadcn setup
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

// Define the structure of a custom field, similar to your mongoose model snippet
interface CustomField {
  _id?: string; // Optional, as it will be assigned by the backend
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[]; // Used for select, radio, checkbox types
}

const SettingsBeneficiaryCustomizableForm = () => {
  // State to hold the list of existing custom fields
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  // State for the form to add/edit a custom field
  const [formData, setFormData] = useState<Partial<CustomField>>({
    name: '',
    label: '',
    type: 'text', // Default type
    required: false,
    options: [],
  });
  // State to track if we are editing an existing field
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  // State to manage the beneficiary type/form name - will assume 'beneficiary' for now
  const formName = 'beneficiary';

  // Fetch custom fields on component mount
  useEffect(() => {
    fetchCustomFields();
  }, []); // Empty dependency array means this runs once on mount

  const fetchCustomFields = async () => {
    try {
      // Replace with your actual API endpoint to fetch fields for a specific form/beneficiary type
      const response = await axios.get(`/api/custom-fields/${formName}`);
      setCustomFields(response.data.fields || []); // Assuming the API returns an object with a 'fields' array
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      // Handle error, e.g., show a message to the user
    }
  };

  // Handle input changes for the form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | React.ChangeEvent<HTMLTextAreaElement>
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change for 'required' field
  const handleRequiredChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, required: checked }));
  };

  // Handle select change for 'type' field
  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      options:
        value === 'select' || value === 'radio' || value === 'checkbox'
          ? prev.options || []
          : [],
    }));
  };

  // Handle options input (assuming comma-separated values)
  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      options: value.split(',').map((opt) => opt.trim()),
    }));
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.label || !formData.type) {
      alert('Name, Label, and Type are required.');
      return;
    }

    try {
      if (editingFieldId) {
        // Update existing field
        // Replace with your actual API endpoint for updating a field
        await axios.put(`/api/custom-fields/${editingFieldId}`, formData);
        alert('Field updated successfully!');
        setEditingFieldId(null); // Exit editing mode
      } else {
        // Add new field
        // Replace with your actual API endpoint for adding a new field configuration
        // Need to send the formName along with the field data
        await axios.post('/api/custom-fields', {
          form: formName,
          fields: [formData],
        }); // Assuming API expects { form, fields: [...] }
        alert('Field added successfully!');
      }
      // Clear the form and refetch fields
      setFormData({
        name: '',
        label: '',
        type: 'text',
        required: false,
        options: [],
      });
      fetchCustomFields();
    } catch (error) {
      console.error('Error saving custom field:', error);
      alert('Error saving field.');
    }
  };

  // Handle editing a field
  const handleEdit = (field: CustomField) => {
    setFormData(field);
    setEditingFieldId(field._id || null);
  };

  // Handle removing a field
  const handleRemove = async (fieldId: string | undefined) => {
    if (!fieldId) return;
    if (window.confirm('Are you sure you want to remove this field?')) {
      try {
        // Replace with your actual API endpoint for deleting a field
        await axios.delete(`/api/custom-fields/${fieldId}`); // Assuming DELETE /api/custom-fields/:id
        alert('Field removed successfully!');
        fetchCustomFields(); // Refetch fields after removal
      } catch (error) {
        console.error('Error removing custom field:', error);
        alert('Error removing field.');
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setFormData({
      name: '',
      label: '',
      type: 'text',
      required: false,
      options: [],
    });
    setEditingFieldId(null);
  };

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold'>
        Gérer les champs personnalisés de bénéficiaire
      </h2>

      {/* Form to Add/Edit Custom Fields */}
      <div className='border rounded-md p-4'>
        <h3 className='text-xl font-semibold mb-4'>
          {editingFieldId
            ? 'Edit Custom Field'
            : 'Ajouter un nouveau champ personnalisé'}
        </h3>
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='label'>Label</Label>
            <Input
              id='label'
              name='label'
              value={formData.label}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='type'>Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select field type' />
              </SelectTrigger>
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
          </div>
          <div className='flex items-center space-x-2 mt-6'>
            <Checkbox
              id='required'
              checked={formData.required}
              onCheckedChange={handleRequiredChange}
            />
            <Label htmlFor='required'>Required</Label>
          </div>
          {(formData.type === 'select' ||
            formData.type === 'radio' ||
            formData.type === 'checkbox') && (
            <div className='col-span-1 md:col-span-2'>
              <Label htmlFor='options'>Options (comma-separated)</Label>
              <Textarea
                id='options'
                name='options'
                value={formData.options ? formData.options.join(', ') : ''}
                onChange={handleOptionsChange}
                placeholder='Option 1, Option 2, Option 3'
              />
            </div>
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
      </div>

      {/* Table to List Custom Fields */}
      <div className='border rounded-md'>
        <h3 className='text-xl font-semibold mb-4 p-4'>
          Champs personnalisés existants
        </h3>
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

export default SettingsBeneficiaryCustomizableForm;
