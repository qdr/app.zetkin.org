import { FC } from 'react';
import { Box, Container } from '@mui/material';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import EventsListModule from './EventsListModule';

type Props = {
  params: {
    orgId: string;
    projectId: string;
  };
};

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const ProjectEventsPage: FC<Props> = async ({ params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  // Fetch events for this project
  // TODO: Add project filter when API supports it
  const now = new Date().toISOString();
  let events: ZetkinEvent[] = [];

  try {
    events = await apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${params.orgId}/actions?filter=start_time%3E=${encodeURIComponent(now)}`
    );
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <ZUIText variant="headingSm" gutterBottom>
          Project Events
        </ZUIText>

        <ZUIText variant="bodySmRegular" color="secondary" sx={{ mb: 3 }}>
          All events associated with this project
        </ZUIText>

        <EventsListModule events={events} orgId={params.orgId} projectId={params.projectId} />
      </Container>
    </Box>
  );
};

export default ProjectEventsPage;
