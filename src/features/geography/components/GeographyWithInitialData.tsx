'use client';

import { useEffect } from 'react';

import GLGeographyMap from './GLGeographyMap';
import { areasLoaded } from 'features/areas/store';
import { Zetkin2Area } from 'features/areas/types';
import { useAppDispatch } from 'core/hooks';

interface GeographyWithInitialDataProps {
  areas: Zetkin2Area[];
  orgId: number;
}

/**
 * Wrapper around Geography Map that pre-populates Redux store
 * with server-fetched areas data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function GeographyWithInitialData({
  areas,
  orgId,
}: GeographyWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched areas data
    dispatch(areasLoaded(areas));
  }, [areas, dispatch]);

  return <GLGeographyMap areas={areas} orgId={orgId} />;
}
