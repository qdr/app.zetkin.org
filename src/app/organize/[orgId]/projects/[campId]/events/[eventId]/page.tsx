'use client';

import { Grid } from '@mui/material';

import EventOverviewCard from 'features/events/components/EventOverviewCard';
import EventParticipantsCard from 'features/events/components/EventParticipantsCard';
import EventRelatedCard from 'features/events/components/EventRelatedCard';
import EventURLCard from 'features/events/components/EventURLCard';
import useEvent from 'features/events/hooks/useEvent';
import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';

const EventPage = () => {
  const { orgId, eventId } = useNumericRouteParams();
  const eventFuture = useEvent(orgId, eventId);

  if (!eventFuture || !eventFuture.data) {
    return null;
  }

  return (
    <ZUIFuture future={eventFuture}>
      {(data) => {
        return (
          <Grid container spacing={2}>
            <Grid size={{ md: 8, xs: 12 }}>
              <EventOverviewCard data={data} orgId={orgId} />
            </Grid>
            <Grid size={{ md: 4, xs: 6 }}>
              <EventParticipantsCard
                eventId={eventId}
                orgId={orgId}
              />
              <EventRelatedCard data={data} orgId={orgId} />
              <EventURLCard
                eventId={eventId}
                isOpen={data.published != null}
                orgId={orgId}
              />
            </Grid>
          </Grid>
        );
      }}
    </ZUIFuture>
  );
};

export default EventPage;
