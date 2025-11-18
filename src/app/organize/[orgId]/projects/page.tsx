import ProjectsPageClient from './ProjectsPageClient';

interface PageProps {
  params: {
    orgId: string;
  };
}

// Server Component - can pre-fetch data here in future
export default async function AllCampaignsSummaryPage({
  params,
}: PageProps) {
  const orgId = parseInt(params.orgId);

  // Future: Pre-fetch campaigns and surveys data here
  // const apiClient = await getServerApiClient();
  // const [campaigns, surveys] = await Promise.all([
  //   apiClient.get(`/api/orgs/${orgId}/campaigns`),
  //   apiClient.get(`/api/orgs/${orgId}/surveys`),
  // ]);

  return <ProjectsPageClient orgId={orgId} />;
}
