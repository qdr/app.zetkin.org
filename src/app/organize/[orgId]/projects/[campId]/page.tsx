'use client';

import { Box, Grid, Typography } from '@mui/material';
import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import ActivitiesOverviewSkeleton from 'features/campaigns/components/ActivitiesOverviewSkeleton';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useNumericRouteParams } from 'core/hooks';

const CampaignSummaryPage = () => {
  const { orgId, campId } = useNumericRouteParams();
  const { campaignFuture } = useCampaign(orgId, campId);
  const campaign = campaignFuture.data;

  return (
    <>
      <Box mb={campaign?.info_text || campaign?.manager ? 2 : 0}>
        <Grid container spacing={2}>
          {campaign?.info_text && (
            <Grid size={{ lg: 6, md: 12, xs: 12 }}>
              <Typography variant="body1">{campaign?.info_text}</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
      <Suspense>
      <Suspense fallback={<ActivitiesOverviewSkeleton />}>
        <ActivitiesOverview campaignId={campId} orgId={orgId} />
      </Suspense>
    </>
  );
};

export default CampaignSummaryPage;
