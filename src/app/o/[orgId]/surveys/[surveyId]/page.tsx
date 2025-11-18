import { notFound } from 'next/navigation';

import { getServerApiClient } from 'core/api/server';
import PublicSurveyPage from 'features/surveys/pages/PublicSurveyPage';
import { ZetkinSurveyExtended, ZetkinUser } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';

type PageProps = {
  params: {
    orgId: string;
    surveyId: string;
  };
};

// Server Component - pre-fetches survey data for faster initial render
export default async function PublicSurveyDetailPage({ params }: PageProps) {
  const { orgId, surveyId } = params;

  const apiClient = await getServerApiClient();

  // Pre-fetch survey data (public, always available)
  let survey: ZetkinSurveyExtended;
  try {
    survey = await apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) {
      notFound();
    } else {
      throw e;
    }
  }

  // Try to get user if authenticated (may fail if not logged in)
  let user: ZetkinUser | null = null;
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    // User not authenticated - that's ok
  }

  return <PublicSurveyPage survey={survey} user={user} />;
}
