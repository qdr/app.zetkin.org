import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinEvent } from 'utils/types/zetkin';
import EventPageClient from './EventPageClient';

export const metadata: Metadata = {
  title: 'Event - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; eventId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, eventId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if event exists and belongs to campaign
  try {
    const event = await apiClient.get<ZetkinEvent>(
      `/api/orgs/${orgId}/actions/${eventId}`
    );
    const actualCampaign = event.campaign?.id.toString() ?? 'standalone';

    if (actualCampaign !== campId) {
      notFound();
    }
  } catch (error) {
    notFound();
  }

  return <EventPageClient orgId={parseInt(orgId)} eventId={parseInt(eventId)} />;
}
