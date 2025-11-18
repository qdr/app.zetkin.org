import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinOrganization } from 'utils/types/zetkin';
import CalendarPageClient from './CalendarPageClient';

export const metadata: Metadata = {
  title: 'Calendar - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if org exists
  try {
    await apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`);
  } catch (err) {
    notFound();
  }

  return <CalendarPageClient />;
}
