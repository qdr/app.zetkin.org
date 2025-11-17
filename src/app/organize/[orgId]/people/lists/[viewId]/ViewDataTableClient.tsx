'use client';

import useServerSide from 'core/useServerSide';
import useView from 'features/views/hooks/useView';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ViewDataTable from 'features/views/components/ViewDataTable';
import ZUIFutures from 'zui/ZUIFutures';

interface ViewDataTableClientProps {
  orgId: string;
  viewId: string;
}

export default function ViewDataTableClient({
  orgId,
  viewId,
}: ViewDataTableClientProps) {
  const onServer = useServerSide();
  const viewFuture = useView(parseInt(orgId), parseInt(viewId));
  const viewGridFuture = useViewGrid(parseInt(orgId), parseInt(viewId));

  if (onServer) {
    return null;
  }

  return (
    <ZUIFutures
      futures={{
        view: viewFuture,
        viewGrid: viewGridFuture,
      }}
    >
      {({ data: { view, viewGrid } }) => (
        <ViewDataTable
          columnOrder={viewGrid.columnOrder}
          rows={viewGrid.rows}
          view={view}
        />
      )}
    </ZUIFutures>
  );
}
