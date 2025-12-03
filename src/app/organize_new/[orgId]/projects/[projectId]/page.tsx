'use client';

import { FC, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { Add, Event, People as PeopleIcon, Assignment } from '@mui/icons-material';

interface Props {
  params: {
    orgId: string;
    projectId: string;
  };
}

const ProjectDetailPage: FC<Props> = ({ params }) => {
  const [currentTab, setCurrentTab] = useState(0);

  // Mock data - replace with real API calls
  const projectName = 'Coders & Organizers demo';

  const activities = [
    { id: 1, title: 'Team meeting', date: 'Nov 24, 2024', type: 'Event', participants: 12 },
    { id: 2, title: 'Code review session', date: 'Nov 25, 2024', type: 'Task', participants: 5 },
    { id: 3, title: 'Sprint planning', date: 'Nov 26, 2024', type: 'Event', participants: 8 },
    { id: 4, title: 'Documentation update', date: 'Nov 27, 2024', type: 'Task', participants: 3 },
  ];

  const calendarEvents = [
    { date: 'Nov 24', title: 'Team meeting', time: '10:00 AM' },
    { date: 'Nov 25', title: 'Code review', time: '2:00 PM' },
    { date: 'Nov 26', title: 'Sprint planning', time: '9:00 AM' },
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h1" fontWeight={600}>
            {projectName}
          </Typography>
          <Button variant="contained" color="error" startIcon={<Add />} sx={{ textTransform: 'none' }}>
            CREATE
          </Button>
        </Toolbar>

        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 100,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="People" />
          <Tab label="Activities" />
          <Tab label="Settings" />
        </Tabs>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Activities List */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Activities
            </Typography>
            <Button size="small" variant="outlined" sx={{ textTransform: 'none' }}>
              View All
            </Button>
          </Box>

          <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            {activities.map((activity, index) => (
              <ListItem
                key={activity.id}
                divider={index < activities.length - 1}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {activity.title}
                      </Typography>
                      <Chip label={activity.type} size="small" color="primary" variant="outlined" />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Event sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{activity.date}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{activity.participants} participants</Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Calendar */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Calendar
            </Typography>
            <Button size="small" variant="outlined" sx={{ textTransform: 'none' }}>
              Full Calendar
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
            {calendarEvents.map((event, index) => (
              <Card key={index} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Event color="primary" />
                    <Typography variant="subtitle2" color="primary" fontWeight={600}>
                      {event.date}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.time}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectDetailPage;
