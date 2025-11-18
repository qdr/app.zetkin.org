'use client';

import { FC, Suspense } from 'react';

import AllEventsList from '../components/AllEventsList';
import AllEventsListSkeleton from '../components/AllEventsListSkeleton';

const AllEventsPage: FC = () => {
  return (
    <Suspense fallback={<AllEventsListSkeleton />}>
      <AllEventsList />
    </Suspense>
  );
};

export default AllEventsPage;
