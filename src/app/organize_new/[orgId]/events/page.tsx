import { FC } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { headers } from 'next/headers';
import { Add } from '@mui/icons-material';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent } from 'utils/types/zetkin';
import EventsList from './EventsList';

type Props = {
  params: {
    orgId: number;
  };
};

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const EventsPage: FC<Props> = async ({ params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  // Fetch upcoming events (actions with start_time >= now)
  const now = new Date().toISOString();
  let events: ZetkinEvent[] = [];

  try {
    events = await apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${params.orgId}/actions?filter=start_time%3E=${now}`
    );
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="h1">
            Events
          </Typography>
          <Button variant="contained" startIcon={<Add />}>
            Create Event
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <EventsList events={events} orgId={params.orgId} />
      </Container>
    </Box>
  );
};

export default EventsPage;
