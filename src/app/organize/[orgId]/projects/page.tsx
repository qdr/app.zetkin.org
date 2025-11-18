import { getServerApiClient } from '@/core/api/server';
import { ZetkinCampaign } from '@/utils/types/zetkin';
import { ZetkinSurvey } from '@/utils/types/zetkin';
import ProjectsPageClient from './ProjectsPageClient';

interface PageProps {
  params: {
    orgId: string;
  };
}

// Server Component - pre-fetches data for faster initial render
export default async function AllCampaignsSummaryPage({
  params,
}: PageProps) {
  const orgId = parseInt(params.orgId);

  // Pre-fetch campaigns and surveys data on server
  const apiClient = await getServerApiClient();
  const [campaigns, surveys] = await Promise.all([
    apiClient.get<ZetkinCampaign[]>(`/api/orgs/${orgId}/campaigns`),
    apiClient.get<ZetkinSurvey[]>(`/api/orgs/${orgId}/surveys`),
  ]);

  return (
    <ProjectsPageClient campaigns={campaigns} orgId={orgId} surveys={surveys} />
  );
}
