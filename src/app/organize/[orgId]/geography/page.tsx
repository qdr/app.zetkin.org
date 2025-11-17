'use client';

import useAreas from 'features/areas/hooks/useAreas';
import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';
import { useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import GLGeographyMap from 'features/geography/components/GLGeographyMap';

const GeographyPage = () => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const areasFuture = useAreas(orgId);

  return (
    <ZUIFuture future={areasFuture}>
      {(areas) => <GLGeographyMap areas={areas} orgId={orgId} />}
    </ZUIFuture>
  );
};

export default GeographyPage;
