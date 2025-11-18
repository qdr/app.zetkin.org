import { getServerApiClient } from 'core/api/server';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import { getAllEventsDef } from 'features/events/rpc/getAllEvents';
import sortEventsByStartTime from 'features/events/utils/sortEventsByStartTime';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import FeedPageClient from './FeedPageClient';

export default async function Page() {
  await redirectIfLoginNeeded();

  // Pre-fetch all events data on server
  const apiClient = await getServerApiClient();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Get all events using the RPC handler directly
  const allEvents = await getAllEventsDef.handler({}, apiClient);
  const sortedEvents = allEvents.sort(sortEventsByStartTime);

  // Also get user's events for status (same as My Home)
  const [bookedEvents, signups] = await Promise.all([
    apiClient.get<ZetkinEvent[]>(
      `/api/users/me/actions?filter=end_time>=${today}`
    ),
    apiClient.get<{ action: ZetkinEvent }[]>(`/api/users/me/action_responses`),
  ]);

  // Process user events to get status
  const bookedEventIds: number[] = [];
  const bookedEventsWithStatus = bookedEvents.map<ZetkinEventWithStatus>(
    (event) => {
      bookedEventIds.push(event.id);
      return {
        ...event,
        status: 'booked',
      };
    }
  );

  const signedUpEvents = signups
    .map<ZetkinEventWithStatus>((signup) => ({
      ...signup.action,
      status: 'signedUp',
    }))
    .filter((event) => !bookedEventIds.includes(event.id))
    .filter(({ end_time }) => end_time >= today);

  const myEvents = [...bookedEventsWithStatus, ...signedUpEvents];

  // Merge all events with user's event statuses
  const eventsWithStatus = sortedEvents.map<ZetkinEventWithStatus>((event) => {
    const myEvent = myEvents.find((candidate) => candidate.id == event.id);
    return (
      myEvent || {
        ...event,
        status: null,
      }
    );
  });

  return <FeedPageClient events={eventsWithStatus} />;
}
