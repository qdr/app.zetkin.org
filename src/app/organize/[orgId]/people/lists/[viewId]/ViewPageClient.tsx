'use client';

import { FC } from 'react';

import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import SingleViewLayout from 'features/views/layout/SingleViewLayout';
import useView from 'features/views/hooks/useView';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ViewDataTable from 'features/views/components/ViewDataTable';
import ZUIFutures from 'zui/ZUIFutures';

interface ViewPageClientProps {
  orgId: number;
  viewId: number;
}

const ViewPageClient: FC<ViewPageClientProps> = ({ orgId, viewId }) => {
  const { columnsFuture, rowsFuture } = useViewGrid(orgId, viewId);
  const viewFuture = useView(orgId, viewId);

  return (
    <SingleViewLayout>
      <ZUIFutures
        futures={{
          cols: columnsFuture,
          rows: rowsFuture,
          view: viewFuture,
        }}
      >
        {({ data: { cols, rows, view } }) => (
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
        )}
      </ZUIFutures>
    </SingleViewLayout>
  );
};

export default ViewPageClient;
