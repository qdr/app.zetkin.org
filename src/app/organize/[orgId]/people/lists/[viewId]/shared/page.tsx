'use client';

import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useView from 'features/views/hooks/useView';
import useViewAccessLevel from 'features/views/hooks/useViewAccessLevel';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ViewDataTable from 'features/views/components/ViewDataTable';
import ZUIFutures from 'zui/ZUIFutures';

const SharedViewPage = () => {
  const { orgId, viewId } = useNumericRouteParams();
  const { data: accessLevel } = useViewAccessLevel(orgId, viewId);

  const { columnsFuture, rowsFuture } = useViewGrid(orgId, viewId);
  const viewFuture = useView(orgId, viewId);
  const canConfigure = accessLevel == 'configure';

  const onServer = useServerSide();
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
          <AccessLevelProvider
            accessLevel={accessLevel || 'none'}
            isRestricted={true}
          >
            {!columnsFuture.isLoading ? (
              <ViewDataTable
                columns={cols}
                disableConfigure={!canConfigure}
                rows={rows}
                view={view}
              />
            ) : null}
          </AccessLevelProvider>
        </>
      )}
    </ZUIFutures>
  );
};

export default SharedViewPage;
