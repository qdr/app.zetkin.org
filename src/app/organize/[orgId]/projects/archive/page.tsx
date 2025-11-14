'use client';

import { Box, Grid } from '@mui/material';
import { ChangeEvent, useState } from 'react';

import ActivityList from 'features/campaigns/components/ActivityList';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import useActivityArchive from 'features/campaigns/hooks/useActivityArchive';
import { useMessages } from 'core/i18n';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';
import { ACTIVITIES, CampaignActivity } from 'features/campaigns/types';



export default ActivitiesArchivePage;
