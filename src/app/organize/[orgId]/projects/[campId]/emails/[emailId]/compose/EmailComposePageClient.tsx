'use client';

import { useEffect } from 'react';

import EmailEditor from 'features/emails/components/EmailEditor';
import { emailLoaded } from 'features/emails/store';
import { useAppDispatch } from 'core/hooks';
import useDebounce from 'utils/hooks/useDebounce';
import useEmail from 'features/emails/hooks/useEmail';
import { ZetkinEmail } from 'utils/types/zetkin';

interface EmailComposePageClientProps {
  email: ZetkinEmail;
  emailId: number;
  orgId: number;
}

export default function EmailComposePageClient({
  email,
  emailId,
  orgId,
}: EmailComposePageClientProps) {
  const dispatch = useAppDispatch();
  const { updateEmail } = useEmail(orgId, emailId);

  useEffect(() => {
    dispatch(emailLoaded(email));
  }, [email, dispatch]);

  const debouncedUpdateEmail = useDebounce(
    async (email: Partial<ZetkinEmail>) => {
      updateEmail({
        ...email,
        locked: undefined,
      });
    },
    400
  );

  return (
    <EmailEditor
      email={email}
      onSave={(email) => {
        debouncedUpdateEmail(email);
      }}
    />
  );
}
