import { FC } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { headers } from 'next/headers';
import {
  Email,
  Phone,
  Event,
  Assignment,
  Campaign,
  Add,
} from '@mui/icons-material';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';

type Props = {
  params: {
    orgId: number;
  };
};

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const ProjectsPage: FC<Props> = async ({ params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${params.orgId}`
  );

  // Mock data for demonstration - replace with real API calls
  const activities = [
    {
      id: 1,
      title: 'Monday email campaign',
      subtitle: 'Email Campaign',
      icon: Email,
      count: 150,
      href: `/organize_new/${org.id}/emails/1`,
    },
    {
      id: 2,
      title: 'Tuesday phone banking',
      subtitle: 'Phone Campaign',
      icon: Phone,
      count: 45,
      href: `/organize_new/${org.id}/calls/2`,
    },
    {
      id: 3,
      title: 'Midweek meeting',
      subtitle: 'Event',
      icon: Event,
      count: 23,
      href: `/organize_new/${org.id}/events/3`,
    },
    {
      id: 4,
      title: 'Thursday survey',
      subtitle: 'Survey',
      icon: Assignment,
      count: 89,
      href: `/organize_new/${org.id}/surveys/4`,
    },
    {
      id: 5,
      title: 'TGIF task',
      subtitle: 'Task',
      icon: Assignment,
      count: 12,
      href: `/organize_new/${org.id}/tasks/5`,
    },
    {
      id: 6,
      title: 'Saturday street canvassing',
      subtitle: 'Canvassing',
      icon: Campaign,
      count: 67,
      href: `/organize_new/${org.id}/canvassings/6`,
    },
  ];

  return (
    <Box>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="h1">
            $workspace
          </Typography>
          <Button variant="contained" startIcon={<Add />}>
            New Activity
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Box
                key={activity.id}
                component="a"
                href={activity.href}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight={600}>
                    {activity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.subtitle}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" fontWeight={600}>
                    {activity.count}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectsPage;
