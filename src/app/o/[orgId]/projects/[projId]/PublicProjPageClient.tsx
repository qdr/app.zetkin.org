'use client';

import { FC } from 'react';

import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import PublicProjPageWithInitialData from 'features/campaigns/components/PublicProjPageWithInitialData';

interface Props {
  campaign: ZetkinCampaign;
  campaignEvents: ZetkinEvent[];
  campId: number;
  orgId: number;
  userEvents: ZetkinEventWithStatus[];
}

const PublicProjPageClient: FC<Props> = ({
  campaign,
  campaignEvents,
  campId,
  orgId,
  userEvents,
}) => {
  return (
    <PublicProjPageWithInitialData
      campaign={campaign}
      campaignEvents={campaignEvents}
      campId={campId}
      orgId={orgId}
      userEvents={userEvents}
    />
  );
};

export default PublicProjPageClient;
