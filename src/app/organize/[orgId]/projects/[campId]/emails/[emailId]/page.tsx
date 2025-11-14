'use client';

import {
  Autocomplete,
  Box,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormattedDate } from 'react-intl';

import EmailLayout from 'features/emails/layout/EmailLayout';
import useEmail from 'features/emails/hooks/useEmail';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import ZUIFuture from 'zui/ZUIFuture';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import useEmails from 'features/emails/hooks/useEmails';
import OpenedInsightsSection from 'features/emails/components/OpenedInsightsSection';
import ClickInsightsSection from 'features/emails/components/ClickedInsightsSection';



export default EmailPage;
