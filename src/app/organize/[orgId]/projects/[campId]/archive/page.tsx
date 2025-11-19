import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import CampaignArchivePageClient from './CampaignArchivePageClient';

export const metadata: Metadata = {
  title: 'Campaign Archive - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return <CampaignArchivePageClient orgId={parseInt(orgId)} campId={parseInt(campId)} />;
}
