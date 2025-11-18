import { getServerApiClient } from 'core/api/server';
import { generateRandomColor } from 'utils/colorUtils';
import { ZetkinCampaign } from 'utils/types/zetkin';
import CampaignDetailPageClient from './CampaignDetailPageClient';

interface PageProps {
  params: {
    orgId: string;
    campId: string;
  };
}

// Server Component - pre-fetches campaign data for faster initial render
export default async function CampaignSummaryPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const campId = parseInt(params.campId);

  // Pre-fetch campaign data on server
  const apiClient = await getServerApiClient();
  const campaign = await apiClient.get<ZetkinCampaign>(
    `/api/orgs/${orgId}/campaigns/${campId}`
  );

  // Add color (same as hook does)
  const campaignWithColor = {
    ...campaign,
    color: generateRandomColor(campaign.id.toString()),
  };

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
    <CampaignDetailPageClient
      campaign={campaignWithColor}
      campId={campId}
      orgId={orgId}
    />
  );
}
