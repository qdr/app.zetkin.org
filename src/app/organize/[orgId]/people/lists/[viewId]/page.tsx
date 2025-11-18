import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import getUserMemberships from 'utils/getUserMemberships';
import { ZetkinView } from 'features/views/components/types';
import ViewPageClient from './ViewPageClient';

export const metadata: Metadata = {
  title: 'People View - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; viewId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, viewId } = await params;
  const { user, apiClient, headersList } = await requireAuth(2);

  // Allow non-officials to access shared views
  await requireOrgAccess(apiClient, user, orgId, true);

  // Try to fetch the view as the current user
  try {
    await apiClient.get<ZetkinView>(
      `/api/orgs/${orgId}/people/views/${viewId}`
    );

    // Check if user is an official
    const ctx = {
      req: { headers: Object.fromEntries(headersList.entries()) },
      user,
    } as any;
    const officialMemberships = await getUserMemberships(ctx, false);
    const isOfficialMember = officialMemberships.includes(parseInt(orgId));
    const isSuperUser = !!user.is_superuser;
    const notAllowedAccess = !isOfficialMember && !isSuperUser;

    if (notAllowedAccess) {
      // The user does NOT have this organization among its official memberships
      // and they are not a super user, but they did have access to the view,
      // so the view must have been shared with them.
      redirect(`/organize/${orgId}/people/lists/${viewId}/shared`);
    }

    return <ViewPageClient orgId={parseInt(orgId)} viewId={parseInt(viewId)} />;
  } catch {
    notFound();
  }
}
