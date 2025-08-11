import { withDashboard } from '@/hoc/withDashboard';
import { useGetAgendaEvents } from '@/hook/agenda.hook';
import { AgendaEvent, IAgencdaFilterForm } from '@/interface/agenda';
import useContributorStore from '@/store/contributor.store';
import React, { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, Formats } from 'react-big-calendar';

import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';

import 'globalize/lib/cultures/globalize.culture.ar-AE';
import 'globalize/lib/cultures/globalize.culture.fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { format } from 'date-fns';

const AgendaPage = withDashboard(() => {
  const locales = {
    fr: fr,
  };

  const localizer = useMemo(
    () =>
      dateFnsLocalizer({
        format: (date: Date, formatStr: string) =>
          format(date, formatStr, { locale: fr }),
        parse,
        startOfWeek: () => startOfWeek(new Date(), { locale: fr }),
        getDay,
        locales,
      }),
    []
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<
    'month' | 'week' | 'day' | 'agenda'
  >('day');

  const contributorId = useContributorStore((s) => s.contributor?._id);
  const [filter, setFilter] = useState<IAgencdaFilterForm>({
    contributorId: contributorId as string,
  });

  const { data: eventsData } = useGetAgendaEvents(filter);

  const events: AgendaEvent[] = useMemo(() => {
    return (eventsData?.data || []).map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  }, [eventsData]);

  // Filter events for the selected date
  const eventsForSelectedDate = events.filter((event: AgendaEvent) => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  });

  const formats = {
    monthHeaderFormat: (date: Date) => {
      const raw = format(date, 'MMMM yyyy', { locale: fr });
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    },
    dayHeaderFormat: (date: Date) => {
      return format(date, 'EEEE d MMMM', { locale: fr }); // lundi 4 août
    },
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
      const formattedStart = format(start, 'd MMM', { locale: fr });
      const formattedEnd = format(end, 'd MMM yyyy', { locale: fr });
      return `${formattedStart} – ${formattedEnd}`;
    },
  };

  React.useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      contributorId: contributorId as string,
    }));
  }, [contributorId]);

  return (
    <div className='container mx-auto'>
      <h4 className='text-2xl font-bold mb-6'>Agenda</h4>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='col-span-2 bg-white p-4 rounded shadow'>
          <div style={{ height: 500 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor='start'
              endAccessor='end'
              culture='fr'
              formats={formats as Formats} // ← ici !
              date={selectedDate}
              onNavigate={(date) => setSelectedDate(date)}
              view={calendarView}
              onView={(view) =>
                setCalendarView(view as 'month' | 'week' | 'day' | 'agenda')
              }
              style={{ height: '100%' }}
              onSelectEvent={(event: AgendaEvent) => alert(event.title)}
              messages={{
                date: 'Date',
                time: 'Heure',
                event: 'Événement',
                allDay: 'Toute la journée',
                next: 'Suivant',
                previous: 'Précédent',
                today: "Aujourd'hui",
                yesterday: 'Hier',
                tomorrow: 'Demain',
                month: 'Mois',
                week: 'Semaine',
                work_week: 'Semaine ouvrée',
                day: 'Jour',
                agenda: 'Agenda',
                noEventsInRange: 'Aucun événement dans cette période.',
                showMore: (total) => `+ Voir plus (${total})`,
              }}
              views={['month', 'week', 'day', 'agenda']}
            />
          </div>
        </div>

        {/* AgendaPage Items */}
        <div className='bg-white p-4 rounded shadow'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>
              Tâches pour {selectedDate.toLocaleDateString()}
            </h2>
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
              <p>Aucune tâche pour cette date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AgendaPage;
