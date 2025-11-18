import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinCampaign } from 'utils/types/zetkin';
import CampaignPageClient from './CampaignPageClient';

export const metadata: Metadata = {
  title: 'Campaign - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if campaign exists
  try {
    await apiClient.get<ZetkinCampaign>(
      `/api/orgs/${orgId}/campaigns/${campId}`
    );
  } catch (err) {
    notFound();
  }

  return <CampaignPageClient orgId={parseInt(orgId)} campId={parseInt(campId)} />;
}
