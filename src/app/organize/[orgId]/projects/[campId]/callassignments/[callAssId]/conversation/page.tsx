import { Grid } from '@mui/material';

import CallerInstructions from 'features/callAssignments/components/CallerInstructions';
import ConversationSettings from 'features/callAssignments/components/ConversationSettings';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    callAssId: string;
  };
};

export default function ConversationPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const callAssId = parseInt(params.callAssId);

  return (
    <Grid container spacing={2}>
      <Grid size={{ lg: 8, md: 6, sm: 12 }}>
        <CallerInstructions assignmentId={callAssId} orgId={orgId} />
      </Grid>
      <Grid size={{ lg: 4, md: 6, sm: 12 }}>
        <ConversationSettings assignmentId={callAssId} orgId={orgId} />
      </Grid>
    </Grid>
  );
}
