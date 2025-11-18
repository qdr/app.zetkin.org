import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinJourney } from 'utils/types/zetkin';
import JourneyInstancesPageClient from './JourneyInstancesPageClient';

export const metadata: Metadata = {
  title: 'Journey Instances - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; journeyId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, journeyId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  try {
    await apiClient.get<ZetkinJourney>(
      `/api/orgs/${orgId}/journeys/${journeyId}`
    );
    return <JourneyInstancesPageClient orgId={parseInt(orgId)} journeyId={parseInt(journeyId)} />;
  } catch {
    notFound();
  }
}
