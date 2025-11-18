import Calendar from 'features/calendar/components';
import { getServerApiClient } from 'core/api/server';
import { ZetkinCampaign } from 'utils/types/zetkin';
import { generateRandomColor } from 'utils/colorUtils';
import CampaignCalendarClient from './CampaignCalendarClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
  };
};

export default async function CampaignCalendarPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const campId = parseInt(params.campId);

  const apiClient = await getServerApiClient();

  const campaign = await apiClient.get<ZetkinCampaign>(
    `/api/orgs/${orgId}/campaigns/${campId}`
  );

  const campaignWithColor = {
    ...campaign,
    color: generateRandomColor(campaign.id.toString()),
  };

  return (
    <CampaignCalendarClient campaign={campaignWithColor} campId={campId} orgId={orgId}>
      <Calendar />
    </CampaignCalendarClient>
  );
}
