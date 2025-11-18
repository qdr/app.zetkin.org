<<<<<<< HEAD
import { getServerApiClient } from 'core/api/server';
import PublicProjectPageClient from './PublicProjectPageClient';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import { generateRandomColor } from 'utils/colorUtils';

type PageProps = {
=======
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import PublicProjPageClient from './PublicProjPageClient';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import { generateRandomColor } from 'utils/colorUtils';
import getEventState from 'features/events/utils/getEventState';
import { EventState } from 'features/events/hooks/useEventState';

type Props = {
>>>>>>> 44bc9c466da9b5e96bcb7cabdc3ad91c664aac94
  params: {
    orgId: string;
    projId: string;
  };
};

<<<<<<< HEAD
// Server Component - pre-fetches campaign and events data for faster initial render
export default async function PublicProjectPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const campId = parseInt(params.projId);

  const apiClient = await getServerApiClient();
  const today = new Date().toISOString().slice(0, 10);

  // Pre-fetch campaign and its events in parallel
  const [campaign, campaignEvents] = await Promise.all([
    apiClient.get<ZetkinCampaign>(`/api/orgs/${orgId}/campaigns/${campId}`),
    apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${orgId}/campaigns/${campId}/actions?filter=end_time>=${today}`
    ),
  ]);

  // Add color to campaign (same as hook does)
  const campaignWithColor = {
    ...campaign,
    color: generateRandomColor(campaign.id.toString()),
  };

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
  } catch (error) {
    // User not authenticated - that's ok, myEvents stays empty
  }

  return (
    <PublicProjectPageClient
      campaign={campaignWithColor}
      campaignEvents={campaignEvents}
      campId={campId}
      myEvents={myEvents}
      orgId={orgId}
=======
export default async function Page({ params }: Props) {
  const { orgId, projId } = await params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Fetch campaign and events in parallel
  const [campaignData, campEvents] = await Promise.all([
    apiClient.get<ZetkinCampaign>(
      `/api/orgs/${orgId}/campaigns/${projId}`
    ),
    apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${orgId}/campaigns/${projId}/actions?filter=end_time>=${today}`
    ),
  ]);

  // Add color to campaign
  const campaign = {
    ...campaignData,
    color: generateRandomColor(campaignData.id.toString()),
  };

  // Filter events by state
  const campaignEvents = campEvents.filter((event) => {
    const eventState = getEventState(event);
    return eventState == EventState.OPEN || eventState == EventState.SCHEDULED;
  });

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
    <PublicProjPageClient
      campaign={campaign}
      campaignEvents={campaignEvents}
      campId={projId}
      orgId={orgId}
      userEvents={userEvents}
>>>>>>> 44bc9c466da9b5e96bcb7cabdc3ad91c664aac94
    />
  );
}
