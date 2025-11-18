'use client';

import { useEffect } from 'react';

import PublicProjPage from '../pages/PublicProjPage';
import { campaignLoaded } from '../store';
import { campaignEventsLoaded } from 'features/events/store';
import { userEventsLoaded } from 'features/events/store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

interface PublicProjectPageWithInitialDataProps {
  campaign: ZetkinCampaign;
  campaignEvents: ZetkinEvent[];
  campId: number;
  myEvents: ZetkinEventWithStatus[];
  orgId: number;
}

/**
 * Wrapper around PublicProjPage that pre-populates Redux store
 * with server-fetched campaign and events data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function PublicProjectPageWithInitialData({
  campaign,
  campaignEvents,
  campId,
  myEvents,
  orgId,
}: PublicProjectPageWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched data
    dispatch(campaignLoaded(campaign));
    dispatch(campaignEventsLoaded([campId, campaignEvents]));
    if (myEvents.length > 0) {
      dispatch(userEventsLoaded(myEvents));
    }
  }, [campaign, campaignEvents, campId, myEvents, dispatch]);

  // Render the existing PublicProjPage which will use the hydrated store
  return <PublicProjPage campId={campId} orgId={orgId} />;
}
