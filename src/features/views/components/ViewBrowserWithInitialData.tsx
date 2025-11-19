'use client';

import { useEffect } from 'react';

import ViewBrowser from './ViewBrowser';
import { allItemsLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import { ViewTreeData } from 'pages/api/views/tree';

interface ViewBrowserWithInitialDataProps {
  basePath: string;
  folderId?: number | null;
  viewTree: ViewTreeData;
}

/**
 * Wrapper around ViewBrowser that pre-populates Redux store
 * with server-fetched view tree data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function ViewBrowserWithInitialData({
  basePath,
  folderId = null,
  viewTree,
}: ViewBrowserWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched view tree data
    dispatch(allItemsLoaded(viewTree));
  }, [viewTree, dispatch]);

  // Render the existing ViewBrowser which will use the hydrated store
  return <ViewBrowser basePath={basePath} folderId={folderId} />;
}
