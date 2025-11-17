'use client';

import { Box, Grid } from '@mui/material';
import { useRef, useState } from 'react';

import AddPersonButton from 'features/events/components/AddPersonButton';
import { useNumericRouteParams } from 'core/hooks';
import EventContactCard from 'features/events/components/EventContactCard';
import EventParticipantsFilter from 'features/events/components/EventParticipantsFilter';
import EventParticipantsList from 'features/events/components/EventParticipantsList';
import ParticipantSummaryCard from 'features/events/components/ParticipantSummaryCard';
import useEvent from 'features/events/hooks/useEvent';
import ZUIFuture from 'zui/ZUIFuture';

const ParticipantsPage = () => {
  const { orgId, eventId } = useNumericRouteParams();
  const [filterString, setFilterString] = useState<string>('');
  const listRef = useRef<HTMLDivElement>();
  const eventFuture = useEvent(orgId, eventId);

  if (!eventFuture) {
    return null;
  }

  return (
    <ZUIFuture future={eventFuture}>
      {(data) => {
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
                <EventContactCard data={data} orgId={orgId} />
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
              <AddPersonButton eventId={data.id} orgId={orgId} />
            </Grid>
            <EventParticipantsList
              ref={listRef}
              data={data}
              filterString={filterString}
              orgId={orgId}
            />
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default ParticipantsPage;
