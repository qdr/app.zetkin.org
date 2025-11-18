'use client';

import { Suspense } from 'react';

import MyActivitiesListSkeleton from 'features/home/components/MyActivitiesListSkeleton';
import MyActivitiesListWithInitialData from 'features/home/components/MyActivitiesListWithInitialData';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

interface HomePageClientProps {
  areaAssignments: ZetkinAreaAssignment[];
  callAssignments: ZetkinCallAssignment[];
  events: ZetkinEventWithStatus[];
}

export default function HomePageClient({
  areaAssignments,
  callAssignments,
  events,
}: HomePageClientProps) {
  return (
    <Suspense fallback={<MyActivitiesListSkeleton />}>
      <MyActivitiesListWithInitialData
        areaAssignments={areaAssignments}
        callAssignments={callAssignments}
        events={events}
      />
    </Suspense>
  );
}
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

const MyHomePageClient: FC<Props> = ({
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

export default MyHomePageClient;
