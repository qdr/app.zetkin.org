'use client';

import { FC } from 'react';

import SimpleLayout from 'utils/layout/SimpleLayout';
import useAreas from 'features/areas/hooks/useAreas';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import GLGeographyMap from 'features/geography/components/GLGeographyMap';

interface GeographyPageClientProps {
  orgId: number;
}

const GeographyPageClient: FC<GeographyPageClientProps> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const areasFuture = useAreas(orgId);

  return (
    <SimpleLayout
      ellipsisMenuItems={[]}
      fixedHeight
      title={<Msg id={messageIds.page.title} />}
    >
      <ZUIFuture future={areasFuture}>
        {(areas) => <GLGeographyMap areas={areas} orgId={orgId} />}
      </ZUIFuture>
    </SimpleLayout>
  );
};

export default GeographyPageClient;
