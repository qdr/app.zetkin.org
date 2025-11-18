import { getServerApiClient } from 'core/api/server';
import IncomingPageClient from './IncomingPageClient';
import { ZetkinJoinSubmission } from 'features/joinForms/types';

type PageProps = {
  params: {
    orgId: string;
  };
};

export default async function IncomingPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);

  const apiClient = await getServerApiClient();

  const submissions = await apiClient.get<ZetkinJoinSubmission[]>(
    `/api/orgs/${orgId}/join_submissions`
  );

  return <IncomingPageClient orgId={orgId} submissions={submissions} />;
}
