'use client';

import { FC, Suspense } from 'react';
import { Box } from '@mui/material';

import { ZetkinUser } from 'utils/types/zetkin';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import SettingsPageWithInitialData from 'features/home/components/SettingsPageWithInitialData';

interface Props {
  user: ZetkinUser;
}

const SettingsPageClient: FC<Props> = ({ user }) => {
  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height="90dvh"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      <SettingsPageWithInitialData key={user.id} user={user} />
    </Suspense>
  );
};

export default SettingsPageClient;
