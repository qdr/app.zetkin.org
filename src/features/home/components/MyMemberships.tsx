'use client';

import { FC } from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Avatar,
} from '@mui/material';
import { ChevronRight, AccountTree } from '@mui/icons-material';
import Link from 'next/link';

import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import useUserMemberships from '../hooks/useUserMemberships';

type MockProject = {
  id: number;
  title: string;
  orgId: number;
};

// Mock project data - replace with real API call later
const mockProjects: MockProject[] = [
  { id: 5, title: 'Coders & Organizers demo', orgId: 1 },
  { id: 7, title: 'Summer Campaign 2025', orgId: 1 },
  { id: 12, title: 'Voter Outreach', orgId: 2 },
];

const OrganizationItem: FC<{
  orgId: number;
  orgTitle: string;
  role: string | null;
}> = ({ orgId, orgTitle, role }) => {
  const orgProjects = mockProjects.filter((p) => p.orgId === orgId);

  return (
    <>
      {/* Organization Item */}
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          href={`/organize_new/${orgId}`}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: '100%',
            }}
          >
            <Avatar
              src={`/api/orgs/${orgId}/avatar`}
              alt={orgTitle}
              sx={{ width: 32, height: 32 }}
            />
            <Box sx={{ flex: 1 }}>
              <ZUIText variant="bodyMdSemiBold">{orgTitle}</ZUIText>
              {role && (
                <ZUIText variant="bodySmRegular" color="secondary">
                  {role}
                </ZUIText>
              )}
            </Box>
            <ChevronRight sx={{ color: 'text.secondary' }} />
          </Box>
        </ListItemButton>
      </ListItem>

      {/* Projects under this organization */}
      {orgProjects.length > 0 && (
        <Box sx={{ pl: 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
          {orgProjects.map((project) => (
            <ListItem key={project.id} disablePadding>
              <ListItemButton
                component={Link}
                href={`/organize_new/${orgId}/projects/${project.id}`}
                sx={{
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    width: '100%',
                  }}
                >
                  <AccountTree
                    sx={{
                      fontSize: 18,
                      color: 'text.secondary',
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <ZUIText variant="bodyMdRegular">{project.title}</ZUIText>
                  </Box>
                  <ChevronRight
                    sx={{
                      fontSize: 18,
                      color: 'text.secondary',
                    }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      )}
    </>
  );
};

const MyMemberships: FC = () => {
  const memberships = useUserMemberships();

  console.log('MyMemberships - memberships:', memberships);

  return (
    <Box mt={2}>
      <ZUISection
        renderContent={() => (
          <Box>
            {memberships.length === 0 && (
              <ZUIText variant="bodyMdRegular" color="secondary">
                No organizations found. You may need to join an organization first.
              </ZUIText>
            )}
            {memberships.length > 0 && (
              <List disablePadding>
                {memberships.map((membership, index) => (
                  <Box key={membership.organization.id}>
                    {index > 0 && <Divider />}
                    <OrganizationItem
                      orgId={membership.organization.id}
                      orgTitle={membership.organization.title}
                      role={membership.role}
                    />
                  </Box>
                ))}
              </List>
            )}
          </Box>
        )}
        title="My Organizations & Projects"
      />
    </Box>
  );
};

export default MyMemberships;
