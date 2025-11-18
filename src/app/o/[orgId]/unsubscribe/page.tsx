import { notFound } from 'next/navigation';

import { getServerApiClient } from 'core/api/server';
import UnsubscribePage from 'features/emails/pages/UnsubscribePage';
import { ZetkinOrganization } from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
  };
  searchParams: {
    unsub?: string;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const apiClient = await getServerApiClient();

  const unsubUrl = searchParams.unsub;
  if (!unsubUrl) {
    return notFound();
  }

  try {
    const org = await apiClient.get<ZetkinOrganization>(
      `/api/orgs/${params.orgId}`
    );

    return <UnsubscribePage org={org} unsubUrl={unsubUrl} />;
  } catch (err) {
    return notFound();
  }
}
