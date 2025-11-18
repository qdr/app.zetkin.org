import { getServerApiClient } from 'core/api/server';
import QuestionsPageClient from './QuestionsPageClient';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { getSurveyStatsDef } from 'features/surveys/rpc/getSurveyStats';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    surveyId: string;
  };
};

export default async function QuestionsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const campId = parseInt(params.campId);
  const surveyId = parseInt(params.surveyId);

  const apiClient = await getServerApiClient();

  const [survey, stats] = await Promise.all([
    apiClient.get<ZetkinSurveyExtended>(`/api/orgs/${orgId}/surveys/${surveyId}`),
    getSurveyStatsDef.handler({ orgId, surveyId }, apiClient),
  ]);

  return (
    <QuestionsPageClient
      campId={campId}
      orgId={orgId}
      stats={stats}
      survey={survey}
      surveyId={surveyId}
    />
  );
}
