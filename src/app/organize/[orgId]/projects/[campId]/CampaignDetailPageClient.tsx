'use client';

import { Box, Grid, Typography } from '@mui/material';
import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import ActivitiesOverviewSkeleton from 'features/campaigns/components/ActivitiesOverviewSkeleton';
import CampaignWithInitialData from 'features/campaigns/components/CampaignWithInitialData';
import { ZetkinCampaign } from 'utils/types/zetkin';

interface CampaignDetailPageClientProps {
  campaign: ZetkinCampaign;
  campId: number;
  orgId: number;
}

export default function CampaignDetailPageClient({
  campaign,
  campId,
  orgId,
}: CampaignDetailPageClientProps) {
  return (
    <CampaignWithInitialData campaign={campaign}>
      <Box mb={campaign?.info_text || campaign?.manager ? 2 : 0}>
        <Grid container spacing={2}>
          {campaign?.info_text && (
            <Grid size={{ lg: 6, md: 12, xs: 12 }}>
              <Typography variant="body1">{campaign?.info_text}</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
      <Suspense fallback={<ActivitiesOverviewSkeleton />}>
        <ActivitiesOverview campaignId={campId} orgId={orgId} />
      </Suspense>
    </CampaignWithInitialData>
  );
}
