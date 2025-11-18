import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import PublicSurveyPageClient from './PublicSurveyPageClient';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSurveyExtended, ZetkinUser } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';

type Props = {
  params: {
    orgId: string;
    surveyId: string;
  };
};

export default async function Page({ params }: Props) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const { orgId, surveyId } = params;

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

  let user: ZetkinUser | null;
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
  }

  return <PublicSurveyPageClient survey={survey} user={user} />;
}
