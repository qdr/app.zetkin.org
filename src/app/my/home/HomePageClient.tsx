'use client';

import { FC } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

// Dynamic import to avoid hydration issues
const HomePage = dynamic(() => import('features/home/pages/HomePage'), {
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
  ssr: false,
});

const HomePageClient: FC = () => {
  return <HomePage />;
};

export default HomePageClient;
