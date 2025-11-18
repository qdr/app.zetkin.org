import { getServerApiClient } from 'core/api/server';
import { ZetkinAssignedTask, ZetkinTask } from 'utils/types/zetkin';
import TaskInsightsPageClient from './TaskInsightsPageClient';

type PageProps = {
  params: {
    orgId: string;
    campId: string;
    taskId: string;
  };
};

export default async function TaskInsightsPage({ params }: PageProps) {
  const orgId = parseInt(params.orgId);
  const taskId = parseInt(params.taskId);

  const apiClient = await getServerApiClient();

  const [task, assignedTasks] = await Promise.all([
    apiClient.get<ZetkinTask>(`/api/orgs/${orgId}/tasks/${taskId}`),
    apiClient.get<ZetkinAssignedTask[]>(
      `/api/orgs/${orgId}/tasks/${taskId}/assigned`
    ),
  ]);

  return (
    <TaskInsightsPageClient
      assignedTasks={assignedTasks}
      orgId={orgId}
      task={task}
      taskId={taskId}
    />
  );
}
