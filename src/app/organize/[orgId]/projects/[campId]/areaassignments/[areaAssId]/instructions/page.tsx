import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import InstructionsPageClient from './InstructionsPageClient';

export const metadata: Metadata = {
  title: 'Area Assignment Instructions - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; areaAssId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, areaAssId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return (
    <InstructionsPageClient
      orgId={orgId}
      areaAssId={parseInt(areaAssId)}
      campId={campId}
    />
  );
}
