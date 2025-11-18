'use client';

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
