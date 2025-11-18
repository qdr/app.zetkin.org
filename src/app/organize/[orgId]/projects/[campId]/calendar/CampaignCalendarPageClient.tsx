'use client';

import { FC } from 'react';

import Calendar from 'features/calendar/components';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useCampaign from 'features/campaigns/hooks/useCampaign';

interface CampaignCalendarPageClientProps {
  orgId: number;
  campId: number;
}

const CampaignCalendarPageClient: FC<CampaignCalendarPageClientProps> = ({ orgId, campId }) => {
  const { campaignFuture } = useCampaign(orgId, campId);
  const campaign = campaignFuture.data;

  return (
    <SingleCampaignLayout fixedHeight>
      <Calendar />
    </SingleCampaignLayout>
  );
};

export default CampaignCalendarPageClient;
