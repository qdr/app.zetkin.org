import { notFound } from 'next/navigation';

import { getServerApiClient } from 'core/api/server';
import UnsubscribedPage from 'features/emails/pages/UnsubscribedPage';
import { ZetkinOrganization } from 'utils/types/zetkin';

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

    return <UnsubscribedPage org={org} />;
  } catch (err) {
    return notFound();
  }
}
