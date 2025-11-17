'use client';

import { Grid } from '@mui/material';

import CallerInstructions from 'features/callAssignments/components/CallerInstructions';
import ConversationSettings from 'features/callAssignments/components/ConversationSettings';
import { useNumericRouteParams } from 'core/hooks';

const ConversationPage = () => {
  const { orgId, callAssId } = useNumericRouteParams();

  return (
    <>
            <Grid container spacing={2}>
        <Grid size={{ lg: 8, md: 6, sm: 12 }}>
          <CallerInstructions assignmentId={callAssId} orgId={orgId} />
        </Grid>
        <Grid size={{ lg: 4, md: 6, sm: 12 }}>
          <ConversationSettings assignmentId={callAssId} orgId={orgId} />
        </Grid>
      </Grid>
    </>
  );
};

export default ConversationPage;
