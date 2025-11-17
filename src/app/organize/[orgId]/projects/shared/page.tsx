'use client';

import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';

const SharedSummaryPage = () => {
  const { orgId } = useNumericRouteParams();
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  return (
    <>
      <Suspense>
        <ActivitiesOverview isShared orgId={orgId} />
      </Suspense>
    </>
  );
};

export default SharedSummaryPage;
