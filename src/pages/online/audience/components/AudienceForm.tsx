import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { IAudienceForm } from '@/interface/audience';
import { IBeneficiaire } from '@/interface/beneficiaire';
import {
  FormCreateAudienceSchema,
  FormUpdateAudienceSchema,
  createAudienceSchema,
  updateAudienceSchema,
} from '@/schema/audience.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AudienceFormProps {
  onSubmit: (
    values: FormCreateAudienceSchema | FormUpdateAudienceSchema
  ) => void;
  initialValues?: Partial<IAudienceForm>;
  isEditing?: boolean;
  isLoading?: boolean;
  beneficiaries?: IBeneficiaire[];
}

export const AudienceForm: React.FC<AudienceFormProps> = ({
  onSubmit,
  initialValues,
  isEditing = false,
  isLoading = false,
  beneficiaries = [],
}) => {
  const formSchema = isEditing ? updateAudienceSchema : createAudienceSchema;

  const form = useForm<FormCreateAudienceSchema | FormUpdateAudienceSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      beneficiaryId: initialValues?.beneficiaryId || '',
      title: initialValues?.title || '',
      locationOfActivity: initialValues?.locationOfActivity,
      description: initialValues?.description || '',
      startDate: initialValues?.startDate || '',
      endDate: initialValues?.endDate || '',
    } as FormCreateAudienceSchema,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {!isEditing && (
          <FormField
            control={form.control}
            name='beneficiaryId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bénéficiaire</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={field.value as string}
                    onValueChange={field.onChange}
                    defaultValue={initialValues?.beneficiaryId}
                    disabled={beneficiaries.length === 0 || isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Sélectionnez un bénéficiaire' />
                    </SelectTrigger>
                    <SelectContent>
                      {beneficiaries?.map((beneficiary) => (
                        <SelectItem
                          key={beneficiary._id}
                          value={beneficiary._id}
                        >
                          {beneficiary.fullName}
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
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'audience</FormLabel>
              <FormControl>
                <Input
                  placeholder="Titre de l'audience"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='locationOfActivity'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu de l'activité</FormLabel>
              <FormControl>
                <Input
                  placeholder="Lieu de l'audience"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de l'audience"
                  rows={10}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-between p-4 border-t'>
          <Button type='submit' className='ml-auto' disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center'>
                <Loader2 className='animate-spin h-4 w-4 mr-2' />
                <span>Chargement...</span>
              </div>
            ) : isEditing ? (
              `Modifier l\'audience`
            ) : (
              `Ajouter l\'audience`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
