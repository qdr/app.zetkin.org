import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import CallAssignmentPageClient from './CallAssignmentPageClient';

export const metadata: Metadata = {
  title: 'Call Assignment - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; callAssId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, callAssId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if call assignment exists and belongs to campaign
  try {
    const data = await apiClient.get<ZetkinCallAssignment>(
      `/api/orgs/${orgId}/call_assignments/${callAssId}`
    );
    const actualCampaign = data.campaign?.id.toString() ?? 'standalone';
    if (actualCampaign !== campId) {
      notFound();
    }

    return <CallAssignmentPageClient orgId={parseInt(orgId)} callAssId={parseInt(callAssId)} />;
  } catch (error) {
    notFound();
  }
}
