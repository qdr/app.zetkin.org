'use client';

import { FC, useEffect } from 'react';

import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';
import { useAppDispatch } from 'core/hooks';
import { campaignLoaded } from '../store';
import { campaignEventsLoaded, userEventsLoaded } from 'features/events/store';
import PublicProjPage from '../pages/PublicProjPage';

interface Props {
  campaign: ZetkinCampaign;
  campaignEvents: ZetkinEvent[];
  campId: number;
  orgId: number;
  userEvents: ZetkinEventWithStatus[];
}

const PublicProjPageWithInitialData: FC<Props> = ({
  campaign,
  campaignEvents,
  campId,
  orgId,
  userEvents,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(campaignLoaded(campaign));
    dispatch(campaignEventsLoaded([campId, campaignEvents]));
    dispatch(userEventsLoaded(userEvents));
  }, [campaign, campaignEvents, campId, userEvents, dispatch]);

  return <PublicProjPage campId={campId} orgId={orgId} />;
};

export default PublicProjPageWithInitialData;
