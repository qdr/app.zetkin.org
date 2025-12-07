'use client';

import { FC } from 'react';
import { Box, Card, CardContent, CardActionArea, Stack } from '@mui/material';
import {
  People,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';

import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUIIconLabel from 'zui/components/ZUIIconLabel';

interface EventsListModuleProps {
  events: ZetkinEvent[];
  orgId: string;
  projectId: string;
}

const EventsListModule: FC<EventsListModuleProps> = ({ events, orgId, projectId }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  if (events.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <p>No events in this project</p>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Events List */}
      {events.map((event) => (
        <Card
          key={event.id}
          variant="outlined"
          sx={{
            '&:hover': {
              boxShadow: 2,
              borderColor: 'primary.main',
            },
            transition: 'all 0.2s',
          }}
        >
          <CardActionArea
            onClick={() => {
              window.location.href = `/organize_new/${orgId}/events/${event.id}`;
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Event Details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <ZUIText variant="bodyMdSemiBold" gutterBottom noWrap>
                    {event.activity?.title || event.title || 'Untitled Event'}
                  </ZUIText>

                  <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <ZUIIconLabel
                      icon={AccessTime}
                      label={`${formatDate(event.start_time)} • ${formatTime(event.start_time)}`}
                      size="small"
                      color="secondary"
                    />


                    {event.num_participants_available !== undefined && (
                      <ZUIIconLabel
                        icon={People}
                        label={`${event.num_participants_available}`}
                        size="small"
                        color="secondary"
                      />
                    )}

                    {event.location?.title && (
                      <ZUIIconLabel
                        icon={LocationOn}
                        label={event.location.title}
                        size="small"
                        color="secondary"
                      />
                    )}
                  </Stack>
                </Box>

              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

export default EventsListModule;
