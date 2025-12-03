'use client';

import { FC, useState } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import {
  Home,
  People,
  Timeline,
  Place,
  Label,
  Dashboard,
  Event,
  Phone,
  Assignment,
  CheckCircle,
  Campaign,
  Email,
  Inbox,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import ZUIBadge from 'zui/ZUIBadge';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import { ZetkinOrganization, ZetkinUser } from 'utils/types/zetkin';
import ProjectsModal from './ProjectsModal';

interface NavItem {
  label: string;
  icon: typeof Home;
  href: string;
  badge?: number;
}

interface OrganizeSidebarProps {
  org: ZetkinOrganization;
  user: ZetkinUser | null;
  organizations: ZetkinOrganization[];
  workspaces?: { id: number; title: string }[];
}

const OrganizeSidebar: FC<OrganizeSidebarProps> = ({
  org,
  user,
  organizations,
  workspaces = [],
}) => {
  const pathname = usePathname();
  const [orgOpen, setOrgOpen] = useState(true);
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);

  const organizationNavItems: NavItem[] = [
    { label: 'Home', icon: Home, href: `/organize_new/${org.id}` },
    { label: 'People', icon: People, href: `/organize_new/${org.id}/people` },
    { label: 'Paths', icon: Timeline, href: `/organize_new/${org.id}/paths` },
    { label: 'Places', icon: Place, href: `/organize_new/${org.id}/places` },
    { label: 'Tags', icon: Label, href: `/organize_new/${org.id}/tags` },
  ];

  const workspaceNavItems: NavItem[] = [
    { label: 'Overview', icon: Dashboard, href: `/organize_new/${org.id}/projects` },
    { label: 'Events', icon: Event, href: `/organize_new/${org.id}/events`, badge: 1 },
    { label: 'Calls', icon: Phone, href: `/organize_new/${org.id}/calls`, badge: 1 },
    { label: 'Surveys', icon: Assignment, href: `/organize_new/${org.id}/surveys`, badge: 1 },
    { label: 'Tasks', icon: CheckCircle, href: `/organize_new/${org.id}/tasks`, badge: 1 },
    { label: 'Canvassings', icon: Campaign, href: `/organize_new/${org.id}/canvassings`, badge: 1 },
    { label: 'Emails', icon: Email, href: `/organize_new/${org.id}/emails`, badge: 1 },
  ];

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        backgroundColor: '#F5F3EF',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Organization Section */}
      <List component="nav" sx={{ flexGrow: 1, pt: 2 }}>
        {/* Organization Dropdown */}
        <ListItemButton onClick={() => setOrgOpen(!orgOpen)} sx={{ pl: 2 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: 'white',
                fontWeight: 600,
              }}
            >
              {org.title.charAt(0).toUpperCase()}
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={org.title}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
          {orgOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={orgOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {organizationNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <ListItemButton
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{
                    pl: 4,
                    py: 1,
                    backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon
                      sx={{
                        fontSize: '1.25rem',
                        color: isActive ? 'primary.main' : 'text.secondary',
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      color: isActive ? 'primary.main' : 'text.primary',
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>

        {/* Workspace Section - Opens Modal */}
        <ListItemButton onClick={() => setProjectsModalOpen(true)} sx={{ pl: 2, mt: 2 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Dashboard sx={{ fontSize: '1.25rem' }} />
          </ListItemIcon>
          <ListItemText
            primary="$workspace"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          />
        </ListItemButton>

        {/* Workspace Nav Items - Still visible */}
        <List component="div" disablePadding>
          {workspaceNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                sx={{
                  pl: 4,
                  py: 1,
                  backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon
                    sx={{
                      fontSize: '1.25rem',
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
                {item.badge && (
                  <Box
                    sx={{
                      ml: 1,
                      minWidth: 20,
                      height: 20,
                      borderRadius: '10px',
                      backgroundColor: 'text.secondary',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      px: 0.5,
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </ListItemButton>
            );
          })}
        </List>

        {/* Inbox */}
        <ListItemButton
          component={Link}
          href={`/organize_new/${org.id}/inbox`}
          sx={{
            pl: 2,
            mt: 2,
            py: 1,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Inbox sx={{ fontSize: '1.25rem', color: 'text.secondary' }} />
          </ListItemIcon>
          <ListItemText
            primary="Inbox"
            primaryTypographyProps={{
              fontSize: '0.875rem',
            }}
          />
          <Box
            sx={{
              minWidth: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: 'text.primary',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            1
          </Box>
        </ListItemButton>
      </List>

      {/* User Section at Bottom */}
      {user && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ListItemButton
            component={Link}
            href={`/organize_new/${org.id}/profile`}
            sx={{
              borderRadius: 1,
              p: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ZUIPersonAvatar
                personId={user.id}
                name={`${user.first_name} ${user.last_name}`}
                size="sm"
              />
            </ListItemIcon>
            <ListItemText
              primary={`${user.first_name} ${user.last_name}`}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </Box>
      )}

      {/* Projects Modal */}
      <ProjectsModal
        open={projectsModalOpen}
        onClose={() => setProjectsModalOpen(false)}
        orgId={org.id}
      />
    </Box>
  );
};

export default OrganizeSidebar;
