'use client';

import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import CallAssignmentStatusCards from 'features/callAssignments/components/CallAssignmentStatusCards';
import CallAssignmentTargets from 'features/callAssignments/components/CallAssignmentTargets';
import { callAssignmentLoaded, statsLoaded } from 'features/callAssignments/store';
import {
  CallAssignmentStats,
} from 'features/callAssignments/hooks/useCallAssignmentStats';
import messageIds from 'features/callAssignments/l10n/messageIds';
import { Msg } from 'core/i18n';
import { useAppDispatch } from 'core/hooks';
import useCallAssignmentStats from 'features/callAssignments/hooks/useCallAssignmentStats';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

interface CallAssignmentPageClientProps {
  callAssId: number;
  callAssignment: ZetkinCallAssignment;
  isTargeted: boolean;
  orgId: number;
  stats: (CallAssignmentStats & { id: number }) | null;
}

export default function CallAssignmentPageClient({
  callAssId,
  callAssignment,
  orgId,
  stats,
}: CallAssignmentPageClientProps) {
  const dispatch = useAppDispatch();

  // Use the original hook to get calculated stats for the status bar
  const { statusBarStatsList } = useCallAssignmentStats(orgId, callAssId);

  useEffect(() => {
    dispatch(callAssignmentLoaded(callAssignment));
    if (stats) {
      dispatch(statsLoaded(stats));
    }
  }, [callAssignment, stats, dispatch]);

  return (
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
  );
}
