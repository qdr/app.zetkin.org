import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireAuth, requireOrgAccess } from 'app/organize/auth';
import { ZetkinTask } from 'utils/types/zetkin';
import TaskAssigneesPageClient from './TaskAssigneesPageClient';

export const metadata: Metadata = {
  title: 'Task Assignees - Zetkin',
};

type PageProps = {
  params: Promise<{ orgId: string; campId: string; taskId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orgId, campId, taskId } = await params;
  const { user, apiClient } = await requireAuth(2);
  await requireOrgAccess(apiClient, user, orgId);

  // Check if task exists and belongs to campaign
  try {
    const task = await apiClient.get<ZetkinTask>(
      `/api/orgs/${orgId}/tasks/${taskId}`
    );

    if (
      parseInt(campId) == task.campaign.id &&
      parseInt(orgId) == task.organization.id
    ) {
      return <TaskAssigneesPageClient orgId={parseInt(orgId)} taskId={parseInt(taskId)} />;
    } else {
      notFound();
    }
  } catch (err) {
    notFound();
  }
}
