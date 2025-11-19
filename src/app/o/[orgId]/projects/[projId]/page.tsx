import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import PublicProjPageClient from './PublicProjPageClient';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import { generateRandomColor } from 'utils/colorUtils';
import getEventState from 'features/events/utils/getEventState';
import { EventState } from 'features/events/hooks/useEventState';

type Props = {
  params: Promise<{
    orgId: string;
    projId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { orgId, projId } = await params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  // Fetch campaign and events in parallel, handle errors before rendering
  let campaignData: ZetkinCampaign;
  let campEvents: ZetkinEvent[];

  try {
    [campaignData, campEvents] = await Promise.all([
      apiClient.get<ZetkinCampaign>(
        `/api/orgs/${orgId}/campaigns/${projId}`
      ),
      apiClient.get<ZetkinEvent[]>(
        `/api/orgs/${orgId}/campaigns/${projId}/actions?filter=end_time>=${today}`
      ),
    ]);
  } catch (err) {
    return notFound();
  }

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
    />
  );
}
