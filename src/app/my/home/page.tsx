import { Suspense } from 'react';
import { Box } from '@mui/material';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import HomePage from 'features/home/pages/HomePage';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

export default async function Page() {
  await redirectIfLoginNeeded();

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
      <HomePage />
    </Suspense>
  );
}
