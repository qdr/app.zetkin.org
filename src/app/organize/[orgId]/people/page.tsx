import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinView } from 'features/views/components/types';
import PeoplePageClient from './PeoplePageClient';

export const metadata: Metadata = {
  title: 'People - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if views endpoint is accessible
  try {
    await apiClient.get<ZetkinView[]>(`/api/orgs/${orgId}/people/views`);
    return <PeoplePageClient orgId={orgId} />;
  } catch {
    notFound();
  }
}
