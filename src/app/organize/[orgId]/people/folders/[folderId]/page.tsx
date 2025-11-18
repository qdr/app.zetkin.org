import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinViewFolder } from 'features/views/components/types';
import FolderPageClient from './FolderPageClient';

export const metadata: Metadata = {
  title: 'People Folder - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; folderId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, folderId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if folder exists and user has access
  try {
    await apiClient.get<ZetkinViewFolder>(
      `/api/orgs/${orgId}/people/view_folders/${folderId}`
    );
    return <FolderPageClient orgId={orgId} folderId={parseInt(folderId)} />;
  } catch {
    notFound();
  }
}
