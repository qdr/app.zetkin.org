'use client';

import EmailEditor from 'features/emails/components/EmailEditor';
import useDebounce from 'utils/hooks/useDebounce';
import useEmail from 'features/emails/hooks/useEmail';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { ZetkinEmail } from 'utils/types/zetkin';

const EmailPage = () => {
  const { orgId, emailId } = useNumericRouteParams();
  const { data: email, updateEmail } = useEmail(orgId, emailId);
  const onServer = useServerSide();

  const debouncedUpdateEmail = useDebounce(
    async (email: Partial<ZetkinEmail>) => {
      updateEmail({
        ...email,
        locked: undefined,
      });
    },
    400
  );

  if (onServer) {
    return null;
  }

  if (!email) {
    return null;
  }

  return (
    <EmailEditor
      email={email}
      onSave={(email) => {
        debouncedUpdateEmail(email);
      }}
    />
  );
};

export default EmailPage;
