'use client';

import { FC } from 'react';
import { Grid } from '@mui/material';

import JourneyCard from 'features/journeys/components/JourneyCard';
import JourneysLayout from 'features/journeys/layout/JourneysLayout';
import messageIds from 'features/journeys/l10n/messageIds';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useMessages } from 'core/i18n';
import { ZetkinJourney } from 'utils/types/zetkin';
import ZUISection from 'zui/ZUISection';

interface JourneysPageClientProps {
  orgId: number;
}

const JourneysPageClient: FC<JourneysPageClientProps> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const journeysFuture = useJourneys(orgId);

  return (
    <JourneysLayout>
      <ZUISection title={messages.journeys.overview.overviewTitle()}>
        <Grid container spacing={2}>
          {journeysFuture.data?.map((journey: ZetkinJourney) => (
            <Grid key={journey.id} size={{ lg: 4, md: 6, xl: 3, xs: 12 }}>
              <JourneyCard journey={journey} />
            </Grid>
          ))}
        </Grid>
      </ZUISection>
    </JourneysLayout>
  );
};

export default JourneysPageClient;
