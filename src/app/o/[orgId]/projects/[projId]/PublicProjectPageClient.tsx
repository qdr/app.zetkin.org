'use client';

import PublicProjectPageWithInitialData from 'features/campaigns/components/PublicProjectPageWithInitialData';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

interface PublicProjectPageClientProps {
  campaign: ZetkinCampaign;
  campaignEvents: ZetkinEvent[];
  campId: number;
  myEvents: ZetkinEventWithStatus[];
  orgId: number;
}

export default function PublicProjectPageClient({
  campaign,
  campaignEvents,
  campId,
  myEvents,
  orgId,
}: PublicProjectPageClientProps) {
  return (
    <PublicProjectPageWithInitialData
      campaign={campaign}
      campaignEvents={campaignEvents}
      campId={campId}
      myEvents={myEvents}
      orgId={orgId}
    />
  );
}
