'use client';

import { useEffect } from 'react';
import { Grid } from '@mui/material';

import EventOverviewCard from 'features/events/components/EventOverviewCard';
import EventParticipantsCard from 'features/events/components/EventParticipantsCard';
import EventRelatedCard from 'features/events/components/EventRelatedCard';
import EventURLCard from 'features/events/components/EventURLCard';
import { eventLoaded } from 'features/events/store';
import { useAppDispatch } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventPageClientProps {
  event: ZetkinEvent;
  eventId: number;
  orgId: number;
}

export default function EventPageClient({
  event,
  eventId,
  orgId,
}: EventPageClientProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(eventLoaded(event));
  }, [event, dispatch]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 8, xs: 12 }}>
        <EventOverviewCard data={event} orgId={orgId} />
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <EventParticipantsCard eventId={eventId} orgId={orgId} />
        <EventRelatedCard data={event} orgId={orgId} />
        <EventURLCard
          eventId={eventId}
          isOpen={event.published != null}
          orgId={orgId}
        />
      </Grid>
    </Grid>
  );
}
