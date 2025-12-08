import useMyEvents from 'features/events/hooks/useMyEvents';
import { MyActivity } from '../types';

export default function useMyActivities() {
  // Only show events that user is booked or signed up for
  const myEvents = useMyEvents();

  const activities: MyActivity[] = [
    ...myEvents.map<MyActivity>((data) => ({
      data,
      kind: 'event',
      start: new Date(data.start_time || 0),
    })),
  ];

  return activities.sort((a, b) => a.start.getTime() - b.start.getTime());
}
