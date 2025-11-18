import { getServerApiClient } from 'core/api/server';
import { ZetkinEvent } from 'utils/types/zetkin';
import ParticipantsPageClient from './ParticipantsPageClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    eventId: string;
  };
};

export default async function ParticipantsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const eventId = parseInt(params.eventId);

  const apiClient = await getServerApiClient();

  const event = await apiClient.get<ZetkinEvent>(
    `/api/orgs/${orgId}/actions/${eventId}`
  );

  return <ParticipantsPageClient event={event} eventId={eventId} orgId={orgId} />;
}
