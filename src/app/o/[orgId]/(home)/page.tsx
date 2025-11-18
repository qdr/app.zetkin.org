import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import PublicOrgPageClient from './PublicOrgPageClient';
import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

type Props = {
  params: {
    orgId: number;
  };
};

export default async function Page({ params }: Props) {
  const { orgId } = await params;
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  // Fetch org data and events in parallel
  const [organization, orgEvents] = await Promise.all([
    apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
    apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${orgId}/actions?recursive&filter=start_time>=${now}`
    ),
  ]);

  // Try to fetch user events if authenticated (gracefully handle unauthenticated)
  let userEvents: ZetkinEventWithStatus[] = [];
  try {
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

    userEvents = [...bookedEvents, ...signedUpEvents];
  } catch (error) {
    // User is not authenticated, continue without user events
  }

  return (
    <PublicOrgPageClient
      organization={organization}
      orgEvents={orgEvents}
      orgId={orgId}
      userEvents={userEvents}
    />
  );
}
