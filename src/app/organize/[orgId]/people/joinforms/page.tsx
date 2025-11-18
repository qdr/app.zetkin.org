import { getServerApiClient } from 'core/api/server';
import JoinFormsPageClient from './JoinFormsPageClient';
import { ZetkinJoinForm } from 'features/joinForms/types';

type PageProps = {
  params: {
    orgId: string;
  };
};

export default async function JoinFormsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  const apiClient = await getServerApiClient();

  const joinForms = await apiClient.get<ZetkinJoinForm[]>(
    `/api/orgs/${orgId}/join_forms`
  );

  return <JoinFormsPageClient joinForms={joinForms} orgId={orgId} />;
}
