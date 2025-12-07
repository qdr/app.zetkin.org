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

const ProjectOverviewPage: FC<Props> = ({ params }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ZUIText variant="headingSm" gutterBottom>
        Project Overview
      </ZUIText>
      <ZUIText variant="bodyMdRegular" color="secondary">
        Overview content will go here. This shows project statistics, recent activity, and key metrics.
      </ZUIText>

      <Box
        sx={{
          mt: 4,
          p: 4,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <ZUIText variant="bodyMdRegular" color="secondary">
          Project statistics and dashboard coming soon
        </ZUIText>
      </Box>
    </Container>
  );
};

export default ProjectOverviewPage;
