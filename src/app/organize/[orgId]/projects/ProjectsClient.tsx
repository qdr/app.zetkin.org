'use client';

import { Suspense } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import CampaignCard from 'features/campaigns/components/CampaignCard';
import messageIds from 'features/campaigns/l10n/messageIds';
import SharedCard from 'features/campaigns/components/SharedCard';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useServerSide from 'core/useServerSide';
import useSurveys from 'features/surveys/hooks/useSurveys';
import { Msg } from 'core/i18n';

interface ProjectsClientProps {
  orgId: string;
}

export default function ProjectsClient({ orgId }: ProjectsClientProps) {
  const orgIdNum = parseInt(orgId);
  const { data: campaigns } = useCampaigns(orgIdNum);
  campaigns?.reverse();

  const onServer = useServerSide();
  const surveys = useSurveys(orgIdNum).data ?? [];

  if (onServer) {
    return null;
  }

  // The shared card is currently only visible when there are shared surveys
  const sharedSurveys = surveys.filter(
    (survey) =>
      survey.org_access === 'suborgs' && survey.organization.id != orgIdNum
  );

  return (
    <>
      <Suspense fallback={null}>
        <ActivitiesOverview orgId={orgIdNum} />
      </Suspense>
      <Box mt={4}>
        <Typography mb={2} variant="h4">
          <Msg id={messageIds.all.heading} />
        </Typography>

        <Grid container spacing={2}>
          {sharedSurveys.length > 0 && (
            <Grid size={{ lg: 3, md: 4, xs: 12 }}>
              <SharedCard />
            </Grid>
          )}
          {campaigns?.map((campaign) => {
            return (
              <Grid key={campaign.id} size={{ lg: 3, md: 4, xs: 12 }}>
                <CampaignCard campaign={campaign} orgId={orgIdNum} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
