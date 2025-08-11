import countries from '@/assets/constants/country';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { IRepresentantBeneficiaire } from '@/interface/beneficiaire';
import { cn } from '@/lib/utils';
import {
  formUpdateRepresentantBeneficiarySchema,
  FormUpdateRepresentantBeneficiarySchemaValue,
} from '@/schema/beneficiary.schema';
import { validatePhoneNumber } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';
import { DialogFooter } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

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
  const [isValid, setIsValid] = useState<null | boolean>(null);
  const [formattedNumber, setFormattedNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

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
                <PhoneInput
                  international={false}
                  defaultCountry='CI'
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    const { isValidNumber, formattedNumber } =
                      validatePhoneNumber(e ? e : '');
                    setIsValid(isValidNumber);
                    setFormattedNumber(formattedNumber);
                  }}
                  className={
                    'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  }
                />
              </FormControl>
              <FormDescription>
                {/* Exemples de formats acceptés */}
                {form.watch('phone') && isValid ? (
                  <div
                    className={`p-3 rounded-md ${
                      isValid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div>
                      <span className='font-medium'>✓ Numéro valide</span>
                      {formattedNumber && (
                        <div className='mt-1 text-sm'>
                          Format: {formattedNumber}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='mt-6 text-sm text-gray-600'>
                    <h3 className='font-medium mb-2'>Formats acceptés :</h3>
                    <ul className='space-y-1'>
                      <li className='text-red'>• +225 01 23 45 67 89</li>
                      <li className='text-red'>
                        • Préfixes: 01, 05, 07 (mobile), 27 (fixe Abidjan)
                      </li>
                    </ul>
                  </div>
                )}
              </FormDescription>
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
                {/* <Input {...field} placeholder='Pays' /> */}
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className='w-[100%] justify-between'
                    >
                      {selectedCountry
                        ? countries.find(
                            (country) => country.value === selectedCountry
                          )?.label
                        : 'Choisir un pays'}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[100%] p-0'>
                    <Command>
                      <CommandInput placeholder='Rechercher un pays...' />
                      <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.value}
                            value={country.value}
                            onSelect={() => {
                              field.onChange(country.value);
                              setSelectedCountry(country.value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedCountry === country.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
