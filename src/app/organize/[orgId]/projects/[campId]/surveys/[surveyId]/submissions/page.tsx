import { getServerApiClient } from 'core/api/server';
import SubmissionsPageClient from './SubmissionsPageClient';
import {
  ZetkinSurveyExtended,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    surveyId: string;
  };
};

export default async function SubmissionsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const campId = parseInt(params.campId);
  const surveyId = parseInt(params.surveyId);

  const apiClient = await getServerApiClient();

  const [survey, submissions] = await Promise.all([
    apiClient.get<ZetkinSurveyExtended>(`/api/orgs/${orgId}/surveys/${surveyId}`),
    apiClient.get<ZetkinSurveySubmission[]>(
      `/api/orgs/${orgId}/surveys/${surveyId}/submissions`
    ),
  ]);

  return (
    <SubmissionsPageClient
      campId={campId}
      orgId={orgId}
      submissions={submissions}
      survey={survey}
      surveyId={surveyId}
    />
  );
}
