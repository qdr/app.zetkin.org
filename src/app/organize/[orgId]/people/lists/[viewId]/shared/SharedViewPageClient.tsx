'use client';

import { useEffect } from 'react';

import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import { columnsLoaded, rowsLoaded, viewLoaded } from 'features/views/store';
import { useAppDispatch } from 'core/hooks';
import ViewDataTable from 'features/views/components/ViewDataTable';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from 'features/views/components/types';

interface SharedViewPageClientProps {
  columns: ZetkinViewColumn[];
  orgId: number;
  rows: ZetkinViewRow[];
  view: ZetkinView;
  viewId: number;
}

export default function SharedViewPageClient({
  columns,
  rows,
  view,
  viewId,
}: SharedViewPageClientProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(viewLoaded(view));
    dispatch(columnsLoaded([viewId, columns]));
    dispatch(rowsLoaded([viewId, rows]));
  }, [view, viewId, columns, rows, dispatch]);

  // Note: useViewAccessLevel hook doesn't exist in the codebase, defaulting to 'none'
  const accessLevel = 'none';
  const canConfigure = accessLevel === 'configure';

  return (
    <AccessLevelProvider accessLevel={accessLevel} isRestricted={true}>
      <ViewDataTable
        columns={columns}
        disableConfigure={!canConfigure}
        rows={rows}
        view={view}
      />
    </AccessLevelProvider>
  );
}
