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
        <Grid container spacing={2}>
          {journeysFuture.data?.map((journey: ZetkinJourney) => (
            <Grid key={journey.id} size={{ lg: 4, md: 6, xl: 3, xs: 12 }}>
              <JourneyCard journey={journey} />
            </Grid>
          ))}
        </Grid>
      </ZUISection>
      <JourneysGrid orgId={orgId} />
    </ZUISection>
  );
};

export default AllJourneysOverviewPage;
