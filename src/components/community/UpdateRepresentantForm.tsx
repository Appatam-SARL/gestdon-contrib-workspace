import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { IRepresentantBeneficiaire } from '@/interface/beneficiaire';
import {
  formUpdateRepresentantBeneficiarySchema,
  FormUpdateRepresentantBeneficiarySchemaValue,
} from '@/schema/beneficiary.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { DialogFooter } from '../ui/dialog';

interface UpdateRepresentantFormProps {
  representant: IRepresentantBeneficiaire;
  onSubmit: (data: FormUpdateRepresentantBeneficiarySchemaValue) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function UpdateRepresentantForm({
  representant,
  onSubmit,
  onCancel,
  isLoading,
}: UpdateRepresentantFormProps) {
  const form = useForm<FormUpdateRepresentantBeneficiarySchemaValue>({
    resolver: zodResolver(formUpdateRepresentantBeneficiarySchema),
    defaultValues: {
      _id: representant._id,
      firstName: representant.firstName,
      lastName: representant.lastName,
      phone: representant.phone,
      address: {
        country: representant.address.country,
        street: representant.address.street,
        postalCode: representant.address.postalCode,
        city: representant.address.city,
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
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
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <label className='block text-sm font-medium'>Nom</label>
              <FormControl>
                <Input id='lastName' type='text' placeholder='Nom' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <label className='block text-sm font-medium'>Téléphone</label>
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
          name='address.postalCode'
          render={({ field }) => (
            <FormItem>
              <label className='block text-sm font-medium'>Code postal</label>
              <FormControl>
                <Input {...field} placeholder='Code postal' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            <X />
            <span>Annuler</span>
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='animate-spin' />
                <span>En cours de modification...</span>
              </>
            ) : (
              <>
                <Save />
                <span>Enregistrer</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
