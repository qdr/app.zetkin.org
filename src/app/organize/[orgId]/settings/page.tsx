'use client';

import { OpenInNew } from '@mui/icons-material';
import { Box, Grid, Link, Typography } from '@mui/material';
import { useParams } from 'next/navigation';

import AddOfficialButton from 'features/settings/components/AddOfficialButton';
import messageIds from 'features/settings/l10n/messageIds';
import OfficialList from 'features/settings/components/OfficialList';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import { useEnv } from 'core/hooks';
import useOfficialMemberships from 'features/settings/hooks/useOfficialMemberships';
import useServerSide from 'core/useServerSide';
import ZUICard from 'zui/ZUICard';
import ZUITextfieldToClipboard from 'zui/ZUITextfieldToClipboard';
import { Msg, useMessages } from 'core/i18n';

export default function SettingsPage() {
  const params = useParams();
  const orgId = parseInt(params.orgId as string);
  const onServer = useServerSide();
  const listFuture = useOfficialMemberships(orgId).data || [];
  const messages = useMessages(messageIds);
  const env = useEnv();
  const publicOrgUrl = `${env.vars.ZETKIN_APP_DOMAIN}/o/${orgId}`;

  const adminList = listFuture.filter((user) => user.role === 'admin');
  const organizerList = listFuture.filter((user) => user.role === 'organizer');

  if (onServer) {
    return null;
  }

  return (
    <SettingsLayout>
      <Box>
        <Box mb={2}>
          <ZUICard header={messages.page.publicUrl.header()}>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              <Typography>{messages.page.publicUrl.description()}</Typography>
              <ZUITextfieldToClipboard
                copySuccessMessage={messages.page.publicUrl.copySuccessMessage()}
                href={publicOrgUrl}
                inputString={publicOrgUrl}
                label={messages.page.publicUrl.label()}
              />
              <Link
                alignItems="center"
                display="flex"
                gap={1}
                href={publicOrgUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {messages.page.publicUrl.visitPublicPage()}
                <OpenInNew color="secondary" fontSize="inherit" />
              </Link>
            </Box>
          </ZUICard>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ md: 6, xs: 12 }}>
            <ZUICard
              header={
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Typography variant="h4">
                    {messages.page.admins.header()}
                  </Typography>
                  <AddOfficialButton orgId={orgId} role="admin" />
                </Box>
              }
            >
              <OfficialList officials={adminList} orgId={orgId} />
            </ZUICard>
          </Grid>
          <Grid size={{ md: 6, xs: 12 }}>
            <ZUICard
              header={
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Typography variant="h4">
                    {messages.page.organizers.header()}
                  </Typography>
                  <AddOfficialButton orgId={orgId} role="organizer" />
                </Box>
              }
            >
              <OfficialList officials={organizerList} orgId={orgId} />
            </ZUICard>
          </Grid>
        </Grid>
      </Box>
    </SettingsLayout>
  );
}
