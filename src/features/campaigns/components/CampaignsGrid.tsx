'use client';

import { Suspense } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import CampaignCard from './CampaignCard';
import CampaignCardSkeleton from './CampaignCardSkeleton';
import messageIds from '../l10n/messageIds';
import SharedCard from './SharedCard';
import useCampaigns from '../hooks/useCampaigns';
import useSurveys from 'features/surveys/hooks/useSurveys';
import { Msg } from 'core/i18n';

interface CampaignsGridProps {
  orgId: number;
}

function CampaignsGridContent({ orgId }: CampaignsGridProps) {
  const { data: campaigns } = useCampaigns(orgId);
  const surveys = useSurveys(orgId).data ?? [];

  const reversedCampaigns = campaigns ? [...campaigns].reverse() : [];

  const sharedSurveys = surveys.filter(
    (survey) =>
      survey.org_access === 'suborgs' && survey.organization.id != orgId
  );

  return (
    <Box mt={4}>
      <Typography mb={2} variant="h4">
        <Msg id={messageIds.all.heading} />
      </Typography>

      <Grid container spacing={2}>
        {sharedSurveys.length > 0 && (
          <Grid size={{ lg: 3, md: 4, xs: 12 }}>
            <Suspense fallback={<CampaignCardSkeleton />}>
              <SharedCard />
            </Suspense>
          </Grid>
        )}
        {reversedCampaigns?.map((campaign) => (
          <Grid key={campaign.id} size={{ lg: 3, md: 4, xs: 12 }}>
            <Suspense fallback={<CampaignCardSkeleton />}>
              <CampaignCard campaign={campaign} />
            </Suspense>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default function CampaignsGrid({ orgId }: CampaignsGridProps) {
  return (
    <Suspense
      fallback={
        <Box mt={4}>
          <Typography mb={2} variant="h4">
            <Msg id={messageIds.all.heading} />
          </Typography>
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid key={i} size={{ lg: 3, md: 4, xs: 12 }}>
                <CampaignCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Box>
      }
    >
      <CampaignsGridContent orgId={orgId} />
    </Suspense>
  );
}
