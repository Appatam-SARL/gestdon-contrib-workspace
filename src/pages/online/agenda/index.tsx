import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { withDashboard } from '@/hoc/withDashboard';
import { useCreateAgendaEvent, useGetAgendaEvents } from '@/hook/agenda.hook';
import { AgendaEvent, IAgencdaFilterForm } from '@/interface/agenda';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import useContributorStore from '@/store/contributor.store';
import 'globalize/lib/cultures/globalize.culture.ar-AE';
import 'globalize/lib/cultures/globalize.culture.fr';

const localizer = momentLocalizer(moment);

const cultures = ['en', 'en-GB', 'fr'];

const lang = {
  en: null,
  'en-GB': null,
  fr: {
    week: 'La semaine',
    work_week: 'Semaine de travail',
    day: 'Jour',
    month: 'Mois',
    previous: 'Antérieur',
    next: 'Prochain',
    today: `Aujourd\'hui`,
    agenda: 'Ordre du jour',

    showMore: (total: number) => `+${total} plus`,
  },
};

// Define Zod schema for task validation
const taskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  start: z.string().min(1, { message: 'Start date and time are required' }),
  end: z.string().min(1, { message: 'End date and time are required' }),
  // ownerId: z.string().min(1, { message: 'Owner ID is required' }),
});

const AgendaPage = withDashboard(() => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [culture, setCulture] = useState<'en' | 'en-GB' | 'fr'>('fr');
  const [rightToLeft, setRightToLeft] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contributorId = useContributorStore((s) => s.contributor?._id);
  const [filter, setFilter] = useState<IAgencdaFilterForm>({
    contributorId: contributorId as string,
  });
  const { data: eventsData } = useGetAgendaEvents(filter);
  const events: AgendaEvent[] = useMemo(
    () => eventsData?.data || [],
    [eventsData]
  );
  console.log('🚀 ~ AgendaPage ~ events:', events);
  const { mutate: createAgendaEvent } = useCreateAgendaEvent();

  const { defaultDate, messages } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 1),
      messages: lang[culture],
    }),
    [culture]
  );

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      start: '',
      end: '',
    },
  });

  // Filter events for the selected date
  const eventsForSelectedDate = events.filter((event: AgendaEvent) => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  });

  const handleAddTask = (values: z.infer<typeof taskSchema>) => {
    // Add validation here if needed - Zod schema handles basic validation
    const newEvent: AgendaEvent = {
      title: values.title,
      start: new Date(values.start),
      end: new Date(values.end),
      ownerId: contributorId as string,
    };
    createAgendaEvent(newEvent);
    form.reset(); // Reset form using react-hook-form
    setIsModalOpen(false); // Close modal
  };

  React.useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      contributorId: contributorId as string,
    }));
  }, [contributorId]);

  return (
    <div className='container mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Agenda</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Calendar Component */}
        <div className='col-span-2 bg-white p-4 rounded shadow'>
          <div style={{ height: 500 }}>
            <Calendar
              localizer={localizer}
              culture={culture}
              events={events}
              startAccessor='start'
              endAccessor='end'
              selectable
              onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
              onSelectEvent={(event: AgendaEvent) => alert(event.title)}
              views={['month', 'week', 'day', 'agenda']}
              defaultView='month'
              step={60}
              timeslots={1}
              messages={messages}
              rtl={rightToLeft}
            />
          </div>
        </div>

        {/* AgendaPage Items */}
        <div className='bg-white p-4 rounded shadow'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>
              Tâches pour {selectedDate.toLocaleDateString()}
            </h2>
            <Button onClick={() => setIsModalOpen(true)}>
              Ajouter une tâche
            </Button>
          </div>
          <div>
            {eventsForSelectedDate.length > 0 ? (
              <ul>
                {eventsForSelectedDate.map((event, index) => (
                  <li key={index} className='mb-2'>
                    <strong>{event.title}</strong>
                    <p>
                      {new Date(event.start).toLocaleTimeString()} -{' '}
                      {new Date(event.end).toLocaleTimeString()}
                    </p>
                    {/* <p>Owner: {event.ownerId}</p> */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune tâche pour cette date.</p>
            )}
          </div>

          {/* Add Task Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle tâche</DialogTitle>
              </DialogHeader>
              {/* Task form will go here */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddTask)}
                  className='grid gap-4 py-4'
                >
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-4 items-center gap-4'>
                        <FormLabel className='text-right'>Titre</FormLabel>
                        <FormControl>
                          <Input id='title' {...field} className='col-span-3' />
                        </FormControl>
                        <FormMessage className='col-span-4 text-right' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='start'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-4 items-center gap-4'>
                        <FormLabel className='text-right'>
                          Date et heure de début
                        </FormLabel>
                        <FormControl>
                          <Input
                            id='start'
                            type='datetime-local'
                            {...field}
                            className='col-span-3'
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 text-right' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='end'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-4 items-center gap-4'>
                        <FormLabel className='text-right'>
                          Date et heure de fin
                        </FormLabel>
                        <FormControl>
                          <Input
                            id='end'
                            type='datetime-local'
                            {...field}
                            className='col-span-3'
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 text-right' />
                      </FormItem>
                    )}
                  />
                  <div className='flex justify-end'>
                    <Button type='submit'>Ajouter la tâche</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
});

export default AgendaPage;
