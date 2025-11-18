import { getServerApiClient } from 'core/api/server';
import { ZetkinJourney } from 'utils/types/zetkin';
import JourneysPageClient from './JourneysPageClient';

interface PageProps {
  params: {
    orgId: string;
  };
}

// Server Component - pre-fetches journeys data for faster initial render
export default async function AllJourneysOverviewPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  // Pre-fetch journeys data on server
  const apiClient = await getServerApiClient();
  const journeys = await apiClient.get<ZetkinJourney[]>(
    `/api/orgs/${orgId}/journeys`
  );

  return <JourneysPageClient journeys={journeys} orgId={orgId} />;
}
