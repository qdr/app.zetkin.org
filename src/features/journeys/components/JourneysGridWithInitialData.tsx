'use client';

import { useEffect } from 'react';

import JourneysGrid from './JourneysGrid';
import { journeysLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinJourney } from 'utils/types/zetkin';

interface JourneysGridWithInitialDataProps {
  journeys: ZetkinJourney[];
  orgId: number;
}

/**
 * Wrapper around JourneysGrid that pre-populates Redux store
 * with server-fetched journeys data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function JourneysGridWithInitialData({
  journeys,
  orgId,
}: JourneysGridWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched journeys data
    dispatch(journeysLoaded(journeys));
  }, [journeys, dispatch]);

  // Render the existing JourneysGrid which will use the hydrated store
  return <JourneysGrid orgId={orgId} />;
}
