import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import IApiClient from 'core/api/client/IApiClient';
import { ZetkinMembership } from 'utils/types/zetkin';
import { ZetkinObjectAccess } from 'core/api/types';
import { ZetkinView } from 'features/views/components/types';
import SharedViewPageClient from './SharedViewPageClient';

export const metadata: Metadata = {
  title: 'Shared View - Zetkin',
};

async function getAccessLevel(
  apiClient: IApiClient,
  orgId: number,
  viewId: number
): Promise<ZetkinObjectAccess['level'] | null> {
  const memberships = await apiClient.get<ZetkinMembership[]>(
    `/api/users/me/memberships`
  );
  const myMembership = memberships.find((mem) => mem.organization.id == orgId);

  if (!myMembership) {
    // NOTE: Might be superuser
    return null;
  }

  const isOfficial = Boolean(myMembership.role);
  if (isOfficial) {
    return 'configure';
  }

  let accessList: ZetkinObjectAccess[] = [];
  try {
    accessList = await apiClient.get<ZetkinObjectAccess[]>(
      `/api/orgs/${orgId}/people/views/${viewId}/access`
    );
  } catch (e) {
    return null;
  }
  const accessObject = accessList.find(
    (obj) => obj.person.id == myMembership.profile.id
  );

  return accessObject?.level ?? null;
}

type PageProps = {
  params: Promise<{ orgId: string; viewId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, viewId } = await params;
  const { user, apiClient } = await requireAuth(2);

  // Allow non-officials to access shared views
  await requireOrgAccess(apiClient, user, orgId, true);

  const accessLevel = await getAccessLevel(
    apiClient,
    parseInt(orgId),
    parseInt(viewId)
  );

  if (accessLevel == null) {
    notFound();
  }

  try {
    await apiClient.get<ZetkinView>(
      `/api/orgs/${orgId}/people/views/${viewId}`
    );
  } catch (err) {
    notFound();
  }

  return (
    <SharedViewPageClient
      accessLevel={accessLevel}
      orgId={parseInt(orgId)}
      viewId={parseInt(viewId)}
    />
  );
}
