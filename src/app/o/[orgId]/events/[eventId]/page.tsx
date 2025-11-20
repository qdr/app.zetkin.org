import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent } from 'utils/types/zetkin';
import PublicEventPageClient from './PublicEventPageClient';

type Props = {
  params: Promise<{
    eventId: string;
    orgId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { eventId, orgId } = await params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  // Fetch event data and handle errors BEFORE rendering client component
  let event: ZetkinEvent;

  try {
    event = await apiClient.get<ZetkinEvent>(
      `/api/orgs/${orgId}/actions/${eventId}`
    );
  } catch (err) {
    return notFound();
  }

  return (
    <PublicEventPageClient
      event={event}
      eventId={event.id}
      orgId={event.organization.id}
    />
  );
}
