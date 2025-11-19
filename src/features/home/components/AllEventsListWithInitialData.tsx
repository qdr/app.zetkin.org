'use client';

<<<<<<< HEAD
import { useEffect } from 'react';

import AllEventsList from './AllEventsList';
import { allEventsLoaded, userEventsLoaded } from 'features/events/store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinEventWithStatus } from '../types';

interface AllEventsListWithInitialDataProps {
  events: ZetkinEventWithStatus[];
}

/**
 * Wrapper around AllEventsList that pre-populates Redux store
 * with server-fetched events data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function AllEventsListWithInitialData({
  events,
}: AllEventsListWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched events data
    // Separate user events from all events
    const userEvents = events.filter((e) => e.status !== null);
    const allEvents = events.map(({ status, ...event }) => event);

    dispatch(allEventsLoaded(events));
    dispatch(userEventsLoaded(userEvents));
  }, [events, dispatch]);

  // Render the existing AllEventsList which will use the hydrated store
  return <AllEventsList />;
}
=======
import { FC, useEffect } from 'react';

import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from '../types';
import { useAppDispatch } from 'core/hooks';
import { allEventsLoaded, userEventsLoaded } from 'features/events/store';
import sortEventsByStartTime from 'features/events/utils/sortEventsByStartTime';
import AllEventsList from './AllEventsList';

interface Props {
  allEvents: ZetkinEvent[];
  userEvents: ZetkinEventWithStatus[];
}

const AllEventsListWithInitialData: FC<Props> = ({
  allEvents,
  userEvents,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sorted = allEvents.sort(sortEventsByStartTime);
    dispatch(allEventsLoaded(sorted));
    dispatch(userEventsLoaded(userEvents));
  }, [allEvents, userEvents, dispatch]);

  return <AllEventsList />;
};

export default AllEventsListWithInitialData;
>>>>>>> 44bc9c466da9b5e96bcb7cabdc3ad91c664aac94
