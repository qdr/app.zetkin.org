'use client';

import EmailEditor from 'features/emails/components/EmailEditor';
import EmailLayout from 'features/emails/layout/EmailLayout';
import useEmail from 'features/emails/hooks/useEmail';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import ZUIFuture from 'zui/ZUIFuture';

export const metadata = {
  title: 'Compose Email - Zetkin',
};

export default function EmailComposePage() {
  const onServer = useServerSide();
  const params = useParams();
  const orgId = parseInt(params.orgId as string);
  const emailId = parseInt(params.emailId as string);
  const { data: email, updateEmail } = useEmail(orgId, emailId);

  if (onServer || !email) {
    return null;
  }

  return (
    <EmailLayout fixedHeight>
      <EmailEditor email={email} onSave={updateEmail} />
    </EmailLayout>
  );
}
