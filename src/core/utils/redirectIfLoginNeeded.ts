import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSession } from 'utils/types/zetkin';

export default async function redirectIfLoginNeeded(
  requiredAuthLevel: number = 1
) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  let shouldRedirectToLogin = false;

  try {
    const session = await apiClient.get<ZetkinSession>('/api/session');
    console.log('[redirectIfLoginNeeded] Session level:', session.level, 'Required:', requiredAuthLevel);
    if (session.level < requiredAuthLevel) {
      shouldRedirectToLogin = true;
    }
  } catch (err) {
    console.log('[redirectIfLoginNeeded] Session check failed:', err);
    shouldRedirectToLogin = true;
  }

  if (shouldRedirectToLogin) {
    const path = headersList.get('x-requested-path');
    const encodedPath = path ? encodeURIComponent(path) : '';
    console.log('[redirectIfLoginNeeded] Redirecting to login. Path:', path);
    redirect(`/login?level=${requiredAuthLevel}&redirect=${encodedPath}`);
  }
}
