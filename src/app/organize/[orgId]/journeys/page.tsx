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

  return (
    <ZUISection title={messages.journeys.overview.overviewTitle()}>
        <Grid container spacing={2}>
          {journeysFuture.data?.map((journey: ZetkinJourney) => (
            <Grid key={journey.id} size={{ lg: 4, md: 6, xl: 3, xs: 12 }}>
              <JourneyCard journey={journey} />
            </Grid>
          ))}
        </Grid>
      </ZUISection>
      <JourneysGrid orgId={orgId} />
    </ZUISection>
  // Pre-fetch journeys data on server
  const apiClient = await getServerApiClient();
  const journeys = await apiClient.get<ZetkinJourney[]>(
    `/api/orgs/${orgId}/journeys`
  );

  return <JourneysPageClient journeys={journeys} orgId={orgId} />;
}
