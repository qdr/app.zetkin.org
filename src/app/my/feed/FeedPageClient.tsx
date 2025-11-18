'use client';

import { FC, Suspense } from 'react';
import { Box } from '@mui/material';

import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import AllEventsListWithInitialData from 'features/home/components/AllEventsListWithInitialData';

interface Props {
  allEvents: ZetkinEvent[];
  userEvents: ZetkinEventWithStatus[];
}

const FeedPageClient: FC<Props> = ({ allEvents, userEvents }) => {
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
      <AllEventsListWithInitialData
        allEvents={allEvents}
        userEvents={userEvents}
      />
    </Suspense>
  );
};

export default FeedPageClient;
