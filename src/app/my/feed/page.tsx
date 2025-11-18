import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { getAllEventsDef } from 'features/events/rpc/getAllEvents';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import FeedPageClient from './FeedPageClient';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

export default async function Page() {
  await redirectIfLoginNeeded();

  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  // Fetch all events
  const allEvents = await getAllEventsDef.handler({}, apiClient);

  // Fetch user events (booked + signed up)
  const today = new Date().toISOString().slice(0, 10);
  const bookedEventIds: number[] = [];

  const bookedEvents = await apiClient
    .get<ZetkinEvent[]>(`/api/users/me/actions?filter=end_time>=${today}`)
    .then((events) =>
      events.map<ZetkinEventWithStatus>((event) => {
        bookedEventIds.push(event.id);
        return {
          ...event,
          status: 'booked',
        };
      })
    );

  const signedUpEvents = await apiClient
    .get<{ action: ZetkinEvent }[]>(`/api/users/me/action_responses`)
    .then((events) =>
      events
        .map<ZetkinEventWithStatus>((signup) => ({
          ...signup.action,
          status: 'signedUp',
        }))
        .filter((event) => !bookedEventIds.includes(event.id))
        .filter(({ end_time }) => end_time >= today)
    );

  const userEvents = [...bookedEvents, ...signedUpEvents];

  return <FeedPageClient allEvents={allEvents} userEvents={userEvents} />;
}
