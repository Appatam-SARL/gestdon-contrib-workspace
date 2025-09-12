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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MessageSquare, Phone, Send, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schéma de validation pour le formulaire de contact
const contactSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  company: z.string().optional(),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  packageName: string;
  onSubmit: (data: ContactFormData) => void;
}

const ContactForm = ({ packageName, onSubmit }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      // Réinitialiser le formulaire après soumission
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-gray-900 mb-2'>
          Contactez-nous pour le package {packageName}
        </h3>
        <p className='text-gray-600'>
          Notre équipe vous contactera dans les plus brefs délais pour discuter
          de vos besoins
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          {/* Prénom et Nom */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Prénom *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Votre prénom' {...field} />
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
                  <FormLabel className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Nom *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Votre nom' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email et Téléphone */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='votre@email.com'
                      {...field}
                    />
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
                  <FormLabel className='flex items-center gap-2'>
                    <Phone className='h-4 w-4' />
                    Téléphone *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='+225 0123456789' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Entreprise */}
          <FormField
            control={form.control}
            name='company'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entreprise / Organisation</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nom de votre entreprise (optionnel)'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message */}
          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center gap-2'>
                  <MessageSquare className='h-4 w-4' />
                  Message *
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Décrivez vos besoins et objectifs...'
                    className='min-h-[120px]'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bouton de soumission */}
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-purple-600 hover:bg-purple-700 text-white'
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Envoi en cours...
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <Send className='h-4 w-4' />
                Envoyer ma demande
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
