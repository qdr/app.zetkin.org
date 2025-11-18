<<<<<<< HEAD
import { getServerApiClient } from 'core/api/server';
import PublicEventPageClient from './PublicEventPageClient';
import { ZetkinEvent, ZetkinMembership } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

type PageProps = {
=======
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent } from 'utils/types/zetkin';
import PublicEventPageClient from './PublicEventPageClient';

type Props = {
>>>>>>> 44bc9c466da9b5e96bcb7cabdc3ad91c664aac94
  params: {
    eventId: string;
    orgId: string;
  };
};

// Server Component - pre-fetches event data for faster initial render
export default async function PublicEventDetailPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const eventId = parseInt(params.eventId);

  const apiClient = await getServerApiClient();

  // Pre-fetch event data (public, always available)
  const event = await apiClient.get<ZetkinEvent>(
    `/api/orgs/${orgId}/actions/${eventId}`
  );

<<<<<<< HEAD
  // Try to get user's data if authenticated (may fail if not logged in)
  let myEvents: ZetkinEventWithStatus[] = [];
  let memberships: ZetkinMembership[] = [];

  try {
    const today = new Date().toISOString().slice(0, 10);
    const [bookedEvents, signups, userMemberships] = await Promise.all([
      apiClient.get<ZetkinEvent[]>(
        `/api/users/me/actions?filter=end_time>=${today}`
      ),
      apiClient.get<{ action: ZetkinEvent }[]>(`/api/users/me/action_responses`),
      apiClient
        .get<ZetkinMembership[]>(`/api/users/me/memberships`)
        .then((response) => response.filter((m) => m.role != null)),
    ]);

    // Process user events
    const bookedEventIds: number[] = [];
    const bookedEventsWithStatus = bookedEvents.map<ZetkinEventWithStatus>(
      (event) => {
        bookedEventIds.push(event.id);
        return { ...event, status: 'booked' };
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
    memberships = userMemberships;
  } catch (error) {
    // User not authenticated - that's ok, data stays empty
  }

  return (
    <PublicEventPageClient
      event={event}
      eventId={eventId}
      memberships={memberships}
      myEvents={myEvents}
      orgId={orgId}
=======
  return (
    <PublicEventPageClient
      event={event}
      eventId={event.id}
      orgId={event.organization.id}
>>>>>>> 44bc9c466da9b5e96bcb7cabdc3ad91c664aac94
    />
  );
}
