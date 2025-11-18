'use client';

import { FC, Suspense } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import CampaignCard from 'features/campaigns/components/CampaignCard';
import messageIds from 'features/campaigns/l10n/messageIds';
import SharedCard from 'features/campaigns/components/SharedCard';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useSurveys from 'features/surveys/hooks/useSurveys';
import { Msg, useMessages } from 'core/i18n';

interface ProjectsPageClientProps {
  orgId: number;
}

const ProjectsPageClient: FC<ProjectsPageClientProps> = ({ orgId }) => {
  const messages = useMessages(messageIds);
  const { data: campaigns } = useCampaigns(orgId);
  campaigns?.reverse();

  const surveys = useSurveys(orgId).data ?? [];

  //The shared card is currently only visible when there are shared surveys, but there will be more shared activities in the future.
  const sharedSurveys = surveys.filter(
    (survey) =>
      survey.org_access === 'suborgs' && survey.organization.id != orgId
  );

  return (
    <AllCampaignsLayout>
      <Suspense>
        <ActivitiesOverview orgId={orgId} />
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
                <CampaignCard campaign={campaign} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </AllCampaignsLayout>
  );
};

export default ProjectsPageClient;
