import { CallAssignmentCaller } from 'features/callAssignments/hooks/useCallers';
import { getServerApiClient } from 'core/api/server';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import CallersPageClient from './CallersPageClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    callAssId: string;
  };
};

export default async function CallersPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const callAssId = parseInt(params.callAssId);

  const apiClient = await getServerApiClient();

  const [callAssignment, callers] = await Promise.all([
    apiClient.get<ZetkinCallAssignment>(
      `/api/orgs/${orgId}/call_assignments/${callAssId}`
    ),
    apiClient.get<CallAssignmentCaller[]>(
      `/api/orgs/${orgId}/call_assignments/${callAssId}/callers`
    ),
  ]);

  return (
    <CallersPageClient
      callAssId={callAssId}
      callAssignment={callAssignment}
      callers={callers}
      orgId={orgId}
    />
  );
}
