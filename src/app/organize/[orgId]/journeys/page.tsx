'use client';

import JourneysGrid from 'features/journeys/components/JourneysGrid';
import messageIds from 'features/journeys/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import ZUISection from 'zui/ZUISection';

const AllJourneysOverviewPage = () => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  return (
    <ZUISection title={messages.journeys.overview.overviewTitle()}>
      <JourneysGrid orgId={orgId} />
    </ZUISection>
  );
};

export default AllJourneysOverviewPage;
