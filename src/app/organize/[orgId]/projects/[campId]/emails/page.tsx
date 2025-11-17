'use client';

import { Box, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useEmails from 'features/emails/hooks/useEmails';
import useServerSide from 'core/useServerSide';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';

export const metadata = {
  title: 'Emails - Zetkin',
};

export default function CampaignEmailsPage() {
  const onServer = useServerSide();
  const params = useParams();
  const router = useRouter();
  const orgId = parseInt(params.orgId as string);
  const campId = parseInt(params.campId as string);
  const emailsFuture = useEmails(orgId);
  const messages = useMessages(messageIds);

  if (onServer) {
    return null;
  }

  return (
    <SingleCampaignLayout>
      <Box sx={{ padding: 2 }}>
        <ZUIFuture future={emailsFuture}>
          {(allEmails) => {
            // Filter emails by campaign
            const emails = allEmails.filter(email => email.campaign?.id === campId);

            if (emails.length === 0) {
              return (
                <ZUIEmptyState message="No emails in this campaign" />
              );
            }

            return (
              <List>
                {emails.map((email) => (
                  <Card key={email.id} sx={{ mb: 2, cursor: 'pointer' }}
                    onClick={() => router.push(`/organize/${orgId}/projects/${campId}/emails/${email.id}`)}>
                    <CardContent>
                      <Typography variant="h6">{email.title || 'Untitled Email'}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {email.subject || 'No subject'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </List>
            );
          }}
        </ZUIFuture>
      </Box>
    </SingleCampaignLayout>
  );
}
