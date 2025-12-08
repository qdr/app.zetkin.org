'use client';

import { FC, useState } from 'react';
import {
  Box,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Avatar,
} from '@mui/material';
import {
  ChevronRight,
  AccountTree,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import Link from 'next/link';

import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import useUserMemberships from '../hooks/useUserMemberships';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import useUpdateMembership from 'features/organizations/hooks/useUpdateMembership';
import { ZetkinMembership } from 'utils/types/zetkin';

const OrganizationItem: FC<{
  membership: ZetkinMembership;
  currentUserId: number | undefined;
}> = ({ membership, currentUserId }) => {
  const [expanded, setExpanded] = useState(false);
  const updateMembership = useUpdateMembership();
  const { orgId, orgTitle, role } = {
    orgId: membership.organization.id,
    orgTitle: membership.organization.title,
    role: membership.role,
  };
  const campaignsFuture = useCampaigns(orgId);
  const allCampaigns = campaignsFuture.data || [];

  // Filter to show only campaigns where the current user is the manager
  const campaigns = currentUserId
    ? allCampaigns.filter(
        (campaign) => campaign.manager?.id === currentUserId
      )
    : [];

  const handleFollowChange = async (checked: boolean) => {
    await updateMembership(orgId, { follow: checked });
  };

  return (
    <>
      {/* Organization Item */}
      <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <ListItemButton
            component={Link}
            href={`/o/${orgId}`}
            sx={{
              py: 1.5,
              flex: 1,
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
            </Box>
          </ListItemButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            sx={{ mr: 1 }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Expandable settings section */}
        <Collapse in={expanded}>
          <Box sx={{ pl: 6, pr: 2, pb: 2, pt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={membership.follow !== false}
                  onChange={(e) => handleFollowChange(e.target.checked)}
                  size="small"
                />
              }
              label={
                <ZUIText variant="bodySmRegular">
                  Show events in Feed
                </ZUIText>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={false}
                  disabled
                  size="small"
                />
              }
              label={
                <ZUIText variant="bodySmRegular" color="secondary">
                  Receive emails (coming soon)
                </ZUIText>
              }
            />
          </Box>
        </Collapse>
      </ListItem>

      {/* Campaigns/Projects under this organization */}
      {campaigns.length > 0 && (
        <Box sx={{ pl: 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
          {campaigns.map((campaign) => (
            <ListItem key={campaign.id} disablePadding>
              <ListItemButton
                component={Link}
                href={`/organize_new/${orgId}/projects/${campaign.id}`}
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
                    <ZUIText variant="bodyMdRegular">{campaign.title}</ZUIText>
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
  const currentUser = useCurrentUser();

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
                      membership={membership}
                      currentUserId={currentUser?.id}
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
