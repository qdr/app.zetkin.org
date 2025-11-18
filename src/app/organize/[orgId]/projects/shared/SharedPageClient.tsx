'use client';

import { FC } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import SharedActivitiesLayout from 'features/campaigns/layout/SharedActivitiesLayout';

interface SharedPageClientProps {
  orgId: string;
}

const SharedPageClient: FC<SharedPageClientProps> = ({ orgId }) => {
  const parsedOrgId = parseInt(orgId);

  return (
    <SharedActivitiesLayout orgId={orgId}>
      <ActivitiesOverview isShared orgId={parsedOrgId} />
    </SharedActivitiesLayout>
  );
};

export default SharedPageClient;
