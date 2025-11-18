import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import MyHomePageClient from './HomePageClient';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinCallAssignment, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

export default async function Page() {
  await redirectIfLoginNeeded();

  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const today = new Date().toISOString().slice(0, 10);

  const [areaAssignments, callAssignments, bookedEvents, signedUpEventsData] =
    await Promise.all([
      apiClient.get<ZetkinAreaAssignment[]>(
        '/api2/users/me/area_assignments'
      ),
      apiClient.get<ZetkinCallAssignment[]>('/api/users/me/call_assignments'),
      apiClient.get<ZetkinEvent[]>(
        `/api/users/me/actions?filter=end_time>=${today}`
      ),
      apiClient.get<{ action: ZetkinEvent }[]>(`/api/users/me/action_responses`),
    ]);

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

  const signedUpEvents = signedUpEventsData
    .map<ZetkinEventWithStatus>((signup) => ({
      ...signup.action,
      status: 'signedUp',
    }))
    .filter((event) => !bookedEventIds.includes(event.id))
    .filter(({ end_time }) => end_time >= today);

  const userEvents = [...bookedEventsWithStatus, ...signedUpEvents];

  return (
    <MyHomePageClient
      areaAssignments={areaAssignments}
      callAssignments={callAssignments}
      userEvents={userEvents}
    />
  );
}
