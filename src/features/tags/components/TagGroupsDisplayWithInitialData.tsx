'use client';

import { useEffect } from 'react';

import TagGroupsDisplay from './TagGroupsDisplay';
import { tagGroupsLoaded, tagsLoaded } from '../store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinTag } from 'utils/types/zetkin';

interface TagGroupsDisplayWithInitialDataProps {
  orgId: number;
  onTagClick: (tag: ZetkinTag) => void;
  tagGroups: ZetkinTag[];
  tags: ZetkinTag[];
}

/**
 * Wrapper around TagGroupsDisplay that pre-populates Redux store
 * with server-fetched tag groups and tags data for faster initial render.
 *
 * This is part of the Level 2 Server Component optimization.
 */
export default function TagGroupsDisplayWithInitialData({
  orgId,
  onTagClick,
  tagGroups,
  tags,
}: TagGroupsDisplayWithInitialDataProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate Redux store with server-fetched tag groups and tags data
    dispatch(tagGroupsLoaded(tagGroups));
    dispatch(tagsLoaded(tags));
  }, [tagGroups, tags, dispatch]);

  // Render the existing TagGroupsDisplay which will use the hydrated store
  return <TagGroupsDisplay orgId={orgId} onTagClick={onTagClick} />;
}
