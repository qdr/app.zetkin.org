import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import JourneyInstancePageClient from './JourneyInstancePageClient';

export const metadata: Metadata = {
  title: 'Journey Instance - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; journeyId: string; instanceId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, journeyId, instanceId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  try {
    const journeyInstance = await apiClient.get<ZetkinJourneyInstance>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}`
    );

    if (journeyInstance.journey.id.toString() !== journeyId) {
      redirect(
        `/organize/${orgId}/journeys/${journeyInstance.journey.id}/${instanceId}`
      );
    }

    return (
      <JourneyInstancePageClient
        orgId={parseInt(orgId)}
        instanceId={parseInt(instanceId)}
      />
    );
  } catch {
    notFound();
  }
}
