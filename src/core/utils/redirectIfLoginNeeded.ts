import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinUser } from 'utils/types/zetkin';

export default async function redirectIfLoginNeeded(
  requiredAuthLevel: number = 1
) {
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  let shouldRedirectToLogin = false;

  try {
    // Check if user is authenticated by fetching their profile
    await apiClient.get<ZetkinUser>('/api/users/me');
    // If successful, user is authenticated (meets level 1 requirement)
  } catch (err) {
    // If failed, user is not authenticated
    shouldRedirectToLogin = true;
  }

  if (shouldRedirectToLogin) {
    const path = headersList.get('x-requested-path');
    redirect(`/login?redirect=${path}`);
  }
}
