import { getServerApiClient } from 'core/api/server';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import JourneyMilestonesPageClient from './JourneyMilestonesPageClient';

type PageProps = {
  params: {
    orgId: string;
    journeyId: string;
    instanceId: string;
  };
};

export default async function JourneyMilestonesPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const instanceId = parseInt(params.instanceId);

  const apiClient = await getServerApiClient();

  const instance = await apiClient.get<ZetkinJourneyInstance>(
    `/api/orgs/${orgId}/journey_instances/${instanceId}`
  );

  const milestones = instance.milestones || [];

  return (
    <JourneyMilestonesPageClient
      instance={instance}
      instanceId={instanceId}
      milestones={milestones}
      orgId={orgId}
    />
  );
}
