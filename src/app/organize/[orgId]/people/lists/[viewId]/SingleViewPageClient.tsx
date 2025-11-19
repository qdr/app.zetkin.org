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

interface SingleViewPageClientProps {
  columns: ZetkinViewColumn[];
  orgId: number;
  rows: ZetkinViewRow[];
  view: ZetkinView;
  viewId: number;
}

export default function SingleViewPageClient({
  columns,
  rows,
  view,
  viewId,
}: SingleViewPageClientProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(viewLoaded(view));
    dispatch(columnsLoaded([viewId, columns]));
    dispatch(rowsLoaded([viewId, rows]));
  }, [view, viewId, columns, rows, dispatch]);

  return (
    <AccessLevelProvider>
      <ViewDataTable
        columns={columns}
        rows={rows}
        rowSelection={{
          mode: 'selectWithBulkActions',
        }}
        view={view}
      />
    </AccessLevelProvider>
  );
}
