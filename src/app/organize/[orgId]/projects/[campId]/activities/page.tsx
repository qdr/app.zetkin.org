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

export default function CampaignActivitiesPage() {
  const onServer = useServerSide();
  const params = useParams();
  const orgId = parseInt(params.orgId as string);
  const campId = parseInt(params.campId as string);
  const messages = useMessages(messageIds);
  const [filter, setFilter] = useState<ACTIVITIES[] | 'all'>('all');
  const activitiesFuture = useActivityList(orgId, campId);

  if (onServer) {
    return null;
  }

  return (
    <SingleCampaignLayout>
      <Box sx={{ overflowY: 'auto', padding: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FilterActivities
              filter={filter}
              onFilterChange={(e) => {
                const value = e.target.value as ACTIVITIES | 'all';
                setFilter(value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ZUIFuture future={activitiesFuture}>
              {(data) => {
                if (data.length === 0) {
                  return (
                    <ZUIEmptyState message={messages.activities.empty()} />
                  );
                }
                return (
                  <ActivityList
                    activities={data}
                    filter={filter}
                    orgId={orgId}
                  />
                );
              }}
            </ZUIFuture>
          </Grid>
        </Grid>
      </Box>
    </SingleCampaignLayout>
  );
}
