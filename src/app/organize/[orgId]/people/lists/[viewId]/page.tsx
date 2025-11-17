'use client';

import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useView from 'features/views/hooks/useView';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ViewDataTable from 'features/views/components/ViewDataTable';
import ZUIFutures from 'zui/ZUIFutures';

const SingleViewPage = () => {
  const { orgId, viewId } = useNumericRouteParams();
  const onServer = useServerSide();

  const { columnsFuture, rowsFuture } = useViewGrid(orgId, viewId);
  const viewFuture = useView(orgId, viewId);

  if (onServer) {
    return null;
  }

  return (
    <ZUIFutures
      futures={{
        cols: columnsFuture,
        rows: rowsFuture,
        view: viewFuture,
      }}
    >
      {({ data: { cols, rows, view } }) => (
        <>
          
          <AccessLevelProvider>
            {!columnsFuture.isLoading || !!columnsFuture.data?.length ? (
              <ViewDataTable
                columns={cols}
                rows={rows}
                rowSelection={{
                  mode: 'selectWithBulkActions',
                }}
                view={view}
              />
            ) : null}
          </AccessLevelProvider>
        </>
      )}
    </ZUIFutures>
  );
};

export default SingleViewPage;
