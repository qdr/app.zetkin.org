'use client';

import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import ActivitiesOverviewSkeleton from 'features/campaigns/components/ActivitiesOverviewSkeleton';
import CampaignsGrid from 'features/campaigns/components/CampaignsGrid';
import { useNumericRouteParams } from 'core/hooks';

const AllCampaignsSummaryPage = () => {
  const { orgId } = useNumericRouteParams();

  return (
    <>
      <Suspense fallback={<ActivitiesOverviewSkeleton />}>
        <ActivitiesOverview orgId={orgId} />
      </Suspense>

      <CampaignsGrid orgId={orgId} />
    </>
  );
};

export default AllCampaignsSummaryPage;
