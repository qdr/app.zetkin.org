import { getServerApiClient } from 'core/api/server';
import PublicProjectPageClient from './PublicProjectPageClient';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import { generateRandomColor } from 'utils/colorUtils';

type PageProps = {
  params: {
    orgId: string;
    projId: string;
  };
};

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
    />
  );
}
