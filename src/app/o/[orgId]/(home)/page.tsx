import { getServerApiClient } from 'core/api/server';
import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import PublicOrgPageClient from './PublicOrgPageClient';
import { Suspense } from 'react';
import PublicOrgPageSkeleton from 'features/organizations/components/PublicOrgPageSkeleton';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import PublicOrgPageClient from './PublicOrgPageClient';
import { ZetkinEvent, ZetkinOrganization } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

type Props = {
  params: {
    orgId: string;
  };
};

// Server Component - pre-fetches org events and details for faster initial render
export default async function Page({ params }: Props) {
  const orgId = parseInt(params.orgId);
  const apiClient = await getServerApiClient();
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  // Pre-fetch organization events and details in parallel
  const [orgEvents, organization] = await Promise.all([
    apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${orgId}/actions?recursive&filter=start_time%3E=${now}`
    ),
    apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
  ]);

  // Try to get user's events if authenticated (may fail if not logged in)
  let myEvents: ZetkinEventWithStatus[] = [];
  try {
    const [bookedEvents, signups] = await Promise.all([
      apiClient.get<ZetkinEvent[]>(
        `/api/users/me/actions?filter=end_time>=${today}`
      ),
      apiClient.get<{ action: ZetkinEvent }[]>(`/api/users/me/action_responses`),
    ]);

    // Process user events
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

    myEvents = [...bookedEventsWithStatus, ...signedUpEvents];
  } catch (error) {
    // User not authenticated - that's ok, myEvents stays empty
  }

  return (
    <Suspense fallback={<PublicOrgPageSkeleton />}>
      <PublicOrgPageClient
        myEvents={myEvents}
        orgEvents={orgEvents}
        orgId={orgId}
        organization={organization}
      />
    </Suspense>
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
