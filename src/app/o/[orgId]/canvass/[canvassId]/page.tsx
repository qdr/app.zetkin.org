'use server';

import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { PublicCanvassPage } from 'features/organizations/pages/PublicCanvassPage';

type Props = {
  params: {
    canvassId: string;
    orgId: number;
  };
};

export default async function Page({ params: { canvassId, orgId } }: Props) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const areaAssignment = await apiClient.get<ZetkinAreaAssignment>(
    `/api2/orgs/${orgId}/area_assignments/${canvassId}`
  );

  return (
    <PublicCanvassPage canvassId={areaAssignment.id} orgId={areaAssignment.organization_id} />
  );
}
