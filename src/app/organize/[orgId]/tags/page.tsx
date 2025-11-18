import { getServerApiClient } from 'core/api/server';
import { ZetkinTag } from 'utils/types/zetkin';
import TagsPageClient from './TagsPageClient';

interface PageProps {
  params: {
    orgId: string;
  };
}

// Server Component - pre-fetches tag groups and tags data for faster initial render
export default async function TagsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  // Pre-fetch tag groups and tags data on server (in parallel)
  const apiClient = await getServerApiClient();
  const [tagGroups, tags] = await Promise.all([
    apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/tag_groups`),
    apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/people/tags`),
  ]);

  return <TagsPageClient orgId={orgId} tagGroups={tagGroups} tags={tags} />;
}
