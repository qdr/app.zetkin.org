import { redirect } from 'next/navigation';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';

export default async function OrganizePage() {
  await redirectIfLoginNeeded(2);

  // For now, redirect to a specific organization
  // TODO: Show organization selection page if user has multiple orgs
  redirect('/organize/1');
}
