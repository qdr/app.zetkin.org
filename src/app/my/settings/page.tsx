import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import SettingsPageClient from './SettingsPageClient';
import { ZetkinUser } from 'utils/types/zetkin';

export default async function Page() {
  await redirectIfLoginNeeded();

  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const user = await apiClient.get<ZetkinUser>('/api/users/me');

  return <SettingsPageClient user={user} />;
}
