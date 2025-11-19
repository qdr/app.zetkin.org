'use client';

import { FC, Suspense } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useCampaign from 'features/campaigns/hooks/useCampaign';

interface CampaignPageClientProps {
  orgId: number;
  campId: number;
}

const CampaignPageClient: FC<CampaignPageClientProps> = ({ orgId, campId }) => {
  const { campaignFuture } = useCampaign(orgId, campId);
  const campaign = campaignFuture.data;

  return (
    <SingleCampaignLayout>
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
    </SingleCampaignLayout>
  );
};

export default CampaignPageClient;
