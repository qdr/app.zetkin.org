'use client';

import { Box, Typography } from '@mui/material';

import CallAssignmentStatusCards from 'features/callAssignments/components/CallAssignmentStatusCards';
import CallAssignmentTargets from 'features/callAssignments/components/CallAssignmentTargets';
import messageIds from 'features/callAssignments/l10n/messageIds';
import { Msg } from 'core/i18n';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';
import useCallAssignmentStats from 'features/callAssignments/hooks/useCallAssignmentStats';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';

const AssignmentPage = () => {
  const { orgId, callAssId } = useNumericRouteParams();
  const { data: callAssignment } = useCallAssignment(orgId, callAssId);
  const { statusBarStatsList } = useCallAssignmentStats(orgId, callAssId);

  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  return (
    <>
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
    </>
  );
};

export default AssignmentPage;
