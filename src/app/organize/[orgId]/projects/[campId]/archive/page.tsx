'use client';

import { Box, Grid } from '@mui/material';
import { ChangeEvent, useState } from 'react';

import { ACTIVITIES } from 'features/campaigns/types';
import ActivityList from 'features/campaigns/components/ActivityList';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useActivityArchive from 'features/campaigns/hooks/useActivityArchive';
import { useMessages } from 'core/i18n';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';



export default CampaignArchivePage;
