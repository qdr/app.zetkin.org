'use client';

import { FC } from 'react';
import { Box, Container } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

import ZUIText from 'zui/components/ZUIText';
import ZUIIcon from 'zui/components/ZUIIcon';

interface Props {
  params: {
    orgId: string;
    projectId: string;
  };
}

const ProjectSettingsPage: FC<Props> = ({ params }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ZUIText variant="headingSm" gutterBottom>
        Settings
      </ZUIText>
      <ZUIText variant="bodyMdRegular" color="secondary" sx={{ mb: 4 }}>
        Project configuration and settings
      </ZUIText>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <ZUIIcon icon={SettingsIcon} size="large" color="secondary" />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <ZUIText variant="headingSm" color="secondary" gutterBottom>
            Settings
          </ZUIText>
          <ZUIText variant="bodySmRegular" color="secondary">
            Project settings and configuration coming soon
          </ZUIText>
        </Box>
      </Box>
    </Container>
  );
};

export default ProjectSettingsPage;
