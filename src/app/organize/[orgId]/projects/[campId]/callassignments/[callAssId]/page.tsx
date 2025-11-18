import { CallAssignmentStats } from 'features/callAssignments/hooks/useCallAssignmentStats';
import { getServerApiClient } from 'core/api/server';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import CallAssignmentPageClient from './CallAssignmentPageClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    callAssId: string;
  };
};

export default async function CallAssignmentPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const callAssId = parseInt(params.callAssId);

  const apiClient = await getServerApiClient();

  const callAssignment = await apiClient.get<ZetkinCallAssignment>(
    `/api/orgs/${orgId}/call_assignments/${callAssId}`
  );

  const isTargeted = !!(
    callAssignment &&
    callAssignment.target?.filter_spec?.length != 0
  );

  let stats: (CallAssignmentStats & { id: number }) | null = null;
  if (isTargeted) {
    const statsData = await apiClient.get<CallAssignmentStats>(
      `/api/callAssignments/targets?org=${orgId}&assignment=${callAssId}`
    );
    stats = { ...statsData, id: callAssId };
  }

  return (
    <CallAssignmentPageClient
      callAssId={callAssId}
      callAssignment={callAssignment}
      isTargeted={isTargeted}
      orgId={orgId}
      stats={stats}
    />
  );
}
