'use client';

import { FC, ReactNode, useState, useEffect } from 'react';
import { Box, Tabs, Tab, Button } from '@mui/material';
import {
  Add,
  Event,
  Phone,
  Assignment,
  Campaign,
  Email,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

import ZUIText from 'zui/components/ZUIText';

interface Props {
  children: ReactNode;
  params: {
    orgId: string;
    projectId: string;
  };
}

const ProjectLayout: FC<Props> = ({ children, params }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState(0);
  const [activitiesSubTab, setActivitiesSubTab] = useState(0);

  // Mock data - replace with real API calls
  const projectName = 'Coders & Organizers demo';

  const mainTabs = ['overview', 'people', 'activities', 'settings'];
  const activityModules = [
    { label: 'Events', icon: Event, path: 'events' },
    { label: 'Calls', icon: Phone, path: 'calls' },
    { label: 'Surveys', icon: Assignment, path: 'surveys' },
    { label: 'Canvassings', icon: Campaign, path: 'canvassings' },
    { label: 'Emails', icon: Email, path: 'emails' },
  ];

  // Determine active tab from pathname
  useEffect(() => {
    const pathParts = pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    if (lastPart === params.projectId || lastPart === 'overview') {
      setCurrentTab(0);
    } else if (lastPart === 'people') {
      setCurrentTab(1);
    } else if (activityModules.some(m => m.path === lastPart)) {
      setCurrentTab(2);
      const moduleIndex = activityModules.findIndex(m => m.path === lastPart);
      if (moduleIndex !== -1) {
        setActivitiesSubTab(moduleIndex);
      }
    } else if (lastPart === 'settings') {
      setCurrentTab(3);
    }
  }, [pathname, params.projectId]);

  const handleMainTabChange = (newValue: number) => {
    setCurrentTab(newValue);
    const tab = mainTabs[newValue];

    if (tab === 'activities') {
      // When clicking Activities, go to first module (events)
      router.push(`/organize_new/${params.orgId}/projects/${params.projectId}/events`);
    } else {
      router.push(`/organize_new/${params.orgId}/projects/${params.projectId}/${tab}`);
    }
  };

  const handleActivityModuleClick = (index: number) => {
    setActivitiesSubTab(index);
    const module = activityModules[index];
    router.push(`/organize_new/${params.orgId}/projects/${params.projectId}/${module.path}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Title Bar */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ZUIText variant="headingLg" component="h1">
            {projectName}
          </ZUIText>

          <Button
            variant="contained"
            color="error"
            startIcon={<Add />}
            sx={{ textTransform: 'none' }}
          >
            CREATE
          </Button>
        </Box>

        {/* Main Tabs */}
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => handleMainTabChange(newValue)}
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

        {/* Activities Sub-Tabs (shown when on an activity module page) */}
        {currentTab === 2 && (
          <Box
            sx={{
              px: 4,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Tabs
              value={activitiesSubTab}
              onChange={(e, newValue) => handleActivityModuleClick(newValue)}
              sx={{
                minHeight: 48,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  minHeight: 48,
                  fontSize: '0.875rem',
                },
              }}
            >
              {activityModules.map((module) => {
                const Icon = module.icon;
                return (
                  <Tab
                    key={module.path}
                    label={module.label}
                    icon={<Icon sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                  />
                );
              })}
            </Tabs>
          </Box>
        )}
      </Box>

      {/* Main Content */}
      {children}
    </Box>
  );
};

export default ProjectLayout;
