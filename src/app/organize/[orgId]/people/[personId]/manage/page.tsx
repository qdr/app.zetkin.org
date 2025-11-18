import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinPerson } from 'utils/types/zetkin';
import PersonManagePageClient from './PersonManagePageClient';

export const metadata: Metadata = {
  title: 'Manage Person - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; personId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, personId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if person exists
  try {
    await apiClient.get<ZetkinPerson>(`/api/orgs/${orgId}/people/${personId}`);
    return <PersonManagePageClient orgId={parseInt(orgId)} personId={parseInt(personId)} />;
  } catch (err) {
    notFound();
  }
}
