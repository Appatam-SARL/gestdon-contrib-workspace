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
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
});

const AgendaPage = withDashboard(() => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [culture, setCulture] = useState<'en' | 'en-GB' | 'fr'>('fr');
  const [rightToLeft, setRightToLeft] = useState(false);

  const { defaultDate, messages } = useMemo(
    () => ({
      defaultDate: new Date(2015, 3, 1),
      messages: lang[culture],
    }),
    [culture]
  );
  const [events, setEvents] = useState([
    // Example events - replace with your actual event data fetching logic
    {
      title: 'Meeting with team',
      start: new Date(2025, 4, 28, 10, 0),
      end: new Date(2025, 4, 28, 11, 0),
    },
    {
      title: 'Project deadline',
      start: new Date(2025, 4, 28),
      end: new Date(2025, 4, 28),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const eventsForSelectedDate = events.filter((event) => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  });

  const handleAddTask = (values: z.infer<typeof taskSchema>) => {
    // Add validation here if needed - Zod schema handles basic validation
    const newEvent = {
      title: values.title,
      start: new Date(values.start),
      end: new Date(values.end),
    };
    setEvents([...events, newEvent]);
    form.reset(); // Reset form using react-hook-form
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>Agenda</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Calendar Component */}
        <div className='col-span-2 bg-white p-4 rounded shadow'>
          <h2 className='text-xl font-semibold mb-4'>Calendar</h2>
          <div style={{ height: 500 }}>
            <Calendar
              localizer={localizer}
              culture={culture}
              events={events}
              startAccessor='start'
              endAccessor='end'
              selectable
              onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
              onSelectEvent={(event: {
                title: string;
                start: Date;
                end: Date;
              }) => alert(event.title)}
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
              Tasks for {selectedDate.toLocaleDateString()}
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
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks for this date.</p>
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
                        <FormLabel className='text-right'>Title</FormLabel>
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
                          Start Date & Time
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
                          End Date & Time
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
