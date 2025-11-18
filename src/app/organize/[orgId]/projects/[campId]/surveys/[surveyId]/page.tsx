import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSurvey } from 'utils/types/zetkin';
import { getSurveyCampId } from 'features/surveys/utils/getSurveyUrl';
import SurveyPageClient from './SurveyPageClient';

export const metadata: Metadata = {
  title: 'Survey - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; surveyId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, surveyId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if survey exists and belongs to campaign
  try {
    const data = await apiClient.get<ZetkinSurvey>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    );

    const surveyCampId = getSurveyCampId(data);
    if (surveyCampId != campId) {
      notFound();
    }

    return <SurveyPageClient orgId={parseInt(orgId)} surveyId={parseInt(surveyId)} />;
  } catch (err) {
    notFound();
  }
}
