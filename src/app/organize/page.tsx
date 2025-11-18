import { Metadata } from 'next';

import { requireAuth } from './auth';
import OrganizePageClient from './OrganizePageClient';

export const metadata: Metadata = {
  title: 'Organize - Zetkin',
};

export default async function Page() {
  await requireAuth(2);

  return <OrganizePageClient />;
}
