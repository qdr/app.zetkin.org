'use client';

import { Box, Grid, Typography } from '@mui/material';
import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import BackendApiClient from 'core/api/client/BackendApiClient';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useParams } from 'next/navigation';
import useServerSide from 'core/useServerSide';
import { ZetkinCampaign } from 'utils/types/zetkin';

export default function CampaignSummaryPage() {
  const onServer = useServerSide();
  const params = useParams();
  const orgId = parseInt(params.orgId as string);
  const campId = parseInt(params.campId as string);

  if (onServer) {
    return null;
  }

  return (
    <SingleCampaignLayout>
      <Box sx={{ padding: 2 }}>
        <Suspense fallback={null}>
          <ActivitiesOverview orgId={orgId} campId={campId} />
        </Suspense>
      </Box>
    </SingleCampaignLayout>
  );
}
