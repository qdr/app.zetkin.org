import { getServerApiClient } from 'core/api/server';
import {
  ZetkinJourneyInstance,
  ZetkinUpdate,
} from 'utils/types/zetkin';
import JourneyDetailsPageClient from './JourneyDetailsPageClient';

type PageProps = {
  params: {
    orgId: string;
    journeyId: string;
    instanceId: string;
  };
};

export default async function JourneyDetailsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const instanceId = parseInt(params.instanceId);

  const apiClient = await getServerApiClient();

  const [instance, timelineUpdates] = await Promise.all([
    apiClient.get<ZetkinJourneyInstance>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}`
    ),
    apiClient.get<ZetkinUpdate[]>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/timeline/updates`
    ),
  ]);

  return (
    <JourneyDetailsPageClient
      instance={instance}
      instanceId={instanceId}
      orgId={orgId}
      timelineUpdates={timelineUpdates}
    />
  );
}
