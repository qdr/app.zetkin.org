import { getServerApiClient } from 'core/api/server';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import HomePageClient from './HomePageClient';

export default async function Page() {
  await redirectIfLoginNeeded();

  // Pre-fetch all activities data on server (in parallel)
  const apiClient = await getServerApiClient();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const [callAssignments, areaAssignments, bookedEvents, signups] =
    await Promise.all([
      apiClient.get<ZetkinCallAssignment[]>(`/api/users/me/call_assignments`),
      apiClient.get<ZetkinAreaAssignment[]>('/api2/users/me/area_assignments'),
      apiClient.get<ZetkinEvent[]>(
        `/api/users/me/actions?filter=end_time>=${today}`
      ),
      apiClient.get<{ action: ZetkinEvent }[]>(`/api/users/me/action_responses`),
    ]);

  // Process events data (same logic as useMyEvents)
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

  const events = [...bookedEventsWithStatus, ...signedUpEvents];

  return (
    <HomePageClient
      areaAssignments={areaAssignments}
      callAssignments={callAssignments}
      events={events}
    />
  );
}
