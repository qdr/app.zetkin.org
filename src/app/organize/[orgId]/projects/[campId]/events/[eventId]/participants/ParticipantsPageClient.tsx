'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Grid } from '@mui/material';

import AddPersonButton from 'features/events/components/AddPersonButton';
import EventContactCard from 'features/events/components/EventContactCard';
import EventParticipantsFilter from 'features/events/components/EventParticipantsFilter';
import EventParticipantsList from 'features/events/components/EventParticipantsList';
import { eventLoaded } from 'features/events/store';
import ParticipantSummaryCard from 'features/events/components/ParticipantSummaryCard';
import { useAppDispatch } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';

interface ParticipantsPageClientProps {
  event: ZetkinEvent;
  eventId: number;
  orgId: number;
}

export default function ParticipantsPageClient({
  event,
  eventId,
  orgId,
}: ParticipantsPageClientProps) {
  const dispatch = useAppDispatch();
  const [filterString, setFilterString] = useState<string>('');
  const listRef = useRef<HTMLDivElement>();

  useEffect(() => {
    dispatch(eventLoaded(event));
  }, [event, dispatch]);

  return (
    <Box sx={{ overflowY: 'auto' }}>
      <Grid container spacing={2}>
        <Grid size={{ md: 8, xs: 12 }}>
          <ParticipantSummaryCard
            eventId={eventId}
            onClickRecord={() => {
              if (listRef.current) {
                listRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            orgId={orgId}
          />
        </Grid>
        <Grid size={{ md: 4, xs: 12 }}>
          <EventContactCard data={event} orgId={orgId} />
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="flex-end"
        size={{ md: 12 }}
        sx={{ marginBottom: '40px', marginTop: '30px' }}
      >
        <EventParticipantsFilter
          onFilterChange={(value) => {
            setFilterString(value);
            if (listRef.current) {
              listRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
        <AddPersonButton eventId={event.id} orgId={orgId} />
      </Grid>
      <EventParticipantsList
        ref={listRef}
        data={event}
        filterString={filterString}
        orgId={orgId}
      />
    </Box>
  );
}
