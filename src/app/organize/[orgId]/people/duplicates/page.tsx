import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import DuplicatesPageClient from './DuplicatesPageClient';

export const metadata: Metadata = {
  title: 'Duplicates - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return <DuplicatesPageClient orgId={parseInt(orgId)} />;
}
