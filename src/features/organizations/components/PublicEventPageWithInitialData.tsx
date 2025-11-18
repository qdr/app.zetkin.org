'use client';

import { FC, useEffect } from 'react';

import { ZetkinEvent } from 'utils/types/zetkin';
import { useAppDispatch } from 'core/hooks';
import { eventsLoaded } from 'features/events/store';
import { PublicEventPage } from '../pages/PublicEventPage';

interface Props {
  event: ZetkinEvent;
  eventId: number;
  orgId: number;
}

const PublicEventPageWithInitialData: FC<Props> = ({
  event,
  eventId,
  orgId,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(eventsLoaded([event]));
  }, [event, dispatch]);

  return <PublicEventPage eventId={eventId} orgId={orgId} />;
};

export default PublicEventPageWithInitialData;
