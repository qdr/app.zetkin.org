'use client';

import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentStatusCards from 'features/callAssignments/components/CallAssignmentStatusCards';
import CallAssignmentTargets from 'features/callAssignments/components/CallAssignmentTargets';
import messageIds from 'features/callAssignments/l10n/messageIds';
import { Msg } from 'core/i18n';
import useCallAssignmentStats from 'features/callAssignments/hooks/useCallAssignmentStats';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

interface CallAssignmentPageClientProps {
  orgId: number;
  callAssId: number;
}

const CallAssignmentPageClient: FC<CallAssignmentPageClientProps> = ({
  orgId,
  callAssId,
}) => {
  const { statusBarStatsList } = useCallAssignmentStats(orgId, callAssId);

  return (
    <CallAssignmentLayout>
      <Box>
        <Box mb={2}>
          <CallAssignmentTargets assignmentId={callAssId} orgId={orgId} />
        </Box>
        <Box mb={2}>
          <Typography variant="h3">
            <Msg id={messageIds.statusSectionTitle} />
          </Typography>
        </Box>
        <ZUIStackedStatusBar values={statusBarStatsList} />
        <Box mt={2}>
          <CallAssignmentStatusCards assignmentId={callAssId} orgId={orgId} />
        </Box>
      </Box>
    </CallAssignmentLayout>
  );
};

export default CallAssignmentPageClient;
