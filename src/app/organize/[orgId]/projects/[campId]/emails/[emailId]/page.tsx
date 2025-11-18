import { getServerApiClient } from 'core/api/server';
import { ZetkinEmail, ZetkinEmailStats } from 'utils/types/zetkin';
import EmailPageClient from './EmailPageClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    emailId: string;
  };
};

export default async function EmailPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const emailId = parseInt(params.emailId);

  const apiClient = await getServerApiClient();

  const email = await apiClient.get<ZetkinEmail>(
    `/api/orgs/${orgId}/emails/${emailId}`
  );

  const isTargeted = !!(email && email.target?.filter_spec?.length != 0);

  let stats: (ZetkinEmailStats & { id: number }) | null = null;
  if (isTargeted) {
    const statsData = await apiClient.get<ZetkinEmailStats>(
      `/api/orgs/${orgId}/emails/${emailId}/stats`
    );
    stats = { ...statsData, id: emailId };
  }

  return (
    <EmailPageClient
      email={email}
      emailId={emailId}
      isTargeted={isTargeted}
      orgId={orgId}
      stats={stats}
    />
  );
}
