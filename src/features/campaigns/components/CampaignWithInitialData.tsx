'use client';

import { ReactNode, useEffect } from 'react';

import { campaignLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinCampaign } from 'utils/types/zetkin';

interface CampaignWithInitialDataProps {
  campaign: ZetkinCampaign;
  children: ReactNode;
}

/**
 * Wrapper that pre-populates Redux store with server-fetched campaign data
 * for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function CampaignWithInitialData({
  campaign,
  children,
}: CampaignWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched campaign data
    dispatch(campaignLoaded(campaign));
  }, [campaign, dispatch]);

  // Render children which will use the hydrated store
  return <>{children}</>;
}
