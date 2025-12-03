'use client';

import { FC } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
} from '@mui/material';
import {
  Event as EventIcon,
  People,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventsListProps {
  events: ZetkinEvent[];
  orgId: number;
}

const EventsList: FC<EventsListProps> = ({ events, orgId }) => {
  if (events.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No upcoming events
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first event to get started
        </Typography>
      </Box>
    );
  }

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

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                {/* Event Icon */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1,
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EventIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>

                {/* Event Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {event.activity?.title || event.title || 'Untitled Event'}
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    {/* Date & Time */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.start_time)} • {formatTime(event.start_time)}
                      </Typography>
                    </Box>

                    {/* Duration */}
                    <Chip
                      label={getDuration(event.start_time, event.end_time)}
                      size="small"
                      variant="outlined"
                    />

                    {/* Participants */}
                    {event.num_participants !== undefined && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <People sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.num_participants} participants
                        </Typography>
                      </Box>
                    )}

                    {/* Location */}
                    {event.location?.title && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location.title}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Info Text */}
                  {event.info_text && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {event.info_text}
                    </Typography>
                  )}
                </Box>

                {/* Status Badge */}
                <Box>
                  {event.published ? (
                    <Chip label="Published" color="success" size="small" />
                  ) : (
                    <Chip label="Draft" color="default" size="small" />
                  )}
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

export default EventsList;
