import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import EventParticipantsPageClient from './EventParticipantsPageClient';

export const metadata: Metadata = {
  title: 'Event Participants - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; eventId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, eventId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return <EventParticipantsPageClient orgId={parseInt(orgId)} eventId={parseInt(eventId)} />;
}
