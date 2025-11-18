import { redirect } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';

type PageProps = {
  params: Promise<{ orgId: string; campId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Redirect to campaign page
  redirect(`/organize/${orgId}/projects/${campId}`);
}
