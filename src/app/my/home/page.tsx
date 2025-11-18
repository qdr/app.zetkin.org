import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import HomePageClient from './HomePageClient';

export default async function Page() {
  await redirectIfLoginNeeded();

  return <HomePageClient />;
}
