'use client';

import { Box, useMediaQuery, useTheme } from '@mui/material';
import { FC, Suspense } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AllActivitiesList from '../components/AllActivitiesList';
import CurrentActivities from '../components/CurrentActivities';

const AllEventsPage: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={2}
        padding={isMobile ? 0 : 2}
        sx={{ width: '100%', overflow: 'hidden' }}
      >
        {/* Main feed - takes up most of the space */}
        <Box flex={isMobile ? '1' : '3'} minWidth={0}>
          <AllActivitiesList />
        </Box>

        {/* Current activities sidebar/bottom section */}
        <Box flex={isMobile ? '1' : '1'} minWidth={isMobile ? '100%' : '300px'}>
          <CurrentActivities />
        </Box>
      </Box>
    </Suspense>
  );
};

export default AllEventsPage;
