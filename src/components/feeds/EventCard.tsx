import React from 'react';

interface EventCardProps {
  month: string;
  day: string;
  title: string;
  organizer: string;
  time: string;
  duration?: string;
  place: string;
  interested?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  month,
  day,
  title,
  organizer,
  time,
  duration,
  place,
  interested,
}) => (
  <div className='flex gap-3 items-center'>
    <div className='bg-red-500 text-white rounded-lg px-2 py-1 text-center'>
      <div className='text-xs font-bold'>{month}</div>
      <div className='text-lg font-bold'>{day}</div>
    </div>
    <div>
      <div className='font-semibold text-blue-700'>{title}</div>
      <div className='text-xs text-gray-500'>Organized by {organizer}</div>
      <div className='text-xs text-gray-500'>Time: {time}</div>
      {duration && (
        <div className='text-xs text-gray-500'>Duration: {duration}</div>
      )}
      {interested && <div className='text-xs text-gray-500'>{interested}</div>}
      <div className='text-xs text-gray-500'>Place: {place}</div>
    </div>
  </div>
);

export default EventCard;
