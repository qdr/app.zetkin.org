'use server';

import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { PublicCallPage } from 'features/organizations/pages/PublicCallPage';

type Props = {
  params: {
    callId: string;
    orgId: number;
  };
};

export default async function Page({ params: { callId, orgId } }: Props) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const callAssignment = await apiClient.get<ZetkinCallAssignment>(
    `/api/orgs/${orgId}/call_assignments/${callId}`
  );

  return (
    <PublicCallPage callId={callAssignment.id} orgId={callAssignment.organization.id} />
  );
}
