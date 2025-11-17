'use client';

import { useState } from 'react';
import { Box, Grid } from '@mui/material';

import { ACTIVITIES } from 'features/campaigns/types';
import ActivityList from 'features/campaigns/components/ActivityList';
import FilterActivities from 'features/campaigns/components/ActivityList/FilterActivities';
import messageIds from 'features/campaigns/l10n/messageIds';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useActivityList from 'features/campaigns/hooks/useActivityList';
import { useMessages } from 'core/i18n';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';



export default CampaignActivitiesPage;
