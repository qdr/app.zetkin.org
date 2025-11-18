'use client';

import { FC } from 'react';

import EmailEditor from 'features/emails/components/EmailEditor';
import EmailLayout from 'features/emails/layout/EmailLayout';
import useDebounce from 'utils/hooks/useDebounce';
import useEmail from 'features/emails/hooks/useEmail';
import { ZetkinEmail } from 'utils/types/zetkin';

interface EmailComposePageClientProps {
  orgId: number;
  emailId: number;
}

const EmailComposePageClient: FC<EmailComposePageClientProps> = ({ orgId, emailId }) => {
  const { data: email, updateEmail } = useEmail(orgId, emailId);

  const debouncedUpdateEmail = useDebounce(
    async (email: Partial<ZetkinEmail>) => {
      updateEmail({
        ...email,
        locked: undefined,
      });
    },
    400
  );

  if (!email) {
    return null;
  }

  return (
    <EmailLayout fixedHeight>
      <EmailEditor
        email={email}
        onSave={(email) => {
          debouncedUpdateEmail(email);
        }}
      />
    </EmailLayout>
  );
};

export default EmailComposePageClient;
