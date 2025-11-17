'use client';

import { useNumericRouteParams } from 'core/hooks';
import ViewBrowser from 'features/views/components/ViewBrowser';

const PeopleViewsPage = () => {
  const { orgId, folderId } = useNumericRouteParams();

  return (
    <>
      <ViewBrowser basePath={`/organize/${orgId}/people`} folderId={folderId} />
    </>
  );
};

export default PeopleViewsPage;
