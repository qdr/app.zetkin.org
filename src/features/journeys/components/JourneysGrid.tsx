'use client';

import { Suspense } from 'react';
import { Grid } from '@mui/material';

import JourneyCard from './JourneyCard';
import JourneyCardSkeleton from './JourneyCardSkeleton';
import useJourneys from '../hooks/useJourneys';
import { ZetkinJourney } from 'utils/types/zetkin';

interface JourneysGridProps {
  orgId: number;
}

function JourneysGridContent({ orgId }: JourneysGridProps) {
  const journeysFuture = useJourneys(orgId);

  return (
    <Grid container spacing={2}>
      {journeysFuture.data?.map((journey: ZetkinJourney) => (
        <Grid key={journey.id} size={{ lg: 4, md: 6, xl: 3, xs: 12 }}>
          <Suspense fallback={<JourneyCardSkeleton />}>
            <JourneyCard journey={journey} />
          </Suspense>
        </Grid>
      ))}
    </Grid>
  );
}

export default function JourneysGrid({ orgId }: JourneysGridProps) {
  return (
    <Suspense
      fallback={
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} size={{ lg: 4, md: 6, xl: 3, xs: 12 }}>
              <JourneyCardSkeleton />
            </Grid>
          ))}
        </Grid>
      }
    >
      <JourneysGridContent orgId={orgId} />
    </Suspense>
  );
}
