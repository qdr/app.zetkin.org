import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import SurveyQuestionsPageClient from './SurveyQuestionsPageClient';

export const metadata: Metadata = {
  title: 'Survey Questions - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; surveyId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, surveyId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return <SurveyQuestionsPageClient orgId={parseInt(orgId)} surveyId={parseInt(surveyId)} />;
}
