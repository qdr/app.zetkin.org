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
