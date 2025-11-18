import { getServerApiClient } from 'core/api/server';
import { ZetkinEmail } from 'utils/types/zetkin';
import EmailComposePageClient from './EmailComposePageClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    emailId: string;
  };
};

export default async function EmailComposePage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const emailId = parseInt(params.emailId);

  const apiClient = await getServerApiClient();

  const email = await apiClient.get<ZetkinEmail>(
    `/api/orgs/${orgId}/emails/${emailId}`
  );

  return <EmailComposePageClient email={email} emailId={emailId} orgId={orgId} />;
}
