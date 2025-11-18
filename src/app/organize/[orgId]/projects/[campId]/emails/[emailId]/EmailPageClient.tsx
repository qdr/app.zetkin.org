'use client';

import { FC } from 'react';
import { Box } from '@mui/material';

import EmailLayout from 'features/emails/layout/EmailLayout';
import EmailTargets from 'features/emails/components/EmailTargets';
import EmailTargetsBlocked from 'features/emails/components/EmailTargetsBlocked';
import EmailTargetsReady from 'features/emails/components/EmailTargetsReady';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailState from 'features/emails/hooks/useEmailState';
import useEmailStats from 'features/emails/hooks/useEmailStats';

interface EmailPageClientProps {
  orgId: number;
  emailId: number;
}

const EmailPageClient: FC<EmailPageClientProps> = ({ orgId, emailId }) => {
  const {
    data: email,
    isTargeted,
    mutating,
    updateEmail,
    updateTargets,
  } = useEmail(orgId, emailId);
  const { numBlocked, numTargetMatches, readyTargets, lockedReadyTargets } =
    useEmailStats(orgId, emailId);
  const emailState = useEmailState(orgId, emailId);

  if (!email) {
    return null;
  }
  const isLocked = !!email.locked;

  return (
    <EmailLayout>
      <Box>
        <Box display="flex" flexDirection="column">
          <EmailTargets
            email={email}
            isLoading={mutating.includes('locked')}
            isLocked={isLocked}
            isTargeted={isTargeted}
            onToggleLocked={() => updateEmail({ locked: !email.locked })}
            readyTargets={readyTargets}
            state={emailState}
            targets={numTargetMatches}
            updateTargets={updateTargets}
          />
          <Box display="flex" gap={2} paddingTop={2}>
            <Box flex={1}>
              <EmailTargetsBlocked
                blacklisted={numBlocked.blacklisted}
                missingEmail={numBlocked.noEmail}
                total={numBlocked.any}
                unsubscribed={numBlocked.unsubscribed}
              />
            </Box>
            <Box flex={1}>
              <EmailTargetsReady
                lockedReadyTargets={lockedReadyTargets}
                missingEmail={numBlocked.noEmail}
                readyTargets={readyTargets}
                state={emailState}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </EmailLayout>
  );
};

export default EmailPageClient;
