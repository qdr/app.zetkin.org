'use client';

import { useEffect } from 'react';

import CampaignsGrid from './CampaignsGrid';
import { campaignsLoaded } from '../store';
import { surveysLoaded } from 'features/surveys/store';
import { generateRandomColor } from 'utils/colorUtils';
import { useAppDispatch } from 'core/hooks';
import { ZetkinCampaign, ZetkinSurvey } from 'utils/types/zetkin';

interface CampaignsGridWithInitialDataProps {
  campaigns: ZetkinCampaign[];
  orgId: number;
  surveys: ZetkinSurvey[];
}

/**
 * Wrapper around CampaignsGrid that pre-populates Redux store
 * with server-fetched data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function CampaignsGridWithInitialData({
  campaigns,
  orgId,
  surveys,
}: CampaignsGridWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched data
    // Add color to campaigns (matching the hook's behavior)
    const campaignsWithColor = campaigns.map((campaign) => ({
      ...campaign,
      color: generateRandomColor(campaign.id.toString()),
    }));

    dispatch(campaignsLoaded(campaignsWithColor));
    dispatch(surveysLoaded(surveys));
  }, [campaigns, surveys, dispatch]);

  // Render the existing CampaignsGrid which will use the hydrated store
  return <CampaignsGrid orgId={orgId} />;
}
