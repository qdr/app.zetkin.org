'use client';

import { FC } from 'react';
import { Grid } from '@mui/material';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallerInstructions from 'features/callAssignments/components/CallerInstructions';
import ConversationSettings from 'features/callAssignments/components/ConversationSettings';

interface ConversationPageClientProps {
  orgId: number;
  callAssId: number;
}

const ConversationPageClient: FC<ConversationPageClientProps> = ({
  orgId,
  callAssId,
}) => {
  return (
    <CallAssignmentLayout>
      <Grid container spacing={2}>
        <Grid size={{ lg: 8, md: 6, sm: 12 }}>
          <CallerInstructions assignmentId={callAssId} orgId={orgId} />
        </Grid>
        <Grid size={{ lg: 4, md: 6, sm: 12 }}>
          <ConversationSettings assignmentId={callAssId} orgId={orgId} />
        </Grid>
      </Grid>
    </CallAssignmentLayout>
  );
};

export default ConversationPageClient;
