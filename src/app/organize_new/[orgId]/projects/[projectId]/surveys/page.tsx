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

const ProjectSurveysPage: FC<Props> = ({ params }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ZUIText variant="headingSm" gutterBottom>
        Surveys
      </ZUIText>
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <p>No surveys in this project</p>
      </Box>
    </Container>
  );
};

export default ProjectSurveysPage;
