import { notFound } from 'next/navigation';

import { getServerApiClient } from 'core/api/server';
import { ZetkinOrganization } from 'utils/types/zetkin';
import JoinFormVerifiedPage from 'features/joinForms/components/JoinFormVerifiedPage';

type PageProps = {
  params: {
    orgId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const apiClient = await getServerApiClient();

  try {
    const org = await apiClient.get<ZetkinOrganization>(
      `/api/orgs/${params.orgId}`
    );

    return <JoinFormVerifiedPage org={org} />;
  } catch (err) {
    return notFound();
  }
}
