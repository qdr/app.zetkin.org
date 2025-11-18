import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import MapPageClient from './MapPageClient';

export const metadata: Metadata = {
  title: 'Area Assignment Map - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; areaAssId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, areaAssId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return (
    <MapPageClient
      orgId={orgId}
      areaAssId={parseInt(areaAssId)}
      campId={campId}
    />
  );
}
