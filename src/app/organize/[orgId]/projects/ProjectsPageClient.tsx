'use client';

import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import ActivitiesOverviewSkeleton from 'features/campaigns/components/ActivitiesOverviewSkeleton';
import CampaignsGridWithInitialData from 'features/campaigns/components/CampaignsGridWithInitialData';
import { ZetkinCampaign, ZetkinSurvey } from 'utils/types/zetkin';

interface ProjectsPageClientProps {
  campaigns: ZetkinCampaign[];
  orgId: number;
  surveys: ZetkinSurvey[];
}

export default function ProjectsPageClient({
  campaigns,
  orgId,
  surveys,
}: ProjectsPageClientProps) {
  return (
    <>
      <Suspense fallback={<ActivitiesOverviewSkeleton />}>
        <ActivitiesOverview orgId={orgId} />
      </Suspense>

      <CampaignsGridWithInitialData
        campaigns={campaigns}
        orgId={orgId}
        surveys={surveys}
      />
    </>
  );
}
