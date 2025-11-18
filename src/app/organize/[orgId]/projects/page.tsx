import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import BackendApiClient from 'core/api/client/BackendApiClient';
import ProjectsPageClient from './ProjectsPageClient';

export const metadata: Metadata = {
  title: 'Projects - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId } = await params;
  const { user, apiClient, headersList } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if org exists
  try {
    await apiClient.get(`/api/orgs/${orgId}`);
  } catch (e) {
    notFound();
  }

  return <ProjectsPageClient orgId={parseInt(orgId)} />;
}
