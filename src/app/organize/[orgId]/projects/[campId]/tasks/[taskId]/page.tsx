import { getServerApiClient } from 'core/api/server';
import { ZetkinTask } from 'utils/types/zetkin';
import TaskDetailPageClient from './TaskDetailPageClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    taskId: string;
  };
};

export default async function TaskDetailPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const taskId = parseInt(params.taskId);

  const apiClient = await getServerApiClient();

  const task = await apiClient.get<ZetkinTask>(
    `/api/orgs/${orgId}/tasks/${taskId}`
  );

  return <TaskDetailPageClient orgId={orgId} task={task} taskId={taskId} />;
}
