import { getServerApiClient } from 'core/api/server';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from 'features/views/components/types';
import SharedViewPageClient from './SharedViewPageClient';

type PageProps = {
  params: {
    orgId: string;
    viewId: string;
  };
};

export default async function SharedViewPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const viewId = parseInt(params.viewId);

  const apiClient = await getServerApiClient();

  const [view, columns, rows] = await Promise.all([
    apiClient.get<ZetkinView>(`/api/orgs/${orgId}/people/views/${viewId}`),
    apiClient.get<ZetkinViewColumn[]>(
      `/api/orgs/${orgId}/people/views/${viewId}/columns`
    ),
    apiClient.get<ZetkinViewRow[]>(
      `/api/orgs/${orgId}/people/views/${viewId}/rows`
    ),
  ]);

  return (
    <SharedViewPageClient
      columns={columns}
      orgId={orgId}
      rows={rows}
      view={view}
      viewId={viewId}
    />
  );
}
