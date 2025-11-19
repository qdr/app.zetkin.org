'use client';

import { FC } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

import { ZetkinUser } from 'utils/types/zetkin';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

interface Props {
  user: ZetkinUser;
}

const SettingsPageWithInitialData = dynamic(
  () => import('features/home/components/SettingsPageWithInitialData'),
  {
    ssr: false,
    loading: () => (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        height="90dvh"
        justifyContent="center"
      >
        <ZUILogoLoadingIndicator />
      </Box>
    ),
  }
);

const SettingsPageClient: FC<Props> = ({ user }) => {
  return <SettingsPageWithInitialData user={user} />;
};

export default SettingsPageClient;
