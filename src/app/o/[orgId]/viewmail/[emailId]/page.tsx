import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { getServerApiClient } from 'core/api/server';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/emails/l10n/messageIds';
import PublicEmailPage from 'features/emails/pages/PublicEmailPage';
import renderEmailHtml from 'features/emails/utils/rendering/renderEmailHtml';
import { ZetkinEmail } from 'utils/types/zetkin';

type PageProps = {
  params: {
    emailId: string;
    orgId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { emailId, orgId } = params;

  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getServerMessages(lang, messageIds);
  const apiClient = await getServerApiClient();

  try {
    const email = await apiClient.get<ZetkinEmail>(
      `/api/orgs/${orgId}/emails/${emailId}`
    );

    const htmlOutput = renderEmailHtml(email.content, messages);

    return <PublicEmailPage email={email} htmlOutput={htmlOutput} />;
  } catch (err) {
    return notFound();
  }
}
