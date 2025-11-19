import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import SurveySubmissionsPageClient from './SurveySubmissionsPageClient';

export const metadata: Metadata = {
  title: 'Survey Submissions - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; surveyId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, surveyId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return <SurveySubmissionsPageClient orgId={parseInt(orgId)} surveyId={parseInt(surveyId)} />;
}
