'use client';

import { FC, useState } from 'react';
import {
  Autocomplete,
  Box,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { FormattedDate } from 'react-intl';

import EmailLayout from 'features/emails/layout/EmailLayout';
import useEmail from 'features/emails/hooks/useEmail';
import ZUIFuture from 'zui/ZUIFuture';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import useEmails from 'features/emails/hooks/useEmails';
import OpenedInsightsSection from 'features/emails/components/OpenedInsightsSection';
import ClickInsightsSection from 'features/emails/components/ClickedInsightsSection';

interface EmailInsightsPageClientProps {
  orgId: number;
  emailId: number;
}

const EmailInsightsPageClient: FC<EmailInsightsPageClientProps> = ({ orgId, emailId }) => {
  const [secondaryEmailId, setSecondaryEmailId] = useState(0);
  const messages = useMessages(messageIds);
  const { data: email } = useEmail(orgId, emailId);
  const emailsFuture = useEmails(orgId);

  if (!email) {
    return null;
  }

  const emailPublished = email.published;
  if (!emailPublished || !email.processed) {
    return null;
  }

  return (
    <EmailLayout>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <ZUIFuture future={emailsFuture}>
          {(emails) => (
            <Autocomplete
              filterOptions={(options, state) =>
                options.filter(
                  (email) =>
                    email.title
                      ?.toLowerCase()
                      .includes(state.inputValue.toLowerCase()) ||
                    email.campaign?.title
                      .toLowerCase()
                      .includes(state.inputValue.toLowerCase())
                )
              }
              getOptionLabel={(option) => option.title || ''}
              onChange={(_, value) => setSecondaryEmailId(value?.id ?? 0)}
              options={emails.filter(
                // Can only compare with published emails, and not itself
                (email) => email.id != emailId && email.published
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={messages.insights.comparison.label()}
                  size="small"
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props}>
                  <Box
                    sx={{
                      alignItems: 'stretch',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box>
                      <Typography>{option.title}</Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Typography variant="body2">
                        {option.published && (
                          <FormattedDate value={option.published} />
                        )}
                      </Typography>
                      <Typography variant="body2">
                        {option.campaign?.title}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              )}
              sx={{
                minWidth: 300,
              }}
              value={
                emails.find((email) => email.id == secondaryEmailId) || null
              }
            />
          )}
        </ZUIFuture>
      </Box>
      <OpenedInsightsSection
        email={email}
        secondaryEmailId={secondaryEmailId}
      />
      <ClickInsightsSection email={email} secondaryEmailId={secondaryEmailId} />
    </EmailLayout>
  );
};

export default EmailInsightsPageClient;
