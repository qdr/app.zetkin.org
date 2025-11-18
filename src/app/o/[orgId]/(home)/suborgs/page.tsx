import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import SubOrgsPageClient from './SubOrgsPageClient';
import { ZetkinSubOrganization } from 'utils/types/zetkin';
import flattenSubOrgs from 'features/organizations/utils/flattenSubOrgs';

type Props = {
  params: {
    orgId: number;
  };
};

export default async function Page({ params }: Props) {
  const { orgId } = await params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const subOrgsData = await apiClient.get<ZetkinSubOrganization[]>(
    `/api/orgs/${orgId}/sub_organizations?recursive`
  );

  const subOrgs = flattenSubOrgs(subOrgsData);

  return <SubOrgsPageClient orgId={orgId} subOrgs={subOrgs} />;
}
