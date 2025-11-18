import { Metadata } from 'next';
import { Suspense } from 'react';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import SharedPageClient from './SharedPageClient';

export const metadata: Metadata = {
  title: 'Shared Activities - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return (
    <Suspense>
      <SharedPageClient orgId={orgId} />
    </Suspense>
  );
}
