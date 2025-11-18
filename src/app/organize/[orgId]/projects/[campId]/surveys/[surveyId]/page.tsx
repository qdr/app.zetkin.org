import { getServerApiClient } from 'core/api/server';
import SurveyOverviewPageClient from './SurveyOverviewPageClient';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    surveyId: string;
  };
};

export default async function SurveyOverviewPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const campId = params.campId;
  const surveyId = parseInt(params.surveyId);

  const apiClient = await getServerApiClient();

  const survey = await apiClient.get<ZetkinSurveyExtended>(
    `/api/orgs/${orgId}/surveys/${surveyId}`
  );

  return (
    <SurveyOverviewPageClient
      campId={campId}
      orgId={orgId}
      survey={survey}
      surveyId={surveyId}
    />
  );
}
