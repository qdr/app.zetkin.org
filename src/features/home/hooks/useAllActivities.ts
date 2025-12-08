import useAllEvents from 'features/events/hooks/useAllEvents';
import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import useMyAreaAssignments from 'features/canvass/hooks/useMyAreaAssignments';
import { MyActivity } from '../types';

export default function useAllActivities() {
  // Get all events (not just booked ones)
  const allEvents = useAllEvents();

  // Get call and canvass assignments (these are already filtered to active ones)
  const callAssignments = useMyCallAssignments();
  const areaAssignments = useMyAreaAssignments();

  // Filter events to only show those without a status (available to attend)
  const availableEvents = allEvents.filter((event) => !event.status);

  const activities: MyActivity[] = [
    ...availableEvents.map<MyActivity>((data) => ({
      data,
      kind: 'event',
      start: new Date(data.start_time || 0),
    })),
    ...callAssignments.map<MyActivity>((data) => ({
      data,
      kind: 'call',
      start: new Date(data.start_date || 0),
    })),
    ...areaAssignments.map<MyActivity>((data) => ({
      data,
      kind: 'canvass',
      start: new Date(data.start_date || 0),
    })),
  ];

  return activities.sort((a, b) => a.start.getTime() - b.start.getTime());
}
