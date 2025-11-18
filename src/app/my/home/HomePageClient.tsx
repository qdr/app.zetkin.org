'use client';

import { FC, Suspense } from 'react';
import { Box } from '@mui/material';

import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import MyActivitiesListWithInitialData from 'features/home/components/MyActivitiesListWithInitialData';

interface Props {
  areaAssignments: ZetkinAreaAssignment[];
  callAssignments: ZetkinCallAssignment[];
  userEvents: ZetkinEventWithStatus[];
}

const HomePageClient: FC<Props> = ({
  areaAssignments,
  callAssignments,
  userEvents,
}) => {
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
      <MyActivitiesListWithInitialData
        areaAssignments={areaAssignments}
        callAssignments={callAssignments}
        userEvents={userEvents}
      />
    </Suspense>
  );
};

export default HomePageClient;
