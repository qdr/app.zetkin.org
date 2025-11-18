'use client';

import { FC } from 'react';
import { OpenInNew } from '@mui/icons-material';
import { Box, Grid, Link, Typography } from '@mui/material';

import AddOfficialButton from 'features/settings/components/AddOfficialButton';
import messageIds from 'features/settings/l10n/messageIds';
import OfficialList from 'features/settings/components/OfficialList';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import { useEnv } from 'core/hooks';
import useOfficialMemberships from 'features/settings/hooks/useOfficialMemberships';
import ZUICard from 'zui/ZUICard';
import ZUITextfieldToClipboard from 'zui/ZUITextfieldToClipboard';
import { Msg, useMessages } from 'core/i18n';

interface SettingsPageClientProps {
  orgId: number;
}

const SettingsPageClient: FC<SettingsPageClientProps> = ({ orgId }) => {
  const listFuture = useOfficialMemberships(orgId).data || [];
  const messages = useMessages(messageIds);
  const env = useEnv();
  const publicOrgUrl = `${env.vars.ZETKIN_APP_DOMAIN}/o/${orgId}`;

  const adminList = listFuture.filter((user) => user.role === 'admin');
  const organizerList = listFuture.filter((user) => user.role === 'organizer');

  return (
    <SettingsLayout>
      <Grid container spacing={2}>
        <Grid size={{ md: 8 }}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            sx={{
              marginBottom: '15px',
              marginTop: '15px',
            }}
          >
            <Typography variant="h4">
              <Msg id={messageIds.officials.administrators.title} />
            </Typography>
            <AddOfficialButton
              disabledList={adminList}
              orgId={orgId}
              roleType="admin"
            />
          </Box>
          <Typography mb={2} variant="body2">
            <Msg id={messageIds.officials.administrators.description} />
          </Typography>
          <OfficialList officialList={adminList} orgId={orgId} />
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            sx={{
              marginBottom: '15px',
              marginTop: '40px',
            }}
          >
            <Typography variant="h4">
              <Msg id={messageIds.officials.organizers.title} />
            </Typography>
            <AddOfficialButton
              disabledList={organizerList}
              orgId={orgId}
              roleType="organizer"
            />
          </Box>
          <Typography mb={2} variant="body2">
            <Msg id={messageIds.officials.organizers.description} />
          </Typography>
          <OfficialList officialList={organizerList} orgId={orgId} />
        </Grid>
        <Grid size={{ md: 4 }}>
          <ZUICard
            header={messages.officials.urlCard.linkToPub()}
            subheader={messages.officials.urlCard.subTitle()}
          >
            <Box display="flex" paddingBottom={2}>
              <ZUITextfieldToClipboard copyText={publicOrgUrl}>
                {publicOrgUrl}
              </ZUITextfieldToClipboard>
            </Box>
            <Link
              display="flex"
              href={publicOrgUrl}
              sx={{ alignItems: 'center', gap: 1 }}
              target="_blank"
            >
              <OpenInNew fontSize="inherit" />
              {messages.officials.urlCard.linkToPub()}
            </Link>
          </ZUICard>
        </Grid>
      </Grid>
    </SettingsLayout>
  );
};

export default SettingsPageClient;
