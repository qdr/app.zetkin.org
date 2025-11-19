'use client';

import { FC } from 'react';

import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import SharedViewLayout from 'features/views/layout/SharedViewLayout';
import useView from 'features/views/hooks/useView';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ViewDataTable from 'features/views/components/ViewDataTable';
import { ZetkinObjectAccess } from 'core/api/types';
import ZUIFutures from 'zui/ZUIFutures';

interface SharedViewPageClientProps {
  accessLevel: ZetkinObjectAccess['level'];
  orgId: number;
  viewId: number;
}

const SharedViewPageClient: FC<SharedViewPageClientProps> = ({
  accessLevel,
  orgId,
  viewId,
}) => {
  const { columnsFuture, rowsFuture } = useViewGrid(orgId, viewId);
  const viewFuture = useView(orgId, viewId);
  const canConfigure = accessLevel == 'configure';

  return (
    <SharedViewLayout>
      <ZUIFutures
        futures={{
          cols: columnsFuture,
          rows: rowsFuture,
          view: viewFuture,
        }}
      >
        {({ data: { cols, rows, view } }) => (
          <AccessLevelProvider accessLevel={accessLevel} isRestricted={true}>
            {!columnsFuture.isLoading ? (
              <ViewDataTable
                columns={cols}
                disableConfigure={!canConfigure}
                rows={rows}
                view={view}
              />
            ) : null}
          </AccessLevelProvider>
        )}
      </ZUIFutures>
    </SharedViewLayout>
  );
};

export default SharedViewPageClient;
