import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import ReportPageClient from './ReportPageClient';

export const metadata: Metadata = {
  title: 'Area Assignment Report - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; areaAssId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, areaAssId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return (
    <ReportPageClient
      orgId={orgId}
      areaAssId={parseInt(areaAssId)}
      campId={campId}
    />
  );
}
