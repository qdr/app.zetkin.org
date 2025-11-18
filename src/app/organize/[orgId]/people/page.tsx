import { getServerApiClient } from 'core/api/server';
import { ViewTreeData } from 'pages/api/views/tree';
import PeoplePageClient from './PeoplePageClient';

interface PageProps {
  params: {
    orgId: string;
  };
}

// Server Component - pre-fetches view tree data for faster initial render
export default async function PeopleViewsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  // Pre-fetch view tree data on server
  const apiClient = await getServerApiClient();
  const viewTree = await apiClient.get<ViewTreeData>(
    `/api/views/tree?orgId=${orgId}`
  );

  return <PeoplePageClient orgId={orgId} viewTree={viewTree} />;
}
