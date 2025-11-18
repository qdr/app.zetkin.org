'use client';

import { FC, useState } from 'react';
import { Box } from '@mui/material';

import { QUERY_STATUS } from 'features/smartSearch/components/types';
import QueryStatusAlert from 'features/tasks/components/QueryStatusAlert';
import SingleTaskLayout from 'features/tasks/layout/SingleTaskLayout';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import TaskAssigneesList from 'features/tasks/components/TaskAssigneesList';
import useAssignedTasks from 'features/tasks/hooks/useAssignedTasks';
import useTask from 'features/tasks/hooks/useTask';
import useTaskMutations from 'features/tasks/hooks/useTaskMutations';
import ZUIFuture from 'zui/ZUIFuture';
import getTaskStatus, { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';
import { ZetkinAssignedTask, ZetkinTask } from 'utils/types/zetkin';

const getQueryStatus = (
  task: ZetkinTask | null,
  assignedTasks: ZetkinAssignedTask[] | null
) => {
  const taskStatus = task ? getTaskStatus(task) : undefined;
  let queryStatus = QUERY_STATUS.ASSIGNED;
  if (
    taskStatus === TASK_STATUS.DRAFT ||
    taskStatus === TASK_STATUS.SCHEDULED
  ) {
    queryStatus = QUERY_STATUS.EDITABLE;
    if (!task?.target.filter_spec.length) {
      queryStatus = QUERY_STATUS.NEW;
    }
  } else if (assignedTasks && !assignedTasks.length) {
    // we don't want 'publishing' state to appear on page load while the data is being fetched
    queryStatus = QUERY_STATUS.PUBLISHED;
  }
  return queryStatus;
};

interface TaskAssigneesPageClientProps {
  orgId: number;
  taskId: number;
}

const TaskAssigneesPageClient: FC<TaskAssigneesPageClientProps> = ({ orgId, taskId }) => {
  const assignedTasksQuery = useAssignedTasks(orgId, taskId);
  const task = useTask(orgId, taskId);
  const { updateTargetQuery } = useTaskMutations(orgId, taskId);
  const assignedTasks = assignedTasksQuery?.data;
  const query = task?.target;

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => setDialogOpen(false);

  const queryStatus = getQueryStatus(task, assignedTasks);

  const readOnly =
    queryStatus === QUERY_STATUS.PUBLISHED ||
    queryStatus === QUERY_STATUS.ASSIGNED;

  return (
    <SingleTaskLayout>
      <QueryStatusAlert
        openDialog={() => setDialogOpen(true)}
        status={queryStatus}
      />
      <ZUIFuture future={assignedTasksQuery}>
        {(data) => {
          return (
            <Box mt={3}>
              <TaskAssigneesList assignedTasks={data} />
            </Box>
          );
        }}
      </ZUIFuture>
      {dialogOpen && (
        <SmartSearchDialog
          onDialogClose={handleDialogClose}
          onSave={(query) => {
            updateTargetQuery(query);
            setDialogOpen(false);
          }}
          query={query}
          readOnly={readOnly}
        />
      )}
    </SingleTaskLayout>
  );
};

export default TaskAssigneesPageClient;
