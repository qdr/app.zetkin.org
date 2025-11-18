import { Metadata } from 'next';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import CampaignActivitiesPageClient from './CampaignActivitiesPageClient';

export const metadata: Metadata = {
  title: 'Campaign Activities - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  return <CampaignActivitiesPageClient orgId={parseInt(orgId)} campId={parseInt(campId)} />;
}
