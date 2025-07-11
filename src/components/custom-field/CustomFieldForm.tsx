import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IBeneficiaryType } from '@/interface/beneficiary-type';
import {
  CustomFieldFormData,
  customFieldSchema,
  DEFAULT_FORM_VALUES,
  FIELD_TYPES,
} from '@/types/custom-field.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

interface CustomFieldFormProps {
  onSubmit: (values: CustomFieldFormData) => Promise<void>;
  beneficiaryTypes?: IBeneficiaryType[];
  isLoadingBeneficiaryTypes?: boolean;
  isEditing?: boolean;
  onCancel?: () => void;
  initialValues?: CustomFieldFormData;
}

export const CustomFieldForm = ({
  onSubmit,
  beneficiaryTypes,
  isLoadingBeneficiaryTypes,
  isEditing = false,
  onCancel,
  initialValues = DEFAULT_FORM_VALUES,
}: CustomFieldFormProps) => {
  const form = useForm<CustomFieldFormData>({
    resolver: zodResolver(customFieldSchema),
    defaultValues: initialValues,
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    } else {
      form.reset(DEFAULT_FORM_VALUES);
    }
  }, [initialValues, form]);

  const formData = form.watch();

  return (
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
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} required aria-label='Nom du champ' />
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
              <FormLabel>Libellé</FormLabel>
              <FormControl>
                <Input {...field} required aria-label='Libellé du champ' />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full' aria-label='Type de champ'>
                    <SelectValue placeholder='Sélectionnez un type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={FIELD_TYPES.TEXT}>Texte</SelectItem>
                  <SelectItem value={FIELD_TYPES.NUMBER}>Nombre</SelectItem>
                  <SelectItem value={FIELD_TYPES.TEXTAREA}>
                    Zone de texte
                  </SelectItem>
                  <SelectItem value={FIELD_TYPES.DATE}>Date</SelectItem>
                  <SelectItem value={FIELD_TYPES.SELECT}>
                    Liste déroulante
                  </SelectItem>
                  <SelectItem value={FIELD_TYPES.RADIO}>
                    Boutons radio
                  </SelectItem>
                  <SelectItem value={FIELD_TYPES.CHECKBOX}>
                    Case à cocher
                  </SelectItem>
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
                  aria-label='Champ requis'
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Requis</FormLabel>
                <FormDescription>
                  Cochez si ce champ est obligatoire.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {(formData.type === FIELD_TYPES.SELECT ||
          formData.type === FIELD_TYPES.RADIO ||
          formData.type === FIELD_TYPES.CHECKBOX) && (
          <FormField
            control={form.control}
            name='options'
            render={({ field }) => (
              <FormItem className='col-span-1 md:col-span-2'>
                <FormLabel>Options (séparées par des virgules)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Option 1, Option 2, Option 3'
                    value={field.value ? field.value.join(', ') : ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(',').map((opt) => opt.trim())
                      )
                    }
                    aria-label='Options du champ'
                  />
                </FormControl>
                <FormDescription>
                  Entrez les options séparées par des virgules pour les types
                  liste déroulante, boutons radio ou case à cocher.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isLoadingBeneficiaryTypes ? (
          <Skeleton className='h-10 w-full col-span-2' />
        ) : (
          <FormField
            control={form.control}
            name='beneficiaryTypeId'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Type de bénéficiaire</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className='w-full'
                      aria-label='Type de bénéficiaire'
                    >
                      <SelectValue placeholder='Sélectionnez un type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {beneficiaryTypes?.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Sélectionnez le type de bénéficiaire auquel ce champ
                  personnalisé s'applique.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className='col-span-1 md:col-span-2 flex justify-end space-x-2'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isEditing ? 'Mettre à jour le champ' : 'Ajouter un champ'}
          </Button>
          {isEditing && (
            <Button type='button' variant='outline' onClick={onCancel}>
              Annuler
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
