'use client';

import { ReactNode, useEffect } from 'react';

import { campaignLoaded } from 'features/campaigns/store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinCampaign } from 'utils/types/zetkin';

interface CampaignCalendarClientProps {
  campaign: ZetkinCampaign;
  campId: number;
  children: ReactNode;
  orgId: number;
}

export default function CampaignCalendarClient({
  campaign,
  children,
}: CampaignCalendarClientProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(campaignLoaded(campaign));
  }, [campaign, dispatch]);

  return <>{children}</>;
}
