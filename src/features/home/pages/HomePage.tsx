'use client';

import { FC, Suspense } from 'react';

import MyActivitiesList from '../components/MyActivitiesList';
import MyActivitiesListSkeleton from '../components/MyActivitiesListSkeleton';

const HomePage: FC = () => {
  return (
    <Suspense fallback={<MyActivitiesListSkeleton />}>
      <MyActivitiesList />
    </Suspense>
  );
};

export default HomePage;
