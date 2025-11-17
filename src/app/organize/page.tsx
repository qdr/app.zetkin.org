import OrganizePageClient from './OrganizePageClient';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';

export default async function OrganizePage() {
  await redirectIfLoginNeeded(2);

  return <OrganizePageClient />;
}
