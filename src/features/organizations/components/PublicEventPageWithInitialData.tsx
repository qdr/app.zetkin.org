'use client';

import { useEffect } from 'react';

import { PublicEventPage } from '../pages/PublicEventPage';
import { eventLoaded } from 'features/events/store';
import { userEventsLoaded } from 'features/events/store';
import { userMembershipsLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinEvent, ZetkinMembership } from 'utils/types/zetkin';
import { ZetkinEventWithStatus } from 'features/home/types';

interface PublicEventPageWithInitialDataProps {
  event: ZetkinEvent;
  eventId: number;
  memberships: ZetkinMembership[];
  myEvents: ZetkinEventWithStatus[];
  orgId: number;
}

/**
 * Wrapper around PublicEventPage that pre-populates Redux store
 * with server-fetched event data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function PublicEventPageWithInitialData({
  event,
  eventId,
  memberships,
  myEvents,
  orgId,
}: PublicEventPageWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched data
    dispatch(eventLoaded(event));
    if (myEvents.length > 0) {
      dispatch(userEventsLoaded(myEvents));
    }
    if (memberships.length > 0) {
      dispatch(userMembershipsLoaded(memberships));
    }
  }, [event, myEvents, memberships, dispatch]);

  // Render the existing PublicEventPage which will use the hydrated store
  return <PublicEventPage eventId={eventId} orgId={orgId} />;
}
