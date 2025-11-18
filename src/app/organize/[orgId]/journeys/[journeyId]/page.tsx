import { getServerApiClient } from 'core/api/server';
import JourneyDetailPageClient from './JourneyDetailPageClient';
import { ZetkinJourney, ZetkinJourneyInstance } from 'utils/types/zetkin';
import { getTagColumns } from 'features/journeys/utils/journeyInstanceUtils';

type PageProps = {
  params: {
    orgId: string;
    journeyId: string;
  };
};

export default async function JourneyDetailPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const journeyId = parseInt(params.journeyId);

  return (
    <>
      <ZUIFuture future={journeyInstancesFuture}>
        {(data) => {
          const openJourneyInstances = data.journeyInstances.filter(
            (journeyInstance) => journeyInstance.closed == null
          );
  const apiClient = await getServerApiClient();

  const [journey, journeyInstances] = await Promise.all([
    apiClient.get<ZetkinJourney>(`/api/orgs/${orgId}/journeys/${journeyId}`),
    apiClient.get<ZetkinJourneyInstance[]>(
      `/api/orgs/${orgId}/journeys/${journeyId}/instances`
    ),
  ]);

  const tagColumnsData = getTagColumns(journeyInstances);

  return (
    <JourneyDetailPageClient
      journey={journey}
      journeyId={journeyId}
      journeyInstances={journeyInstances}
      orgId={orgId}
      tagColumnsData={tagColumnsData}
    />
  );
}
