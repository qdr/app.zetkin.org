'use client';

import { FC } from 'react';
import { Box, Container } from '@mui/material';

import ZUIText from 'zui/components/ZUIText';

interface Props {
  params: {
    orgId: string;
    projectId: string;
  };
}

const ProjectCallsPage: FC<Props> = ({ params }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ZUIText variant="headingSm" gutterBottom>
        Calls
      </ZUIText>
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <p>No call campaigns in this project</p>
      </Box>
    </Container>
  );
};

export default ProjectCallsPage;
