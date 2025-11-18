import { getServerApiClient } from 'core/api/server';
import { ZetkinView, ZetkinViewFolder } from 'features/views/components/types';
import PeopleFoldersPageClient from './PeopleFoldersPageClient';

type PageProps = {
  params: {
    orgId: string;
    folderId: string;
  };
};

export default async function PeopleFoldersPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const folderId = parseInt(params.folderId);

  const apiClient = await getServerApiClient();

  const [views, folders] = await Promise.all([
    apiClient.get<ZetkinView[]>(`/api/orgs/${orgId}/people/views`),
    apiClient.get<ZetkinViewFolder[]>(`/api/orgs/${orgId}/people/view_folders`),
  ]);

  return (
    <PeopleFoldersPageClient
      folderId={folderId}
      folders={folders}
      orgId={orgId}
      views={views}
    />
  );
}
