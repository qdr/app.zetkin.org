'use client';

import { useEffect } from 'react';

import { allItemsLoaded } from 'features/views/store';
import { useAppDispatch } from 'core/hooks';
import ViewBrowser from 'features/views/components/ViewBrowser';
import { ZetkinView, ZetkinViewFolder } from 'features/views/components/types';

interface PeopleFoldersPageClientProps {
  folderId: number;
  folders: ZetkinViewFolder[];
  orgId: number;
  views: ZetkinView[];
}

export default function PeopleFoldersPageClient({
  folderId,
  folders,
  orgId,
  views,
}: PeopleFoldersPageClientProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(allItemsLoaded({ folders, views }));
  }, [folders, views, dispatch]);

  return <ViewBrowser basePath={`/organize/${orgId}/people`} folderId={folderId} />;
}
