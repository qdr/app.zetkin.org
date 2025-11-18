import { getServerApiClient } from 'core/api/server';
import { ZetkinEmail } from 'utils/types/zetkin';
import EmailInsightsPageClient from './EmailInsightsPageClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    emailId: string;
  };
};

export default async function EmailInsightsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const emailId = parseInt(params.emailId);

  const apiClient = await getServerApiClient();

  const [email, emails] = await Promise.all([
    apiClient.get<ZetkinEmail>(`/api/orgs/${orgId}/emails/${emailId}`),
    apiClient.get<ZetkinEmail[]>(`/api/orgs/${orgId}/emails`),
  ]);

  return (
    <EmailInsightsPageClient
      email={email}
      emailId={emailId}
      emails={emails}
      orgId={orgId}
    />
  );
}
