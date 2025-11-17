'use client';

import { Box, Grid, Typography } from '@mui/material';
import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';

const CampaignSummaryPage = () => {
  const isOnServer = useServerSide();
  const { orgId, campId } = useNumericRouteParams();
  const { campaignFuture } = useCampaign(orgId, campId);
  const campaign = campaignFuture.data;

  if (isOnServer) {
    return null;
  }

  return (
    <>
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
          <ActivitiesOverview campaignId={campId} orgId={orgId} />
        </Suspense>
      </>
    </>
  );
};

export default CampaignSummaryPage;
