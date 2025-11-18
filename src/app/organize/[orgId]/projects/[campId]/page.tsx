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
    <CampaignDetailPageClient
      campaign={campaignWithColor}
      campId={campId}
      orgId={orgId}
    />
  );
}
