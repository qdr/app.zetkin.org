'use client';

import { useEffect, useMemo } from 'react';
import { Box } from '@mui/material';

import EmailTargets from 'features/emails/components/EmailTargets';
import EmailTargetsBlocked from 'features/emails/components/EmailTargetsBlocked';
import EmailTargetsReady from 'features/emails/components/EmailTargetsReady';
import { EmailState } from 'features/emails/hooks/useEmailState';
import { emailLoaded, statsLoaded } from 'features/emails/store';
import useEmail from 'features/emails/hooks/useEmail';
import { useAppDispatch } from 'core/hooks';
import useEmailStats from 'features/emails/hooks/useEmailStats';
import { ZetkinEmail, ZetkinEmailStats } from 'utils/types/zetkin';

interface EmailPageClientProps {
  email: ZetkinEmail;
  emailId: number;
  isTargeted: boolean;
  orgId: number;
  stats: (ZetkinEmailStats & { id: number }) | null;
}

export default function EmailPageClient({
  email,
  emailId,
  isTargeted,
  orgId,
  stats,
}: EmailPageClientProps) {
  const dispatch = useAppDispatch();

  // Use the original hooks to get mutation functions
  const { mutating, updateEmail, updateTargets } = useEmail(orgId, emailId);
  const { numBlocked, readyTargets, lockedReadyTargets } = useEmailStats(
    orgId,
    emailId
  );

  useEffect(() => {
    dispatch(emailLoaded(email));
    if (stats) {
      dispatch(statsLoaded(stats));
    }
  }, [email, stats, dispatch]);

  const emailState = useMemo(() => {
    if (!email) {
      return EmailState.UNKNOWN;
    }

    if (email.published) {
      const sendingDate = new Date(email.published);
      const now = new Date();

      if (sendingDate > now) {
        return EmailState.SCHEDULED;
      } else {
        return EmailState.SENT;
      }
    } else {
      return EmailState.DRAFT;
    }
  }, [email]);

  const isLocked = !!email.locked;

  return (
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
          targets={stats?.num_target_matches || 0}
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
  );
}
