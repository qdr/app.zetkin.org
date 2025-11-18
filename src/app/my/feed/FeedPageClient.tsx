'use client';

import { Suspense } from 'react';

import AllEventsListSkeleton from 'features/home/components/AllEventsListSkeleton';
import AllEventsListWithInitialData from 'features/home/components/AllEventsListWithInitialData';
import { ZetkinEventWithStatus } from 'features/home/types';

interface FeedPageClientProps {
  events: ZetkinEventWithStatus[];
}

export default function FeedPageClient({ events }: FeedPageClientProps) {
  return (
    <Suspense fallback={<AllEventsListSkeleton />}>
      <AllEventsListWithInitialData events={events} />
    </Suspense>
  );
}
