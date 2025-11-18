import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinOrganization } from 'utils/types/zetkin';
import JourneysPageClient from './JourneysPageClient';

export const metadata: Metadata = {
  title: 'Journeys - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  try {
    await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);
    return <JourneysPageClient orgId={parseInt(orgId)} />;
  } catch {
    notFound();
  }
}
