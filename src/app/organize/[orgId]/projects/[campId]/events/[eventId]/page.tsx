import { getServerApiClient } from 'core/api/server';
import { ZetkinEvent } from 'utils/types/zetkin';
import EventPageClient from './EventPageClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    eventId: string;
  };
};

export default async function EventPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const eventId = parseInt(params.eventId);

  const apiClient = await getServerApiClient();

  const event = await apiClient.get<ZetkinEvent>(
    `/api/orgs/${orgId}/actions/${eventId}`
  );

  return <EventPageClient event={event} eventId={eventId} orgId={orgId} />;
}
