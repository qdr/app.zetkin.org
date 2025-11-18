'use client';

import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import ActivitiesOverviewSkeleton from 'features/campaigns/components/ActivitiesOverviewSkeleton';
import CampaignsGrid from 'features/campaigns/components/CampaignsGrid';

interface ProjectsPageClientProps {
  orgId: number;
}

export default function ProjectsPageClient({ orgId }: ProjectsPageClientProps) {
  return (
    <>
      <Suspense fallback={<ActivitiesOverviewSkeleton />}>
        <ActivitiesOverview orgId={orgId} />
      </Suspense>

      <CampaignsGrid orgId={orgId} />
    </>
  );
}
